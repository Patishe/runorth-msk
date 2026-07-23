<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('X-Content-Type-Options: nosniff');

const ATTRIBUTION_SITE = 'msk.runorth.ru';
const ATTRIBUTION_ALLOWED_HOSTS = ['msk.runorth.ru'];
const ATTRIBUTION_TTL = 1209600;
const ATTRIBUTION_MAX_BODY = 16384;

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function clean_value($value, int $maxLength): string
{
    if (!is_scalar($value)) return '';
    $value = trim((string)$value);
    $value = preg_replace('/[\x00-\x1F\x7F]/u', '', $value) ?? '';
    return function_exists('mb_substr') ? mb_substr($value, 0, $maxLength) : substr($value, 0, $maxLength);
}

function request_host(): string
{
    $host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
    return preg_replace('/:\d+$/', '', $host) ?? '';
}

function valid_browser_origin(): bool
{
    $candidate = (string)($_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '');
    if ($candidate === '') return true;
    $host = strtolower((string)(parse_url($candidate, PHP_URL_HOST) ?? ''));
    return in_array($host, ATTRIBUTION_ALLOWED_HOSTS, true);
}

if (!in_array(request_host(), ATTRIBUTION_ALLOWED_HOSTS, true)) {
    respond(400, ['ok' => false, 'error' => 'invalid_host']);
}

$storage = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'messenger-attribution';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $token = strtolower((string)($_GET['token'] ?? ''));
    if (!preg_match('/^[a-f0-9]{32}$/', $token)) {
        respond(400, ['ok' => false, 'error' => 'invalid_token']);
    }
    $path = $storage . DIRECTORY_SEPARATOR . $token . '.json';
    if (!is_file($path) || filemtime($path) < time() - ATTRIBUTION_TTL) {
        respond(404, ['ok' => false, 'error' => 'not_found']);
    }
    $context = json_decode((string)file_get_contents($path), true);
    if (!is_array($context)) {
        respond(404, ['ok' => false, 'error' => 'not_found']);
    }
    respond(200, ['ok' => true, 'context' => $context]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: GET, POST');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

if (!valid_browser_origin()) {
    respond(403, ['ok' => false, 'error' => 'invalid_origin']);
}

$contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > ATTRIBUTION_MAX_BODY) {
    respond(413, ['ok' => false, 'error' => 'payload_too_large']);
}

$raw = file_get_contents('php://input', false, null, 0, ATTRIBUTION_MAX_BODY + 1);
if ($raw === false || strlen($raw) > ATTRIBUTION_MAX_BODY) {
    respond(413, ['ok' => false, 'error' => 'payload_too_large']);
}
$input = json_decode($raw, true);
if (!is_array($input)) {
    respond(400, ['ok' => false, 'error' => 'invalid_json']);
}

$utmInput = is_array($input['utm'] ?? null) ? $input['utm'] : [];
$utm = [];
foreach (['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as $key) {
    $utm[$key] = clean_value($utmInput[$key] ?? '', 255);
}

$context = [
    'version' => 2,
    'site' => ATTRIBUTION_SITE,
    'utm' => $utm,
    'page_path' => clean_value($input['page_path'] ?? '/', 500),
    'page_url' => clean_value($input['page_url'] ?? '', 2048),
    'placement' => clean_value($input['placement'] ?? '', 30),
    'referrer' => clean_value($input['referrer'] ?? '', 2048),
    'roistat_visit' => clean_value($input['roistat_visit'] ?? '', 100),
    'roistat_marker' => clean_value($input['roistat_marker'] ?? '', 500),
    'roistat_referrer' => clean_value($input['roistat_referrer'] ?? '', 1000),
    'roistat_pos' => clean_value($input['roistat_pos'] ?? '', 255),
    'yandex_client_id' => clean_value($input['yandex_client_id'] ?? '', 100),
    'yclid' => clean_value($input['yclid'] ?? '', 255),
    'gclid' => clean_value($input['gclid'] ?? '', 255),
    'created_at' => gmdate('c'),
];

if (!is_dir($storage) && !mkdir($storage, 0750, true) && !is_dir($storage)) {
    respond(500, ['ok' => false, 'error' => 'storage_unavailable']);
}

if (random_int(1, 100) === 1) {
    foreach (glob($storage . DIRECTORY_SEPARATOR . '*.json') ?: [] as $oldPath) {
        if (is_file($oldPath) && filemtime($oldPath) < time() - ATTRIBUTION_TTL) @unlink($oldPath);
    }
}

$token = bin2hex(random_bytes(16));
$path = $storage . DIRECTORY_SEPARATOR . $token . '.json';
if (file_put_contents($path, json_encode($context, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX) === false) {
    respond(500, ['ok' => false, 'error' => 'storage_unavailable']);
}
@chmod($path, 0640);

respond(201, ['ok' => true, 'token' => $token]);
