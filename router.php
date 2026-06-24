<?php
/**
 * Локальный роутер для встроенного php-сервера (php -S ... router.php).
 * Повторяет поведение прод-`.htaccess`: бесрасширочные URL (/kleeniy-brus → kleeniy-brus.html),
 * индекс директории (index.php), отдача статики. Нужен ТОЛЬКО для локальной разработки —
 * на боевом хостинге маршрутизацией занимается Apache/.htaccess.
 */
$root = __DIR__;
$uri  = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/');
$full = $root . $uri;

// 1) Существующий файл (не директория) — пусть php -S отдаёт/исполняет сам
if ($uri !== '/' && is_file($full)) {
    return false;
}

// 2) Корень или директория → index.php / index.html
if ($uri === '/' || is_dir($full)) {
    $dir = rtrim($full, '/');
    if (is_file($dir . '/index.php'))  { chdir($dir); require $dir . '/index.php'; return true; }
    if (is_file($dir . '/index.html')) { header('Content-Type: text/html; charset=UTF-8'); readfile($dir . '/index.html'); return true; }
}

// 3) Бесрасширочный URL → .html, затем .php (как RewriteRule ^(.+?)/?$ $1.html)
$base = $root . rtrim($uri, '/');
if (is_file($base . '.html')) { header('Content-Type: text/html; charset=UTF-8'); readfile($base . '.html'); return true; }
if (is_file($base . '.php'))  { chdir(dirname($base)); require $base . '.php'; return true; }

// 4) Не найдено
http_response_code(404);
if (is_file($root . '/404.html')) { readfile($root . '/404.html'); }
return true;
