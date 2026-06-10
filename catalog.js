const catalogProjects = [
    { name: 'Давос', floors: 1, area: 130, price: 10339000, priceMonth: 49590, bedrooms: 3, bathrooms: 2, terrace: 31, options: ['sauna', 'terrace'], description: 'Компактный одноэтажный дом с сауной и широкой террасой для тихих вечеров у леса.', images: ['images/1/Davos/1.jpg', 'images/1/Davos/2.jpg', 'images/1/Davos/3.jpg', 'images/1/Davos/4.png'] },
    { name: 'Фрибур', floors: 1, area: 115, price: 9284251, priceMonth: 44531, bedrooms: 3, bathrooms: 1, terrace: 25, options: ['terrace'], description: 'Лаконичный дом для постоянной жизни с удобной террасой и рациональной планировкой без лишних коридоров.', images: ['images/1/Fribur/1.jpg', 'images/1/Fribur/2.jpg', 'images/1/Fribur/3.png', 'images/1/Fribur/4.png'] },
    { name: 'Аркенстон', floors: 1, area: 139, price: 11989000, priceMonth: 57504, bedrooms: 3, bathrooms: 2, terrace: 34, options: ['terrace'], description: 'Одноэтажный проект с выразительной архитектурой и террасой для завтраков на свежем воздухе.', images: ['images/1/Arcenston/1.jpg', 'images/1/Arcenston/2.jpg', 'images/1/Arcenston/3.jpg', 'images/1/Arcenston/4.jpg'] },
    { name: 'Бруклин', floors: 1, area: 172, price: 11198842, priceMonth: 53714, bedrooms: 3, bathrooms: 2, terrace: 50, options: ['terrace'], description: 'Просторный одноэтажный дом с большой террасой, созданный для отдыха и встреч с близкими.', images: ['images/1/Bruklin/1.jpg', 'images/1/Bruklin/2.jpg', 'images/1/Bruklin/3.png', 'images/1/Bruklin/4.png'] },
    { name: 'Бостон', floors: 2, area: 170, price: 10324500, priceMonth: 49520, bedrooms: 4, bathrooms: 2, terrace: 49, options: ['terrace'], description: 'Двухэтажный проект для большой семьи: приватные спальни наверху и просторная общая зона внизу.', images: ['images/2/Boston/1.webp', 'images/2/Boston/2.webp', 'images/2/Boston/3.webp', 'images/2/Boston/4.webp', 'images/2/Boston/5.webp'] },
    { name: 'Цюрих', floors: 2, area: 135, price: 10235000, priceMonth: 49091, bedrooms: 4, bathrooms: 3, terrace: 56, options: ['terrace'], description: 'Современный двухэтажный дом с четырьмя спальнями, где легко разместить семью и гостей.', images: ['images/2/Curih/1.jpg', 'images/2/Curih/2.jpg', 'images/2/Curih/3.png', 'images/2/Curih/4.png', 'images/2/Curih/5.png'] },
    { name: 'Хедаль', floors: 2, area: 153, price: 11660000, priceMonth: 55926, bedrooms: 3, bathrooms: 2, terrace: 38, options: ['terrace'], description: 'Сбалансированный двухэтажный дом с тремя спальнями и спокойным семейным сценарием жизни.', images: ['images/2/Hedal/1.jpg', 'images/2/Hedal/2.jpg', 'images/2/Hedal/3.jpg', 'images/2/Hedal/4.jpg', 'images/2/Hedal/5.png'] },
    { name: 'Мюнхен', url: '/projects/kleeniy-brus/munchen', floors: 2, area: 208, price: 13308568, priceMonth: 63834, bedrooms: 4, bathrooms: 3, terrace: 29, options: ['terrace'], description: 'Вместительный двухэтажный проект из клееного бруса с четырьмя спальнями, террасой и выразительной премиальной архитектурой.', images: ['images/2/Munhen/1.jpg', 'images/2/Munhen/2.jpg', 'images/2/Munhen/3.png', 'images/2/Munhen/4.png', 'images/2/Munhen/5.png'] },
    { name: 'Милан', floors: 1, area: 113, price: 8063616, priceMonth: 38677, bedrooms: 3, bathrooms: 1, terrace: 26, options: ['terrace'], description: 'Небольшой и аккуратный дом с тремя спальнями для комфортной загородной жизни без переплаты за метры.', images: ['images/1/Milan/1.jpg', 'images/1/Milan/2.jpg', 'images/1/Milan/3.png', 'images/1/Milan/4.png'] },
    { name: 'Чикаго', floors: 1, area: 198, price: 13450000, priceMonth: 64512, bedrooms: 3, bathrooms: 2, terrace: 40, options: ['terrace'], description: 'Одноэтажный дом увеличенной площади с тремя спальнями и щедрой террасой для летней кухни.', images: ['images/1/Chicago/1.jpg', 'images/1/Chicago/2.jpg', 'images/1/Chicago/3.png', 'images/1/Chicago/4.png'] },
    { name: 'Гренобль', floors: 1, area: 140, price: 11250000, priceMonth: 53960, bedrooms: 2, bathrooms: 2, terrace: 38, options: ['terrace'], description: 'Уютный проект с двумя спальнями, двумя санузлами и террасой для неспешного загородного ритма.', images: ['images/1/Grenobl/1.jpg', 'images/1/Grenobl/2.jpg', 'images/1/Grenobl/3.png'] },
    { name: 'Афины', floors: 1, area: 205, price: 14750000, priceMonth: 70747, bedrooms: 4, bathrooms: 3, terrace: 56, options: ['terrace'], description: 'Светлый одноэтажный дом для большой семьи с четырьмя спальнями и просторной террасой.', images: ['images/1/Afini/1.png', 'images/1/Afini/2.png', 'images/1/Afini/3.jpg', 'images/1/Afini/4.jpg', 'images/1/Afini/5.jpg'] },
    { name: 'Спарта', floors: 2, area: 144, price: 10890000, priceMonth: 52233, bedrooms: 3, bathrooms: 2, terrace: 56, options: ['terrace'], description: 'Динамичный двухэтажный проект с террасой, где общая зона и приватные комнаты разведены по уровням.', images: ['images/2/Sparta/1.png', 'images/2/Sparta/2.png', 'images/2/Sparta/3.jpg', 'images/2/Sparta/4.jpg'] },
    { name: 'Берген', floors: 2, area: 200, price: 13250000, priceMonth: 63552, bedrooms: 4, bathrooms: 4, terrace: 32, options: ['terrace'], description: 'Солидный двухэтажный дом с четырьмя спальнями и санузлами для каждого ежедневного сценария.', images: ['images/2/Bergen/1.jpg', 'images/2/Bergen/2.jpg', 'images/2/Bergen/3.png', 'images/2/Bergen/4.png', 'images/2/Bergen/5.png'] },
    { name: 'Амстердам', floors: 2, area: 285, price: 18950000, priceMonth: 90892, bedrooms: 4, bathrooms: 3, terrace: 52, options: ['terrace'], description: 'Представительный дом с большой площадью, четырьмя спальнями и террасой для приёма гостей.', images: ['images/2/Amsterdam/1.jpg', 'images/2/Amsterdam/2.jpg', 'images/2/Amsterdam/3.jpg', 'images/2/Amsterdam/4.png', 'images/2/Amsterdam/5.png'] },
    { name: 'Детройт', floors: 2, area: 174, price: 12450000, priceMonth: 59715, bedrooms: 4, bathrooms: 2, terrace: 62, options: ['terrace'], description: 'Современный двухэтажный проект с четырьмя спальнями и большой террасой для активной семьи.', images: ['images/2/Detroit/2.jpg', 'images/2/Detroit/1.jpg', 'images/2/Detroit/3.png', 'images/2/Detroit/4.png', 'images/2/Detroit/5.png'] }
];

