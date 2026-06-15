// app.js

// ============================================
// VK Ads (Top.Mail.Ru) — отправка целей в пиксель 3769884.
// Дублирует цели Яндекс.Метрики, чтобы кампании VK Ads
// могли оптимизироваться по конверсиям. Безопасно к вызову
// до загрузки пикселя: _tmr создаётся при необходимости.
// ============================================
window.vkGoal = function (goal, params) {
    try {
        var _tmr = window._tmr || (window._tmr = []);
        var event = { type: 'reachGoal', id: '3769884', goal: goal };
        if (params) event.params = params;
        _tmr.push(event);
    } catch (e) {}
};

window.runorthReachGoal = window.runorthReachGoal || function (goal, params) {
    if (!goal) return;
    try {
        if (typeof window.ym === 'function') {
            window.ym(24341083, 'reachGoal', goal, params || {});
        }
    } catch (e) {}
    if (typeof window.vkGoal === 'function') {
        window.vkGoal(goal, params);
    }
};

// Shared fullscreen lightbox for pages that do not declare one inline.
(function initSharedLightboxShell() {
    const PLACEHOLDER_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const state = {
        images: [],
        index: 0
    };

    function ensureLightbox() {
        let lightbox = document.getElementById('lightbox');
        if (lightbox || !document.body) return lightbox;

        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.id = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <button class="lightbox-close" type="button" aria-label="Close">&times;</button>
            <button class="lightbox-arrow lightbox-prev" type="button" aria-label="Previous">‹</button>
            <div class="lightbox-content">
                <div class="lightbox-zoom-wrapper">
                    <img class="lightbox-img" id="lightboxImg" src="${PLACEHOLDER_SRC}" alt="">
                </div>
                <div class="lightbox-counter" id="lightboxCounter"></div>
            </div>
            <button class="lightbox-arrow lightbox-next" type="button" aria-label="Next">›</button>
            <div class="lightbox-dots" id="lightboxDots"></div>
        `;
        document.body.appendChild(lightbox);

        const overlay = lightbox.querySelector('.lightbox-overlay');
        const close = lightbox.querySelector('.lightbox-close');
        const prev = lightbox.querySelector('.lightbox-prev');
        const next = lightbox.querySelector('.lightbox-next');

        if (overlay) overlay.addEventListener('click', () => window.closeLightbox && window.closeLightbox());
        if (close) close.addEventListener('click', () => window.closeLightbox && window.closeLightbox());
        if (prev) prev.addEventListener('click', () => window.lightboxNav && window.lightboxNav(-1));
        if (next) next.addEventListener('click', () => window.lightboxNav && window.lightboxNav(1));

        return lightbox;
    }

    function normalizeImages(images) {
        return (Array.isArray(images) ? images : [])
            .map(src => String(src || '').trim())
            .filter(Boolean);
    }

    function buildLightboxTrack(images, index) {
        const lightbox = ensureLightbox();
        const wrapper = lightbox && lightbox.querySelector('.lightbox-zoom-wrapper');
        if (!wrapper) return null;

        wrapper.innerHTML = '';
        const track = document.createElement('div');
        track.className = 'lightbox-track';
        track.style.transform = `translateX(-${index * 100}%)`;

        images.forEach((src, i) => {
            const slide = document.createElement('div');
            slide.className = 'lightbox-slide';

            const img = document.createElement('img');
            img.className = 'lightbox-img';
            img.src = src;
            img.alt = '';
            img.dataset.lightboxIndex = String(i);
            img.decoding = 'async';
            if (i === index) img.id = 'lightboxImg';
            if (i !== index) img.loading = 'lazy';

            slide.appendChild(img);
            track.appendChild(slide);
        });

        wrapper.appendChild(track);
        return track;
    }

    function renderDots(images, index) {
        const dotsContainer = document.getElementById('lightboxDots');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';
        images.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'lightbox-dot' + (i === index ? ' active' : '');
            dot.setAttribute('aria-label', `Photo ${i + 1}`);
            dot.addEventListener('click', () => window.lightboxGoTo && window.lightboxGoTo(i));
            dotsContainer.appendChild(dot);
        });
    }

    function updateCounter() {
        const counter = document.getElementById('lightboxCounter');
        if (counter) counter.textContent = `${state.index + 1} / ${state.images.length}`;
    }

    function goTo(index) {
        if (!state.images.length) return;

        const nextIndex = (index + state.images.length) % state.images.length;
        const track = document.querySelector('.lightbox-track');
        const currentImg = document.getElementById('lightboxImg');
        const nextImg = track ? track.querySelector(`[data-lightbox-index="${nextIndex}"]`) : null;

        if (typeof window.resetLightboxZoom === 'function') window.resetLightboxZoom();
        if (currentImg) currentImg.removeAttribute('id');
        if (nextImg) {
            nextImg.id = 'lightboxImg';
            nextImg.style.transform = '';
            nextImg.classList.remove('zoomed');
        }

        state.index = nextIndex;
        if (track) track.style.transform = `translateX(-${state.index * 100}%)`;
        updateCounter();
        document.querySelectorAll('.lightbox-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === state.index);
        });
    }

    if (typeof window.openLightbox !== 'function') {
        window.openLightbox = function (images, index) {
            const normalizedImages = normalizeImages(images);
            if (!normalizedImages.length) return;

            state.images = normalizedImages;
            state.index = Math.min(Math.max(parseInt(index || 0, 10) || 0, 0), state.images.length - 1);

            if (typeof window.resetLightboxZoom === 'function') window.resetLightboxZoom();
            buildLightboxTrack(state.images, state.index);
            renderDots(state.images, state.index);
            updateCounter();

            const lightbox = ensureLightbox();
            if (lightbox) {
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };
    }

    if (typeof window.closeLightbox !== 'function') {
        window.closeLightbox = function () {
            const lightbox = document.getElementById('lightbox');
            if (typeof window.resetLightboxZoom === 'function') window.resetLightboxZoom();
            if (lightbox) lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };
    }

    if (typeof window.lightboxNav !== 'function') {
        window.lightboxNav = function (direction) {
            goTo(state.index + direction);
        };
    }

    if (typeof window.lightboxGoTo !== 'function') {
        window.lightboxGoTo = goTo;
    }

    if (typeof window.updateLightboxImage !== 'function') {
        window.updateLightboxImage = function (img, src) {
            if (img) img.src = src;
        };
    }

    window.ensureRunorthLightbox = ensureLightbox;
    if (document.body) ensureLightbox();
})();

// ============================================
// UTM / Click-ID capture (persist across pages)
// Сохраняет рекламные метки на ЛЮБОЙ странице входа (включая главную),
// чтобы они пережили внутренние переходы и попали в форму/CRM.
// Формы читают эти же ключи: 'runorth_utm' и 'runorth_click'.
// ============================================
(function captureMarketingParams() {
    try {
        var params = new URLSearchParams(window.location.search);

        var utm = {
            utm_source: params.get('utm_source') || '',
            utm_medium: params.get('utm_medium') || '',
            utm_campaign: params.get('utm_campaign') || '',
            utm_content: params.get('utm_content') || '',
            utm_term: params.get('utm_term') || ''
        };
        if (utm.utm_source || utm.utm_medium || utm.utm_campaign || utm.utm_content || utm.utm_term) {
            localStorage.setItem('runorth_utm', JSON.stringify(utm));
        }

        // yclid/gclid — критичны для привязки лида к Яндекс.Директу / Google Ads
        var yclid = params.get('yclid') || '';
        var gclid = params.get('gclid') || '';
        if (yclid || gclid) {
            var prev = {};
            try { prev = JSON.parse(localStorage.getItem('runorth_click') || '{}'); } catch (e) { prev = {}; }
            localStorage.setItem('runorth_click', JSON.stringify({
                yclid: yclid || prev.yclid || '',
                gclid: gclid || prev.gclid || ''
            }));
        }
    } catch (e) { /* localStorage недоступен — тихо игнорируем */ }
})();

// ============================================
// Hero animations
// ============================================
(function() {
    // Запускаем анимации hero секции сразу (не дожидаясь window load)
    triggerHeroAnimations();
})();

// Анимации hero секции
function triggerHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero-animate');
    if (heroElements.length === 0) return;

    // Проверяем prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isMobileHero = window.matchMedia('(max-width: 768px)');
    if (prefersReducedMotion.matches || isMobileHero.matches) {
        // Если пользователь предпочитает reduced motion, сразу показываем элементы
        heroElements.forEach(function (el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.animation = 'none';
        });
        return;
    }

    // Добавляем класс visible с небольшой задержкой после preloader
    setTimeout(function () {
        heroElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }, 400);
}

// ============================================
// Scroll Reveal Animations
// ============================================
(function initScrollReveal() {
    // Отключаем анимации если пользователь предпочитает reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
            el.classList.add('revealed');
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    // Проверяем поддержку IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        // Если не поддерживается — показываем все элементы сразу
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
            el.classList.add('revealed');
        });
        return;
    }

    // Опции для observer
    const revealOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -80px 0px', // срабатывает когда элемент на 80px выше нижней границы
        threshold: 0.1 // 10% элемента должно быть видно
    };

    // Callback при пересечении
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // анимируем только один раз
            }
        });
    };

    // Создаём observer
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    // Наблюдаем за всеми элементами с классом reveal
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        revealObserver.observe(el);
    });
})();

// Phone Input Mask - формат: +7 (XXX) XXX-XX-XX
function phoneMask(input) {
    // Получаем текущее значение и очищаем от нецифровых символов
    let value = input.value.replace(/\D/g, '');

    // Если первая цифра 8, заменяем на 7
    if (value.startsWith('8')) {
        value = '7' + value.slice(1);
    }

    // Если не начинается с 7, добавляем 7
    if (!value.startsWith('7')) {
        value = '7' + value;
    }

    // РћРіСЂР°РЅРёС‡РёРІР°РµРј 11 С†РёС„СЂР°РјРё (7 + 10 С†РёС„СЂ РЅРѕРјРµСЂР°)
    value = value.slice(0, 11);

    // Р¤РѕСЂРјР°С‚РёСЂСѓРµРј РїРѕ РјР°СЃРєРµ
    let formatted = '';
    if (value.length > 0) {
        formatted = '+' + value[0];
    }
    if (value.length > 1) {
        formatted += ' (' + value.slice(1, 4);
    }
    if (value.length > 4) {
        formatted += ') ' + value.slice(4, 7);
    }
    if (value.length > 7) {
        formatted += '-' + value.slice(7, 9);
    }
    if (value.length > 9) {
        formatted += '-' + value.slice(9, 11);
    }

    input.value = formatted;
}

function normalizeRussianPhone(value) {
    const raw = String(value || '').replace(/\D/g, '');

    if (raw.length !== 11) {
        return '';
    }

    if (!raw.startsWith('7') && !raw.startsWith('8')) {
        return '';
    }

    return '7' + raw.slice(1);
}

function formatRussianPhone(digits) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
}

function validatePhone(value) {
    return Boolean(normalizeRussianPhone(value));
}

// Initialize phone masks on all tel inputs
function initPhoneMasks() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        // Р¤РѕСЂРјР°С‚РёСЂСѓРµРј РїСЂРё РІРІРѕРґРµ
        input.addEventListener('input', () => phoneMask(input));

        // Р¤РѕСЂРјР°С‚РёСЂСѓРµРј РїСЂРё С„РѕРєСѓСЃРµ РµСЃР»Рё РїРѕР»Рµ РїСѓСЃС‚РѕРµ
        input.addEventListener('focus', () => {
            if (!input.value) {
                input.value = '+7 (';
            }
        });

        // РЈР±РёСЂР°РµРј РЅРµР·Р°РІРµСЂС€РµРЅРЅС‹Р№ С„РѕСЂРјР°С‚ РїСЂРё РїРѕС‚РµСЂРµ С„РѕРєСѓСЃР°
        input.addEventListener('blur', () => {
            if (input.value === '+7 (' || input.value === '+7' || input.value === '') {
                input.value = '';
            }
        });
    });
}

// Project Gallery Navigation — global function for onclick
function setProjectGalleryImage(card, targetIndex) {
    const gallery = card.querySelector('.project-gallery');
    const track = gallery.querySelector('.project-gallery-track');
    const images = JSON.parse(card.dataset.images);
    const total = images.length;

    if (total === 0) return;

    let nextIndex = targetIndex;
    if (nextIndex < 0) nextIndex = total - 1;
    if (nextIndex >= total) nextIndex = 0;

    card.dataset.galleryIndex = nextIndex;

    if (track) {
        track.style.transform = `translateX(-${nextIndex * 100}%)`;
    }

    gallery.querySelectorAll('.project-gallery-dot').forEach((dot, i) =>
        dot.classList.toggle('active', i === nextIndex)
    );

    const thumbs = card.querySelectorAll('.case-gallery-thumb');
    thumbs.forEach((thumb, i) => {
        const isActive = i === nextIndex;
        thumb.classList.toggle('active', isActive);
        thumb.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // Прокручиваем ленту миниатюр так, чтобы активная всегда была видна
    const thumbsWrap = card.querySelector('.case-gallery-thumbs');
    const activeThumb = thumbs[nextIndex];
    if (thumbsWrap && activeThumb && thumbsWrap.scrollWidth > thumbsWrap.clientWidth) {
        const target = activeThumb.offsetLeft - (thumbsWrap.clientWidth - activeThumb.clientWidth) / 2;
        const maxLeft = thumbsWrap.scrollWidth - thumbsWrap.clientWidth;
        thumbsWrap.scrollTo({ left: Math.max(0, Math.min(target, maxLeft)), behavior: 'smooth' });
    }
}

function projectGalleryNav(btn, direction) {
    const card = btn.closest('.project-card');
    if (card.dataset.galleryInitialized !== 'true' && typeof window.ensureProjectGallery === 'function') {
        window.ensureProjectGallery(card);
    }
    const images = JSON.parse(card.dataset.images);
    if (images.length === 0) return;

    const currentIndex = parseInt(card.dataset.galleryIndex || '0');
    let nextIndex = currentIndex + direction;

    if (nextIndex < 0) nextIndex = images.length - 1;
    if (nextIndex >= images.length) nextIndex = 0;

    setProjectGalleryImage(card, nextIndex);
}

window.setProjectGalleryImage = setProjectGalleryImage;
window.projectGalleryNav = projectGalleryNav;

function resolveLightboxImageUrl(element) {
    const link = element.matches('a') ? element : element.closest('a');
    const href = link && link.getAttribute('href');
    if (href && href.charAt(0) !== '#') {
        return new URL(href, window.location.href).href;
    }

    const img = element.matches('img') ? element : element.querySelector('img');
    return img ? (img.currentSrc || img.src) : '';
}

function initStaticImageLightboxes() {
    document.querySelectorAll('.product-gallery-grid').forEach(grid => {
        if (grid.dataset.lightboxBound === 'true') return;

        const items = Array.from(grid.querySelectorAll('.product-gallery-item'));
        const images = items.map(resolveLightboxImageUrl).filter(Boolean);
        if (!images.length) return;

        items.forEach((item, index) => {
            item.addEventListener('click', event => {
                event.preventDefault();
                openLightbox(images, index);
            });
        });

        grid.dataset.lightboxBound = 'true';
    });
}

function initMobileFeatureAutoActive() {
    const featureCards = Array.from(document.querySelectorAll('#features .feature-card'));
    if (featureCards.length === 0) return;

    const mobileMQ = window.matchMedia('(max-width: 768px)');
    let queued = false;

    function clearActiveCards() {
        featureCards.forEach(card => card.classList.remove('is-active'));
    }

    function updateActiveCard() {
        queued = false;

        if (!mobileMQ.matches) {
            clearActiveCards();
            return;
        }

        const activationLine = window.innerHeight * 0.52;
        let activeCard = null;
        let activeDistance = Infinity;

        featureCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const isInActivationZone = rect.bottom > window.innerHeight * 0.18 && rect.top < window.innerHeight * 0.82;

            if (!isInActivationZone) return;

            const cardCenter = rect.top + rect.height / 2;
            const distance = Math.abs(cardCenter - activationLine);

            if (distance < activeDistance) {
                activeDistance = distance;
                activeCard = card;
            }
        });

        featureCards.forEach(card => {
            card.classList.toggle('is-active', card === activeCard);
        });
    }

    function requestActiveUpdate() {
        if (queued) return;

        queued = true;
        requestAnimationFrame(updateActiveCard);
    }

    window.addEventListener('scroll', requestActiveUpdate, { passive: true });
    window.addEventListener('resize', requestActiveUpdate);

    if (typeof mobileMQ.addEventListener === 'function') {
        mobileMQ.addEventListener('change', requestActiveUpdate);
    } else if (typeof mobileMQ.addListener === 'function') {
        mobileMQ.addListener(requestActiveUpdate);
    }

    requestActiveUpdate();
    setTimeout(requestActiveUpdate, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    // Save UTM params to localStorage on page load
    saveUTMToStorage();

    // Populate hidden UTM fields
    populateUTMFields();

    // Initialize phone masks
    initPhoneMasks();

    // Auto-highlight feature cards on mobile while scrolling.
    initMobileFeatureAutoActive();
    initStaticImageLightboxes();

    // ============================================
    // Yandex.Metrika — Intermediate Goals
    // ============================================

    // Scroll to contacts tracking (one-time)
    const contactsSection = document.getElementById('contacts');
    let contactsTracked = false;
    if (contactsSection) {
        const contactsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !contactsTracked) {
                    contactsTracked = true;
                    ym(24341083, 'reachGoal', 'scroll_to_contacts');
                    vkGoal('scroll_to_contacts');
                    contactsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        contactsObserver.observe(contactsSection);
    }

    // Time on site — 30 seconds
    setTimeout(() => {
        ym(24341083, 'reachGoal', 'visit_30_seconds');
        vkGoal('visit_30_seconds');
    }, 30000);

    // Burger Menu Toggle
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (burgerMenu && mobileMenuOverlay) {
        // Open menu
        burgerMenu.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close menu
        const closeMobileMenu = () => {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
        }

        // Close on overlay click
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                closeMobileMenu();
            }
        });

        // Close on link click
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Initialize project galleries
    const initProjectGallery = (card) => {
        // Skip if already initialized
        if (card.dataset.galleryInitialized === 'true') return;

        const gallery = card.querySelector('.project-gallery');
        const viewport = gallery.querySelector('.project-gallery-viewport');
        const images = JSON.parse(card.dataset.images);
        const dotsContainer = gallery.querySelector('.project-gallery-dots');
        const firstImg = viewport.querySelector('.project-gallery-img');
        const firstSource = viewport.querySelector('source[type="image/webp"]');
        const projectTitle = card.querySelector('h3')?.textContent || firstImg?.alt || '';
        card.dataset.galleryIndex = '0';

        const track = document.createElement('div');
        track.className = 'project-gallery-track';

        images.forEach((src, i) => {
            const picture = document.createElement('picture');
            picture.className = 'project-gallery-slide';

            const source = document.createElement('source');
            if (i === 0 && firstSource?.getAttribute('srcset')) {
                source.srcset = firstSource.getAttribute('srcset');
                const sizes = firstSource.getAttribute('sizes');
                if (sizes) source.sizes = sizes;
            } else {
                source.srcset = src.replace(/\.(jpe?g|png)$/i, '.webp');
            }
            source.type = 'image/webp';

            const img = document.createElement('img');
            img.className = 'project-gallery-img';
            img.src = src;
            img.alt = projectTitle;
            img.width = firstImg?.width || 600;
            img.height = firstImg?.height || 400;
            img.loading = 'lazy';
            img.decoding = 'async';

            picture.append(source, img);
            track.appendChild(picture);
        });

        viewport.textContent = '';
        viewport.appendChild(track);

        [
            { button: gallery.querySelector('.project-gallery-arrow.arrow-left'), direction: -1 },
            { button: gallery.querySelector('.project-gallery-arrow.arrow-right'), direction: 1 }
        ].forEach(({ button, direction }) => {
            if (!button) return;
            button.removeAttribute('onclick');
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                projectGalleryNav(button, direction);
            });
        });

        gallery.addEventListener('click', (event) => {
            const arrowButton = event.target.closest('.project-gallery-arrow');
            if (!arrowButton) return;
            event.preventDefault();
            event.stopPropagation();
            projectGalleryNav(arrowButton, arrowButton.classList.contains('arrow-right') ? 1 : -1);
        });

        track.addEventListener('click', () => {
            openLightbox(images, parseInt(card.dataset.galleryIndex || '0'));
            ym(24341083, 'reachGoal', 'project_gallery_view');
            vkGoal('project_gallery_view');
        });

        // Create dots
        images.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'project-gallery-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `\u0424\u043E\u0442\u043E ${i + 1}`);
            dot.addEventListener('click', () => {
                setProjectGalleryImage(card, i);
            });
            dotsContainer.appendChild(dot);
        });

        if (card.classList.contains('case-card')) {
            const thumbs = document.createElement('div');
            thumbs.className = 'case-gallery-thumbs';
            thumbs.setAttribute('aria-label', 'Миниатюры объекта');

            images.forEach((src, i) => {
                const thumb = document.createElement('button');
                thumb.type = 'button';
                thumb.className = 'case-gallery-thumb' + (i === 0 ? ' active' : '');
                thumb.setAttribute('aria-label', `Показать фото ${i + 1}`);
                thumb.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');

                const img = document.createElement('img');
                img.src = src.replace(/\.(jpe?g|png)$/i, '-480.webp');
                img.alt = '';
                img.loading = 'lazy';
                img.decoding = 'async';
                img.onerror = () => {
                    img.onerror = null;
                    img.src = src;
                };

                thumb.appendChild(img);
                thumb.addEventListener('click', () => {
                    setProjectGalleryImage(card, i);
                });
                thumbs.appendChild(thumb);
            });

            gallery.after(thumbs);
        }

        card.dataset.galleryInitialized = 'true';
    };

    window.ensureProjectGallery = initProjectGallery;

    const projectGalleryCards = Array.from(document.querySelectorAll('.project-card'));
    const warmProjectGallery = (card) => {
        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => initProjectGallery(card), { timeout: 1200 });
        } else {
            setTimeout(() => initProjectGallery(card), 120);
        }
    };

    if ('IntersectionObserver' in window) {
        const projectGalleryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                warmProjectGallery(entry.target);
                projectGalleryObserver.unobserve(entry.target);
            });
        }, { rootMargin: '700px 0px 700px', threshold: 0.01 });

        projectGalleryCards.forEach(card => projectGalleryObserver.observe(card));
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => projectGalleryCards.forEach(initProjectGallery), 2500);
        }, { once: true });
    }

    projectGalleryCards.forEach(card => {
        const gallery = card.querySelector('.project-gallery');
        if (!gallery) return;
        const initOnIntent = () => initProjectGallery(card);
        gallery.addEventListener('pointerdown', initOnIntent, { once: true, passive: true });
        gallery.addEventListener('pointerenter', initOnIntent, { once: true, passive: true });
        gallery.addEventListener('focusin', initOnIntent, { once: true });
    });

    document.querySelectorAll('#cases .case-card').forEach(card => {
        const info = card.querySelector('.project-info');
        const description = info?.querySelector('.project-description');
        const specs = Array.from(card.children).find(child => child.classList.contains('case-specs'));
        if (info && specs) {
            if (description) description.after(specs);
            else info.appendChild(specs);
        }
        initProjectGallery(card);
    });

    const casesCarousel = document.querySelector('#cases .cases-carousel');
    if (casesCarousel) {
        const track = casesCarousel.querySelector('.projects-home-wrapper');
        const grid = casesCarousel.querySelector('.projects-home-grid');
        const prevBtn = casesCarousel.querySelector('.cases-carousel-arrow-prev');
        const nextBtn = casesCarousel.querySelector('.cases-carousel-arrow-next');
        const progress = casesCarousel.querySelector('.cases-carousel-progress span');
        let activeCaseIndex = 0;

        const getCaseCards = () => Array.from(track?.querySelectorAll('.case-card') || []);

        const getCaseGap = () => {
            const gridStyle = grid ? window.getComputedStyle(grid) : null;
            return parseFloat(gridStyle?.columnGap || gridStyle?.gap || '24') || 24;
        };

        const getCurrentCaseIndex = () => {
            const cards = getCaseCards();
            if (!track || cards.length === 0) return 0;
            const step = cards[0].getBoundingClientRect().width + getCaseGap();
            if (step <= 0) return 0;
            return Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / step)));
        };

        const updateCasesCarousel = () => {
            if (!track) return;
            const cards = getCaseCards();
            activeCaseIndex = getCurrentCaseIndex();
            const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
            const progressValue = maxScroll > 0 ? track.scrollLeft / maxScroll : 1;
            const atStart = track.scrollLeft <= 2;
            const atEnd = track.scrollLeft >= maxScroll - 2;

            casesCarousel.dataset.atStart = atStart ? 'true' : 'false';
            casesCarousel.dataset.atEnd = atEnd ? 'true' : 'false';
            if (prevBtn) prevBtn.disabled = activeCaseIndex <= 0 || cards.length <= 1;
            if (nextBtn) nextBtn.disabled = activeCaseIndex >= cards.length - 1 || cards.length <= 1;
            if (progress) progress.style.transform = `scaleX(${Math.max(0.08, progressValue)})`;
        };

        const scrollCases = (direction) => {
            const cards = getCaseCards();
            if (!track || !grid || cards.length === 0) return;
            const currentIndex = getCurrentCaseIndex();
            const nextIndex = Math.max(0, Math.min(cards.length - 1, currentIndex + direction));
            const targetLeft = cards[nextIndex].offsetLeft - grid.offsetLeft;
            activeCaseIndex = nextIndex;
            track.scrollTo({ left: targetLeft, behavior: 'smooth' });
            updateCasesCarousel();
        };

        prevBtn?.addEventListener('click', () => scrollCases(-1));
        nextBtn?.addEventListener('click', () => scrollCases(1));
        track?.addEventListener('scroll', () => window.requestAnimationFrame(updateCasesCarousel), { passive: true });
        window.addEventListener('resize', updateCasesCarousel);
        window.requestAnimationFrame(updateCasesCarousel);
        window.addEventListener('load', updateCasesCarousel, { once: true });
        setTimeout(updateCasesCarousel, 250);
        setTimeout(updateCasesCarousel, 1000);
    }

    // FAQ Accordion - Enhanced
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
                // Yandex.Metrika goal
                ym(24341083, 'reachGoal', 'faq_open');
                vkGoal('faq_open');
            }
        });
    });

    // Close modal when clicking outside of it
    const modal = document.getElementById('modal');

    // Click handler for desktop
    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    // Touch handler for mobile
    if (modal) {
        modal.addEventListener('touchend', function (e) {
            if (e.target == modal) {
                closeModal();
            }
        }, { passive: true });
    }

    // Close modal with touch on mobile
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('touchend', function (e) {
            e.preventDefault();
            closeModal();
        }, { passive: false });

        closeModalBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            closeModal();
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('modal');
            if (modal && modal.style.display === 'block') {
                closeModal();
            }
        }
    });

    // Projects list: show every homepage project in a single vertical grid.
    const projectCards = document.querySelectorAll('#projects .project-card');
    projectCards.forEach(card => {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'none';
        card.classList.add('revealed');
    });

    // ============================================
    // Gallery "Наши готовые проекты" — Swipe + Lightbox
    // ============================================
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const galleryScroll = document.getElementById('galleryScroll');
    const galleryDots = document.getElementById('galleryDots');
    const arrowLeft = document.getElementById('galleryArrowLeft');
    const arrowRight = document.getElementById('galleryArrowRight');

    if (galleryScroll) {
        const items = galleryScroll.querySelectorAll('.gallery-item');
        const totalSlides = items.length;
        let currentSlide = 0;
        let isDragging = false;
        let startPos = 0;
        let scrollStart = 0;
        let dragDistance = 0;

        function updateDots() {
            if (!galleryDots) return;
            const dots = galleryDots.querySelectorAll('.gallery-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
            // Update active slide for shadow
            items.forEach((item, i) => {
                item.classList.toggle('active-slide', i === currentSlide);
            });
        }

        // Скролл к слайду
        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentSlide = index;
            const item = items[currentSlide];
            if (item) {
                const itemLeft = item.offsetLeft - galleryScroll.offsetLeft;
                const centerOffset = (galleryScroll.clientWidth - item.clientWidth) / 2;
                galleryScroll.scrollTo({
                    left: Math.max(0, itemLeft - centerOffset),
                    behavior: 'smooth'
                });
            }
            updateDots();
        }

        // Клик по точкам
        if (galleryDots) {
            galleryDots.querySelectorAll('.gallery-dot').forEach((dot, i) => {
                dot.addEventListener('click', () => goToSlide(i));
            });
        }

        // Стрелки
        if (arrowLeft) arrowLeft.addEventListener('click', () => goToSlide(currentSlide - 1));
        if (arrowRight) arrowRight.addEventListener('click', () => goToSlide(currentSlide + 1));

        // Touch/Mouse свайп
        function getPositionX(e) {
            return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        }

        galleryScroll.addEventListener('touchstart', (e) => {
            isDragging = true;
            startPos = getPositionX(e);
            scrollStart = galleryScroll.scrollLeft;
            dragDistance = 0;
            galleryScroll.style.cursor = 'grabbing';
        }, { passive: true });

        galleryScroll.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const pos = getPositionX(e);
            dragDistance = pos - startPos;
        }, { passive: true });

        galleryScroll.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            galleryScroll.style.cursor = 'grab';

            if (dragDistance < -50) goToSlide(currentSlide + 1);
            else if (dragDistance > 50) goToSlide(currentSlide - 1);
            else goToSlide(currentSlide);
        }, { passive: true });

        // Mouse drag для десктопа
        galleryScroll.addEventListener('mousedown', (e) => {
            isDragging = true;
            startPos = getPositionX(e);
            scrollStart = galleryScroll.scrollLeft;
            dragDistance = 0;
            galleryScroll.style.cursor = 'grabbing';
            e.preventDefault();
        });

        galleryScroll.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const pos = getPositionX(e);
            dragDistance = pos - startPos;
            galleryScroll.scrollLeft = scrollStart - dragDistance;
        });

        galleryScroll.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            galleryScroll.style.cursor = 'grab';

            if (dragDistance < -50) goToSlide(currentSlide + 1);
            else if (dragDistance > 50) goToSlide(currentSlide - 1);
            else goToSlide(currentSlide);
        });

        galleryScroll.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                galleryScroll.style.cursor = 'grab';
                goToSlide(currentSlide);
            }
        });

        // Отслеживание скролла
        galleryScroll.addEventListener('scroll', () => {
            if (isDragging) return;
            const scrollLeft = galleryScroll.scrollLeft;
            const center = scrollLeft + galleryScroll.clientWidth / 2;

            let newIndex = 0;
            items.forEach((item, i) => {
                const itemCenter = item.offsetLeft + item.clientWidth / 2;
                if (Math.abs(itemCenter - center) < Math.abs(items[newIndex].offsetLeft + items[newIndex].clientWidth / 2 - center)) {
                    newIndex = i;
                }
            });

            if (newIndex !== currentSlide) {
                currentSlide = newIndex;
                updateDots();
            }
        });

        // Клик по изображению — открыть lightbox
        const galleryImages = JSON.parse(galleryWrapper?.dataset.galleryImages || '[]');
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (galleryImages.length > 0) {
                    openGalleryLightbox(galleryImages, index);
                }
            });
        });

        // Клавиатура
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('lightbox')?.classList.contains('active')) return;
            if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
            if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
        });

        updateDots();
    }
});

// Bitrix24 Integration
// ============================================

// Gallery Lightbox — открытие изображений "Наши готовые проекты" на весь экран
function openGalleryLightbox(images, index) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    if (typeof openLightbox === 'function') {
        openLightbox(images, index);
        return;
    }

    // Используем существующий lightbox
    const img = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');
    const dotsContainer = document.getElementById('lightboxDots');

    // Обновляем lightbox для галереи
    lightboxImages = images;
    lightboxIndex = index;
    if (typeof lightboxAnimating !== 'undefined') lightboxAnimating = false;
    document.querySelectorAll('.lightbox-img-slide').forEach(slide => slide.remove());
    if (img) {
        img.classList.remove('lightbox-img-current');
        img.style.transform = '';
    }

    updateLightboxImage(img, images[index]);
    counter.textContent = `${index + 1} / ${images.length}`;

    // Обновляем точки
    dotsContainer.innerHTML = '';
    images.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'lightbox-dot' + (i === index ? ' active' : '');
        dot.addEventListener('click', () => lightboxGoTo(i));
        dotsContainer.appendChild(dot);
    });

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}
// РќРђРЎРўР РћР™РљРђ: Р’СЃС‚Р°РІСЊС‚Рµ РІР°С€ Webhook URL РёР· Bitrix24
// РђРґРјРёРЅРёСЃС‚СЂРёСЂРѕРІР°РЅРёРµ в†’ РРЅС‚РµРіСЂР°С†РёРё в†’ Р’РµР±С…СѓРєРё в†’ РЎРѕР·РґР°С‚СЊ РІС…РѕРґСЏС‰РёР№ РІРµР±С…СѓРє
// РџСЂР°РІР°: CRM (lead.add)
const BITRIX24_WEBHOOK = 'https://nordsrub.bitrix24.ru/rest/7966/gn3p7yo8dut3jydw/';
// ============================================

// Маппинг UTM/меток -> SOURCE_ID в справочнике источников Битрикса.
// Справочник: crm.status.list?filter[ENTITY_ID]=SOURCE на портале nordsrub.bitrix24.ru
function resolveBitrixSourceId(data) {
    const utmSource = (data.utm_source || '').toLowerCase().trim();
    const utmMedium = (data.utm_medium || '').toLowerCase().trim();
    const hasYclid = !!data.yclid;
    const hasGclid = !!data.gclid;

    if (hasYclid || utmSource === 'yandex' || utmSource === 'yandex_direct' || utmSource === 'yandex-direct' || utmSource === 'direct') {
        return 'UC_RRCXS8'; // Яндекс Директ - основной сайт
    }
    if (utmSource.includes('avito')) {
        return '2'; // Авито
    }
    if (utmSource === 'vk' || utmSource === 'vkontakte' || utmSource === 'vk_ads') {
        return '6|VK'; // ВКонтакте
    }
    if (hasGclid || utmSource === 'google') {
        return '9'; // SEO (отдельного источника Google в портале нет)
    }
    if (utmSource && (utmMedium === 'cpc' || utmMedium === 'ppc' || utmMedium === 'paid')) {
        return 'UC_RRCXS8'; // прочий платный — кладём в Директ-основной по умолчанию
    }
    return '10'; // Органический трафик
}

// Yandex.Metrika Client ID -> Bitrix24
const YANDEX_METRIKA_COUNTER_ID = 24341083;
let yandexClientIdCache = '';

function readYandexClientIdFromCookie() {
    const match = document.cookie.match(/(?:^|;\s*)_ym_uid=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function initYandexClientId() {
    yandexClientIdCache = readYandexClientIdFromCookie();
    try {
        if (typeof ym === 'function') {
            ym(YANDEX_METRIKA_COUNTER_ID, 'getClientID', function (clientId) {
                if (clientId) yandexClientIdCache = String(clientId);
            });
        }
    } catch (e) {
        // noop
    }
}

function getYandexClientId() {
    return yandexClientIdCache || readYandexClientIdFromCookie();
}

document.addEventListener('DOMContentLoaded', initYandexClientId);

const BITRIX24_UTM_FIELD_HINTS = {
    utm_source: ['utmsource'],
    utm_medium: ['utmmedium'],
    utm_campaign: ['utmcampaign'],
    utm_content: ['utmcontent'],
    utm_term: ['utmterm'],
    roistat: ['roistat'],
    roistat_visit: ['roistatvisit', 'roistatvizit', 'vizitroistat', 'visitroistat']
};

let bitrixLeadFieldsPromise = null;
let bitrixCustomUtmFieldMapPromise = null;

function normalizeBitrixFieldKey(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9\u0430-\u044F\u0451]/gi, '');
}

async function getBitrixLeadFields() {
    if (bitrixLeadFieldsPromise) {
        return bitrixLeadFieldsPromise;
    }

    bitrixLeadFieldsPromise = fetch(BITRIX24_WEBHOOK + 'crm.lead.fields', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(result => result.result || {})
        .catch(error => {
            console.warn('Could not load Bitrix lead fields metadata:', error);
            return {};
        });

    return bitrixLeadFieldsPromise;
}

async function getBitrixCustomUtmFieldMap() {
    if (bitrixCustomUtmFieldMapPromise) {
        return bitrixCustomUtmFieldMapPromise;
    }

    bitrixCustomUtmFieldMapPromise = getBitrixLeadFields().then(fields => {
        const fieldMap = {};

        Object.entries(fields).forEach(([fieldCode, meta]) => {
            if (!fieldCode.startsWith('UF_CRM_')) {
                return;
            }

            const candidates = [
                fieldCode,
                meta?.title,
                meta?.formLabel,
                meta?.listLabel,
                meta?.filterLabel,
                meta?.XML_ID,
                meta?.settings?.XML_ID
            ]
                .map(normalizeBitrixFieldKey)
                .filter(Boolean);

            Object.entries(BITRIX24_UTM_FIELD_HINTS).forEach(([utmKey, hints]) => {
                if (fieldMap[utmKey]) {
                    return;
                }

                const matched = candidates.some(candidate =>
                    hints.some(hint => candidate.includes(hint))
                );

                if (matched) {
                    fieldMap[utmKey] = fieldCode;
                }
            });
        });

        return fieldMap;
    });

    return bitrixCustomUtmFieldMapPromise;
}

function buildBitrixCustomUtmFields(data, fieldMap) {
    const customFields = {};

    Object.entries(fieldMap || {}).forEach(([utmKey, fieldCode]) => {
        customFields[fieldCode] = utmKey === 'roistat'
            ? (data.roistat_visit || data.roistat_marker || '')
            : (data[utmKey] || '');
    });

    return customFields;
}

// Parse UTM parameters from URL
function getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_content: params.get('utm_content') || '',
        utm_term: params.get('utm_term') || ''
    };
}

function getRoistatParams(params = new URLSearchParams(window.location.search)) {
    return {
        roistat: params.get('roistat') || '',
        roistat_referrer: params.get('roistat_referrer') || '',
        roistat_pos: params.get('roistat_pos') || ''
    };
}

function getRoistatVisit() {
    if (window.roistat && typeof window.roistat.getVisit === 'function') {
        return window.roistat.getVisit();
    }

    const match = document.cookie.match(/(?:^|;\s*)roistat_visit=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

// Из маркера Roistat (direct16_context_<id>_<term>) собираем utm для Яндекс.Директа.
function parseRoistatMarkerToUtm(marker, referrer) {
    if (!marker) return null;
    const parts = String(marker).split('_');
    if (!/^direct\d*$/i.test(parts[0] || '')) return null; // только Яндекс.Директ
    const type = parts[1] || '';              // context (РСЯ) | search (поиск)
    const campaignId = parts[2] || '';
    const term = parts.slice(3).join('_').replace(/^-+/, '');
    return {
        utm_source: 'ya.ru',
        utm_medium: 'cpc',
        utm_campaign: campaignId ? (type ? type + '_' + campaignId : campaignId) : type,
        utm_term: term,
        utm_content: referrer || ''
    };
}

// Заполняем utm из маркера Roistat, только если настоящих utm в URL не было.
function applyRoistatUtmFallback(data) {
    if (data.utm_source || data.utm_medium || data.utm_campaign || data.utm_content || data.utm_term) {
        return;
    }
    const derived = parseRoistatMarkerToUtm(data.roistat_marker, data.roistat_referrer);
    if (!derived) return;
    Object.keys(derived).forEach(k => { if (!data[k]) data[k] = derived[k]; });
}

function hasAnyUTM(utm) {
    return Boolean(
        utm.utm_source ||
        utm.utm_medium ||
        utm.utm_campaign ||
        utm.utm_content ||
        utm.utm_term
    );
}

// Save UTM to localStorage (persist across pages)
function saveUTMToStorage() {
    const current = getUTMParams();
    if (hasAnyUTM(current)) {
        localStorage.setItem('runorth_utm', JSON.stringify(current));
    }
}

// Get UTM from localStorage
function getStoredUTM() {
    try {
        const stored = localStorage.getItem('runorth_utm');
        return stored ? JSON.parse(stored) : getUTMParams();
    } catch (e) {
        return getUTMParams();
    }
}

function getEffectiveUTM() {
    const current = getUTMParams();
    const stored = getStoredUTM();

    return {
        utm_source: current.utm_source || stored.utm_source || '',
        utm_medium: current.utm_medium || stored.utm_medium || '',
        utm_campaign: current.utm_campaign || stored.utm_campaign || '',
        utm_content: current.utm_content || stored.utm_content || '',
        utm_term: current.utm_term || stored.utm_term || ''
    };
}

// Populate hidden UTM fields
function populateUTMFields() {
    const utm = getEffectiveUTM();
    const fields = {
        utmSource: utm.utm_source,
        utmMedium: utm.utm_medium,
        utmCampaign: utm.utm_campaign,
        utmContent: utm.utm_content,
        utmTerm: utm.utm_term,
        referrer: document.referrer || 'direct'
    };

    // Populate modal form fields
    Object.entries(fields).forEach(([key, value]) => {
        const modalEl = document.getElementById(key);
        if (modalEl) modalEl.value = value;

        // Populate CTA form fields (with Cta suffix)
        const ctaKey = key + 'Cta';
        const ctaEl = document.getElementById(ctaKey);
        if (ctaEl) ctaEl.value = value;
    });
}

// Send lead to Bitrix24
async function sendToBitrix24(data) {
    if (!BITRIX24_WEBHOOK || BITRIX24_WEBHOOK.includes('YOUR_WEBHOOK')) {
        console.warn('Bitrix24 webhook not configured. Lead data:', data);
        return { success: true, demo: true };
    }

    const normalizedPhone = normalizeRussianPhone(data.phone);
    if (!normalizedPhone) {
        return {
            success: false,
            error: 'INVALID_PHONE',
            message: 'Incomplete phone number'
        };
    }
    data.phone = formatRussianPhone(normalizedPhone);

    try {
        applyRoistatUtmFallback(data);
        const yaClientId = getYandexClientId();
        // Домен посадочной страницы: на msk.runorth.ru даёт реальный хост,
        // чтобы лид с поддомена был отличим в Bitrix от заявок основного сайта.
        const landingHost = (window.location && window.location.hostname) || 'msk.runorth.ru';
        const landingUrl = (window.location && window.location.href) || landingHost;
        const customUtmFieldMap = await getBitrixCustomUtmFieldMap();
        const customUtmFields = buildBitrixCustomUtmFields(data, customUtmFieldMap);

        // Build URL-encoded params for Bitrix24 (fixes Cyrillic encoding issues)
        const leadFields = {
            'fields[TITLE]': `\u041B\u0438\u0434 \u0441 ${landingHost} - ${data.formSource || '\u0417\u0430\u044F\u0432\u043A\u0430'}`,
            'fields[NAME]': data.name || '',
            'fields[PHONE][0][VALUE]': data.phone,
            'fields[PHONE][0][VALUE_TYPE]': 'WORK',
            'fields[SOURCE_ID]': resolveBitrixSourceId(data),
            'fields[SOURCE_DESCRIPTION]': `\u0424\u043E\u0440\u043C\u0430: ${data.formSource} | UTM: ${data.utm_source} / ${data.utm_medium}`,
            'fields[UTM_SOURCE]': data.utm_source,
            'fields[UTM_MEDIUM]': data.utm_medium,
            'fields[UTM_CAMPAIGN]': data.utm_campaign,
            'fields[UTM_CONTENT]': data.utm_content,
            'fields[UTM_TERM]': data.utm_term,
            'fields[UF_CRM_YA_CID]': yaClientId || '',
            'fields[UF_CRM_YCLID]': data.yclid || '',
            'fields[COMMENTS]': [
                data.quizAnswers ? `=== \u041E\u0442\u0432\u0435\u0442\u044B \u043A\u0432\u0438\u0437\u0430 ===\n${data.quizAnswers}\n===\n` : null,
                data.name ? `\u0418\u043C\u044F: ${data.name}` : null,
                data.messenger ? `\u041A\u0443\u0434\u0430 \u043D\u0430\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0442: ${data.messenger}` : null,
                `\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430: ${landingUrl}`,
                `\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A: ${data.referrer || 'direct'}`,
                `Roistat visit: ${data.roistat_visit || '—'}`,
                `Roistat marker: ${data.roistat_marker || '—'}`,
                `Roistat referrer: ${data.roistat_referrer || '—'}`,
                `Roistat pos: ${data.roistat_pos || '—'}`,
                `yclid: ${data.yclid || '—'}`,
                `gclid: ${data.gclid || '—'}`,
                `Yandex Client ID: ${yaClientId || '—'}`
            ].filter(Boolean).join('\n')
        };

        // Add custom UTM fields
        Object.entries(customUtmFields).forEach(([key, value]) => {
            leadFields[`fields[${key}]`] = value;
        });

        // Номер визита Roistat пишем напрямую в известное поле (UF_CRM_1705255545),
        // не завязываясь на crm.lead.fields. Только чистый номер визита, не маркер.
        if (data.roistat_visit) {
            leadFields['fields[UF_CRM_1705255545]'] = data.roistat_visit;
        } else {
            delete leadFields['fields[UF_CRM_1705255545]'];
        }

        const formBody = Object.entries(leadFields)
            .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value || ''))
            .join('&');

        const response = await fetch(BITRIX24_WEBHOOK + 'crm.lead.add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: formBody
        });

        const result = await response.json();

        if (!response.ok || result.error) {
            return {
                success: false,
                error: result.error_description || result.error || `HTTP ${response.status}`,
                raw: result
            };
        }

        return {
            success: true,
            leadId: result.result,
            raw: result
        };
    } catch (error) {
        console.error('Bitrix24 error:', error);
        return { success: false, error: error.message };
    }
}

// Show form status message
function showFormStatus(form, type, message) {
    let statusEl = form.querySelector('.form-status');
    if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.className = 'form-status';
        form.appendChild(statusEl);
    }
    statusEl.className = `form-status form-status-${type}`;
    statusEl.textContent = message;
    statusEl.style.display = 'block';
}

// Hide form status message
function hideFormStatus(form) {
    const statusEl = form.querySelector('.form-status');
    if (statusEl) {
        statusEl.style.display = 'none';
    }
}

function redirectToThankYou() {
    window.location.href = '/thank-you';
}

// Form Submission with Bitrix24
function submitForm(event) {
    event.preventDefault();

    console.log('Form submitted!');

    const form = event.target;
    const phoneInput = form.querySelector('input[name="phone"]');
    const nameInput = form.querySelector('input[name="name"]');
    // Мессенджер для отправки проекта (Telegram / MAX) — учитываем только если поле видимо
    const messengerInput = form.querySelector('[name="messenger"]:checked') || form.querySelector('[name="messenger"]');
    const messengerVisible = messengerInput && messengerInput.offsetParent !== null;

    console.log('Form:', form.id, 'Phone:', phoneInput?.value);

    // Determine form source and get corresponding hidden fields
    const isModalForm = form.id === 'modalForm';
    const fieldSuffix = isModalForm ? '' : 'Cta';
    const effectiveUTM = getEffectiveUTM();
    const urlParams = new URLSearchParams(window.location.search);
    const roistatParams = getRoistatParams(urlParams);

    const formSource = document.getElementById('formSource' + fieldSuffix);
    const utmSource = document.getElementById('utmSource' + fieldSuffix);
    const utmMedium = document.getElementById('utmMedium' + fieldSuffix);
    const utmCampaign = document.getElementById('utmCampaign' + fieldSuffix);
    const utmContent = document.getElementById('utmContent' + fieldSuffix);
    const utmTerm = document.getElementById('utmTerm' + fieldSuffix);
    const referrer = document.getElementById('referrer' + fieldSuffix);

    // Validate phone number
    const normalizedPhone = normalizeRussianPhone(phoneInput && phoneInput.value);
    if (!normalizedPhone) {
        alert('\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u043e\u043b\u043d\u044b\u0439 \u043d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430 \u0432 \u0444\u043e\u0440\u043c\u0430\u0442\u0435 +7 (XXX) XXX-XX-XX');
        if (phoneInput) {
            phoneInput.focus();
        }
        return;
    }
    if (phoneInput) {
        phoneInput.value = formatRussianPhone(normalizedPhone);
    }

    const formData = {
        phone: formatRussianPhone(normalizedPhone),
        name: nameInput ? nameInput.value.trim() : '',
        messenger: messengerVisible ? messengerInput.value : '',
        formSource: formSource ? formSource.value : (isModalForm ? 'modal' : 'cta-section'),
        utm_source: (utmSource && utmSource.value) || effectiveUTM.utm_source,
        utm_medium: (utmMedium && utmMedium.value) || effectiveUTM.utm_medium,
        utm_campaign: (utmCampaign && utmCampaign.value) || effectiveUTM.utm_campaign,
        utm_content: (utmContent && utmContent.value) || effectiveUTM.utm_content,
        utm_term: (utmTerm && utmTerm.value) || effectiveUTM.utm_term,
        roistat_visit: getRoistatVisit(),
        roistat_marker: roistatParams.roistat,
        roistat_referrer: roistatParams.roistat_referrer,
        roistat_pos: roistatParams.roistat_pos,
        yclid: urlParams.get('yclid') || '',
        gclid: urlParams.get('gclid') || '',
        referrer: referrer ? referrer.value : (document.referrer || 'direct')
    };

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.querySelector('span')?.textContent || submitBtn.textContent;
    submitBtn.disabled = true;
    if (submitBtn.querySelector('span')) {
        submitBtn.querySelector('span').textContent = '\u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430...';
    } else {
        submitBtn.textContent = '\u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430...';
    }

    // Send to Bitrix24
    sendToBitrix24(formData).then(result => {
        if (result.success || result.demo) {
            // Yandex.Metrika goal
            ym(24341083, 'reachGoal', 'form_submit');
            vkGoal('form_submit');

            showFormStatus(form, 'success', '\u2713 \u0417\u0430\u044F\u0432\u043A\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0430! \u041C\u044B \u0441\u0432\u044F\u0436\u0435\u043C\u0441\u044F \u0441 \u0432\u0430\u043C\u0438 \u0432 \u0431\u043B\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u0432\u0440\u0435\u043C\u044F.');
            form.reset();

            const checkbox = form.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.checked = true;

            setTimeout(() => {
                if (isModalForm) {
                    closeModal();
                }
                redirectToThankYou();
            }, 1200);
        } else {
            console.error('Bitrix24 lead submission failed:', result.error || result.raw || result);
            showFormStatus(form, 'error', '\u2717 \u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430. \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u0435 \u043D\u0430\u043C \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E.');
            submitBtn.disabled = false;
            if (submitBtn.querySelector('span')) {
                submitBtn.querySelector('span').textContent = originalText;
            } else {
                submitBtn.textContent = originalText;
            }
        }
    });
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('modal');
        if (modal && modal.style.display === 'block') {
            closeModal();
        }
    }
});

// Close lightbox on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    }
    // Arrow navigation when lightbox is open
    if (e.key === 'ArrowLeft') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active') && !(typeof window.isLightboxZoomed === 'function' && window.isLightboxZoomed())) lightboxNav(-1);
    }
    if (e.key === 'ArrowRight') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active') && !(typeof window.isLightboxZoomed === 'function' && window.isLightboxZoomed())) lightboxNav(1);
    }
});

// Persistent pinch-to-zoom for lightbox images.
(function () {
    const zoomWrapper = document.querySelector('.lightbox-zoom-wrapper');
    if (!zoomWrapper) return;

    window.isLightboxZoomed = window.isLightboxZoomed || function () {
        return !!document.querySelector('.lightbox-img.zoomed');
    };

    if (typeof window.resetLightboxZoom === 'function' || zoomWrapper.dataset.zoomPersistBound === 'true') {
        if (!window.isLightboxPinchGesture && zoomWrapper.dataset.zoomGestureGuardBound !== 'true') {
            let externalPinchGesture = false;
            zoomWrapper.dataset.zoomGestureGuardBound = 'true';
            window.isLightboxPinchGesture = function () {
                return externalPinchGesture;
            };
            zoomWrapper.addEventListener('touchstart', function (e) {
                if (e.touches.length > 1) externalPinchGesture = true;
            }, { passive: true });
            zoomWrapper.addEventListener('touchend', function (e) {
                if (e.touches.length === 0) {
                    setTimeout(function () {
                        externalPinchGesture = false;
                    }, 120);
                }
            }, { passive: true });
            zoomWrapper.addEventListener('touchcancel', function () {
                setTimeout(function () {
                    externalPinchGesture = false;
                }, 120);
            }, { passive: true });
        }
        return;
    }
    zoomWrapper.dataset.zoomPersistBound = 'true';

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let isPinching = false;
    let pinchGestureActive = false;
    let initialPinchDistance = 0;
    let initialScale = 1;
    let lastTapTime = 0;
    const MIN_SCALE = 1;
    const MAX_SCALE = 6;

    function lightboxActive() {
        const lightbox = document.getElementById('lightbox');
        return !!(lightbox && lightbox.classList.contains('active'));
    }

    function activeImage() {
        return document.getElementById('lightboxImg') || zoomWrapper.querySelector('.lightbox-img');
    }

    function distance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function clampPan() {
        const img = activeImage();
        if (!img || scale <= 1) {
            translateX = 0;
            translateY = 0;
            return;
        }

        // Границы пана считаем по реально видимому изображению (object-fit: contain),
        // а не по боксу элемента — иначе фото можно увести в чёрные поля (чёрный экран).
        const wrapperRect = zoomWrapper.getBoundingClientRect();
        const boxW = img.offsetWidth || wrapperRect.width;
        const boxH = img.offsetHeight || wrapperRect.height;
        const natW = img.naturalWidth || boxW;
        const natH = img.naturalHeight || boxH;
        const fit = Math.min(boxW / natW, boxH / natH) || 1;
        const dispW = natW * fit * scale;
        const dispH = natH * fit * scale;
        const maxX = Math.max(0, (dispW - wrapperRect.width) / 2);
        const maxY = Math.max(0, (dispH - wrapperRect.height) / 2);

        translateX = maxX > 1 ? Math.max(-maxX, Math.min(maxX, translateX)) : 0;
        translateY = maxY > 1 ? Math.max(-maxY, Math.min(maxY, translateY)) : 0;
    }

    function setArrowsHidden(hidden) {
        document.querySelectorAll('.lightbox-arrow').forEach(arrow => {
            arrow.classList.toggle('hidden', hidden);
        });
    }

    function updateTransform() {
        const img = activeImage();
        if (!img) return;
        if (scale <= 1.05) {
            img.style.transform = '';
            img.classList.remove('zoomed');
            setArrowsHidden(false);
            return;
        }
        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        img.classList.add('zoomed');
        setArrowsHidden(true);
    }

    function resetLightboxZoom() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        isDragging = false;
        isPinching = false;
        const img = activeImage();
        if (img) {
            img.style.transform = '';
            img.classList.remove('zoomed');
        }
        setArrowsHidden(false);
    }

    window.resetLightboxZoom = resetLightboxZoom;
    window.isLightboxZoomed = function () {
        return scale > 1.05 || !!document.querySelector('.lightbox-img.zoomed');
    };
    window.isLightboxPinchGesture = function () {
        return pinchGestureActive;
    };

    zoomWrapper.addEventListener('touchstart', function (e) {
        if (!lightboxActive()) return;

        if (e.touches.length === 2) {
            e.preventDefault();
            zoomWrapper.classList.add('is-panning');
            isPinching = true;
            pinchGestureActive = true;
            isDragging = false;
            initialPinchDistance = distance(e.touches);
            initialScale = scale;
            return;
        }

        if (e.touches.length === 1 && scale > 1.05) {
            isDragging = true;
            zoomWrapper.classList.add('is-panning');
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        }
    }, { passive: false });

    zoomWrapper.addEventListener('touchmove', function (e) {
        if (!lightboxActive()) return;

        if (e.touches.length === 2 && initialPinchDistance > 0) {
            e.preventDefault();
            scale = Math.min(Math.max(initialScale * (distance(e.touches) / initialPinchDistance), MIN_SCALE), MAX_SCALE);
            clampPan();
            updateTransform();
            return;
        }

        if (e.touches.length === 1 && isDragging && scale > 1.05) {
            e.preventDefault();
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            clampPan();
            updateTransform();
        }
    }, { passive: false });

    zoomWrapper.addEventListener('touchend', function (e) {
        if (!lightboxActive()) return;

        if (e.touches.length === 1 && isPinching && scale > 1.05) {
            isPinching = false;
            isDragging = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
            return;
        }

        if (e.touches.length === 0) {
            const wasPinching = pinchGestureActive;
            isPinching = false;
            isDragging = false;
            zoomWrapper.classList.remove('is-panning');

            if (scale <= 1.05) {
                resetLightboxZoom();
            } else {
                clampPan();
                updateTransform();
            }

            if (!wasPinching && e.changedTouches.length === 1) {
                const now = Date.now();
                if (now - lastTapTime < 300) {
                    e.preventDefault();
                    if (scale > 1.05) {
                        resetLightboxZoom();
                    } else {
                        scale = 3;
                        translateX = 0;
                        translateY = 0;
                        updateTransform();
                    }
                    lastTapTime = 0;
                    return;
                }
                lastTapTime = now;
            }

            setTimeout(() => {
                pinchGestureActive = false;
            }, 120);
        }
    }, { passive: false });

    zoomWrapper.addEventListener('touchcancel', function () {
        isPinching = false;
        isDragging = false;
        zoomWrapper.classList.remove('is-panning');
        setTimeout(() => {
            pinchGestureActive = false;
        }, 120);
    }, { passive: true });
})();

// Desktop zoom for lightbox images: mouse wheel, double click and drag.
(function () {
    const zoomWrapper = document.querySelector('.lightbox-zoom-wrapper');
    if (!zoomWrapper || zoomWrapper.dataset.desktopZoomBound === 'true') return;
    zoomWrapper.dataset.desktopZoomBound = 'true';

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let startTranslateX = 0;
    let startTranslateY = 0;
    const MIN_SCALE = 1;
    const MAX_SCALE = 6;
    const WHEEL_STEP = 0.16;
    const DOUBLE_CLICK_SCALE = 2.6;

    const previousResetZoom = typeof window.resetLightboxZoom === 'function' ? window.resetLightboxZoom : null;
    const previousIsZoomed = typeof window.isLightboxZoomed === 'function' ? window.isLightboxZoomed : null;

    function lightboxActive() {
        const lightbox = document.getElementById('lightbox');
        return !!(lightbox && lightbox.classList.contains('active'));
    }

    function activeImage() {
        return document.getElementById('lightboxImg') || zoomWrapper.querySelector('.lightbox-img');
    }

    function setArrowsHidden(hidden) {
        document.querySelectorAll('.lightbox-arrow').forEach(arrow => {
            arrow.classList.toggle('hidden', hidden);
        });
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function clampPan() {
        const img = activeImage();
        if (!img || scale <= 1) {
            translateX = 0;
            translateY = 0;
            return;
        }

        // Границы пана — по реально видимому изображению (object-fit: contain),
        // а не по боксу элемента, чтобы фото не уезжало в чёрные поля.
        const wrapperRect = zoomWrapper.getBoundingClientRect();
        const boxW = img.offsetWidth || wrapperRect.width;
        const boxH = img.offsetHeight || wrapperRect.height;
        const natW = img.naturalWidth || boxW;
        const natH = img.naturalHeight || boxH;
        const fit = Math.min(boxW / natW, boxH / natH) || 1;
        const dispW = natW * fit * scale;
        const dispH = natH * fit * scale;
        const maxX = Math.max(0, (dispW - wrapperRect.width) / 2);
        const maxY = Math.max(0, (dispH - wrapperRect.height) / 2);

        translateX = maxX > 1 ? clamp(translateX, -maxX, maxX) : 0;
        translateY = maxY > 1 ? clamp(translateY, -maxY, maxY) : 0;
    }

    function updateTransform() {
        const img = activeImage();
        if (!img) return;

        if (scale <= 1.05) {
            img.style.transform = '';
            img.classList.remove('zoomed');
            setArrowsHidden(false);
            return;
        }

        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        img.classList.add('zoomed');
        setArrowsHidden(true);
    }

    function resetDesktopZoom() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        isDragging = false;
        zoomWrapper.classList.remove('is-desktop-dragging');

        const img = activeImage();
        if (img) {
            img.style.transform = '';
            img.classList.remove('zoomed');
        }
        setArrowsHidden(false);
    }

    function zoomAt(clientX, clientY, nextScale) {
        const wrapperRect = zoomWrapper.getBoundingClientRect();
        const cursorX = clientX - wrapperRect.left - wrapperRect.width / 2;
        const cursorY = clientY - wrapperRect.top - wrapperRect.height / 2;
        const ratio = nextScale / scale;

        translateX = translateX * ratio + cursorX * (1 - ratio);
        translateY = translateY * ratio + cursorY * (1 - ratio);
        scale = nextScale;
        clampPan();
        updateTransform();
    }

    window.resetLightboxZoom = function () {
        resetDesktopZoom();
        if (previousResetZoom) previousResetZoom();
    };

    window.isLightboxZoomed = function () {
        return scale > 1.05 || (previousIsZoomed ? previousIsZoomed() : false);
    };

    zoomWrapper.addEventListener('wheel', function (e) {
        if (!lightboxActive()) return;
        if (e.target.closest('.lightbox-close, .lightbox-arrow, .lightbox-dot')) return;

        e.preventDefault();
        const direction = e.deltaY < 0 ? 1 : -1;
        const factor = 1 + direction * WHEEL_STEP;
        const nextScale = clamp(scale * factor, MIN_SCALE, MAX_SCALE);

        if (nextScale <= 1.05) {
            window.resetLightboxZoom();
            return;
        }

        zoomAt(e.clientX, e.clientY, nextScale);
    }, { passive: false });

    zoomWrapper.addEventListener('dblclick', function (e) {
        if (!lightboxActive()) return;
        if (e.target.closest('.lightbox-close, .lightbox-arrow, .lightbox-dot')) return;

        e.preventDefault();
        if (scale > 1.05) {
            window.resetLightboxZoom();
            return;
        }

        zoomAt(e.clientX, e.clientY, DOUBLE_CLICK_SCALE);
    });

    zoomWrapper.addEventListener('mousedown', function (e) {
        if (!lightboxActive() || scale <= 1.05 || e.button !== 0) return;
        if (e.target.closest('.lightbox-close, .lightbox-arrow, .lightbox-dot')) return;

        e.preventDefault();
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        startTranslateX = translateX;
        startTranslateY = translateY;
        zoomWrapper.classList.add('is-desktop-dragging');
    });

    window.addEventListener('mousemove', function (e) {
        if (!isDragging) return;

        e.preventDefault();
        translateX = startTranslateX + e.clientX - dragStartX;
        translateY = startTranslateY + e.clientY - dragStartY;
        clampPan();
        updateTransform();
    });

    window.addEventListener('mouseup', function () {
        if (!isDragging) return;
        isDragging = false;
        zoomWrapper.classList.remove('is-desktop-dragging');
    });
})();

// Touch/swipe support for lightbox
(function () {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let multiTouch = false;

    lightbox.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            multiTouch = true;
            return;
        }
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        multiTouch = false;
    }, { passive: true });

    lightbox.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) multiTouch = true;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        if (
            multiTouch ||
            (typeof window.isLightboxPinchGesture === 'function' && window.isLightboxPinchGesture()) ||
            (typeof window.isLightboxZoomed === 'function' && window.isLightboxZoomed())
        ) {
            if (e.touches.length === 0) multiTouch = false;
            return;
        }
        touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diff = touchStartX - touchEndX;
        const diffY = Math.abs(touchStartY - touchEndY);
        if (Math.abs(diff) > 50 && Math.abs(diff) > diffY) {
            if (diff > 0) lightboxNav(1);
            else lightboxNav(-1);
        }
    }, { passive: true });
})();

// Horizontal Gallery Swipe for Mobile Projects
(function () {
    function initGallerySwipe() {
        if (window.innerWidth > 768) return;

        const galleries = document.querySelectorAll('.project-gallery');

        galleries.forEach(gallery => {
            // РЈРґР°Р»СЏРµРј СЃС‚Р°СЂС‹Рµ РѕР±СЂР°Р±РѕС‚С‡РёРєРё РµСЃР»Рё РµСЃС‚СЊ
            if (gallery._swipeHandler) return;

            let touchStartX = 0;
            let touchStartY = 0;
            let isSwiping = false;

            const handleTouchStart = (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
                isSwiping = true;
            };

            const handleTouchMove = (e) => {
                if (!isSwiping) return;
                const touchX = e.changedTouches[0].screenX;
                const touchY = e.changedTouches[0].screenY;
                const diffX = Math.abs(touchX - touchStartX);
                const diffY = Math.abs(touchY - touchStartY);

                // Р•СЃР»Рё РіРѕСЂРёР·РѕРЅС‚Р°Р»СЊРЅРѕРµ РґРІРёР¶РµРЅРёРµ Р±РѕР»СЊС€Рµ РІРµСЂС‚РёРєР°Р»СЊРЅРѕРіРѕ, РїСЂРµРґРѕС‚РІСЂР°С‰Р°РµРј СЃРєСЂРѕР»Р» СЃС‚СЂР°РЅРёС†С‹
                if (diffX > diffY && diffX > 10) {
                    e.preventDefault();
                }
            };

            const handleTouchEnd = (e) => {
                if (!isSwiping) return;
                isSwiping = false;

                const touchEndX = e.changedTouches[0].screenX;
                const touchEndY = e.changedTouches[0].screenY;
                const diffX = touchStartX - touchEndX;
                const diffY = Math.abs(touchStartY - touchEndY);

                // РўРѕР»СЊРєРѕ РµСЃР»Рё РіРѕСЂРёР·РѕРЅС‚Р°Р»СЊРЅС‹Р№ СЃРІР°Р№Рї Р±РѕР»СЊС€Рµ РІРµСЂС‚РёРєР°Р»СЊРЅРѕРіРѕ Рё Р±РѕР»СЊС€Рµ РїРѕСЂРѕРіР°
                if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
                    const direction = diffX > 0 ? 1 : -1;
                    // РќР°С…РѕРґРёРј РєРЅРѕРїРєСѓ СЃС‚СЂРµР»РєРё Рё РІС‹Р·С‹РІР°РµРј РЅР°РІРёРіР°С†РёСЋ
                    const arrowBtn = direction > 0
                        ? gallery.querySelector('.arrow-right')
                        : gallery.querySelector('.arrow-left');
                    if (arrowBtn) {
                        projectGalleryNav(arrowBtn, direction);
                    }
                }
            };

            gallery.addEventListener('touchstart', handleTouchStart, { passive: true });
            gallery.addEventListener('touchmove', handleTouchMove, { passive: false });
            gallery.addEventListener('touchend', handleTouchEnd, { passive: true });

            gallery._swipeHandler = true;
        });
    }

    // РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РїСЂРё Р·Р°РіСЂСѓР·РєРµ
    initGallerySwipe();

    // РџРµСЂРµРёРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РїСЂРё РёР·РјРµРЅРµРЅРёРё СЂР°Р·РјРµСЂР° РѕРєРЅР°
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initGallerySwipe, 250);
    });

    // ============================================
    // Yandex.Metrika Goals — Click Tracking
    // ============================================

    // Phone click tracking (делегирование)
    document.addEventListener('click', (e) => {
        const metrikaTarget = e.target.closest('[data-metrika-goal]');
        if (metrikaTarget && typeof window.runorthReachGoal === 'function') {
            window.runorthReachGoal(metrikaTarget.dataset.metrikaGoal, {
                href: metrikaTarget.href || '',
                text: (metrikaTarget.textContent || '').trim().slice(0, 120)
            });
        }

        const phoneLink = e.target.closest('a[href^="tel:"]');
        if (phoneLink) {
            ym(24341083, 'reachGoal', 'phone_click');
            vkGoal('phone_click');
        }

        // Telegram click tracking
        const telegramLink = e.target.closest('a[href*="t.me/"]');
        if (telegramLink) {
            ym(24341083, 'reachGoal', 'telegram_click');
            vkGoal('telegram_click');
        }

        // MAX click tracking
        const maxLink = e.target.closest('a[href*="max.ru/"]');
        if (maxLink) {
            ym(24341083, 'reachGoal', 'max_click');
            vkGoal('max_click');
        }
    });
})();
