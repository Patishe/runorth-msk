// Adds the current acquisition context to Telegram/MAX bot deep links.
//
// Payload contract for the bot integration:
// r1-p<header|footer>-s<utm_source>-m<utm_medium>-c<utm_campaign>
//    -o<utm_content>-t<utm_term>-g<site+page>
//
// Empty optional segments are omitted. Values are normalized to ASCII letters
// and digits, and the complete payload is capped at Telegram's 64-char limit.
(function initMessengerAttribution() {
    'use strict';

    const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    const LINK_SELECTOR = 'a[data-chat-bot="telegram"], a[data-chat-bot="max"]';
    const STORAGE_KEY = 'runorth_utm';
    const SITE_CODE = 'msk';
    const MAX_PAYLOAD_LENGTH = 64;
    const CYRILLIC_MAP = {
        а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh',
        з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
        п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts',
        ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu',
        я: 'ya'
    };

    function readStoredUTM() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch (error) {
            return {};
        }
    }

    function getEffectiveUTM() {
        const params = new URLSearchParams(window.location.search);
        const stored = readStoredUTM();
        const current = {};
        const effective = {};
        let hasCurrentUTM = false;

        UTM_KEYS.forEach((key) => {
            current[key] = params.get(key) || '';
            effective[key] = current[key] || stored[key] || '';
            hasCurrentUTM = hasCurrentUTM || Boolean(current[key]);
        });

        if (hasCurrentUTM) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(effective));
            } catch (error) {
                // Deep links still work when storage is unavailable.
            }
        }

        return effective;
    }

    function normalizeValue(value, fallback) {
        const normalized = String(value || '')
            .toLowerCase()
            .replace(/[а-яё]/g, (letter) => CYRILLIC_MAP[letter] || '')
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

        // Preserve source/medium/campaign first. Less important values are
        // shortened before the core attribution fields.
        const trimOrder = [5, 4, 6, 3, 2, 1];
        let payload = assemblePayload(segments);

        while (payload.length > MAX_PAYLOAD_LENGTH) {
            const segmentIndex = trimOrder.find((index) => segments[index].value.length > segments[index].min);
            if (segmentIndex === undefined) break;
            segments[segmentIndex].value = segments[segmentIndex].value.slice(0, -1);
            payload = assemblePayload(segments);
        }

        return payload.slice(0, MAX_PAYLOAD_LENGTH);
    }

    function updateBotLinks() {
        const utm = getEffectiveUTM();

        document.querySelectorAll(LINK_SELECTOR).forEach((link) => {
            const bot = link.dataset.chatBot;
            const baseUrl = bot === 'telegram'
                ? 'https://t.me/info_nordsrub_bot'
                : 'https://max.ru/id7811659615_bot';
            const payload = buildPayload(utm, getPlacement(link));
            const url = new URL(baseUrl);

            url.searchParams.set('start', payload);
            link.href = url.toString();
        });
    }

    window.runorthBuildMessengerPayload = buildPayload;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateBotLinks, { once: true });
    } else {
        updateBotLinks();
    }
})();
