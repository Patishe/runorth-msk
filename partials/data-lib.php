<?php
/**
 * Общий низкоуровневый движок данных для управляемых блоков (Объекты, Каталог, …).
 * Только generic-функции — НЕ знают про конкретную структуру блока.
 * Конкретные обёртки: cases-lib.php (Объекты), catalog-lib.php (Каталог).
 */

if (!defined('SITE_BASE_DIR')) {
    define('SITE_BASE_DIR', dirname(__DIR__)); // .../Site
}
if (!defined('SITE_DATA_DIR')) {
    define('SITE_DATA_DIR', SITE_BASE_DIR . '/data');
}

/** Прочитать JSON-файл (или сид при отсутствии). Возвращает массив или null. */
function data_load_file(string $file, ?string $seedFile = null): ?array
{
    $path = is_file($file) ? $file : (string)$seedFile;
    if ($path === '' || !is_file($path)) {
        return null;
    }
    $data = json_decode((string)file_get_contents($path), true);
    return is_array($data) ? $data : null;
}

/**
 * Атомарно сохранить массив в JSON-файл с бэкапом предыдущей версии.
 * @param string $backupPrefix префикс файлов бэкапа (напр. 'cases', 'catalog')
 */
function data_save_file(string $file, array $data, string $backupDir, string $backupPrefix, int $keepBackups = 20): bool
{
    $dir = dirname($file);
    if (!is_dir($dir)) {
        @mkdir($dir, 0775, true);
    }
    if (is_file($file)) {
        if (!is_dir($backupDir)) {
            @mkdir($backupDir, 0775, true);
        }
        @copy($file, $backupDir . '/' . $backupPrefix . '-' . date('Ymd-His') . '.json');
        data_prune_backups($backupDir, $backupPrefix, $keepBackups);
    }

    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false) {
        return false;
    }
    $tmp = $file . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) === false) {
        return false;
    }
    return rename($tmp, $file);
}

/** Оставить не более $keep последних бэкапов с данным префиксом. */
function data_prune_backups(string $backupDir, string $backupPrefix, int $keep = 20): void
{
    if (!is_dir($backupDir)) {
        return;
    }
    $files = glob($backupDir . '/' . $backupPrefix . '-*.json');
    if (!$files || count($files) <= $keep) {
        return;
    }
    sort($files);
    foreach (array_slice($files, 0, count($files) - $keep) as $old) {
        @unlink($old);
    }
}

/** Только видимые элементы (hidden пуст), в порядке массива. */
function data_visible(array $items): array
{
    return array_values(array_filter($items, fn($x) => empty($x['hidden'])));
}

/** Индекс элемента по id в массиве элементов; -1 если нет. */
function data_index_by_id(array $items, $id): int
{
    foreach ($items as $i => $x) {
        if (isset($x['id']) && $x['id'] === $id) {
            return $i;
        }
    }
    return -1;
}

/** Русское склонение по числу: 1 этаж / 2 этажа / 5 этажей. */
function data_ru_plural($n, string $one, string $few, string $many): string
{
    $n = abs((int)$n);
    $mod100 = $n % 100;
    $mod10 = $n % 10;
    if ($mod100 >= 11 && $mod100 <= 14) return $many;
    if ($mod10 === 1) return $one;
    if ($mod10 >= 2 && $mod10 <= 4) return $few;
    return $many;
}

/**
 * Текст метрики из числа: тип 'area' | 'floors' | 'term'.
 * Толерантно к старым строковым данным («172 м²» вернётся как есть).
 */
function data_format_metric($value, string $type): string
{
    $s = trim((string)$value);
    if ($s === '') return '';
    if (preg_match('/[^\d\s.,]/u', $s)) return $s; // легаси-строка с буквами
    $num = (float)str_replace(',', '.', $s);
    $int = (int)round($num);
    switch ($type) {
        case 'area':
            return rtrim(rtrim(number_format($num, 1, '.', ''), '0'), '.') . ' м²';
        case 'floors':
            return $int . ' ' . data_ru_plural($int, 'этаж', 'этажа', 'этажей');
        case 'term':
            return $int . ' ' . data_ru_plural($int, 'месяц', 'месяца', 'месяцев');
    }
    return $s;
}
