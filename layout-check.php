<?php
// Opt-in, on-device layout measurements. Nothing is submitted or stored.
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
ob_start();
require __DIR__ . '/index.php';
$page = ob_get_clean();
ob_start();
?>
<script>
(function () {
    'use strict';
    var panel = document.createElement('aside');
    panel.setAttribute('aria-label', 'Проверка ширины страницы');
    panel.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:2147483647;box-sizing:border-box;width:300px;max-width:calc(100vw - 16px);padding:12px;background:#fff;color:#172c38;border:2px solid #e8a774;border-radius:10px;box-shadow:0 3px 20px #0004;font:13px/1.4 monospace;';
    var title = document.createElement('strong');
    title.textContent = 'Замеры на этом телефоне';
    var output = document.createElement('pre');
    output.style.cssText = 'margin:8px 0;white-space:pre-wrap;font:inherit;';
    var copy = document.createElement('button');
    copy.textContent = 'Скопировать замеры';
    copy.style.cssText = 'padding:9px;background:#31434e;color:#fff;border:0;border-radius:5px;font:14px sans-serif;';
    panel.append(title, output, copy);
    document.body.appendChild(panel);
    function n(value) { return Math.round(value * 100) / 100; }
    function measure() {
        var viewport = window.visualViewport;
        var left = viewport ? viewport.offsetLeft : 0;
        var width = viewport ? viewport.width : innerWidth;
        function gaps(selector) {
            var element = document.querySelector(selector);
            if (!element) return 'ещё не загружено';
            var box = element.getBoundingClientRect();
            return n(box.left - left) + ' / ' + n(left + width - box.right);
        }
        output.textContent = [
            'Экран / страница: ' + screen.width + ' / ' + innerWidth,
            'Видимая ширина: ' + n(width),
            'Масштаб: ' + n(viewport ? viewport.scale : 1),
            'Сдвиг viewport: ' + n(left),
            'Прокрутка X: ' + n(scrollX) + ' / ' + n(document.body.scrollLeft),
            'Отступы слева / справа:',
            'Шапка: ' + gaps('.header-inner'),
            'Карточка: ' + gaps('#projects .project-card'),
            'Версия: ' + (document.querySelector('link[href*="responsive-grid"]') ? 'новая' : 'другая')
        ].join('\n');
        panel.style.left = (left + 8) + 'px';
        panel.style.width = Math.min(300, width - 16) + 'px';
    }
    copy.addEventListener('click', function () {
        var text = output.textContent + '\n' + navigator.userAgent;
        navigator.clipboard.writeText(text).then(function () {
            copy.textContent = 'Скопировано — отправьте в чат';
        }).catch(function () { copy.textContent = 'Пришлите скриншот этой панели'; });
    });
    setInterval(measure, 500);
    measure();
})();
</script>
<?php
$diagnostic = ob_get_clean();
echo str_replace('</body>', $diagnostic . '</body>', $page);
