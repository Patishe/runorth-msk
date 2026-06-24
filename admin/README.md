# Панель управления msk.runorth.ru (admin/)

Тот же движок, что и на runorth.ru. Два раздела (переключатель вверху):
- **Объекты** — `/admin/cases/` — блок «Готовые объекты» на главной (`index.php`, серверный рендер).
- **Каталог** — `/admin/catalog/` — секция «Проекты» (#projects) на главной; `index.php` грузит её
  инлайн-скриптом через `fetch('/data/catalog.json')` (8 проектов + «показать ещё»). Платёж/мес
  считается из цены. Поля проще, чем на runorth (без террасы/опций/ссылки).

## Структура

```
admin/
  login.php / logout.php / index.php
  shared/   bootstrap, config.php (НЕ в git/FTP), images.php, styles.php, nav.php
  cases/    index.php, form.php
partials/
  data-lib.php, cases-lib.php, cases-render.php
data/
  cases.json (живой, НЕ в git/FTP)  /  cases.example.json (сид)
uploads/cases/<id>/  (загруженные фото, НЕ деплоятся)
```

`index.html` → `index.php`: блок объектов подключается через
`<?php include 'partials/cases-render.php'; ?>` и читает `data/cases.json`
(fallback — `cases.example.json`).

## Первичная настройка на сервере (один раз)

```
cp admin/shared/config.sample.php admin/shared/config.php
php -r 'echo password_hash("ВАШ_ПАРОЛЬ", PASSWORD_DEFAULT), "\n";'
```
Вставить хэш в `password_hash`, поменять `session_secret`. Логин — `admin`.
`data/` и `uploads/` — на запись. Открыть: `https://msk.runorth.ru/admin/`

## Важно
- Это **отдельная** панель и отдельные данные от runorth.ru (свой репозиторий, свой деплой).
  Контент msk ведётся здесь, на runorth.ru — там.
- Живые данные/фото/пароль исключены из FTP-деплоя — `git push` их не затирает.
