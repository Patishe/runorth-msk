// Quiz module — multi-step lead form for runorth.ru
(function () {
    'use strict';

    const QUIZ_STEPS = [
        {
            id: 'area',
            question: 'Какая площадь дома Вам необходима?',
            options: [
                'до 100 м²',
                '100–150 м²',
                '150–200 м²',
                '200–300 м²',
                '300–500 м²',
                'более 500 м²'
            ]
        },
        {
            id: 'floors',
            question: 'Сколько этажей планируете?',
            options: [
                '1 этаж',
                '1 этаж + мансарда',
                '2 этажа',
                'Ещё не решил(а)'
            ]
        },
        {
            id: 'timing',
            question: 'Когда планируете начать строительство?',
            options: [
                'Как можно скорее',
                'В этом сезоне',
                'В следующем сезоне',
                'Пока изучаю варианты'
            ]
        },
        {
            id: 'land',
            question: 'Есть ли участок под строительство?',
            options: [
                'Да, с коммуникациями',
                'Да, без коммуникаций',
                'В процессе покупки',
                'Ещё ищу'
            ]
        },
        {
            id: 'payment',
            question: 'Какой способ оплаты рассматриваете?',
            options: [
                'Собственные средства',
                'Ипотека',
                'Материнский капитал',
                'Рассрочка от застройщика'
            ]
        }
    ];

    const LABELS = {
        area: 'Площадь',
        floors: 'Этажность',
        timing: 'Сроки',
        land: 'Участок',
        payment: 'Оплата'
    };

    const state = {
        current: 0,
        answers: {}
    };

    let elements = null;
    const trackedGoals = new Set();

    function init() {
        const root = document.getElementById('quizRoot');
        if (!root) return;

        elements = {
            root,
            progress: root.querySelector('.quiz-progress'),
            stepsContainer: root.querySelector('.quiz-steps'),
            stepLabel: root.querySelector('.quiz-step-label'),
            prevBtn: root.querySelector('.quiz-btn-prev'),
            nextBtn: root.querySelector('.quiz-btn-next'),
            submitBtn: root.querySelector('.quiz-btn-submit'),
            success: root.querySelector('.quiz-success'),
            card: root.querySelector('.quiz-card'),
            form: root.querySelector('#quizFinalForm')
        };

        renderSteps();
        wireNav();
        wireForm();
        showStep(0);
        wireFirstStepTracking();
    }

    function renderSteps() {
        const container = elements.stepsContainer;
        const totalSteps = QUIZ_STEPS.length + 1;

        QUIZ_STEPS.forEach((step, idx) => {
            const stepEl = document.createElement('div');
            stepEl.className = 'quiz-step';
            stepEl.dataset.step = idx;

            const q = document.createElement('h3');
            q.className = 'quiz-question';
            q.textContent = step.question;
            stepEl.appendChild(q);

            const opts = document.createElement('div');
            opts.className = 'quiz-options';
            step.options.forEach((opt, optIdx) => {
                const label = document.createElement('label');
                label.className = 'quiz-option';
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `q_${step.id}`;
                input.value = opt;
                input.dataset.stepIdx = idx;
                input.addEventListener('change', () => {
                    state.answers[step.id] = opt;
                    if (idx === 0) trackQuizStep(0);
                    updateNavState();
                });
                const bullet = document.createElement('span');
                bullet.className = 'quiz-option-bullet';
                const text = document.createElement('span');
                text.className = 'quiz-option-text';
                text.textContent = opt;
                label.appendChild(input);
                label.appendChild(bullet);
                label.appendChild(text);
                opts.appendChild(label);
            });
            stepEl.appendChild(opts);
            container.appendChild(stepEl);
        });

        // Final step — contact form (already in HTML, just mark it)
        const finalStep = container.querySelector('.quiz-step-final');
        if (finalStep) {
            finalStep.dataset.step = QUIZ_STEPS.length;
        }

        elements.totalSteps = totalSteps;
    }

    function wireNav() {
        elements.prevBtn.addEventListener('click', () => {
            if (state.current > 0) showStep(state.current - 1);
        });
        elements.nextBtn.addEventListener('click', () => {
            const step = QUIZ_STEPS[state.current];
            if (step && !state.answers[step.id]) return;
            if (state.current < QUIZ_STEPS.length) showStep(state.current + 1);
        });
    }

    function wireForm() {
        if (!elements.form) return;
        elements.form.addEventListener('submit', handleSubmit);
    }

    function showStep(idx) {
        state.current = idx;
        const steps = elements.stepsContainer.querySelectorAll('.quiz-step');
        steps.forEach((el) => el.classList.remove('active'));
        const target = elements.stepsContainer.querySelector(`.quiz-step[data-step="${idx}"]`);
        if (target) target.classList.add('active');

        const totalForProgress = QUIZ_STEPS.length;
        const pct = Math.min(100, Math.round(((idx + 1) / (totalForProgress + 1)) * 100));
        elements.progress.style.width = pct + '%';

        elements.stepLabel.textContent = `Шаг: ${Math.min(idx + 1, totalForProgress + 1)}/${totalForProgress + 1}`;

        const isFinal = idx === QUIZ_STEPS.length;
        elements.nextBtn.style.display = isFinal ? 'none' : '';
        elements.submitBtn.style.display = isFinal ? '' : 'none';
        elements.prevBtn.disabled = idx === 0;

        updateNavState();

        if (idx > 0) trackQuizStep(idx);
    }

    function wireFirstStepTracking() {
        const section = elements.root.closest('.quiz-section') || elements.root;
        const trackFirstStep = () => trackQuizStep(0);

        ['pointerdown', 'focusin', 'keydown', 'touchstart'].forEach((eventName) => {
            section.addEventListener(eventName, trackFirstStep, { once: true, passive: true });
        });

        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                trackFirstStep();
                observer.disconnect();
            }
        }, { threshold: 0.35 });

        observer.observe(section);
    }

    function trackQuizStep(idx) {
        trackQuizGoal('quiz_step_' + (idx + 1), { step: idx + 1 });
    }

    function trackQuizGoal(goal, params) {
        if (!goal || trackedGoals.has(goal)) return;
        trackedGoals.add(goal);

        const payload = Object.assign({
            page: window.location.pathname,
            quiz: 'kleeniy-brus'
        }, params || {});

        if (typeof window.runorthReachGoal === 'function') {
            window.runorthReachGoal(goal, payload);
            return;
        }

        try {
            if (typeof window.ym === 'function') {
                window.ym(24341083, 'reachGoal', goal, payload);
            }
        } catch (e) {}

        sendVkGoal(goal, payload);
    }

    function sendVkGoal(goal, params) {
        try {
            if (typeof window.vkGoal === 'function') {
                window.vkGoal(goal, params);
                return;
            }

            const _tmr = window._tmr || (window._tmr = []);
            const event = { type: 'reachGoal', id: '3769884', goal };
            if (params) event.params = params;
            _tmr.push(event);
        } catch (e) {}
    }

    function updateNavState() {
        const step = QUIZ_STEPS[state.current];
        if (!step) {
            elements.nextBtn.disabled = false;
            return;
        }
        elements.nextBtn.disabled = !state.answers[step.id];
    }

    function buildQuizSummary() {
        return Object.entries(state.answers)
            .map(([key, val]) => `${LABELS[key] || key}: ${val}`)
            .join('\n');
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const nameInput = form.querySelector('input[name="name"]');
        const phoneInput = form.querySelector('input[name="phone"]');

        if (typeof window.validatePhone === 'function' && !window.validatePhone(phoneInput.value)) {
            alert('Пожалуйста, введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX');
            phoneInput.focus();
            return;
        }

        const submitBtn = elements.submitBtn;
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        const quizSummary = buildQuizSummary();
        const effectiveUTM = typeof window.getEffectiveUTM === 'function' ? window.getEffectiveUTM() : {};
        const urlParams = new URLSearchParams(window.location.search);
        const roistatParams = typeof window.getRoistatParams === 'function' ? window.getRoistatParams(urlParams) : {};

        const formData = {
            phone: phoneInput.value,
            name: nameInput ? nameInput.value : '',
            formSource: 'quiz-главная',
            quizAnswers: quizSummary,
            utm_source: effectiveUTM.utm_source || '',
            utm_medium: effectiveUTM.utm_medium || '',
            utm_campaign: effectiveUTM.utm_campaign || '',
            utm_content: effectiveUTM.utm_content || '',
            utm_term: effectiveUTM.utm_term || '',
            roistat_visit: typeof window.getRoistatVisit === 'function' ? window.getRoistatVisit() : '',
            roistat_marker: roistatParams.roistat || '',
            roistat_referrer: roistatParams.roistat_referrer || '',
            roistat_pos: roistatParams.roistat_pos || '',
            yclid: urlParams.get('yclid') || '',
            gclid: urlParams.get('gclid') || '',
            referrer: document.referrer || 'Прямой заход'
        };

        try {
            if (typeof window.sendToBitrix24 !== 'function') {
                console.warn('sendToBitrix24 not available — quiz lead:', formData);
                trackQuizGoal('quiz_submit', {
                    step: QUIZ_STEPS.length + 1,
                    answersCount: Object.keys(state.answers).length
                });
                onSuccess();
                return;
            }
            const result = await window.sendToBitrix24(formData);
            if (result.success || result.demo) {
                trackQuizGoal('quiz_submit', {
                    step: QUIZ_STEPS.length + 1,
                    answersCount: Object.keys(state.answers).length
                });
                onSuccess();
            } else {
                console.error('Quiz lead failed:', result);
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                alert('Произошла ошибка отправки. Пожалуйста, позвоните нам напрямую.');
            }
        } catch (err) {
            console.error('Quiz submit error:', err);
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    function onSuccess() {
        elements.card.style.display = 'none';
        elements.success.classList.add('active');
        setTimeout(() => {
            window.location.href = '/thank-you';
        }, 1500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
