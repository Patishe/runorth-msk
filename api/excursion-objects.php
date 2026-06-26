<?php
/**
 * Публичный JSON-эндпоинт для блока «Объекты» на странице экскурсии (/excursion).
 *
 * Зачем нужен: data/cases.json закрыт от прямого доступа в .htaccess, а сама
 * excursion.html — статическая. Поэтому данные читаем на сервере через cases-lib
 * и отдаём наружу только то, что нужно блоку, и только объекты с включённым
 * тумблером showOnExcursion.
 */

header('Content-Type: application/json; charset=UTF-8');
// Не кэшируем: данные меняются из админки (тумблер showOnExcursion) и должны
// сразу отражаться на фронте. mod_expires (.htaccess, application/json = 1 час)
// иначе навешивал бы max-age=3600 и фронт показывал устаревший список.
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0', true);
header('Pragma: no-cache');
header('Expires: 0', true);

require_once __DIR__ . '/../partials/cases-lib.php';

$data  = cases_load();
$cases = cases_visible($data); // только не-hidden, в порядке массива

$out = [];
foreach ($cases as $c) {
    // Тумблер: по умолчанию (если поля ещё нет) показываем; явный false — скрываем.
    $show = !array_key_exists('showOnExcursion', $c) || !empty($c['showOnExcursion']);
    if (!$show) continue;

    // Полные пути к фото (imageBase + файл). WebP сервер подставит сам (.htaccess).
    $base   = rtrim((string)($c['imageBase'] ?? ''), '/');
    $images = [];
    foreach (($c['images'] ?? []) as $img) {
        $img = ltrim((string)$img, '/');
        if ($img === '') continue;
        $images[] = $base !== '' ? $base . '/' . $img : $img;
    }

    // Метрики — форматируем на сервере (склонения как на сайте).
    $metrics = [];
    $area   = cases_format_metric($c['area']   ?? '', 'area');
    $floors = cases_format_metric($c['floors'] ?? '', 'floors');
    $term   = cases_format_metric($c['term']   ?? '', 'term');
    $mortgage = trim((string)($c['mortgage'] ?? ''));
    if ($area   !== '') $metrics[] = ['type' => 'area',   'value' => $area];
    if ($floors !== '') $metrics[] = ['type' => 'floors', 'value' => $floors];
    if ($term   !== '') $metrics[] = ['type' => 'term',   'value' => $term];

    $specs = [];
    foreach (($c['specs'] ?? []) as $sp) {
        $label = trim((string)($sp['label'] ?? ''));
        $value = trim((string)($sp['value'] ?? ''));
        if ($label === '' || $value === '') continue;
        $specs[] = ['label' => $label, 'value' => $value];
    }

    $out[] = [
        'id'            => (string)($c['id'] ?? ''),
        'name'          => (string)($c['name'] ?? ''),
        'location'      => (string)($c['location'] ?? ''),
        'excursionTime' => trim((string)($c['excursionTime'] ?? '')),
        'area'          => $area, // короткая метрика для подписи таба
        'metrics'       => $metrics,
        'mortgage'      => $mortgage,
        'description'   => (string)($c['description'] ?? ''),
        'images'        => $images,
        'specs'         => $specs,
    ];
}

echo json_encode(['objects' => $out], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
