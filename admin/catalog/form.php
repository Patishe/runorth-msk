<?php
require_once __DIR__ . '/../shared/bootstrap.php';
require_once __DIR__ . '/../shared/images.php';
require_once dirname(__DIR__, 2) . '/partials/catalog-lib.php';
admin_require_login();

$data = catalog_load();
$KNOWN_OPTIONS = ['terrace' => 'Терраса', 'sauna' => 'Сауна'];

$editId = (string)($_GET['id'] ?? '');
$idx = $editId !== '' ? catalog_index_by_id($data, $editId) : -1;
$isNew = ($idx < 0);

$item = $isNew ? [
    'id' => '', 'hidden' => false, 'name' => '', 'floors' => '', 'area' => '',
    'price' => '', 'bedrooms' => '', 'bathrooms' => '', 'terrace' => '',
    'options' => [], 'description' => '', 'url' => '', 'imageBase' => '', 'images' => [],
] : $data['items'][$idx];

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    admin_check_csrf();

    $name = trim((string)($_POST['name'] ?? ''));
    if ($name === '') $errors[] = 'Укажите название проекта';

    $intOnly = fn($v) => ($s = preg_replace('/[^\d]/', '', (string)$v)) === '' ? '' : (int)$s;

    $item['name']        = $name;
    $item['floors']      = $intOnly($_POST['floors'] ?? '');
    $item['area']        = $intOnly($_POST['area'] ?? '');
    $item['price']       = $intOnly($_POST['price'] ?? '');
    $item['bedrooms']    = $intOnly($_POST['bedrooms'] ?? '');
    $item['bathrooms']   = $intOnly($_POST['bathrooms'] ?? '');
    $item['terrace']     = $intOnly($_POST['terrace'] ?? '');
    $item['description'] = trim((string)($_POST['description'] ?? ''));
    $item['url']         = trim((string)($_POST['url'] ?? ''));

    // Опции (чекбоксы)
    $opts = $_POST['options'] ?? [];
    $item['options'] = is_array($opts) ? array_values(array_intersect(array_keys($KNOWN_OPTIONS), $opts)) : [];

    // id: для нового проекта используем id, под которым уже загружались фото (gallery_id)
    if ($isNew && empty($item['id'])) {
        $gid = trim((string)($_POST['gallery_id'] ?? ''));
        if ($gid !== '' && catalog_index_by_id($data, $gid) < 0) {
            $item['id'] = $gid;
        } else {
            $base = admin_slug($name); $id = $base; $n = 2;
            while (catalog_index_by_id($data, $id) >= 0) { $id = $base . '-' . $n; $n++; }
            $item['id'] = $id;
        }
    }
    if (empty($item['imageBase'])) {
        $gbase = trim((string)($_POST['gallery_imagebase'] ?? ''), '/');
        $item['imageBase'] = $gbase !== '' ? $gbase : ('uploads/catalog/' . $item['id']);
    }

    // Картинки управляются мгновенно через AJAX. В форме — итоговый список (полные пути).
    $imgs = $_POST['gallery_images'] ?? [];
    $images = [];
    if (is_array($imgs)) {
        foreach ($imgs as $v) { $v = ltrim((string)$v, '/'); if ($v !== '') $images[] = $v; }
    }
    $item['images'] = $images;

    if (!$errors) {
        if ($isNew) $data['items'][] = $item;
        else        $data['items'][$idx] = $item;
        catalog_save($data);
        $_SESSION['flash'] = $isNew ? 'Проект добавлен' : 'Изменения сохранены';
        $_SESSION['flashType'] = 'ok';
        admin_redirect('index.php');
    }
}

