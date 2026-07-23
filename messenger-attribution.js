// Passes complete acquisition data to Telegram/MAX through a short server token.
(function initMessengerAttribution() {
    'use strict';

    const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    const LINK_SELECTOR = 'a[data-chat-bot="telegram"], a[data-chat-bot="max"]';
    const SITE_CODE = 'msk';
    const TOKEN_SITE_CODE = 'm';
    const STORAGE_KEY = 'runorth_utm';
    const CLICK_STORAGE_KEY = 'runorth_click';
    const ROISTAT_STORAGE_KEY = 'runorth_roistat';
    const ENDPOINT = '/api/messenger-attribution.php';
    const MAX_PAYLOAD_LENGTH = 64;

    function readJsonStorage(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || '{}');
        } catch (error) {
            return {};
        }
    }

    function getEffectiveUTM() {
        const params = new URLSearchParams(window.location.search);
        const stored = readJsonStorage(STORAGE_KEY);
        const effective = {};
        let hasCurrentUTM = false;

        UTM_KEYS.forEach((key) => {
            const current = params.get(key) || '';
            effective[key] = current || stored[key] || '';
            hasCurrentUTM = hasCurrentUTM || Boolean(current);
        });

        if (hasCurrentUTM) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(effective));
            } catch (error) {
                // Attribution still works for the current page without storage.
            }
        }

        return effective;
    }

    function normalizeValue(value, fallback) {
        const normalized = String(value || '')
            .toLowerCase()
            .normalize('NFKD')
            .replace(/[^\x00-\x7F]/g, '')
            .replace(/[^a-z0-9]+/g, '');

        return normalized || fallback || '';
    }

    function getPageCode() {
        const pathname = window.location.pathname.replace(/\/+$/, '');
        const lastSegment = pathname.split('/').filter(Boolean).pop() || 'home';
        const page = normalizeValue(lastSegment.replace(/\.[^.]+$/, ''), 'home');
        return normalizeValue(SITE_CODE + page, SITE_CODE + 'home');
    }

    function getPlacement(link) {
        return link.closest('.footer') ? 'footer' : 'header';
    }

    function assemblePayload(segments) {
        return ['r1']
            .concat(segments.filter((segment) => segment.value).map((segment) => segment.key + segment.value))
            .join('-');
    }

    function buildPayload(utm, placement) {
        const segments = [
            { key: 'p', value: placement, min: placement.length },
            { key: 's', value: normalizeValue(utm.utm_source, 'direct'), min: 4 },
            { key: 'm', value: normalizeValue(utm.utm_medium, 'site'), min: 3 },
            { key: 'c', value: normalizeValue(utm.utm_campaign, 'chat'), min: 4 },
            { key: 'o', value: normalizeValue(utm.utm_content, ''), min: 0 },
            { key: 't', value: normalizeValue(utm.utm_term, ''), min: 0 },
            { key: 'g', value: getPageCode(), min: 4 }
        ];
        const trimOrder = [5, 4, 6, 3, 2, 1];
        let payload = assemblePayload(segments);

        while (payload.length > MAX_PAYLOAD_LENGTH) {
            const index = trimOrder.find((item) => segments[item].value.length > segments[item].min);
            if (index === undefined) break;
            segments[index].value = segments[index].value.slice(0, -1);
            payload = assemblePayload(segments);
        }

        return payload.slice(0, MAX_PAYLOAD_LENGTH);
    }

    function readCookie(name) {
        const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : '';
    }

    function getRoistatVisit() {
        try {
            if (window.roistat && typeof window.roistat.getVisit === 'function') {
                return String(window.roistat.getVisit() || '');
            }
        } catch (error) {
            // Fall back to the Roistat cookie.
        }
        return readCookie('roistat_visit');
    }

    function buildContext(link) {
        const params = new URLSearchParams(window.location.search);
        const click = readJsonStorage(CLICK_STORAGE_KEY);
        const roistat = readJsonStorage(ROISTAT_STORAGE_KEY);

        return {
            utm: getEffectiveUTM(),
            page_path: window.location.pathname || '/',
            page_url: window.location.href,
            placement: getPlacement(link),
            referrer: document.referrer || '',
            roistat_visit: getRoistatVisit(),
            roistat_marker: params.get('roistat') || roistat.roistat || '',
            roistat_referrer: params.get('roistat_referrer') || roistat.roistat_referrer || '',
            roistat_pos: params.get('roistat_pos') || roistat.roistat_pos || '',
            yandex_client_id: readCookie('_ym_uid'),
            yclid: params.get('yclid') || click.yclid || '',
            gclid: params.get('gclid') || click.gclid || ''
        };
    }

    function botBaseUrl(bot) {
        return bot === 'telegram'
            ? 'https://t.me/info_nordsrub_bot'
            : 'https://max.ru/id7811659615_bot';
    }

    function botUrl(bot, payload) {
        const url = new URL(botBaseUrl(bot));
        url.searchParams.set('start', payload);
        return url.toString();
    }

    async function registerContext(context) {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(context),
            credentials: 'same-origin',
            cache: 'no-store'
        });
        if (!response.ok) throw new Error('Attribution registration failed');
        const result = await response.json();
        if (!result || !/^[a-f0-9]{32}$/.test(result.token || '')) {
            throw new Error('Invalid attribution token');
        }
        return result.token;
    }

    function updateFallbackLink(link) {
        const fallback = buildPayload(getEffectiveUTM(), getPlacement(link));
        link.href = botUrl(link.dataset.chatBot, fallback);
    }

    function handleBotClick(event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        const link = event.currentTarget;
        event.preventDefault();

        const fallbackUrl = link.href;
        const popup = window.open('', '_blank');
        if (popup) popup.opener = null;
        let completed = false;

        const navigate = (url) => {
            if (completed) return;
            completed = true;
            if (popup && !popup.closed) popup.location.replace(url);
            else window.location.assign(url);
        };

        const fallbackTimer = window.setTimeout(() => navigate(fallbackUrl), 4000);
        registerContext(buildContext(link))
            .then((token) => {
                window.clearTimeout(fallbackTimer);
                navigate(botUrl(link.dataset.chatBot, `m2-${TOKEN_SITE_CODE}-${token}`));
            })
            .catch(() => {
                window.clearTimeout(fallbackTimer);
                navigate(fallbackUrl);
            });
    }

    function initializeLinks() {
        document.querySelectorAll(LINK_SELECTOR).forEach((link) => {
            updateFallbackLink(link);
            link.addEventListener('click', handleBotClick);
        });
    }

    window.runorthBuildMessengerPayload = buildPayload;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLinks, { once: true });
    } else {
        initializeLinks();
    }
})();
