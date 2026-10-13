<?php
/** Shared promotion for the Saint Petersburg and Moscow landings. */
function runorth_glulam_promo_active(): bool
{
    return time() < strtotime('2027-01-01T00:00:00+03:00');
}

function runorth_glulam_promo_note(): void
{
    if (!runorth_glulam_promo_active()) return;
    ?>
    <div class="glulam-promo-note">
        <div>
            <strong>Скидка 10% на домокомплект из клеёного бруса</strong>
            <p>При заключении договора на строительство до 31.12.2026. <a href="https://nordsrub.ru/skidka-10-na-domokomplekt/" target="_blank" rel="noopener">Условия акции</a></p>
        </div>
        <input type="hidden" name="promotion" value="Акция: скидка 10% на домокомплект из клеёного бруса при заключении договора на строительство до 31.12.2026">
    </div>
    <?php
}

function runorth_glulam_promo_banner(): void
{
    if (!runorth_glulam_promo_active()) return;
    ?>
    <section class="glulam-promo" id="domokomplekt-promo" aria-labelledby="glulam-promo-title">
        <div class="container">
            <div class="glulam-promo__card">
                <div class="glulam-promo__body">
                    <p class="glulam-promo__deadline">Акция до 31 декабря 2026</p>
                    <h2 id="glulam-promo-title">Скидка 10% на домокомплект из клеёного бруса</h2>
                    <p class="glulam-promo__lead">Заключите договор на строительство до конца года — заводской стеновой комплект вашего дома обойдётся на 10% дешевле.</p>
                    <p class="glulam-promo__detail">Для типовых и индивидуальных проектов. Сумму скидки рассчитаем по смете и зафиксируем в договоре.</p>
                    <div class="glulam-promo__actions">
                        <button type="button" class="btn btn-primary" onclick="openModal('Получить расчёт со скидкой'); return false;">Получить расчёт со скидкой</button>
                        <a href="https://nordsrub.ru/skidka-10-na-domokomplekt/" target="_blank" rel="noopener">Условия акции <span aria-hidden="true">↗</span></a>
                    </div>
                </div>
                <div class="glulam-promo__media">
                    <img src="images/glulam-promo-timber.webp" alt="Стеновой комплект из клеёного бруса на производстве" width="960" height="640" loading="lazy" decoding="async">
                    <span class="glulam-promo__figure" aria-hidden="true">−10<small>%</small></span>
                    <span class="glulam-promo__caption">На заводской стеновой комплект</span>
                </div>
            </div>
        </div>
    </section>
    <?php
}