$priceMonth = $item['price'] !== '' ? catalog_price_month($item['price']) : 0;
?>
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= $isNew ? 'Новый проект' : 'Редактирование: ' . admin_e($item['name']) ?></title>
<?php include __DIR__ . '/../shared/styles.php'; ?>
</head>
<body>
<div class="admin-wrap">
    <div class="admin-topbar">
        <div>
            <h1><?= $isNew ? 'Новый проект каталога' : admin_e($item['name']) ?></h1>
            <p class="admin-muted"><a href="index.php">← К списку проектов</a></p>
        </div>
    </div>

    <?php if ($errors): ?>
        <div class="admin-alert admin-alert-error"><?= implode('<br>', array_map('admin_e', $errors)) ?></div>
    <?php endif; ?>

    <form class="admin-form" method="post" enctype="multipart/form-data">
        <?= admin_csrf_field() ?>

        <div class="admin-card admin-form">
            <label>Название*<input type="text" name="name" value="<?= admin_e($item['name']) ?>" required></label>
            <div class="admin-grid-3">
                <label>Площадь
                    <span class="num-field"><input type="text" inputmode="numeric" name="area" value="<?= admin_e($item['area']) ?>" placeholder="172" data-metric="area"><span class="num-suffix">м²</span></span>
                    <small class="metric-preview" data-for="area"></small>
                </label>
                <label>Этажность
                    <span class="num-field"><input type="text" inputmode="numeric" name="floors" value="<?= admin_e($item['floors']) ?>" placeholder="1" data-metric="floors"><span class="num-suffix">эт.</span></span>
                    <small class="metric-preview" data-for="floors"></small>
                </label>
                <label>Цена
                    <span class="num-field"><input type="text" inputmode="numeric" name="price" value="<?= admin_e($item['price']) ?>" placeholder="10000000" id="priceInput"><span class="num-suffix">₽</span></span>
                    <small class="metric-preview" id="priceMonthPreview"><?= $priceMonth ? '≈ ' . number_format($priceMonth, 0, '', ' ') . ' ₽/мес' : '' ?></small>
                </label>
            </div>
            <div class="admin-grid-2">
                <label>Спальни
                    <span class="num-field"><input type="text" inputmode="numeric" name="bedrooms" value="<?= admin_e($item['bedrooms']) ?>" placeholder="3"><span class="num-suffix">шт.</span></span>
                </label>
                <label>Санузлы
                    <span class="num-field"><input type="text" inputmode="numeric" name="bathrooms" value="<?= admin_e($item['bathrooms']) ?>" placeholder="2"><span class="num-suffix">шт.</span></span>
                </label>
            </div>
            <label>Описание<textarea name="description"><?= admin_e($item['description']) ?></textarea></label>
        </div>

        <div class="admin-card">
            <p class="admin-section-title">Фотогалерея</p>
            <?php if (!admin_webp_available()): ?>
                <div class="admin-alert admin-alert-error" style="margin-top:10px">На сервере недоступна генерация webp (модуль GD). Фото будут показаны как JPG.</div>
            <?php endif; ?>
            <p class="admin-muted" style="margin:10px 0 6px">Перетаскивайте фото за ⠿. Первое фото — обложка.</p>
            <div class="img-grid" id="galleryGrid" data-entity="catalog" data-isnew="<?= $isNew ? '1' : '0' ?>" data-csrf="<?= admin_e(admin_csrf_token()) ?>" style="margin:6px 0 0">
                <?php foreach (($item['images'] ?? []) as $k => $img): $img = ltrim((string)$img, '/'); ?>
                <div class="img-tile" data-value="<?= admin_e($img) ?>">
                    <span class="img-cover-flag" <?= $k === 0 ? '' : 'style="display:none"' ?>>обложка</span>
                    <span class="img-drag" title="Перетащить">⠿</span>
                    <input type="hidden" name="gallery_images[]" value="<?= admin_e($img) ?>">
                    <img src="/<?= admin_e($img) ?>" alt="" loading="lazy" draggable="false">
                    <div class="img-tools"><button type="button" class="admin-btn admin-btn-sm admin-btn-danger img-del">удалить</button></div>
                </div>
                <?php endforeach; ?>
            </div>
            <label style="margin-top:12px">Добавить фото (можно несколько, JPG/PNG/WEBP до 15 МБ)
                <input type="file" id="galleryFile" accept="image/jpeg,image/png,image/webp" multiple>
            </label>
            <p class="admin-muted" id="galleryStatus" style="margin:8px 0 0;min-height:18px"></p>
            <?php if ($isNew): ?><p class="admin-muted" style="margin:4px 0 0">Можно добавлять фото сразу — проект создастся при нажатии «Создать».</p><?php endif; ?>
            <input type="hidden" id="gallery_id" name="gallery_id" value="<?= admin_e($item['id'] ?? '') ?>">
            <input type="hidden" id="gallery_imagebase" name="gallery_imagebase" value="<?= admin_e($item['imageBase'] ?? '') ?>">
        </div>

        <div class="admin-actions">
            <button type="submit" class="admin-btn admin-btn-primary"><?= $isNew ? 'Создать проект' : 'Сохранить изменения' ?></button>
            <a href="index.php" class="admin-btn">Отмена</a>
        </div>
    </form>
</div>

<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js"></script>
<script>
// Предпросмотр единиц (площадь/этажность)
(function(){
    function plural(n, one, few, many){ n=Math.abs(parseInt(n,10)); var a=n%100,b=n%10; if(a>=11&&a<=14)return many; if(b===1)return one; if(b>=2&&b<=4)return few; return many; }
    function fmt(type, raw){ var s=String(raw).replace(',', '.').trim(); if(s==='')return ''; var num=parseFloat(s); if(isNaN(num))return ''; if(type==='area')return (Math.round(num*10)/10)+' м²'; var i=Math.round(num); if(type==='floors')return i+' '+plural(i,'этаж','этажа','этажей'); return ''; }
    document.querySelectorAll('input[data-metric]').forEach(function(inp){
        var type=inp.dataset.metric, out=document.querySelector('.metric-preview[data-for="'+type+'"]');
        function upd(){ var c=inp.value.replace(/[^\d.,]/g,''); if(c!==inp.value)inp.value=c; if(out)out.textContent=fmt(type,c)?'На сайте: '+fmt(type,c):''; }
        inp.addEventListener('input', upd); upd();
    });
})();

// Цена → платёж/мес
(function(){
    var price=document.getElementById('priceInput'), out=document.getElementById('priceMonthPreview');
    if(!price) return;
    function fmtNum(n){ return Math.round(n).toLocaleString('ru-RU').replace(/ /g,' '); }
    function upd(){ var c=price.value.replace(/[^\d]/g,''); if(c!==price.value)price.value=c; var v=parseInt(c,10); out.textContent = v? '≈ '+fmtNum(v*0.0047964)+' ₽/мес':''; }
    price.addEventListener('input', upd);
})();

</script>
<script src="/admin/shared/gallery.js"></script>
</body>
</html>
