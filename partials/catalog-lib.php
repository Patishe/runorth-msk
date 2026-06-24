<?php
/**
 * Библиотека каталога проектов. Тонкая обёртка над data-lib.php.
 * Данные:
 *   data/catalog.json          — рабочий файл (создаётся/меняется админкой; исключён из FTP)
 *   data/catalog.example.json  — стартовый сид (деплоится); fallback
 *
 * Структура: ['settings' => [...], 'items' => [ {id,name,floors,area,price,bedrooms,
 *   bathrooms,terrace,options[],description,url,imageBase,images[]}, ... ]]
 * priceMonth НЕ хранится — считается из цены.
 */

require_once __DIR__ . '/data-lib.php';

if (!defined('CATALOG_FILE'))       define('CATALOG_FILE', SITE_DATA_DIR . '/catalog.json');
if (!defined('CATALOG_SEED_FILE'))  define('CATALOG_SEED_FILE', SITE_DATA_DIR . '/catalog.example.json');
if (!defined('CATALOG_BACKUP_DIR')) define('CATALOG_BACKUP_DIR', SITE_DATA_DIR . '/backups');

/** Ставка ежемесячного платежа (как в текущем catalog.js). */
if (!defined('CATALOG_RATE')) define('CATALOG_RATE', 0.0047964);

function catalog_load(): array
{
    $data = data_load_file(CATALOG_FILE, CATALOG_SEED_FILE) ?? [];
    if (!isset($data['settings']) || !is_array($data['settings'])) {
        $data['settings'] = [];
    }
    if (!isset($data['items']) || !is_array($data['items'])) {
        $data['items'] = [];
    }
    return $data;
}

function catalog_save(array $data): bool
{
    return data_save_file(CATALOG_FILE, $data, CATALOG_BACKUP_DIR, 'catalog');
}

function catalog_visible(array $data): array
{
    return data_visible($data['items'] ?? []);
}

function catalog_index_by_id(array $data, $id): int
{
    return data_index_by_id($data['items'] ?? [], $id);
}

/** Ежемесячный платёж из цены. */
function catalog_price_month($price): int
{
    return (int)round(((float)$price) * CATALOG_RATE);
}
