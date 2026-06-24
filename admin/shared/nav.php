<?php
/**
 * Общая шапка админки с переключателем разделов «Объекты | Каталог».
 * Использование: admin_topbar('cases'|'catalog', 'подзаголовок', $rightHtml).
 */
function admin_topbar(string $active, string $subtitle = '', string $rightHtml = ''): void
{
    $tabs = [
        'cases'   => ['Объекты', '/admin/cases/'],
        'catalog' => ['Каталог', '/admin/catalog/'],
    ];
    ?>
    <div class="admin-topbar">
        <div>
            <nav class="admin-switch">
                <?php foreach ($tabs as $key => [$label, $href]): ?>
                    <a class="admin-switch-tab <?= $key === $active ? 'active' : '' ?>" href="<?= admin_e($href) ?>"><?= admin_e($label) ?></a>
                <?php endforeach; ?>
            </nav>
            <?php if ($subtitle !== ''): ?><p class="admin-muted" style="margin:8px 0 0"><?= admin_e($subtitle) ?></p><?php endif; ?>
        </div>
        <div class="admin-actions">
            <?= $rightHtml ?>
            <a class="admin-btn" href="/" target="_blank" rel="noopener">Открыть сайт ↗</a>
            <a class="admin-btn" href="/admin/logout.php">Выйти</a>
        </div>
    </div>
    <?php
}