let catalogSortValue = 'default';

const catalogSortLabels = {
    default: 'По умолчанию',
    'price-asc': 'по возрастанию цены',
    'price-desc': 'по убыванию цены'
};

function formatPrice(value) {
    return new Intl.NumberFormat('ru-RU').format(value);
}

function formatPriceMillions(value) {
    return (value / 1000000).toLocaleString('ru-RU', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
}

function catalogRanges() {
    const areas = catalogProjects.map(project => project.area);
    const prices = catalogProjects.map(project => project.price / 1000000);

    return {
        areaMin: Math.min(...areas),
        areaMax: Math.max(...areas),
        priceMin: Math.floor(Math.min(...prices) * 10) / 10,
        priceMax: Math.ceil(Math.max(...prices) * 10) / 10
    };
}

function setRangeInputBounds() {
    const ranges = catalogRanges();
    const inputs = {
        areaMin: document.getElementById('areaMin'),
        areaMax: document.getElementById('areaMax'),
        priceMin: document.getElementById('priceMin'),
        priceMax: document.getElementById('priceMax')
    };

    inputs.areaMin.min = ranges.areaMin;
    inputs.areaMin.max = ranges.areaMax;
    inputs.areaMin.placeholder = ranges.areaMin;
    inputs.areaMin.value = ranges.areaMin;

    inputs.areaMax.min = ranges.areaMin;
    inputs.areaMax.max = ranges.areaMax;
    inputs.areaMax.placeholder = ranges.areaMax;
    inputs.areaMax.value = ranges.areaMax;

    inputs.priceMin.min = ranges.priceMin;
    inputs.priceMin.max = ranges.priceMax;
    inputs.priceMin.placeholder = ranges.priceMin;
    inputs.priceMin.value = ranges.priceMin;

    inputs.priceMax.min = ranges.priceMin;
    inputs.priceMax.max = ranges.priceMax;
    inputs.priceMax.placeholder = ranges.priceMax;
    inputs.priceMax.value = ranges.priceMax;

    updateRangeControls();
}

function formatRangeNumber(value) {
    return Number(value).toLocaleString('ru-RU', { maximumFractionDigits: 1 });
}

function updateRangePair(minId, maxId, minValueId, maxValueId, suffix) {
    const minInput = document.getElementById(minId);
    const maxInput = document.getElementById(maxId);
    const minOutput = document.getElementById(minValueId);
    const maxOutput = document.getElementById(maxValueId);
    const slider = minInput.closest('.catalog-slider');
    const track = slider.querySelector('.catalog-slider-track');

    if (Number(minInput.value) > Number(maxInput.value)) {
        const active = document.activeElement === minInput ? minInput : maxInput;
        if (active === minInput) maxInput.value = minInput.value;
        if (active === maxInput) minInput.value = maxInput.value;
    }

    const min = Number(minInput.min);
    const max = Number(minInput.max);
    const left = ((Number(minInput.value) - min) / (max - min)) * 100;
    const right = 100 - ((Number(maxInput.value) - min) / (max - min)) * 100;

    track.style.left = `${left}%`;
    track.style.right = `${right}%`;
    minOutput.textContent = `от ${formatRangeNumber(minInput.value)} ${suffix}`;
    maxOutput.textContent = `до ${formatRangeNumber(maxInput.value)} ${suffix}`;
}

function updateRangeControls() {
    updateRangePair('areaMin', 'areaMax', 'areaMinValue', 'areaMaxValue', 'м²');
    updateRangePair('priceMin', 'priceMax', 'priceMinValue', 'priceMaxValue', 'млн ₽');
    updatePresetStates();
}

function setPreset(name) {
    const ranges = catalogRanges();
    const presets = {
        'area-small': () => {
            setValue('areaMin', ranges.areaMin);
            setValue('areaMax', 120);
        },
        'area-medium': () => {
            setValue('areaMin', 120);
            setValue('areaMax', 170);
        },
        'area-large': () => {
            setValue('areaMin', 170);
            setValue('areaMax', ranges.areaMax);
        },
        'price-12': () => {
            setValue('priceMin', ranges.priceMin);
            setValue('priceMax', 12);
        }
    };

    if (presets[name]) {
        presets[name]();
        applyFilters();
    }
}

function updatePresetStates() {
    const ranges = catalogRanges();
    const current = {
        areaMin: Number(document.getElementById('areaMin').value),
        areaMax: Number(document.getElementById('areaMax').value),
        priceMin: Number(document.getElementById('priceMin').value),
        priceMax: Number(document.getElementById('priceMax').value)
    };

    document.querySelectorAll('[data-preset]').forEach(button => {
        const preset = button.dataset.preset;
        const active =
            (preset === 'area-small' && current.areaMin === ranges.areaMin && current.areaMax === 120) ||
            (preset === 'area-medium' && current.areaMin === 120 && current.areaMax === 170) ||
            (preset === 'area-large' && current.areaMin === 170 && current.areaMax === ranges.areaMax) ||
            (preset === 'price-12' && current.priceMin === ranges.priceMin && current.priceMax === 12);

        button.classList.toggle('is-active', active);
    });
}

function assetUrl(src) {
    return src;
}

function webp(src) {
    return src.replace(/\.(jpe?g|png)$/i, '.webp');
}

function gallerySlides(project) {
    return project.images.map((src, index) => `
        <div class="project-gallery-slide" style="background-image: url('${assetUrl(src)}')">
            <img class="project-gallery-img" src="${assetUrl(src)}" alt="\u0414\u043e\u043c ${project.name}" width="1200" height="900" loading="${index === 0 ? 'eager' : 'lazy'}">
        </div>
    `).join('');
}

function galleryDots(project) {
    return project.images.map((_, index) =>
        `<button class="project-gallery-dot${index === 0 ? ' active' : ''}" type="button" onclick="catalogGallerySet(this.closest('.catalog-card'), ${index})" aria-label="Показать фото ${index + 1}"></button>`
    ).join('');
}

function projectBadges(project) {
    const badges = [];
    if (['Давос', 'Бостон', 'Милан'].includes(project.name)) badges.push('Популярный');
    if (project.area <= 140) badges.push('Для узкого участка');
    if (project.options.includes('sauna')) badges.push('С сауной');
    if (project.options.includes('terrace')) badges.push('С террасой');
    return badges.slice(0, 3);
}

function projectDescription(project) {
    const floorText = project.floors === 1 ? 'одноэтажный дом' : 'двухэтажный дом';
    const details = [];
    if (project.options.includes('sauna')) details.push('сауной');
    if (project.options.includes('terrace')) details.push('террасой');
    if (project.bedrooms >= 4) details.push('просторной семейной планировкой');
    if (details.length === 0) details.push(`${project.bedrooms} спальнями`);
    return `${floorText} с ${details.join(' и ')}`;
}

function projectSpecs(project) {
    const bathroomsText = project.bathrooms === 1 ? '1 санузел' : `${project.bathrooms} санузла`;
    return [
        ['floors', `${project.floors} эт.`],
        ['area', `${project.area} м²`],
        ['bedrooms', `${project.bedrooms} спальни`],
        ['bath', bathroomsText],
        ['terrace', `${project.terrace} м² терраса`]
    ];
}

function specIcon(type) {
    const icons = {
        floors: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21h16"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M9 7h1"/><path d="M14 7h1"/><path d="M9 11h1"/><path d="M14 11h1"/><path d="M9 15h1"/><path d="M14 15h1"/></svg>',
        area: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7V4h3"/><path d="M17 4h3v3"/><path d="M20 17v3h-3"/><path d="M7 20H4v-3"/><path d="M4 4l6 6"/><path d="M20 20l-6-6"/></svg>',
        bedrooms: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11V5"/><path d="M21 19v-8a3 3 0 0 0-3-3h-7v11"/><path d="M3 19v-8h18"/><path d="M7 8h4"/><path d="M3 19h18"/></svg>',
        bath: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Z"/><path d="M7 12V6a3 3 0 0 1 6 0"/><path d="M13 6h2"/><path d="M8 19l-1 2"/><path d="M16 19l1 2"/></svg>',
        terrace: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11h16"/><path d="M6 11l2-6h8l2 6"/><path d="M7 11v9"/><path d="M17 11v9"/><path d="M5 20h14"/></svg>'
    };

    return icons[type] || '';
}

function card(project) {
    const badges = [`${project.floors} эт.`, `${project.area} м²`, `${project.bedrooms} спальни`];
    if (project.options.includes('sauna')) badges.push('сауна');
    const bathroomsText = project.bathrooms === 1 ? '1 санузел' : `${project.bathrooms} санузла`;

    return `
        <article class="catalog-card"
            data-floors="${project.floors}"
            data-area="${project.area}"
            data-price="${project.price}"
            data-bedrooms="${project.bedrooms}"
            data-options="${project.options.join(',')}"
            data-gallery-index="0"
            data-images='${JSON.stringify(project.images.map(assetUrl))}'>
            <div class="project-gallery">
                <div class="project-gallery-viewport">
                    <picture>
                        <source srcset="${webp(project.images[0])}" type="image/webp">
                        <img class="project-gallery-img" src="${project.images[0]}" alt="Дом ${project.name}" width="600" height="400" loading="lazy">
                    </picture>
                </div>
                <button class="project-gallery-arrow arrow-left" onclick="projectGalleryNav(this, -1)" aria-label="Назад">‹</button>
                <button class="project-gallery-arrow arrow-right" onclick="projectGalleryNav(this, 1)" aria-label="Вперёд">›</button>
                <div class="project-gallery-dots"></div>
            </div>
            <div class="catalog-card-info">
                <div class="catalog-badges">${badges.map(item => `<span class="catalog-badge">${item}</span>`).join('')}</div>
                <h2>${project.name}</h2>
                <div class="catalog-specs">
                    <span>${bathroomsText}</span>
                    <span>терраса ${project.terrace} м²</span>
                </div>
                <div class="catalog-card-bottom">
                    <div class="catalog-price">от ${formatPrice(project.price)} ₽</div>
                    <button class="btn-project-request" onclick="openModal('Получить презентацию ${project.name}')">Презентация</button>
                </div>
            </div>
        </article>
    `;
}

function card(project) {
    const badges = [`${project.floors} СЌС‚.`, `${project.area} РјВІ`, `${project.bedrooms} СЃРїР°Р»СЊРЅРё`];
    if (project.options.includes('sauna')) badges.push('СЃР°СѓРЅР°');
    const bathroomsText = project.bathrooms === 1 ? '1 СЃР°РЅСѓР·РµР»' : `${project.bathrooms} СЃР°РЅСѓР·Р»Р°`;

    return `
        <article class="catalog-card"
            data-floors="${project.floors}"
            data-area="${project.area}"
            data-price="${project.price}"
            data-bedrooms="${project.bedrooms}"
            data-options="${project.options.join(',')}"
            data-gallery-index="0"
            data-images='${JSON.stringify(project.images)}'>
            <div class="project-gallery">
                <div class="project-gallery-viewport">
                    <div class="project-gallery-track" onclick="catalogGalleryOpen(this.closest('.catalog-card'))">
                        ${gallerySlides(project)}
                    </div>
                </div>
                <button class="project-gallery-arrow arrow-left" onclick="catalogGalleryNav(this, -1)" aria-label="РќР°Р·Р°Рґ">вЂ№</button>
                <button class="project-gallery-arrow arrow-right" onclick="catalogGalleryNav(this, 1)" aria-label="Р’РїРµСЂС‘Рґ">вЂє</button>
                <div class="project-gallery-dots">${galleryDots(project)}</div>
            </div>
            <div class="catalog-card-info">
                <div class="catalog-badges">${badges.map(item => `<span class="catalog-badge">${item}</span>`).join('')}</div>
                <h2>${project.name}</h2>
                <div class="catalog-specs">
                    <span>${bathroomsText}</span>
                    <span>С‚РµСЂСЂР°СЃР° ${project.terrace} РјВІ</span>
                </div>
                <div class="catalog-card-bottom">
                    <div class="catalog-price">РѕС‚ ${formatPrice(project.price)} в‚Ѕ</div>
                    <button class="btn-project-request" onclick="openModal('РџРѕР»СѓС‡РёС‚СЊ РїСЂРµР·РµРЅС‚Р°С†РёСЋ ${project.name}')">РџСЂРµР·РµРЅС‚Р°С†РёСЏ</button>
                </div>
            </div>
        </article>
    `;
}

function card(project) {
    return catalogCard(project);
}

function declOf(n, forms) {
    const abs = Math.abs(n) % 100;
    const n1 = abs % 10;
    if (abs > 10 && abs < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
}

function catalogCard(project) {
    const images = project.images.map(assetUrl);
    const bedroomsWord = declOf(project.bedrooms, ['\u0441\u043f\u0430\u043b\u044c\u043d\u044f', '\u0441\u043f\u0430\u043b\u044c\u043d\u0438', '\u0441\u043f\u0430\u043b\u0435\u043d']);
    const bathroomsWord = declOf(project.bathrooms, ['\u0441\u0430\u043d\u0443\u0437\u0435\u043b', '\u0441\u0430\u043d\u0443\u0437\u043b\u0430', '\u0441\u0430\u043d\u0443\u0437\u043b\u043e\u0432']);
    const firstImg = images[0];
    const firstWebp = webp(firstImg);
    const projectUrl = project.url || '';
    const coverMarkup = `
                    <picture>
                        <source srcset="${firstWebp}" type="image/webp">
                        <img class="project-gallery-img" src="${firstImg}" alt="\u0414\u043e\u043c ${project.name}" width="600" height="400" loading="lazy">
                    </picture>`;
    const titleMarkup = projectUrl
        ? `<a href="${projectUrl}">${project.name}</a>`
        : project.name;

    return `
        <div class="project-card catalog-card"
            data-floors="${project.floors}"
            data-area="${project.area}"
            data-price="${project.price}"
            data-bedrooms="${project.bedrooms}"
            data-options="${project.options.join(',')}"
            data-images='${JSON.stringify(images)}'>
            <div class="project-card-labels"></div>
            <div class="project-gallery">
                <div class="project-gallery-viewport">
                    ${projectUrl ? `<a class="project-card-cover-link" href="${projectUrl}" aria-label="\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442 ${project.name}">${coverMarkup}</a>` : coverMarkup}
                </div>
                <button class="project-gallery-arrow arrow-left" onclick="projectGalleryNav(this, -1)" aria-label="\u041d\u0430\u0437\u0430\u0434">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button class="project-gallery-arrow arrow-right" onclick="projectGalleryNav(this, 1)" aria-label="\u0412\u043f\u0435\u0440\u0451\u0434">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
                <div class="project-gallery-dots"></div>
            </div>
            <div class="project-info">
                <div class="project-title-row">
                    <div class="project-title-left">
                        <h3>${titleMarkup}</h3>
                    </div>
                </div>
                <div class="project-price-line">
                    <div class="project-price-block">
                        <div class="price-main">\u043e\u0442 ${formatPrice(project.price)} \u20bd</div>
                    </div>
                    <div class="price-month">\u043e\u0442 ${formatPrice(project.priceMonth)} \u20bd/\u043c\u0435\u0441</div>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-badges project-metrics">
                    <div class="project-badge project-badge-area">${project.area} \u043c\u00b2</div>
                    <div class="project-badge project-badge-bedrooms">${project.bedrooms} ${bedroomsWord}</div>
                    <div class="project-badge project-badge-bathrooms">${project.bathrooms} ${bathroomsWord}</div>
                </div>
                <div class="project-footer">
                    <button class="btn-project-request" onclick="openModal('\u0417\u0430\u043f\u0440\u043e\u0441\u0438\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442 ${project.name}')">
                        <span>\u0417\u0430\u043f\u0440\u043e\u0441\u0438\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442 \u0438 \u0441\u043c\u0435\u0442\u0443</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function catalogGallerySet(card, targetIndex) {
    const cover = card.querySelector('.catalog-cover');
    const coverImg = card.querySelector('.catalog-cover-img');
    const images = JSON.parse(card.dataset.images);
    const total = images.length;
    if (!cover || total === 0) return;

    let nextIndex = targetIndex;
    if (nextIndex < 0) nextIndex = total - 1;
    if (nextIndex >= total) nextIndex = 0;

    card.dataset.galleryIndex = nextIndex;
    cover.style.backgroundImage = `url('${images[nextIndex]}')`;
    if (coverImg) coverImg.src = images[nextIndex];
    card.querySelectorAll('.project-gallery-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === nextIndex);
    });
}

function catalogGalleryNav(btn, direction) {
    const card = btn.closest('.catalog-card');
    const currentIndex = parseInt(card.dataset.galleryIndex || '0', 10);
    catalogGallerySet(card, currentIndex + direction);
}

function catalogGalleryOpen(card) {
    const images = JSON.parse(card.dataset.images);
    const index = parseInt(card.dataset.galleryIndex || '0', 10);
    openLightbox(images, index);
}

function filters() {
    return {
        floors: document.querySelector('.catalog-chip.is-active')?.dataset.floor || 'all',
        areaMin: Number(document.getElementById('areaMin').value) || 0,
        areaMax: Number(document.getElementById('areaMax').value) || Infinity,
        priceMin: (Number(document.getElementById('priceMin').value) || 0) * 1000000,
        priceMax: (Number(document.getElementById('priceMax').value) || Infinity) * 1000000,
        bedrooms: Number(document.getElementById('bedroomsMin').value) || 0,
        options: Array.from(document.querySelectorAll('[data-option]:checked')).map(input => input.value),
        search: (document.getElementById('catalogSearch')?.value || '').trim().toLowerCase()
    };
}

function renderTags(state) {
    const tags = document.getElementById('catalogTags');
    const ranges = catalogRanges();
    const list = [];
    if (state.floors !== 'all') list.push({ text: state.floors === '1' ? '1 этаж' : '2 этажа', clear: () => setFloor('all') });
    if (state.areaMin) list.push({ text: `от ${state.areaMin} м²`, clear: () => setValue('areaMin', '') });
    if (state.areaMax !== Infinity) list.push({ text: `до ${state.areaMax} м²`, clear: () => setValue('areaMax', '') });
    if (state.priceMin) list.push({ text: `от ${state.priceMin / 1000000} млн ₽`, clear: () => setValue('priceMin', '') });
    if (state.priceMax !== Infinity) list.push({ text: `до ${state.priceMax / 1000000} млн ₽`, clear: () => setValue('priceMax', '') });
    if (state.bedrooms) list.push({ text: `от ${state.bedrooms} спален`, clear: () => setValue('bedroomsMin', '0') });
    if (state.areaMin === ranges.areaMin && state.areaMax === ranges.areaMax) {
        for (let index = list.length - 1; index >= 0; index -= 1) {
            const clearSource = list[index].clear.toString();
            if (clearSource.includes('areaMin') || clearSource.includes('areaMax')) list.splice(index, 1);
        }
    }
    if (state.priceMin === ranges.priceMin * 1000000 && state.priceMax === ranges.priceMax * 1000000) {
        for (let index = list.length - 1; index >= 0; index -= 1) {
            const clearSource = list[index].clear.toString();
            if (clearSource.includes('priceMin') || clearSource.includes('priceMax')) list.splice(index, 1);
        }
    }
    state.options.forEach(option => {
        list.push({
            text: option === 'terrace' ? 'терраса' : 'сауна',
            clear: () => setOption(option, false)
        });
    });

    tags.innerHTML = list.map((item, index) =>
        `<button class="catalog-tag" type="button" data-tag="${index}">${item.text} ×</button>`
    ).join('');

    tags.querySelectorAll('[data-tag]').forEach(button => {
        button.addEventListener('click', () => {
            list[Number(button.dataset.tag)].clear();
            applyFilters();
        });
    });
}

function setValue(id, value) {
    document.getElementById(id).value = value;
}

function renderTags(state) {
    const tags = document.getElementById('catalogTags');
    const ranges = catalogRanges();
    const list = [];

    if (state.floors !== 'all') list.push({ text: state.floors === '1' ? '1 этаж' : '2 этажа', clear: () => setFloor('all') });
    if (state.areaMin !== ranges.areaMin || state.areaMax !== ranges.areaMax) {
        list.push({
            text: `${state.areaMin}–${state.areaMax} м²`,
            clear: () => {
                setValue('areaMin', ranges.areaMin);
                setValue('areaMax', ranges.areaMax);
            }
        });
    }
    if (state.priceMin !== ranges.priceMin * 1000000 || state.priceMax !== ranges.priceMax * 1000000) {
        list.push({
            text: `${formatRangeNumber(state.priceMin / 1000000)}–${formatRangeNumber(state.priceMax / 1000000)} млн ₽`,
            clear: () => {
                setValue('priceMin', ranges.priceMin);
                setValue('priceMax', ranges.priceMax);
            }
        });
    }
    if (state.bedrooms) list.push({ text: `от ${state.bedrooms} спален`, clear: () => setValue('bedroomsMin', '0') });
    state.options.forEach(option => {
        list.push({
            text: option === 'terrace' ? 'терраса' : 'сауна',
            clear: () => setOption(option, false)
        });
    });

    tags.innerHTML = list.length
        ? `<span class="catalog-tags-label">Выбрано:</span>${list.map((item, index) =>
            `<button class="catalog-tag" type="button" data-tag="${index}">${item.text}<span aria-hidden="true">×</span></button>`
        ).join('')}`
        : '<span class="catalog-tags-empty">Все проекты</span>';

    tags.querySelectorAll('[data-tag]').forEach(button => {
        button.addEventListener('click', () => {
            list[Number(button.dataset.tag)].clear();
            applyFilters();
        });
    });
}

function setOption(value, checked) {
    const input = document.querySelector(`[data-option][value="${value}"]`);
    if (input) input.checked = checked;
}

function setFloor(value) {
    document.querySelectorAll('.catalog-chip').forEach(button => {
        button.classList.toggle('is-active', button.dataset.floor === value);
    });
}

function applyFilters() {
    updateRangeControls();
    const state = filters();
    const cards = Array.from(document.querySelectorAll('.catalog-card'));
    const visible = [];

    console.log('[catalog] applyFilters', { state, cardsFound: cards.length });

    cards.forEach((item, idx) => {
        try {
            const optionsAttr = item.dataset.options || '';
            const options = optionsAttr ? optionsAttr.split(',') : [];
            const name = (item.querySelector('h3')?.textContent || '').toLowerCase();
            const ok = (state.floors === 'all' || item.dataset.floors === state.floors) &&
                Number(item.dataset.area) >= state.areaMin &&
                Number(item.dataset.area) <= state.areaMax &&
                Number(item.dataset.price) >= state.priceMin &&
                Number(item.dataset.price) <= state.priceMax &&
                Number(item.dataset.bedrooms) >= state.bedrooms &&
                state.options.every(option => options.includes(option)) &&
                (!state.search || name.includes(state.search));

            if (ok) {
                item.style.removeProperty('display');
                item.classList.remove('is-visible');
                void item.offsetHeight;
                item.classList.add('is-visible');
                visible.push(item);
            } else {
                item.classList.remove('is-visible');
                item.style.setProperty('display', 'none', 'important');
            }
        } catch (err) {
            console.error(`[catalog] applyFilters: card #${idx} failed`, err, item);
        }
    });

    console.log('[catalog] visible cards:', visible.length);

    const countEl = document.getElementById('catalogCount');
    if (countEl) countEl.textContent = `${visible.length} из ${cards.length} проектов`;
    const emptyEl = document.getElementById('catalogEmpty');
    if (emptyEl) emptyEl.classList.toggle('is-visible', visible.length === 0);
    updateDropdownLabels();
}

