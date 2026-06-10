// Yandex Metrika Integration

// Конфигурация - замените XXXXXXXX на ваш номер счетчика
const YANDEX_METRICA_ID = 'XXXXXXXX';

// Идентификаторы целей
const YANDEX_GOALS = {
    FORM_SUBMIT: 'form_submit',      // Цель: отправка формы
    THANK_YOU_PAGE: 'thank_you_page' // Цель: просмотр страницы "Спасибо"
};

// Инициализация Яндекс Метрики
function initYandexMetrika() {
    if (typeof ym === 'function') {
        console.log('Yandex Metrika already initialized');
        return;
    }

    (function(m, e, t, r, i, k, a) {
        m[i] = m[i] || function() {
            (m[i].a = m[i].a || []).push(arguments)
        };
        m[i].l = 1 * new Date();
        for (var j = 0; j < document.scripts.length; j++) {
            if (document.scripts[j].src === r) { return; }
        }
        k = e.createElement(t);
        a = e.getElementsByTagName(t)[0];
        k.async = true;
        k.src = 'https://mc.yandex.ru/metrika/tag.js';
        a.parentNode.insertBefore(k, a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(YANDEX_METRICA_ID, "init", {
        clickmap: true,
        accurateTrackBounce: true,
        webvisor: true,
        trackLinks: true,
        ecommerce: "dataLayer"
    });

    console.log('Yandex Metrika initialized with ID:', YANDEX_METRICA_ID);
}

// Отправка цели в Яндекс Метрику
function yandexGoal(goalId, params = {}) {
    if (typeof ym === 'function') {
        ym(YANDEX_METRICA_ID, 'reachGoal', goalId, params);
        console.log('Yandex Metrika goal reached:', goalId, params);
    } else {
        console.warn('Yandex Metrika not initialized. Goal:', goalId);
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    initYandexMetrika();
});

// Экспорт функций для использования в других скриптах
if (typeof window !== 'undefined') {
    window.yandexGoal = yandexGoal;
    window.initYandexMetrika = initYandexMetrika;
}
