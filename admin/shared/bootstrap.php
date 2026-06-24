<?php
/**
 * Общий старт для всех разделов админки (Объекты, Каталог).
 * Сессия, конфиг, аутентификация, CSRF, хелперы. Один логин на всю панель.
 */
declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/partials/data-lib.php';

// --- Конфиг (общий для всех разделов) ------------------------------------
$__cfgFile = __DIR__ . '/config.php';
if (!is_file($__cfgFile)) {
    http_response_code(500);
    exit('Не найден admin/shared/config.php. Скопируйте config.sample.php → config.php и задайте пароль.');
}
$ADMIN_CFG = require $__cfgFile;

// --- Сессия ---------------------------------------------------------------
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_name('runorth_admin');
    session_start();
}

// --- Хелперы --------------------------------------------------------------
function admin_e($s): string
{
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}

function admin_is_logged_in(): bool
{
    return !empty($_SESSION['admin_ok']);
}

function admin_require_login(): void
{
    if (!admin_is_logged_in()) {
        header('Location: /admin/login.php');
        exit;
    }
}

function admin_csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function admin_csrf_field(): string
{
    return '<input type="hidden" name="csrf" value="' . admin_e(admin_csrf_token()) . '">';
}

function admin_check_csrf(): void
{
    $sent = $_POST['csrf'] ?? '';
    if (!is_string($sent) || empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $sent)) {
        http_response_code(400);
        exit('Неверный CSRF-токен. Обновите страницу и попробуйте снова.');
    }
}

function admin_redirect(string $to): void
{
    header('Location: ' . $to);
    exit;
}

/** Транслитерация имени в slug для id/папок. */
function admin_slug(string $name): string
{
    $map = [
        'а'=>'a','б'=>'b','в'=>'v','г'=>'g','д'=>'d','е'=>'e','ё'=>'e','ж'=>'zh','з'=>'z','и'=>'i','й'=>'y',
        'к'=>'k','л'=>'l','м'=>'m','н'=>'n','о'=>'o','п'=>'p','р'=>'r','с'=>'s','т'=>'t','у'=>'u','ф'=>'f',
        'х'=>'h','ц'=>'c','ч'=>'ch','ш'=>'sh','щ'=>'sch','ъ'=>'','ы'=>'y','ь'=>'','э'=>'e','ю'=>'yu','я'=>'ya',
    ];
    $s = mb_strtolower(trim($name), 'UTF-8');
    $s = strtr($s, $map);
    $s = preg_replace('/[^a-z0-9]+/u', '-', $s);
    $s = trim((string)$s, '-');
    return $s !== '' ? $s : 'item-' . substr((string)time(), -6);
}