function resetFilters() {
    const ranges = catalogRanges();
    setFloor('all');
    setValue('areaMin', ranges.areaMin);
    setValue('areaMax', ranges.areaMax);
    setValue('priceMin', ranges.priceMin);
    setValue('priceMax', ranges.priceMax);
    setValue('bedroomsMin', '0');
    document.querySelectorAll('input[name="bedrooms"]').forEach(input => {
        input.checked = input.value === '0';
    });
    document.querySelectorAll('input[name="floors"]').forEach(input => {
        input.checked = input.value === 'all';
    });
    document.querySelectorAll('[data-option]').forEach(input => input.checked = false);
    const searchInput = document.getElementById('catalogSearch');
    if (searchInput) searchInput.value = '';
    applyFilters();
}

function openCatalogFilters() {
    document.body.classList.add('catalog-filtering');
    document.body.style.overflow = 'hidden';
}

function closeCatalogFilters() {
    document.body.classList.remove('catalog-filtering');
    document.body.style.overflow = '';
}

function bind(id, event, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
    else console.warn(`[catalog] element #${id} not found`);
}

function updateDropdownLabels() {
    const ranges = catalogRanges();
    const state = filters();
    const labels = {
        floors: state.floors === 'all' ? 'Этажность' : (state.floors === '1' ? '1 этаж' : '2 этажа'),
        area: (state.areaMin === ranges.areaMin && state.areaMax === ranges.areaMax)
            ? 'Площадь'
            : `${state.areaMin}–${state.areaMax} м²`,
        bedrooms: state.bedrooms ? `от ${state.bedrooms} спален` : 'Спальни',
        price: (state.priceMin === ranges.priceMin * 1000000 && state.priceMax === ranges.priceMax * 1000000)
            ? 'Цена'
            : `${formatRangeNumber(state.priceMin / 1000000)}–${formatRangeNumber(state.priceMax / 1000000)} млн ₽`,
        options: state.options.length === 0
            ? 'Опции'
            : state.options.map(o => o === 'terrace' ? 'терраса' : 'сауна').join(', ')
    };

    const defaults = { floors: 'Этажность', area: 'Площадь', bedrooms: 'Спальни', price: 'Цена', options: 'Опции' };
    Object.entries(labels).forEach(([key, value]) => {
        const el = document.querySelector(`[data-dd-label="${key}"]`);
        if (el) el.textContent = value;
        const dd = document.querySelector(`.catalog-dd[data-dd="${key}"]`);
        if (dd) dd.classList.toggle('is-active', value !== defaults[key]);
    });
}

