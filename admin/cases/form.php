<?php
require_once __DIR__ . '/../shared/bootstrap.php';
require_once __DIR__ . '/../shared/images.php';
require_once dirname(__DIR__, 2) . '/partials/cases-lib.php';
admin_require_login();

$data = cases_load();
$KNOWN_SPEC_KEYS = ['foundation' => 'Фундамент', 'timber' => 'Брус', 'walls' => 'Блок', 'roof' => 'Кровля', 'windows' => 'Окна', 'finish' => 'Отделка'];

$editId = (string)($_GET['id'] ?? '');
$idx = $editId !== '' ? cases_index_by_id($data, $editId) : -1;
$isNew = ($idx < 0);

// Текущая модель (для предзаполнения)
$case = $isNew ? [
    'id' => '', 'hidden' => false, 'name' => '', 'location' => '',
    'area' => '', 'floors' => '', 'term' => '', 'mortgage' => '',
    'description' => '', 'imageBase' => '', 'images' => [], 'specs' => [],
] : $data['cases'][$idx];

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    admin_check_csrf();

    $name = trim((string)($_POST['name'] ?? ''));
    if ($name === '') $errors[] = 'Укажите название объекта';

    // Собираем модель из формы
    $case['name']        = $name;
    $case['location']    = trim((string)($_POST['location'] ?? ''));
    // Метрики храним числом (пользователь вводит только цифры), единицы подставляет рендер
    $numOnly = function ($v) {
        $v = preg_replace('/[^\d.,]/u', '', (string)$v);
        $v = str_replace(',', '.', (string)$v);
        if ($v === '' || $v === '.') return '';
        return (strpos($v, '.') !== false) ? (float)$v : (int)$v;
    };
    $case['area']        = $numOnly($_POST['area'] ?? '');
    $case['floors']      = $numOnly($_POST['floors'] ?? '');
    $case['term']        = $numOnly($_POST['term'] ?? '');
    $case['mortgage']    = trim((string)($_POST['mortgage'] ?? ''));
    $case['description'] = trim((string)($_POST['description'] ?? ''));

    // Спецификации
    $specs = [];
    $sk = $_POST['spec_key'] ?? [];
    $sl = $_POST['spec_label'] ?? [];
    $sv = $_POST['spec_value'] ?? [];
    for ($i = 0; $i < count($sl); $i++) {
        $label = trim((string)($sl[$i] ?? ''));
        $value = trim((string)($sv[$i] ?? ''));
        $rawKey = trim((string)($sk[$i] ?? ''));
        // сохраняем только заполненные строки (нужны и подпись, и значение)
        if ($label === '' || $value === '') continue;
        $key = $rawKey === '' ? 'spec' : admin_slug($rawKey);
        $specs[] = ['key' => $key, 'label' => $label, 'value' => $value];
    }
    $case['specs'] = $specs;

    // id: для нового объекта используем id, под которым уже загружались фото (gallery_id),
    // иначе генерируем из имени.
    if ($isNew && empty($case['id'])) {
        $gid = trim((string)($_POST['gallery_id'] ?? ''));
        if ($gid !== '' && cases_index_by_id($data, $gid) < 0) {
            $case['id'] = $gid;
        } else {
            $base = admin_slug($name); $id = $base; $n = 2;
            while (cases_index_by_id($data, $id) >= 0) { $id = $base . '-' . $n; $n++; }
            $case['id'] = $id;
        }
    }
    if (empty($case['imageBase'])) {
        $gbase = trim((string)($_POST['gallery_imagebase'] ?? ''), '/');
        $case['imageBase'] = $gbase !== '' ? $gbase : ('uploads/cases/' . $case['id']);
    }

    // Картинки управляются мгновенно через AJAX (admin/shared/image-api.php);
    // в форме приходит только итоговый список/порядок плиток. Первое фото = обложка.
    $imgs = $_POST['gallery_images'] ?? [];
    $images = [];
    if (is_array($imgs)) {
        foreach ($imgs as $v) { $v = basename((string)$v); if ($v !== '') $images[] = $v; }
    }
    $case['images'] = $images;

    if (!$errors) {
        if ($isNew) {
            $data['cases'][] = $case;
        } else {
            $data['cases'][$idx] = $case;
        }
        cases_save($data);
        $_SESSION['flash'] = $isNew ? 'Объект добавлен' : 'Изменения сохранены';
        $_SESSION['flashType'] = 'ok';
        admin_redirect('index.php');
    }
    // при ошибке остаёмся на форме с уже применёнными загрузками/удалениями (данные сохраняем для повторного сабмита)
}

