/**
 * Anti-Fraud Protection for Static Website
 * ==========================================
 * Защита от:
 * - Спам форм (боты, автоматическая отправка)
 * - Накрутки кликов (rate limiting)
 * - Подозрительной активности (мониторинг)
 */

(function() {
    'use strict';

    // ==========================================
    // 1. ANTI-SPAM: Honeypot & Timing Protection
    // ==========================================

    const FraudProtection = {
        // Время загрузки страницы (для проверки тайминга)
        pageLoadTime: Date.now(),

        // Минимальное время заполнения формы (мс)
        minFormTime: 3000,

        // Максимальное время заполнения формы (мс) - боты слишком быстры
        maxFormTime: 500,

        // Лимит отправок формы в минуту
        formSubmitLimit: 3,

        // Лимит кликов в секунду
        clickRateLimit: 10,

        // Хранилище отправок форм
        formSubmissions: [],

        // Хранилище кликов
        clickTimestamps: [],

        // Токент сессии
        sessionToken: null,

        // ==========================================
        // Генерация уникального токена сессии
        // ==========================================
        generateSessionToken: function() {
            const array = new Uint8Array(32);
            window.crypto.getRandomValues(array);
            this.sessionToken = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
            
            // Сохраняем в sessionStorage
            sessionStorage.setItem('_st', this.sessionToken);
            
            // Добавляем скрытое поле в все формы
            this.addTokenToForms();
        },

        // ==========================================
        // Добавление токена в формы
        // ==========================================
        addTokenToForms: function() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                if (!form.querySelector('input[name="_st"]')) {
                    const tokenInput = document.createElement('input');
                    tokenInput.type = 'hidden';
                    tokenInput.name = '_st';
                    tokenInput.value = this.sessionToken;
                    form.appendChild(tokenInput);
                }
            });
        },

        // ==========================================
        // Honeypot: создание скрытых полей-ловушек
        // ==========================================
        initHoneypot: function() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                // Проверяем, уже ли добавлен honeypot
                if (form.querySelector('.hp-field')) return;

                // Создаем привлекательное для ботов поле
                const honeypotNames = ['website', 'url', 'email_confirm', 'phone_2', 'company'];
                const honeypotName = honeypotNames[Math.floor(Math.random() * honeypotNames.length)];
                
                const hpDiv = document.createElement('div');
                hpDiv.className = 'hp-field';
                hpDiv.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';
                hpDiv.setAttribute('aria-hidden', 'true');
                
                const input = document.createElement('input');
                input.type = 'text';
                input.name = honeypotName;
                input.tabIndex = -1;
                input.autocomplete = 'off';
                
                hpDiv.appendChild(input);
                form.insertBefore(hpDiv, form.firstChild);

                // Добавляем поле времени
                const timeInput = document.createElement('input');
                timeInput.type = 'hidden';
                timeInput.name = '_t';
                timeInput.value = Date.now();
                form.appendChild(timeInput);
            });
        },

        // ==========================================
        // Проверка honeypot
        // ==========================================
        checkHoneypot: function(form) {
            const hpFields = form.querySelectorAll('.hp-field input');
            for (let i = 0; i < hpFields.length; i++) {
                if (hpFields[i].value !== '') {
                    console.warn('Honeypot triggered');
                    return false;
                }
            }
            return true;
        },

        // ==========================================
        // Проверка тайминга заполнения формы
        // ==========================================
        checkFormTiming: function(form) {
            const timeField = form.querySelector('input[name="_t"]');
            if (!timeField) return true; // Если нет поля времени, пропускаем

            const startTime = parseInt(timeField.value);
            const submitTime = Date.now();
            const elapsed = submitTime - startTime;

            // Слишком быстро (бот)
            if (elapsed < this.maxFormTime) {
                console.warn('Form submitted too fast:', elapsed, 'ms');
                return false;
            }

            // Форма отправлена до полной загрузки страницы
            if (startTime < this.pageLoadTime) {
                console.warn('Form filled before page load');
                return false;
            }

            return true;
        },

        // ==========================================
        // Rate limiting для форм
        // ==========================================
        checkFormRateLimit: function() {
            const now = Date.now();
            const oneMinute = 60 * 1000;

            // Удаляем старые записи
            this.formSubmissions = this.formSubmissions.filter(t => now - t < oneMinute);

            if (this.formSubmissions.length >= this.formSubmitLimit) {
                console.warn('Form rate limit exceeded');
                return false;
            }

            this.formSubmissions.push(now);
            return true;
        },

        // ==========================================
        // Rate limiting для кликов
        // ==========================================
        checkClickRateLimit: function() {
            const now = Date.now();
            const oneSecond = 1000;

            // Удаляем старые записи
            this.clickTimestamps = this.clickTimestamps.filter(t => now - t < oneSecond);

            if (this.clickTimestamps.length >= this.clickRateLimit) {
                console.warn('Click rate limit exceeded');
                return false;
            }

            this.clickTimestamps.push(now);
            return true;
        },

        // ==========================================
        // Проверка поведения мыши (человек vs бот)
        // ==========================================
        initMouseTracking: function() {
            let mouseMovements = 0;
            const threshold = 5; // Минимальное количество движений

            document.addEventListener('mousemove', function() {
                mouseMovements++;
            }, { passive: true });

            // Проверяем при отправке формы
            this.checkMouseActivity = function() {
                return mouseMovements >= threshold;
            };
        },

        // ==========================================
        // Математическая капча
        // ==========================================
        initMathCaptcha: function() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                // Проверяем, уже ли добавлена капча
                if (form.querySelector('.math-captcha')) return;

                // Генерируем случайный вопрос
                const operators = ['+', '-', '×'];
                const operator = operators[Math.floor(Math.random() * operators.length)];
                let a, b, answer;

                switch(operator) {
                    case '+':
                        a = Math.floor(Math.random() * 10) + 1;
                        b = Math.floor(Math.random() * 10) + 1;
                        answer = a + b;
                        break;
                    case '-':
                        a = Math.floor(Math.random() * 10) + 5;
                        b = Math.floor(Math.random() * 5) + 1;
                        answer = a - b;
                        break;
                    case '×':
                        a = Math.floor(Math.random() * 5) + 1;
                        b = Math.floor(Math.random() * 5) + 1;
                        answer = a * b;
                        break;
                }

                // Создаем контейнер капчи
                const captchaDiv = document.createElement('div');
                captchaDiv.className = 'math-captcha';
                captchaDiv.style.cssText = 'margin-bottom:15px;padding:12px;background:#f8f9fa;border-radius:8px;border:1px solid #e9ecef;';

                const label = document.createElement('label');
                label.style.cssText = 'display:block;margin-bottom:8px;font-size:0.9rem;color:#333;font-weight:600;';
                label.textContent = `Анти-спам: Сколько будет ${a} ${operator} ${b}?`;

                const input = document.createElement('input');
                input.type = 'text';
                input.name = '_captcha';
                input.required = true;
                input.placeholder = 'Введите ответ';
                input.style.cssText = 'width:100px;padding:8px;border:1px solid #ddd;border-radius:4px;font-size:1rem;';

                // Сохраняем правильный ответ (хешируем для безопасности)
                const answerHash = this.simpleHash(answer.toString());
                input.dataset.answer = answerHash;

                captchaDiv.appendChild(label);
                captchaDiv.appendChild(input);
                form.appendChild(captchaDiv);
            });
        },

        // ==========================================
        // Простая хеш-функция для капчи
        // ==========================================
        simpleHash: function(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash.toString();
        },

        // ==========================================
        // Проверка ответа капчи
        // ==========================================
        checkMathCaptcha: function(form) {
            const captchaInput = form.querySelector('input[name="_captcha"]');
            if (!captchaInput) return true; // Если нет капчи, пропускаем

            const userAnswer = captchaInput.value.trim();
            const correctAnswerHash = captchaInput.dataset.answer;

            if (!userAnswer) {
                alert('Пожалуйста, решите математический пример для защиты от спама.');
                return false;
            }

            if (this.simpleHash(userAnswer) !== correctAnswerHash) {
                alert('Неверный ответ. Пожалуйста, попробуйте снова.');
                return false;
            }

            return true;
        },

        // ==========================================
        // Проверка User-Agent и поведения
        // ==========================================
        checkBotIndicators: function() {
            const ua = navigator.userAgent;
            
            // Проверка на типичные бот-паттерны
            const botPatterns = [
                /bot/i, /crawler/i, /spider/i, /scraper/i,
                /selenium/i, /puppeteer/i, /phantom/i,
                /headless/i, /automate/i
            ];

            for (let pattern of botPatterns) {
                if (pattern.test(ua)) {
                    console.warn('Bot detected in User-Agent');
                    return false;
                }
            }

            return true;
        },

        // ==========================================
        // Защита от множественных отправок
        // ==========================================
        initFormProtection: function() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                // Проверка при отправке
                form.addEventListener('submit', (e) => {
                    // 1. Honeypot check
                    if (!this.checkHoneypot(form)) {
                        e.preventDefault();
                        console.warn('Submission blocked: honeypot');
                        return false;
                    }

                    // 2. Timing check
                    if (!this.checkFormTiming(form)) {
                        e.preventDefault();
                        alert('Пожалуйста, подождите немного перед отправкой формы.');
                        console.warn('Submission blocked: timing');
                        return false;
                    }

                    // 3. Rate limit check
                    if (!this.checkFormRateLimit()) {
                        e.preventDefault();
                        alert('Вы отправили слишком много заявок. Пожалуйста, подождите.');
                        console.warn('Submission blocked: rate limit');
                        return false;
                    }

                    // 4. Math captcha check
                    if (!this.checkMathCaptcha(form)) {
                        e.preventDefault();
                        console.warn('Submission blocked: captcha');
                        return false;
                    }

                    // 5. Mouse activity check (опционально, не блокирует)
                    if (!this.checkMouseActivity()) {
                        console.warn('Warning: Low mouse activity detected');
                        // Не блокируем, только логируем
                    }

                    // 6. Bot indicators
                    if (!this.checkBotIndicators()) {
                        e.preventDefault();
                        console.warn('Submission blocked: bot indicators');
                        return false;
                    }

                    // Всё прошло - разрешаем отправку
                    console.log('Form submission validated successfully');
                    return true;
                });
            });
        },

        // ==========================================
        // Rate limiting для кнопок
        // ==========================================
        initButtonProtection: function() {
            const buttons = document.querySelectorAll('button, .btn');
            
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if (!this.checkClickRateLimit()) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        console.warn('Click blocked: rate limit');
                        return false;
                    }
                    return true;
                }, true); // capture phase
            });
        },

        // ==========================================
        // Логирование подозрительной активности
        // ==========================================
        initFraudLogging: function() {
            // Отслеживаем аномалии
            window.addEventListener('error', (e) => {
                console.warn('Suspicious activity logged:', e.message);
            });

            // Логируем при попытках отправки
            const originalSubmit = HTMLFormElement.prototype.submit;
            HTMLFormElement.prototype.submit = function() {
                console.log('Form submitted programmatically');
                return originalSubmit.apply(this, arguments);
            };
        },

        // ==========================================
        // Инициализация всех защит
        // ==========================================
        init: function() {
            console.log('Initializing anti-fraud protection...');
            
            // Генерация токена сессии
            this.generateSessionToken();
            
            // Инициализация honeypot
            this.initHoneypot();
            
            // Инициализация математической капчи
            this.initMathCaptcha();
            
            // Инициализация отслеживания мыши
            this.initMouseTracking();
            
            // Защита форм
            this.initFormProtection();
            
            // Защита кнопок
            this.initButtonProtection();
            
            // Логирование
            this.initFraudLogging();
            
            console.log('Anti-fraud protection initialized');
        }
    };

    // ==========================================
    // Запуск после загрузки DOM
    // ==========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            FraudProtection.init();
        });
    } else {
        FraudProtection.init();
    }

    // Экспортируем для использования в других скриптах
    window.FraudProtection = FraudProtection;

})();