function closeAllDropdowns(except) {
    document.querySelectorAll('.catalog-dd.is-open').forEach(dd => {
        if (dd !== except) {
            dd.classList.remove('is-open');
            const btn = dd.querySelector('.catalog-dd-btn');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    });
}

function initDropdowns() {
    document.querySelectorAll('.catalog-dd').forEach(dd => {
        const btn = dd.querySelector('.catalog-dd-btn');
        if (!btn) return;
        btn.addEventListener('click', event => {
            event.stopPropagation();
            const open = dd.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (open) closeAllDropdowns(dd);
        });
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('.catalog-dd')) closeAllDropdowns();
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeAllDropdowns();
    });
}

function bindBedroomRadios() {
    const select = document.getElementById('bedroomsMin');
    document.querySelectorAll('input[name="bedrooms"]').forEach(input => {
        input.addEventListener('change', () => {
            if (select) {
                select.value = input.value;
                select.dispatchEvent(new Event('change'));
            }
        });
    });
}

function bindFloorRadios() {
    document.querySelectorAll('input[name="floors"]').forEach(input => {
        input.addEventListener('change', () => {
            setFloor(input.value);
            applyFilters();
        });
    });
}

function closeCatalogSort(exceptSort = null) {
    document.querySelectorAll('[data-catalog-sort]').forEach(sort => {
        if (exceptSort && sort === exceptSort) return;

        const toggle = sort.querySelector('.catalog-sort-toggle');
        const menu = sort.querySelector('.catalog-sort-menu');
        sort.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        if (menu) menu.setAttribute('aria-hidden', 'true');
    });
}

