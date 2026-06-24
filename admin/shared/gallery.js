/**
 * Мгновенная фотогалерея админки: загрузка/удаление/сортировка через AJAX,
 * без перезагрузки формы. Работает для объектов и каталога.
 *
 * Разметка: контейнер #galleryGrid c data-entity, data-isnew, data-csrf.
 * Плитки .img-tile[data-value] со скрытым input[name="gallery_images[]"].
 * Рядом: input#galleryFile, input#gallery_id (hidden), input#gallery_imagebase (hidden),
 * элемент #galleryStatus.
 */
(function () {
    var root = document.getElementById('galleryGrid');
    if (!root) return;

    var API = '/admin/shared/image-api.php';
    var entity = root.dataset.entity;
    var isNew = root.dataset.isnew === '1';
    var csrf = root.dataset.csrf;
    var idField = document.getElementById('gallery_id');
    var baseField = document.getElementById('gallery_imagebase');
    var fileInput = document.getElementById('galleryFile');
    var status = document.getElementById('galleryStatus');

    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function currentId() { return idField ? idField.value : ''; }
    function setStatus(msg, err) { if (status) { status.textContent = msg || ''; status.style.color = err ? '#dc2626' : ''; } }

    function tileHtml(value, url) {
        return '<div class="img-tile" data-value="' + esc(value) + '">' +
            '<span class="img-cover-flag">обложка</span>' +
            '<span class="img-drag" title="Перетащить">⠿</span>' +
            '<input type="hidden" name="gallery_images[]" value="' + esc(value) + '">' +
            '<img src="' + esc(url) + '" alt="" loading="lazy" draggable="false">' +
            '<div class="img-tools"><button type="button" class="admin-btn admin-btn-sm admin-btn-danger img-del">удалить</button></div>' +
            '</div>';
    }
    function refreshCover() {
        [].forEach.call(root.querySelectorAll('.img-tile'), function (t, i) {
            var f = t.querySelector('.img-cover-flag');
            if (f) f.style.display = (i === 0) ? '' : 'none';
        });
    }
    function post(fd) {
        fd.append('csrf', csrf);
        fd.append('entity', entity);
        return fetch(API, { method: 'POST', body: fd, headers: { 'X-CSRF-Token': csrf } })
            .then(function (r) { return r.json(); });
    }

    // --- Загрузка (последовательно, чтобы корректно нумеровать файлы) ---
    if (fileInput) {
        fileInput.addEventListener('change', function () {
            var files = [].slice.call(fileInput.files || []);
            fileInput.value = '';
            if (!files.length) return;
            files.reduce(function (chain, file) {
                return chain.then(function () {
                    if (!/^image\//.test(file.type)) return;
                    setStatus('Загрузка «' + file.name + '»…');
                    var fd = new FormData();
                    fd.append('op', 'upload');
                    fd.append('file', file);
                    fd.append('id', currentId());
                    if (isNew) {
                        fd.append('isnew', '1');
                        if (!currentId()) {
                            var nameEl = document.querySelector('input[name="name"]');
                            fd.append('name', nameEl ? nameEl.value : '');
                        }
                    }
                    return post(fd).then(function (res) {
                        if (!res.ok) { setStatus(res.error || 'Ошибка загрузки', true); return; }
                        if (res.id && idField) idField.value = res.id;
                        if (res.imageBase !== undefined && baseField) baseField.value = res.imageBase;
                        root.insertAdjacentHTML('beforeend', tileHtml(res.value, res.url));
                        refreshCover();
                        setStatus('');
                    }).catch(function () { setStatus('Сбой сети при загрузке', true); });
                });
            }, Promise.resolve());
        });
    }

    // --- Удаление (делегирование) ---
    root.addEventListener('click', function (e) {
        var btn = e.target.closest && e.target.closest('.img-del');
        if (!btn) return;
        var tile = btn.closest('.img-tile');
        var value = tile.dataset.value;
        if (!confirm('Удалить это фото?')) return;
        setStatus('Удаление…');
        var fd = new FormData();
        fd.append('op', 'delete');
        fd.append('id', currentId());
        fd.append('value', value);
        if (isNew) fd.append('isnew', '1');
        post(fd).then(function (res) {
            if (!res.ok) { setStatus(res.error || 'Ошибка удаления', true); return; }
            tile.remove();
            refreshCover();
            setStatus('');
        }).catch(function () { setStatus('Сбой сети при удалении', true); });
    });

    // --- Сортировка ---
    if (window.Sortable) {
        new Sortable(root, {
            handle: '.img-drag', animation: 150,
            onEnd: function () {
                refreshCover();
                var fd = new FormData();
                fd.append('op', 'reorder');
                fd.append('id', currentId());
                if (isNew) fd.append('isnew', '1');
                [].forEach.call(root.querySelectorAll('.img-tile'), function (t) { fd.append('order[]', t.dataset.value); });
                post(fd);
            }
        });
    }
})();
