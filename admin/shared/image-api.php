<?php
/**
 * AJAX-эндпоинт мгновенных операций с фотогалереей (загрузка/удаление/сортировка).
 * Используют формы объектов и каталога обеих площадок.
 *
 * POST-параметры: entity=cases|catalog, op=upload|delete|reorder, id, isnew, name, csrf.
 * Ответ — JSON.
 *
 * Логика new vs existing:
 *  - существующий объект (есть в data): операции сразу пишутся в data-файл и на диск;
 *  - новый объект (ещё не сохранён): файлы пишутся в uploads/<entity>/<id>/, но в data
 *    ничего не создаётся — пути возвращаются клиенту, который кладёт их в скрытые поля
 *    формы; запись в data появится при «Создать».
 */
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/images.php';
require_once dirname(__DIR__, 2) . '/partials/cases-lib.php';
require_once dirname(__DIR__, 2) . '/partials/catalog-lib.php';

header('Content-Type: application/json; charset=utf-8');
function api_out($a) { echo json_encode($a, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; }

if (!admin_is_logged_in()) { http_response_code(401); api_out(['ok' => false, 'error' => 'Не авторизовано']); }

$csrf = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($_POST['csrf'] ?? '');
if (empty($_SESSION['csrf']) || !is_string($csrf) || !hash_equals($_SESSION['csrf'], $csrf)) {
    http_response_code(400); api_out(['ok' => false, 'error' => 'Неверный CSRF-токен, обновите страницу']);
}

$entity = $_POST['entity'] ?? '';
$op     = $_POST['op'] ?? '';
$id     = trim((string)($_POST['id'] ?? ''));
$isNew  = !empty($_POST['isnew']);

// --- Адаптер сущности -----------------------------------------------------
if ($entity === 'cases') {
    $data = cases_load();
    $items = $data['cases'];
    $collKey = 'cases'; $saver = 'cases_save';
    $uploadRoot = 'uploads/cases'; $fullPath = false;
} elseif ($entity === 'catalog') {
    $data = catalog_load();
    $items = $data['items'];
    $collKey = 'items'; $saver = 'catalog_save';
    $uploadRoot = 'uploads/catalog'; $fullPath = true;
} else {
    api_out(['ok' => false, 'error' => 'Неизвестный раздел']);
}

$idx = $id !== '' ? data_index_by_id($items, $id) : -1;

// Для нового объекта без id — сгенерировать id из имени (для имени папки)
if ($idx < 0 && $isNew && $id === '') {
    $name = trim((string)($_POST['name'] ?? ''));
    if ($name === '') api_out(['ok' => false, 'error' => 'Сначала введите название']);
    $base = admin_slug($name); $id = $base; $n = 2;
    while (data_index_by_id($items, $id) >= 0) { $id = $base . '-' . $n; $n++; }
}
if ($id === '') api_out(['ok' => false, 'error' => 'Не указан объект']);

// imageBase: у существующего — из записи; у нового — uploads/<entity>/<id>
$imageBase = ($idx >= 0 && !empty($items[$idx]['imageBase']))
    ? trim((string)$items[$idx]['imageBase'], '/')
    : $uploadRoot . '/' . $id;
$destDir = SITE_BASE_DIR . '/' . $imageBase;

// value (как хранится в images[]) и публичный url по имени файла
$toValue = fn($file) => $fullPath ? ($imageBase . '/' . $file) : $file;
$toUrl   = fn($value) => '/' . ltrim($fullPath ? (string)$value : ($imageBase . '/' . $value), '/');

// текущий список картинок объекта (для существующего)
$images = ($idx >= 0) ? array_values((array)($items[$idx]['images'] ?? [])) : [];

function api_persist($saver, &$data, $collKey, $idx, $images, $imageBase) {
    if ($idx >= 0) {
        $data[$collKey][$idx]['images'] = $images;
        if (empty($data[$collKey][$idx]['imageBase'])) {
            $data[$collKey][$idx]['imageBase'] = $imageBase;
        }
        $saver($data);
    }
}

if ($op === 'upload') {
    if (empty($_FILES['file'])) api_out(['ok' => false, 'error' => 'Нет файла']);
    $f = $_FILES['file'];
    if (($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) api_out(['ok' => false, 'error' => 'Ошибка загрузки файла']);
    if (($f['size'] ?? 0) > 15 * 1024 * 1024) api_out(['ok' => false, 'error' => 'Файл больше 15 МБ']);
    if (!is_uploaded_file($f['tmp_name'])) api_out(['ok' => false, 'error' => 'Некорректная загрузка']);

    $stem = admin_next_stem_for_dir($destDir);
    $res = admin_save_image($f['tmp_name'], $destDir, $stem);
    if (!$res['ok']) api_out(['ok' => false, 'error' => $res['error'] ?? 'Не удалось обработать изображение']);

    $value = $toValue($res['file']);
    $images[] = $value;
    api_persist($saver, $data, $collKey, $idx, $images, $imageBase);
    api_out(['ok' => true, 'id' => $id, 'value' => $value, 'url' => $toUrl($value), 'count' => count($images)]);
}

if ($op === 'delete') {
    $value = (string)($_POST['value'] ?? '');
    if ($value === '') api_out(['ok' => false, 'error' => 'Не указано изображение']);
    $images = array_values(array_filter($images, fn($x) => $x !== $value));
    // путь на диске
    $path = $fullPath ? $value : ($imageBase . '/' . $value);
    if (strpos($path, 'uploads/') === 0) {
        $stem = preg_replace('/\.[^.]+$/', '', basename($path));
        admin_delete_image_files(SITE_BASE_DIR . '/' . dirname($path), $stem);
    }
    api_persist($saver, $data, $collKey, $idx, $images, $imageBase);
    api_out(['ok' => true, 'id' => $id, 'count' => count($images)]);
}

if ($op === 'reorder') {
    $order = $_POST['order'] ?? [];
    if (!is_array($order)) $order = [];
    if ($idx >= 0) {
        $remaining = $images; $ordered = [];
        foreach ($order as $v) {
            $k = array_search((string)$v, $remaining, true);
            if ($k !== false) { $ordered[] = $remaining[$k]; unset($remaining[$k]); }
        }
        foreach ($remaining as $rest) $ordered[] = $rest;
        $images = array_values($ordered);
        api_persist($saver, $data, $collKey, $idx, $images, $imageBase);
    }
    api_out(['ok' => true, 'id' => $id]);
}

api_out(['ok' => false, 'error' => 'Неизвестная операция']);