function applyCatalogSort() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.catalog-card'));
    cards.sort((a, b) => {
        if (catalogSortValue === 'price-asc') {
            return Number(a.dataset.price) - Number(b.dataset.price);
        }
        if (catalogSortValue === 'price-desc') {
            return Number(b.dataset.price) - Number(a.dataset.price);
        }
        return Number(a.dataset.index) - Number(b.dataset.index);
    });

    cards.forEach(card => grid.appendChild(card));
}

function updateSortControls() {
    document.querySelectorAll('[data-catalog-sort-label], #catalogSortLabel').forEach(label => {
        label.textContent = catalogSortLabels[catalogSortValue] || catalogSortLabels.default;
    });

    document.querySelectorAll('[data-sort-value]').forEach(option => {
        const active = option.dataset.sortValue === catalogSortValue;
        option.classList.toggle('is-active', active);
        option.setAttribute('aria-selected', active ? 'true' : 'false');
    });
}

function setCatalogSort(value) {
    if (!catalogSortLabels[value]) return;
    catalogSortValue = value;
    applyCatalogSort();
    updateSortControls();
    applyFilters();
}

function initCatalogSort() {
    const sorts = Array.from(document.querySelectorAll('[data-catalog-sort]'));
    if (!sorts.length) return;

    sorts.forEach(sort => {
        const toggle = sort.querySelector('.catalog-sort-toggle');
        const menu = sort.querySelector('.catalog-sort-menu');
        if (!toggle) return;

        toggle.addEventListener('click', event => {
            event.stopPropagation();
            const open = !sort.classList.contains('is-open');
            closeCatalogSort(sort);
            sort.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (menu) menu.setAttribute('aria-hidden', open ? 'false' : 'true');
        });

        sort.querySelectorAll('[data-sort-value]').forEach(option => {
            option.addEventListener('click', event => {
                event.stopPropagation();
                setCatalogSort(option.dataset.sortValue);
                closeCatalogSort();
            });
        });
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('[data-catalog-sort]')) closeCatalogSort();
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeCatalogSort();
    });

    updateSortControls();
}

