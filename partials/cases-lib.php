<?php
/**
 * Библиотека блока «Готовые объекты». Тонкая обёртка над общим data-lib.php.
 * Используется публичным рендером (cases-render.php) и админкой (/admin/cases).
 *
 * Данные:
 *   data/cases.json          — рабочий файл (создаётся/меняется админкой; ИСКЛЮЧЁН из FTP-деплоя)
 *   data/cases.example.json  — стартовый сид в репозитории (деплоится); fallback
 */

require_once __DIR__ . '/data-lib.php';

if (!defined('CASES_BASE_DIR'))   define('CASES_BASE_DIR', SITE_BASE_DIR);
if (!defined('CASES_DATA_DIR'))   define('CASES_DATA_DIR', SITE_DATA_DIR);
if (!defined('CASES_FILE'))       define('CASES_FILE', CASES_DATA_DIR . '/cases.json');
if (!defined('CASES_SEED_FILE'))  define('CASES_SEED_FILE', CASES_DATA_DIR . '/cases.example.json');
if (!defined('CASES_BACKUP_DIR')) define('CASES_BACKUP_DIR', CASES_DATA_DIR . '/backups');

/** Загрузить данные блока: ['settings' => [...], 'cases' => [...]]. */
function cases_load(): array
{
    $data = data_load_file(CASES_FILE, CASES_SEED_FILE) ?? [];
    if (!isset($data['settings']) || !is_array($data['settings'])) {
        $data['settings'] = ['defaultCase' => ''];
    }
    if (!isset($data['cases']) || !is_array($data['cases'])) {
        $data['cases'] = [];
    }
    return $data;
}

/** Атомарно сохранить cases.json (+ бэкап). */
function cases_save(array $data): bool
{
    return data_save_file(CASES_FILE, $data, CASES_BACKUP_DIR, 'cases');
}

/** Только видимые объекты, в порядке массива. */
function cases_visible(array $data): array
{
    return data_visible($data['cases'] ?? []);
}

/** Индекс объекта по id; -1 если нет. */
function cases_index_by_id(array $data, $id): int
{
    return data_index_by_id($data['cases'] ?? [], $id);
}

/** Совместимость: форматирование метрик блока «Объекты». */
function cases_format_metric($value, string $type): string
{
    return data_format_metric($value, $type);
}
function cases_ru_plural($n, string $one, string $few, string $many): string
{
    return data_ru_plural($n, $one, $few, $many);
}