$imgBaseUrl = $case['imageBase'] !== '' ? '/' . trim($case['imageBase'], '/') . '/' : '';
?>
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= $isNew ? 'Новый объект' : 'Редактирование: ' . admin_e($case['name']) ?></title>
<?php include __DIR__ . '/../shared/styles.php'; ?>
</head>
<body>
<div class="admin-wrap">
    <div class="admin-topbar">
        <div>
            <h1><?= $isNew ? 'Новый объект' : admin_e($case['name']) ?></h1>
            <p class="admin-muted"><a href="index.php">← К списку объектов</a></p>
        </div>
    </div>

    <?php if ($errors): ?>
        <div class="admin-alert admin-alert-error"><?= implode('<br>', array_map('admin_e', $errors)) ?></div>
    <?php endif; ?>

    <form class="admin-form" method="post" enctype="multipart/form-data">
        <?= admin_csrf_field() ?>

        <div class="admin-card admin-form">
            <div class="admin-grid-2">
                <label>Название*<input type="text" name="name" value="<?= admin_e($case['name']) ?>" required></label>
                <label>Локация<input type="text" name="location" value="<?= admin_e($case['location']) ?>" placeholder="Уют у залива, СПб"></label>
            </div>
            <?php
            // Для поля показываем только число (на случай старых строковых данных)
            $numField = fn($v) => admin_e(preg_replace('/[^\d.,]/u', '', (string)$v));
            ?>
            <div class="admin-grid-3">
                <label>Площадь
                    <span class="num-field">
                        <input type="text" inputmode="decimal" name="area" value="<?= $numField($case['area']) ?>" placeholder="172" data-metric="area">
                        <span class="num-suffix">м²</span>
                    </span>
                    <small class="metric-preview" data-for="area"></small>
                </label>
                <label>Этажность
                    <span class="num-field">
                        <input type="text" inputmode="numeric" name="floors" value="<?= $numField($case['floors']) ?>" placeholder="1" data-metric="floors">
                        <span class="num-suffix">эт.</span>
                    </span>
                    <small class="metric-preview" data-for="floors"></small>
                </label>
                <label>Срок
                    <span class="num-field">
                        <input type="text" inputmode="numeric" name="term" value="<?= $numField($case['term']) ?>" placeholder="3" data-metric="term">
                        <span class="num-suffix">мес.</span>
                    </span>
                    <small class="metric-preview" data-for="term"></small>
                </label>
            </div>
            <label>Ипотека (бейдж, необязательно)<input type="text" name="mortgage" value="<?= admin_e($case['mortgage']) ?>" placeholder="Семейная ипотека"></label>
            <label>Описание<textarea name="description"><?= admin_e($case['description']) ?></textarea></label>
        </div>

        <div class="admin-card">
            <p class="admin-section-title">Характеристики (нижний блок карточки)</p>
            <?php
            // Рендер выпадающего списка ключа характеристики
            $renderSpecKeySelect = function ($current) use ($KNOWN_SPEC_KEYS) {
                $current = (string)$current;
                $out = '<select name="spec_key[]" class="spec-key">';
                $out .= '<option value="">— характеристика —</option>';
                $found = false;
                foreach ($KNOWN_SPEC_KEYS as $k => $title) {
                    $sel = ($k === $current) ? ' selected' : '';
                    if ($sel) $found = true;
                    $out .= '<option value="' . admin_e($k) . '"' . $sel . '>' . admin_e($title) . '</option>';
                }
                if ($current !== '' && !$found) {
                    $out .= '<option value="' . admin_e($current) . '" selected>' . admin_e($current) . '</option>';
                }
                $out .= '</select>';
                return $out;
            };
            $specsForView = !empty($case['specs']) ? $case['specs'] : [['key' => 'foundation', 'label' => 'Фундамент', 'value' => '']];
            ?>
            <div id="specList" style="margin-top:12px">
                <?php foreach ($specsForView as $sp): ?>
                <div class="spec-row">
                    <?= $renderSpecKeySelect($sp['key'] ?? '') ?>
                    <input type="text" name="spec_label[]" class="spec-label" value="<?= admin_e($sp['label'] ?? '') ?>" placeholder="Подпись">
                    <input type="text" name="spec_value[]" class="spec-value" value="<?= admin_e($sp['value'] ?? '') ?>" placeholder="Значение (например, Плита 250 мм)">
                    <button type="button" class="admin-btn admin-btn-sm admin-btn-danger spec-del" onclick="this.closest('.spec-row').remove()">✕</button>
                </div>
                <?php endforeach; ?>
            </div>
            <button type="button" class="admin-btn admin-btn-sm" onclick="addSpec()">+ Добавить характеристику</button>
            <p class="admin-muted" style="margin-top:8px">Выберите тип характеристики — подпись подставится автоматически, её можно изменить. Значение впишите справа.</p>
        </div>

        <div class="admin-card">
            <p class="admin-section-title">Фотогалерея</p>
            <?php if (!admin_webp_available()): ?>
                <div class="admin-alert admin-alert-error" style="margin-top:10px">На сервере недоступна генерация webp (модуль GD). Фото будут показаны как JPG. Для оптимальной скорости включите GD/webp на хостинге.</div>
            <?php endif; ?>
            <p class="admin-muted" style="margin:10px 0 6px">Перетаскивайте фото за ⠿. Первое фото — обложка.</p>
            <div class="img-grid" id="galleryGrid" data-entity="cases" data-isnew="<?= $isNew ? '1' : '0' ?>" data-csrf="<?= admin_e(admin_csrf_token()) ?>" style="margin:6px 0 0">
                <?php foreach (($case['images'] ?? []) as $k => $img): $img = ltrim((string)$img, '/'); ?>
                <div class="img-tile" data-value="<?= admin_e($img) ?>">
                    <span class="img-cover-flag" <?= $k === 0 ? '' : 'style="display:none"' ?>>обложка</span>
                    <span class="img-drag" title="Перетащить">⠿</span>
                    <input type="hidden" name="gallery_images[]" value="<?= admin_e($img) ?>">
                    <img src="<?= admin_e($imgBaseUrl . $img) ?>" alt="" loading="lazy" draggable="false">
                    <div class="img-tools"><button type="button" class="admin-btn admin-btn-sm admin-btn-danger img-del">удалить</button></div>
                </div>
                <?php endforeach; ?>
            </div>
            <label style="margin-top:12px">Добавить фото (можно несколько, JPG/PNG/WEBP до 15 МБ)
                <input type="file" id="galleryFile" accept="image/jpeg,image/png,image/webp" multiple>
            </label>
            <p class="admin-muted" id="galleryStatus" style="margin:8px 0 0;min-height:18px"></p>
            <?php if ($isNew): ?><p class="admin-muted" style="margin:4px 0 0">Можно добавлять фото сразу — объект создастся при нажатии «Создать».</p><?php endif; ?>
            <input type="hidden" id="gallery_id" name="gallery_id" value="<?= admin_e($case['id'] ?? '') ?>">
            <input type="hidden" id="gallery_imagebase" name="gallery_imagebase" value="<?= admin_e($case['imageBase'] ?? '') ?>">
        </div>

        <div class="admin-actions">
            <button type="submit" class="admin-btn admin-btn-primary"><?= $isNew ? 'Создать объект' : 'Сохранить изменения' ?></button>
            <a href="index.php" class="admin-btn">Отмена</a>
        </div>
    </form>