function initCatalog() {
    try {
        const grid = document.getElementById('catalogGrid');
        if (!grid) {
            console.warn('[catalog] #catalogGrid not found');
            return;
        }
        grid.innerHTML = catalogProjects.map(card).join('');
        grid.querySelectorAll('.catalog-card').forEach((item, index) => {
            item.dataset.index = index;
        });
        setRangeInputBounds();

        document.querySelectorAll('.catalog-chip').forEach(button => {
            button.addEventListener('click', () => {
                setFloor(button.dataset.floor);
                applyFilters();
            });
        });

        document.querySelectorAll('#areaMin,#areaMax,#priceMin,#priceMax,#bedroomsMin,[data-option]').forEach(input => {
            input.addEventListener('input', applyFilters);
            input.addEventListener('change', applyFilters);
        });

        document.querySelectorAll('[data-preset]').forEach(button => {
            button.addEventListener('click', () => setPreset(button.dataset.preset));
        });

        initDropdowns();
        bindBedroomRadios();
        bindFloorRadios();
        initCatalogSort();

        const searchInput = document.getElementById('catalogSearch');
        if (searchInput) searchInput.addEventListener('input', applyFilters);

        bind('catalogApply', 'click', closeCatalogFilters);
        bind('catalogReset', 'click', resetFilters);
        bind('catalogEmptyReset', 'click', resetFilters);
        bind('catalogFilterOpen', 'click', openCatalogFilters);
        bind('catalogFilterClose', 'click', closeCatalogFilters);
        bind('catalogBackdrop', 'click', closeCatalogFilters);

        applyFilters();
    } catch (err) {
        console.error('[catalog] initCatalog failed:', err);
    }
}

