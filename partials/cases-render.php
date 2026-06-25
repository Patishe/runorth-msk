<?php
/**
 * Публичный рендер карточек блока «Посмотрите некоторые из последних объектов».
 * Подключается из index.php внутри <div class="grid-2 projects-home-grid">.
 * Выводит те же <article class="project-card case-card">, что были захардкожены ранее,
 * но из data/cases.json — чтобы менеджер мог управлять ими через /admin/cases.
 */
require_once __DIR__ . '/cases-lib.php';

$__casesData = cases_load();
$__casesList = cases_visible($__casesData);

if (!function_exists('cases_e')) {
    function cases_e($s)
    {
        return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
    }
}
if (!function_exists('cases_img_paths')) {
    function cases_img_paths($case)
    {
        $base = rtrim((string)($case['imageBase'] ?? ''), '/');
        $out = [];
        foreach (($case['images'] ?? []) as $img) {
            $img = ltrim((string)$img, '/');
            $out[] = $base !== '' ? $base . '/' . $img : $img;
        }
        return $out;
    }
}

foreach ($__casesList as $case):
    $name = $case['name'] ?? '';
    $location = $case['location'] ?? '';
    $alt = 'Дом ' . $name . ($location !== '' ? ' — ' . $location : '');
    $modal = 'Экскурсия в дом ' . $name . ($location !== '' ? ', ' . $location : '');

    $imgPaths = cases_img_paths($case);
    $first = $imgPaths[0] ?? '';
    // webp-варианты первого изображения: <base>/<stem>-480.webp и т.д.
    $firstStem = '';
    $firstDir = '';
    if ($first !== '') {
        $firstDir = (strpos($first, '/') !== false) ? substr($first, 0, strrpos($first, '/')) : '';
        $firstName = basename($first);
        $firstStem = preg_replace('/\.[^.]+$/', '', $firstName);
    }
    $wbase = $firstDir !== '' ? $firstDir . '/' . $firstStem : $firstStem;
    // webp-источник выводим только если файл реально существует на диске
    $hasWebp = $first !== '' && is_file(CASES_BASE_DIR . '/' . $wbase . '.webp');

    $badges = [
        ['area',     cases_format_metric($case['area']   ?? '', 'area')],
        ['floors',   cases_format_metric($case['floors'] ?? '', 'floors')],
        ['time',     cases_format_metric($case['term']   ?? '', 'term')],
        ['mortgage', trim((string)($case['mortgage'] ?? ''))],
    ];
    $dataImages = json_encode($imgPaths, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
?>
                        <!-- Кейс: <?= cases_e($name) ?> -->
                        <article class="project-card case-card"
                            data-images='<?= cases_e($dataImages) ?>'>
                            <div class="project-gallery">
                                <div class="project-gallery-viewport">
                                    <picture>
<?php if ($hasWebp): ?>
                                        <source
                                            srcset="<?= cases_e($wbase) ?>-480.webp 480w, <?= cases_e($wbase) ?>-768.webp 768w, <?= cases_e($wbase) ?>.webp 1200w"
                                            sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1200px) 50vw, 600px"
                                            type="image/webp">
<?php endif; ?>
<?php if ($first !== ''): ?>
                                        <img class="project-gallery-img" src="<?= cases_e($first) ?>" alt="<?= cases_e($alt) ?>"
                                            width="600" height="400" loading="lazy" decoding="async">
<?php endif; ?>
                                    </picture>
                                </div>
                                <button class="project-gallery-arrow arrow-left" onclick="projectGalleryNav(this, -1)" aria-label="Назад"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                                <button class="project-gallery-arrow arrow-right" onclick="projectGalleryNav(this, 1)" aria-label="Вперёд"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
<?php if (count($imgPaths) > 1): ?>
                                <div class="project-gallery-counter"><span>1</span> / <?= count($imgPaths) ?></div>
<?php endif; ?>
                                <div class="project-gallery-dots"></div>
                            </div>
                            <div class="project-info">
                                <div class="project-title-row">
                                    <div class="project-title-left">
                                        <h3><?= cases_e($name) ?></h3>
                                        <p class="case-location"><?= cases_e($location) ?></p>
                                    </div>
                                </div>
                                <div class="project-badges project-metrics">
<?php foreach ($badges as $b): if ($b[1] === '' || $b[1] === null) continue; ?>
                                    <div class="project-badge project-badge-<?= cases_e($b[0]) ?>"><?= cases_e($b[1]) ?></div>
<?php endforeach; ?>
                                </div>
                                <p class="project-description"><?= cases_e($case['description'] ?? '') ?></p>
                                <div class="case-cta">
                                    <button class="btn-project-request" onclick="openModal('<?= cases_e(str_replace("'", "\\'", $modal)) ?>')">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                        <span>Записаться на экскурсию</span>
                                    </button>
                                    <p class="case-cta-note">Покажем этот дом вживую и ответим на вопросы</p>
                                </div>
                            </div>
                            <div class="case-specs" aria-label="Детали объекта">
<?php foreach (($case['specs'] ?? []) as $sp): ?>
                                    <div class="case-spec case-spec-<?= cases_e($sp['key'] ?? '') ?>"><span><?= cases_e($sp['label'] ?? '') ?></span><strong><?= cases_e($sp['value'] ?? '') ?></strong></div>
<?php endforeach; ?>
                                </div>
                        </article>

<?php endforeach; ?>
