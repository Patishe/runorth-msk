(function () {
    'use strict';
    const endpoint = 'https://runorth.ru/api/lead-submit.php';

    function requestId(form) {
        if (form && form.dataset.leadRequestId) return form.dataset.leadRequestId;
        const bytes = new Uint8Array(16);
        window.crypto.getRandomValues(bytes);
        const id = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
        if (form) {
            form.dataset.leadRequestId = id;
            if (!form.dataset.leadRequestListener) {
                form.addEventListener('input', () => { delete form.dataset.leadRequestId; });
                form.dataset.leadRequestListener = '1';
            }
        }
        return id;
    }

    async function submit(fields, source, form, selectedObject) {
        const body = new URLSearchParams();
        Object.entries(fields).forEach(([key, value]) => body.set(key, value == null ? '' : String(value)));
        body.set('request_id', requestId(form));
        body.set('form_source', source || 'Заявка');
        body.set('selected_object', selectedObject || '');
        const response = await fetch(endpoint, {
            method: 'POST',
            credentials: 'omit',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: body.toString(),
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || 'lead_delivery_pending');
        if (form) delete form.dataset.leadRequestId;
        return { success: true };
    }

    window.RunorthLeadDelivery = { submit };
})();