function trackCatalogGoal(goal, params) {
    if (!goal) return;
    if (typeof window.runorthReachGoal === 'function') {
        window.runorthReachGoal(goal, params);
        return;
    }
    try {
        if (typeof window.ym === 'function') {
            window.ym(24341083, 'reachGoal', goal, params || {});
        }
    } catch (e) {}
    try {
        if (typeof window.vkGoal === 'function') {
            window.vkGoal(goal, params);
        }
    } catch (e) {}
}

function trackCatalogModalGoal(title) {
    const value = title || '';
    const lower = value.toLowerCase();
    const params = { title: value };

    if (value.indexOf('\u0417\u0430\u043a\u0430\u0437\u0430\u0442\u044c \u0437\u0432\u043e\u043d\u043e\u043a') === 0) {
        trackCatalogGoal('callback_button_click', params);
        return;
    }
    if (value.indexOf('\u0417\u0430\u043f\u0440\u043e\u0441\u0438\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442') === 0 || value.indexOf('\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043f\u0440\u0435\u0437\u0435\u043d\u0442\u0430\u0446\u0438\u044e') === 0) {
        trackCatalogGoal('request_project_click', params);
        return;
    }
    if (lower.indexOf('\u044d\u043a\u0441\u043a\u0443\u0440\u0441') !== -1) {
        trackCatalogGoal('excursion_request_click', params);
        return;
    }
    if (lower.indexOf('\u0438\u043d\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043b\u044c\u043d') !== -1 || lower.indexOf('\u0438\u0437\u043c\u0435\u043d\u0435\u043d') !== -1) {
        trackCatalogGoal('custom_project_click', params);
    }
}

