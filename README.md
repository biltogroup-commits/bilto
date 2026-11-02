# Сайт Bilto — инструкция по сопровождению

Сайт: https://www.bilto-group.be. Язык сайта — нидерландский (nl-BE).

Сайт собран на Astro и Tailwind, размещён на Vercel. Все тексты и фото лежат в этом репозитории. Чтобы изменить сайт, нужно изменить файл и сохранить изменение в ветку `master`: Vercel сам пересоберёт сайт за 1–2 минуты.

## Как внести правку

**Самый простой способ — прямо на GitHub:**

1. Откройте нужный файл в репозитории и нажмите значок карандаша (Edit).
2. Измените текст.
3. Нажмите **Commit changes**.
4. Через 1–2 минуты откройте сайт и проверьте результат. Если сайт не обновился, посмотрите статус сборки в Vercel → Deployments.

Если сборка упала, сайт продолжит работать в прежней версии. Ошибка будет в журнале сборки.

**На своём компьютере** (нужен Node.js):

```
npm install
npm run dev      # локальный просмотр
npm run build    # проверка и сборка перед отправкой
git push         # отправка в master
```

## Где что менять

| Что изменить | Файл |
|---|---|
| Адрес, телефон, e-mail, BTW, список городов для Google | `src/data/company.ts` |
| Главный экран: заголовок, текст, кнопки, видео | `src/data/hero.ts` |
| Over ons: текст, цифры, фото | `src/data/overOns.ts` |
| Realisaties и слайдер «до/после» | `src/data/gallery.ts` |
| Вопросы и ответы (FAQ) | `src/data/faq.ts` |
| Шаги работы (Werkwijze) | `src/data/steps.ts` |
| Таблица сравнения (Waarom Bilto) | `src/data/comparison.ts` |
| Пункты меню и ссылки в подвале | `src/data/nav.ts` |
| Страницы услуг | `src/content/services/*.md` |
| Страницы городов | `src/content/regions/*.md` |
| Privacyverklaring | `src/legal/privacyverklaring.md` |
| Algemene voorwaarden | `src/pages/algemene-voorwaarden.astro` |

В файлах `.ts` меняйте только текст внутри кавычек. Если в тексте есть апостроф, поставьте перед ним обратный слеш: `'foto\'s'`.

## Добавить или изменить услугу

Каждая услуга — один файл в `src/content/services/`. Имя файла становится адресом страницы: `dakwerken.md` → `/dakwerken`.

```markdown
---
title: Dakwerken & dakreiniging
shortDescription: Одно предложение для карточки и для Google.
icon: roof
order: 3
image:
  label: "Описание фото"
  ratio: "4:3"
  src: "/images/services/dak.jpg"
---

Основной текст страницы.

## Подзаголовок

Можно использовать абзацы, подзаголовки и списки.
```

- `icon` — одно из значений: `cable`, `building`, `roof`, `wall`, `trowel`, `shield`.
- `order` — место в списке услуг.
- `label` — описание фото для незрячих посетителей и для Google.

Новая услуга сама появится на главной, в меню, в подвале и в форме заявки. Заголовок на главной «Zes vakgebieden, één aannemer» находится в `src/components/sections/Diensten.astro`: если услуг станет не шесть, поправьте его там.

## Добавить или изменить город

Каждый город — один файл в `src/content/regions/`. Адрес страницы: `gent.md` → `/regio/gent`.

```markdown
---
name: Gent
order: 2
---

Текст о работах в этом городе.
```

Новый город сам появится в подвале. Добавьте его и в `areaServed` в `src/data/company.ts`.

Пишите только о реальных объектах. Одинаковые страницы, где меняется лишь название города, вредят позициям в Google.

## Добавить работу в Realisaties

1. Положите фото в `public/images/realisaties/`.
2. Добавьте блок в `galleryItems` в `src/data/gallery.ts`:

```ts
{
  title: 'Название работы',
  category: 'dakwerken',
  image: { label: 'Название работы', ratio: '4:3' as const, src: '/images/realisaties/foto.jpg' },
},
```

`category` — одно из значений: `dakwerken`, `gevelwerken`, `kabelwerken`, `renovatie`, `pleisterwerken`. По ним работают кнопки-фильтры.

## Заменить фото

Самый простой способ — загрузить новый файл под тем же именем. Если имя другое, измените путь `src` там, где фото используется.

| Где | Размер | Папка |
|---|---|---|
| Услуги и Realisaties | 900×675 px (4:3) | `public/images/services/`, `public/images/realisaties/` |
| Слайдер «до/после» | 1200×675 px, оба фото с одного ракурса | `public/images/realisaties/` |
| Over ons | вертикальное, 3:4, например 675×900 px | `public/images/` |

Формат JPG, желательно до 200 КБ. Тяжёлые фото замедляют сайт. Имя файла — латиницей, без пробелов.

## Заменить видео на главном экране

Файлы: `public/hero.mp4` (десктоп, горизонтальное) и `public/hero_mobile.mp4` (телефон, вертикальное). Рядом лежат картинки, которые видны до старта видео: `hero-poster.jpg` и `hero-mobile-poster.jpg`. Сделайте их из первого кадра ролика.

- Лёгкие ролики (720p, примерно до 2 Мбит/с) не пережимайте, только перенесите служебные данные в начало файла: `ffmpeg -i in.mp4 -map 0:v:0 -c copy -movflags +faststart out.mp4`
- Тяжёлые исходники уменьшайте до 1920 px: `ffmpeg -i in.mp4 -vf scale=1920:-2:flags=lanczos -c:v libx264 -crf 29 -preset slow -pix_fmt yuv420p -movflags +faststart -an out.mp4`

## Форма заявок

Заявки уходят на адрес `email` из `src/data/company.ts`. Отправка идёт через Resend (домен `bilto-group.be`), код находится в `src/lib/offerte.ts`.

Если письмо отправить не удалось, посетитель увидит страницу с телефоном и почтой, а не «спасибо». Причина будет в журнале Vercel → Logs, путь `/api/offerte`, строки `[offerte] NIET verstuurd`. Отправленные письма видны в панели Resend → Emails.

## Лента Instagram

Шесть последних постов @bilto.be.renovaties подтягиваются при каждой сборке. Сборка запускается автоматически раз в день. Если токен перестанет работать, блок просто исчезнет с сайта, а всё остальное продолжит работать. Тогда создайте новый токен: Meta Business → Настройки компании → Системные пользователи → `bilto-website` → Сгенерировать токен (срок действия: никогда) — и замените `INSTAGRAM_TOKEN` в Vercel.

## Настройки Vercel

Settings → Environment Variables, только названия (значения храните только там):

| Переменная | Для чего |
|---|---|
| `RESEND_API_KEY`, `RESEND_EMAIL_DOMAIN` | отправка заявок |
| `INSTAGRAM_TOKEN` | лента Instagram |
| `CRON_SECRET` | защита ежедневного запуска |
| `DEPLOY_HOOK_URL` | ежедневная пересборка |

После изменения переменной нужна новая сборка: Deployments → Redeploy.

Никогда не записывайте токены и ключи в файлы этого репозитория: он публичный. По этой же причине репозиторий нельзя делать приватным на бесплатном плане Vercel без дополнительной настройки: сборки перестанут запускаться.

## Домен

Домен `bilto-group.be` зарегистрирован в Combell, там же его DNS-записи. Основной адрес — `www.bilto-group.be`, адрес без `www` перенаправляется на него. Записи для сайта: A `@` и CNAME `www`. Записи `send`, `rsend` и `resend._domainkey` нужны для отправки заявок: их не удаляйте.

## Открыть сайт для Google

Пока в `src/data/site.ts` стоит `launched = false`, все страницы закрыты от поисковых систем. Когда сайт будет готов, поставьте `launched = true`.
