(() => {
  "use strict";

  const deadline = Date.parse("2026-12-01T00:00:00+03:00");
  const header = document.querySelector("header.header");
  if (!header || Date.now() >= deadline) return;

  const title = "Акция «Миллион на стройку»";
  const formTitle = "Заявка на участие в конкурсе";
  const formSource = "Заявка на конкурс «Миллион»";
  const sessionKey = "runorth_contest_shown_2026";
  const dismissedKey = "runorth_contest_dismissed_2026";
  const applyParameter = "million-contest";
  const gift = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11h16v10H4zM3 7h18v4H3zM12 7v14M12 7H8.5A2.5 2.5 0 1 1 11 4.5L12 7Zm0 0h3.5A2.5 2.5 0 1 0 13 4.5L12 7Z"/></svg>';
  const cross = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';

  function readSession(key) {
    try {
      return sessionStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  }

  function writeSession(key) {
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      // The current page still keeps its state.
    }
  }

  function wasShown() {
    return document.cookie.split(";").some(cookie => cookie.trim() === sessionKey + "=1") || readSession(sessionKey);
  }

  function rememberDisplay() {
    const domain = /^(?:(?:www\.)?(?:msk\.)?)runorth\.ru$/.test(location.hostname) ? "; Domain=runorth.ru" : "";
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = sessionKey + "=1; Path=/; SameSite=Lax" + domain + secure;
    writeSession(sessionKey);
  }

  const promo = document.createElement("div");
  promo.className = "home-contest-promo";
  promo.dataset.open = "false";
  promo.dataset.mobileDisplay = readSession(dismissedKey) ? "dismissed" : wasShown() ? "minimized" : "pending";
  promo.innerHTML = `
    <div class="home-contest-promo__actions">
      <button class="home-contest-trigger" type="button" aria-haspopup="dialog" aria-expanded="false">
        <span class="home-contest-trigger__desktop home-contest-promo__copy">
          ${gift}<strong>${title}</strong>
          <span>Получи <strong class="home-contest-promo__amount">1 000 000 ₽</strong> на строительство дома до конца года</span>
        </span>
        <span class="home-contest-trigger__desktop home-contest-trigger__cta">Узнать больше <span aria-hidden="true">→</span></span>
        <span class="home-contest-trigger__mobile">${gift}${title}</span>
      </button>
      <button class="home-contest-promo__dismiss" type="button" aria-label="Убрать плашку акции">${cross}</button>
    </div>`;

  const overlay = document.createElement("div");
  overlay.className = "home-contest";
  overlay.hidden = true;
  overlay.innerHTML = `
    <section class="home-contest__dialog" role="dialog" aria-modal="true" aria-labelledby="home-contest-title">
      <button class="home-contest__close" type="button" aria-label="Закрыть окно конкурса">${cross}</button>
      <div class="home-contest__scroll" tabindex="0" role="region" aria-label="Условия акции и призы">
        <img class="home-contest__banner" width="1120" height="631" fetchpriority="high" alt="">
        <div class="home-contest__content">
          <h2 id="home-contest-title">${title}</h2>
          <p class="home-contest__instructions">Оставляй заявку в любой форме на сайте и участвуй в розыгрыше подарков.</p>
          <div class="home-contest__gift">
            ${gift}<p><span>Подарок каждому участнику</span><strong>Выезд команды на осмотр участка</strong></p>
          </div>
          <ol class="home-contest__prize-list">
            <li><span class="home-contest__place">1 место</span><div><strong>Скидка 1 000 000 ₽</strong><p>При заключении договора на строительство дома по типовому проекту</p></div></li>
            <li><span class="home-contest__place">2 место</span><strong>Индивидуальное проектирование</strong></li>
            <li><span class="home-contest__place">3 место</span><strong>Геология и топосъёмка</strong></li>
          </ol>
        </div>
      </div>
      <div class="home-contest__actions">
        <p class="home-contest__deadline">1 декабря выберем победителей. Чтобы закрепить скидку, заключите договор до конца года.</p>
        <button class="home-contest__apply" type="button" aria-haspopup="dialog">Оставить заявку</button>
        <p class="home-contest__disclaimer">НЕ СУММИРУЕТСЯ С ДРУГИМИ АКЦИЯМИ</p>
      </div>
    </section>`;

  document.body.classList.add("runorth-contest-active");
  header.prepend(promo);
  document.body.append(overlay);

  const trigger = promo.querySelector(".home-contest-trigger");
  const closeButton = overlay.querySelector(".home-contest__close");
  const image = overlay.querySelector(".home-contest__banner");
  let previousOverflow = "";
  let timer;

  function stopTimer() {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", schedule);
  }

  function openContest() {
    if (!overlay.hidden || Date.now() >= deadline) return;
    stopTimer();
    rememberDisplay();
    if (!image.hasAttribute("src")) image.src = "/contest-million/popup-banner.webp";
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    promo.dataset.open = "true";
    trigger.setAttribute("aria-expanded", "true");
    overlay.hidden = false;
    closeButton.focus({preventScroll: true});
  }

  function closeContest() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.overflow = previousOverflow;
    promo.dataset.open = "false";
    trigger.setAttribute("aria-expanded", "false");
    if (promo.dataset.mobileDisplay === "pending") promo.dataset.mobileDisplay = "minimized";
    trigger.focus({preventScroll: true});
  }

  function openApplication() {
    const form = document.getElementById("modalForm");
    if (typeof window.openModal !== "function" || !form) {
      const target = new URL(location.href);
      target.pathname = "/";
      target.searchParams.set(applyParameter, "apply");
      target.hash = "";
      location.assign(target.href);
      return;
    }

    stopTimer();
    rememberDisplay();
    if (promo.dataset.mobileDisplay === "pending") promo.dataset.mobileDisplay = "minimized";
    window.openModal(formTitle, formSource);
    const source = form.querySelector('[name="form_source"]');
    if (source) source.value = formSource;
    form.querySelector('input:not([type="hidden"])')?.focus({preventScroll: true});
  }

  function showOnce() {
    if (document.hidden) return;
    if (wasShown()) {
      stopTimer();
      if (promo.dataset.mobileDisplay === "pending") promo.dataset.mobileDisplay = "minimized";
      return;
    }
    openContest();
  }

  function showWhenAvailable() {
    if (document.hidden) return;
    const otherDialog = Array.from(document.querySelectorAll('.modal, [aria-modal="true"]')).some(element =>
      !overlay.contains(element) && element.getClientRects().length && !element.closest('[aria-hidden="true"], [hidden]') &&
      getComputedStyle(element).visibility !== "hidden"
    );
    if (document.body.style.overflow === "hidden" || otherDialog) {
      timer = setTimeout(showWhenAvailable, 1200);
      return;
    }
    if (navigator.locks) navigator.locks.request(sessionKey, showOnce).catch(showOnce);
    else showOnce();
  }

  function schedule() {
    clearTimeout(timer);
    if (!document.hidden) timer = setTimeout(showWhenAvailable, 10000);
  }

  trigger.addEventListener("click", openContest);
  closeButton.addEventListener("click", closeContest);
  promo.querySelector(".home-contest-promo__dismiss").addEventListener("click", () => {
    promo.dataset.mobileDisplay = "dismissed";
    writeSession(dismissedKey);
    header.querySelector("a")?.focus({preventScroll: true});
  });
  overlay.querySelector(".home-contest__apply").addEventListener("click", () => {
    closeContest();
    openApplication();
  });
  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeContest();
  });
  overlay.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeContest();
    }
    if (event.key !== "Tab") return;
    const focusable = overlay.querySelectorAll('button, [tabindex="0"]');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const url = new URL(location.href);
  if (url.pathname === "/" && url.searchParams.get(applyParameter) === "apply") {
    url.searchParams.delete(applyParameter);
    history.replaceState(history.state, "", url);
    openApplication();
  } else if (promo.dataset.mobileDisplay === "pending") {
    document.addEventListener("visibilitychange", schedule);
    schedule();
  }
})();