function openModal(title) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = title || 'Оставьте заявку';
    document.getElementById('formSource').value = title || 'Каталог проектов';
    // Запрос проекта: показываем выбор мессенджера и корректируем подзаголовок
    const isProjectRequest = !!title && title.indexOf('Запросить проект') === 0;
    const messengerGroup = document.getElementById('messengerGroup');
    if (messengerGroup) messengerGroup.style.display = isProjectRequest ? 'block' : 'none';
    const modalSubtitle = document.querySelector('.modal-subtitle');
    if (modalSubtitle) {
        // Запоминаем исходный текст подзаголовка, чтобы вернуть для не-проектных форм
        if (!modalSubtitle.dataset.defaultText) {
            modalSubtitle.dataset.defaultText = modalSubtitle.textContent;
        }
        modalSubtitle.textContent = isProjectRequest
            ? 'Укажите, куда удобно будет направить проект и смету под ваш запрос.'
            : modalSubtitle.dataset.defaultText;
    }
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    trackCatalogModalGoal(title || '');
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.body.style.overflow = '';
}

function renderLightbox() {
    const img = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');
    img.src = lightboxImages[lightboxIndex];
    counter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

function openLightbox(images, index) {
    if (typeof window.resetLightboxZoom === 'function') window.resetLightboxZoom();
    lightboxImages = images;
    lightboxIndex = index || 0;
    renderLightbox();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (typeof window.resetLightboxZoom === 'function') window.resetLightboxZoom();
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function lightboxNav(direction) {
    if (typeof window.resetLightboxZoom === 'function') window.resetLightboxZoom();
    lightboxIndex = (lightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
    renderLightbox();
}

document.addEventListener('DOMContentLoaded', initCatalog);
