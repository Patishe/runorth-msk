<?php
// Корень админки → раздел «Объекты» (или логин, если не авторизован).
require_once __DIR__ . '/shared/bootstrap.php';
admin_redirect(admin_is_logged_in() ? '/admin/cases/' : '/admin/login.php');
