<?php
require_once __DIR__ . '/../shared/bootstrap.php';
require_once dirname(__DIR__, 2) . '/partials/catalog-lib.php';
admin_require_login();

$data = catalog_load();
$flash = '';
$flashType = 'ok';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    admin_check_csrf();
    $action = $_POST['action'] ?? '';

    if ($action === 'toggle') {
        $i = catalog_index_by_id($data, (string)($_POST['id'] ?? ''));
        if ($i >= 0) {
            $data['items'][$i]['hidden'] = empty($data['items'][$i]['hidden']);
            catalog_save($data);
            $flash = $data['items'][$i]['hidden'] ? 'Проект скрыт' : 'Проект показан';
        }
    } elseif ($action === 'delete') {
        $i = catalog_index_by_id($data, (string)($_POST['id'] ?? ''));
        if ($i >= 0) {
            $base = (string)($data['items'][$i]['imageBase'] ?? '');
            if (strpos($base, 'uploads/') === 0) {
                $dir = SITE_BASE_DIR . '/' . trim($base, '/');
                if (is_dir($dir)) {
                    foreach (glob($dir . '/*') ?: [] as $f) @unlink($f);
                    @rmdir($dir);
                }
            }
            $name = $data['items'][$i]['name'] ?? '';
            array_splice($data['items'], $i, 1);
            catalog_save($data);
            $flash = 'Проект «' . $name . '» удалён';
        }
    } elseif ($action === 'reorder') {
        $order = $_POST['order'] ?? [];
        if (is_array($order) && $order) {
            $byId = [];
            foreach ($data['items'] as $c) $byId[$c['id']] = $c;
            $new = [];
            foreach ($order as $id) {
                if (isset($byId[$id])) { $new[] = $byId[$id]; unset($byId[$id]); }
            }
            foreach ($byId as $c) $new[] = $c;
            $data['items'] = $new;
            catalog_save($data);
            $flash = 'Порядок сохранён';
        }
    }
    $_SESSION['flash'] = $flash;
    $_SESSION['flashType'] = $flashType;
    admin_redirect('index.php');
}

if (!empty($_SESSION['flash'])) {
    $flash = $_SESSION['flash'];
    $flashType = $_SESSION['flashType'] ?? 'ok';
    unset($_SESSION['flash'], $_SESSION['flashType']);
}

$items = $data['items'];
?>
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Каталог проектов — управление</title>
<?php include __DIR__ . '/../shared/styles.php'; ?>
</head>
<body>
<div class="admin-wrap">
    <?php
    require_once __DIR__ . '/../shared/nav.php';
    admin_topbar('catalog', 'Каталог проектов (секция на главной msk.runorth.ru)',
        '<a class="admin-btn admin-btn-primary" href="form.php">+ Добавить проект</a>');
    ?>

    <?php if ($flash): ?>
        <div class="admin-alert admin-alert-<?= admin_e($flashType) ?>"><?= admin_e($flash) ?></div>
    <?php endif; ?>

    <?php if (!$items): ?>
        <div class="admin-card">Проектов пока нет. <a href="form.php">Добавьте первый</a>.</div>
    <?php else: ?>
    <p class="admin-muted" style="margin:0 0 10px">Перетаскивайте за ⠿, чтобы менять порядок. Изменения сохраняются автоматически.</p>
    <div id="caseList">
        <?php foreach ($items as $c):
            $imgs = $c['images'] ?? [];
            $thumb = $imgs ? '/' . ltrim((string)$imgs[0], '/') : '';
        ?>
        <div class="case-row <?= !empty($c['hidden']) ? 'is-hidden' : '' ?>" data-id="<?= admin_e($c['id']) ?>">
            <span class="case-drag" title="Перетащить">⠿</span>
            <?php if ($thumb): ?><img class="case-thumb" src="<?= admin_e($thumb) ?>" alt="" loading="lazy"><?php else: ?><span class="case-thumb"></span><?php endif; ?>
            <div class="case-main">
                <h3>
                    <?= admin_e($c['name']) ?>
                    <?php if (!empty($c['hidden'])): ?><span class="case-badge case-badge-hidden">скрыт</span><?php endif; ?>
                </h3>
                <div class="case-meta">
                    <?= admin_e(data_format_metric($c['area'] ?? '', 'area')) ?> ·
                    <?= admin_e(data_format_metric($c['floors'] ?? '', 'floors')) ?> ·
                    <?= admin_e(number_format((float)($c['price'] ?? 0), 0, '', ' ')) ?> ₽ ·
                    фото: <?= count($imgs) ?>
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
                <form method="post" style="display:inline" onsubmit="return confirm('Удалить проект «<?= admin_e($c['name']) ?>»? Действие необратимо.');">
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

<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js"></script>
<script>
(function(){
    var list = document.getElementById('caseList');
    if (!list || !window.Sortable) return;
    var form = document.getElementById('reorderForm');
    new Sortable(list, {
        handle: '.case-drag',
        animation: 150,
        onEnd: function(){
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
