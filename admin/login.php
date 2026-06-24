<?php
require_once __DIR__ . '/shared/bootstrap.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    admin_check_csrf();
    $u = trim((string)($_POST['username'] ?? ''));
    $p = (string)($_POST['password'] ?? '');
    $okUser = hash_equals((string)$ADMIN_CFG['username'], $u);
    $okPass = password_verify($p, (string)$ADMIN_CFG['password_hash']);
    if ($okUser && $okPass) {
        session_regenerate_id(true);
        $_SESSION['admin_ok'] = true;
        admin_redirect('/admin/cases/');
    }
    $error = 'Неверный логин или пароль';
}

if (admin_is_logged_in()) {
    admin_redirect('/admin/cases/');
}
?>
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Вход — панель управления</title>
<?php include __DIR__ . '/shared/styles.php'; ?>
</head>
<body class="admin-login-body">
    <form class="admin-card admin-login" method="post" action="/admin/login.php">
        <h1>Панель управления</h1>
        <p class="admin-muted">Объекты и каталог сайта</p>
        <?= admin_csrf_field() ?>
        <?php if ($error): ?><div class="admin-alert admin-alert-error"><?= admin_e($error) ?></div><?php endif; ?>
        <label>Логин<input type="text" name="username" autocomplete="username" required autofocus></label>
        <label>Пароль<input type="password" name="password" autocomplete="current-password" required></label>
        <button type="submit" class="admin-btn admin-btn-primary">Войти</button>
    </form>
</body>
</html>
