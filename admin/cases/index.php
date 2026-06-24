<?php
require_once __DIR__ . '/../shared/bootstrap.php';
require_once dirname(__DIR__, 2) . '/partials/cases-lib.php';
admin_require_login();

$data = cases_load();
$flash = '';
$flashType = 'ok';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    admin_check_csrf();
    $action = $_POST['action'] ?? '';

    if ($action === 'toggle') {
        $i = cases_index_by_id($data, (string)($_POST['id'] ?? ''));
        if ($i >= 0) {
            $data['cases'][$i]['hidden'] = empty($data['cases'][$i]['hidden']);
            cases_save($data);
            $flash = $data['cases'][$i]['hidden'] ? 'Объект скрыт' : 'Объект показан';
        }
    } elseif ($action === 'delete') {
        $i = cases_index_by_id($data, (string)($_POST['id'] ?? ''));
        if ($i >= 0) {
            // удаляем загруженные через панель фото (только из uploads/, статику images/ не трогаем)
            $base = (string)($data['cases'][$i]['imageBase'] ?? '');
            if (strpos($base, 'uploads/') === 0) {
                $dir = CASES_BASE_DIR . '/' . $base;
                if (is_dir($dir)) {
                    foreach (glob($dir . '/*') ?: [] as $f) @unlink($f);
                    @rmdir($dir);
                }
            }
            $name = $data['cases'][$i]['name'] ?? '';
            array_splice($data['cases'], $i, 1);
            cases_save($data);
            $flash = 'Объект «' . $name . '» удалён';
        }
    } elseif ($action === 'reorder') {
        $order = $_POST['order'] ?? [];
        if (is_array($order) && $order) {
            $byId = [];
            foreach ($data['cases'] as $c) $byId[$c['id']] = $c;
            $new = [];
            foreach ($order as $id) {
                if (isset($byId[$id])) { $new[] = $byId[$id]; unset($byId[$id]); }
            }
            foreach ($byId as $c) $new[] = $c; // на всякий случай добиваем остаток
            $data['cases'] = $new;
            cases_save($data);
            $flash = 'Порядок сохранён';
        }
    } elseif ($action === 'default') {
        $data['settings']['defaultCase'] = (string)($_POST['defaultCase'] ?? '');
        cases_save($data);
        $flash = 'Вкладка по умолчанию обновлена';
    }
    // POST-redirect-GET, чтобы не пересабмитить
    $_SESSION['flash'] = $flash;
    $_SESSION['flashType'] = $flashType;
    admin_redirect('index.php');
}

if (!empty($_SESSION['flash'])) {
    $flash = $_SESSION['flash'];
    $flashType = $_SESSION['flashType'] ?? 'ok';
    unset($_SESSION['flash'], $_SESSION['flashType']);
}

$cases = $data['cases'];
$defaultCase = $data['settings']['defaultCase'] ?? '';
?>
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Готовые объекты — управление</title>
<?php include __DIR__ . '/../shared/styles.php'; ?>
</head>
<body>
<div class="admin-wrap">
    <?php
    require_once __DIR__ . '/../shared/nav.php';
    admin_topbar('cases', 'Блок «Посмотрите некоторые из последних объектов» на главной',
        '<a class="admin-btn admin-btn-primary" href="form.php">+ Добавить объект</a>');
    ?>

    <?php if ($flash): ?>
        <div class="admin-alert admin-alert-<?= admin_e($flashType) ?>"><?= admin_e($flash) ?></div>
    <?php endif; ?>

    <?php if (!$cases): ?>
        <div class="admin-card">Объектов пока нет. <a href="form.php">Добавьте первый</a>.</div>
    <?php else: ?>
    <p class="admin-muted" style="margin:0 0 10px">Перетаскивайте за ⠿, чтобы менять порядок. Изменения сохраняются автоматически.</p>
    <div id="caseList">
        <?php foreach ($cases as $c):
            $thumb = '';
            $imgs = $c['images'] ?? [];
            if ($imgs) { $thumb = rtrim((string)($c['imageBase'] ?? ''), '/') . '/' . ltrim((string)$imgs[0], '/'); }
        ?>
        <div class="case-row <?= !empty($c['hidden']) ? 'is-hidden' : '' ?>" data-id="<?= admin_e($c['id']) ?>">
            <span class="case-drag" title="Перетащить">⠿</span>
            <?php if ($thumb): ?><img class="case-thumb" src="/<?= admin_e($thumb) ?>" alt="" loading="lazy"><?php else: ?><span class="case-thumb"></span><?php endif; ?>
            <div class="case-main">
                <h3>
                    <?= admin_e($c['name']) ?>
                    <?php if (!empty($c['hidden'])): ?><span class="case-badge case-badge-hidden">скрыт</span><?php endif; ?>
                    <?php if (($c['name'] ?? '') === $defaultCase): ?><span class="case-badge">по умолчанию</span><?php endif; ?>
                </h3>
                <div class="case-meta">
                    <?= admin_e($c['location'] ?? '') ?>
                    · <?= admin_e(cases_format_metric($c['area'] ?? '', 'area') ?: '—') ?> · <?= admin_e(cases_format_metric($c['floors'] ?? '', 'floors')) ?>
                    · фото: <?= count($imgs) ?>
                </div>
            </div>
            <div class="admin-actions">
                <a class="admin-btn admin-btn-sm" href="form.php?id=<?= admin_e(rawurlencode($c['id'])) ?>">Править</a>
                <form method="post" style="display:inline">
                    <?= admin_csrf_field() ?>
                    <input type="hidden" name="action" value="toggle">
                    <input type="hidden" name="id" value="<?= admin_e($c['id']) ?>">
                    <button class="admin-btn admin-btn-sm" type="submit"><?= !empty($c['hidden']) ? 'Показать' : 'Скрыть' ?></button>
                </form>
                <form method="post" style="display:inline" onsubmit="return confirm('Удалить объект «<?= admin_e($c['name']) ?>»? Действие необратимо.');">
                    <?= admin_csrf_field() ?>
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="id" value="<?= admin_e($c['id']) ?>">
                    <button class="admin-btn admin-btn-sm admin-btn-danger" type="submit">Удалить</button>
                </form>
            </div>
        </div>
        <?php endforeach; ?>
    </div>

    <form id="reorderForm" method="post" style="display:none">
        <?= admin_csrf_field() ?>
        <input type="hidden" name="action" value="reorder">
    </form>
    <?php endif; ?>
</div>

<script src="/admin/shared/sortable.min.js"></script>
<script>
(function(){
    var list = document.getElementById('caseList');
    if (!list || !window.Sortable) return;
    var form = document.getElementById('reorderForm');
    new Sortable(list, {
        handle: '.case-drag',
        animation: 150,
        onEnd: function(){
            // собрать порядок и отправить
            form.querySelectorAll('input[name="order[]"]').forEach(function(n){ n.remove(); });
            list.querySelectorAll('.case-row').forEach(function(row){
                var inp = document.createElement('input');
                inp.type = 'hidden'; inp.name = 'order[]'; inp.value = row.dataset.id;
                form.appendChild(inp);
            });
            form.submit();
        }
    });
})();
</script>
</body>
</html>