</div>

<script src="/admin/shared/sortable.min.js"></script>
<script>
var SPEC_LABELS = <?= json_encode($KNOWN_SPEC_KEYS, JSON_UNESCAPED_UNICODE) ?>;

function addSpec(){
    var row = document.querySelector('#specList .spec-row');
    var clone = row.cloneNode(true);
    clone.querySelectorAll('input').forEach(function(i){ i.value=''; });
    var sel = clone.querySelector('select.spec-key');
    if (sel) sel.selectedIndex = 0;
    document.getElementById('specList').appendChild(clone);
}

// Выбор типа характеристики → автоподстановка подписи (можно переписать вручную)
document.getElementById('specList').addEventListener('change', function(e){
    var sel = e.target.closest('select.spec-key');
    if (!sel) return;
    var label = sel.closest('.spec-row').querySelector('.spec-label');
    if (label && SPEC_LABELS[sel.value] !== undefined) {
        label.value = SPEC_LABELS[sel.value];
    }
});

// Живой предпросмотр единиц измерения (склонение как на сайте)
(function(){
    function plural(n, one, few, many){
        n = Math.abs(parseInt(n,10)); var m100=n%100, m10=n%10;
        if (m100>=11 && m100<=14) return many;
        if (m10===1) return one;
        if (m10>=2 && m10<=4) return few;
        return many;
    }
    function fmt(type, raw){
        var s=String(raw).replace(',', '.').trim();
        if (s==='') return '';
        var num=parseFloat(s); if (isNaN(num)) return '';
        if (type==='area') return (Math.round(num*10)/10) + ' м²';
        var i=Math.round(num);
        if (type==='floors') return i+' '+plural(i,'этаж','этажа','этажей');
        if (type==='term') return i+' '+plural(i,'месяц','месяца','месяцев');
        return '';
    }
    document.querySelectorAll('input[data-metric]').forEach(function(inp){
        var type=inp.dataset.metric;
        var out=document.querySelector('.metric-preview[data-for="'+type+'"]');
        function upd(){
            // оставляем только цифры и разделитель
            var clean=inp.value.replace(/[^\d.,]/g,'');
            if (clean!==inp.value) inp.value=clean;
            if (out) out.textContent = fmt(type, clean) ? 'На сайте: ' + fmt(type, clean) : '';
        }
        inp.addEventListener('input', upd); upd();
    });
})();

</script>
<script src="/admin/shared/gallery.js"></script>
</body>
</html>
