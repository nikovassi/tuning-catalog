# Tuning Catalog

Модерен продуктов каталог за автомобилни тунинг продукти и аксесоари.
React + TypeScript + Vite + Tailwind CSS + Lucide. Статичен сайт, готов за GitHub Pages и подготвен за бъдещ CMS/backend.

> **Данни:** 10 реални продукта от обявите в OLX.bg, изпратени от Александър Андонов (02.10.2026).
> Използвани са само данните от обявите: заглавие, описание, параметри, цена и снимки.
> Наличност, OEM номера и съвместимост с конкретни автомобили не са посочени в обявите и не са добавени.
> „Тип VDO“ означава стил на уреда, а не марка. Затова единствената марка е Greddy.
> Виж [Липсващи данни](#липсващи-данни).

---

## Бърз старт

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build в dist/
npm run preview    # преглед на build-а
```

Локален build с base path като в GitHub Pages:

```bash
BASE_PATH=/tuning-catalog/ VITE_SITE_URL=https://USER.github.io/tuning-catalog npm run build
```

## Деплой в GitHub Pages

1. Създайте repo в GitHub и качете проекта в клон `main`.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. При всеки push към `main` се стартира `.github/workflows/deploy.yml`.

Workflow-ът взема **base path** и **публичния URL** от `actions/configure-pages`, така че без промени работи и за
`https://USER.github.io/REPO/`, и за собствен домейн (Settings → Pages → Custom domain).

| Проверено | Как е решено |
|---|---|
| base path | `BASE_PATH` → `vite.config.ts` `base` + `BrowserRouter basename` |
| assets | всички пътища от `public/` минават през `asset()` (`src/lib/paths.ts`) |
| routing / директно отваряне на вътрешни страници | build-ът генерира `404.html`, който пренасочва към `/?__route=…`; `main.tsx` възстановява адреса (заедно с query и hash) преди React Router да стартира |
| 404 | несъществуващ адрес → страница „Страницата не е намерена“ с `noindex` |

Не използваме HashRouter (`/#/...`), за да останат адресите чисти и индексируеми.

## Структура

```
src/
  config/site.ts          # име, контакти, социални мрежи, фирма, demoMode — САМО реални данни
  types/catalog.ts        # Product, Category, Brand, VehicleFitment …
  data/                   # статичният „източник“ (заменим с CMS)
    products.ts
    categories.ts
    brands.ts
  lib/
    catalog.ts            # data access слой — единствената точка за достъп до данните
    search.ts             # търсене (кирилица/латиница, autocomplete, scoring)
    filters.ts            # фасетни филтри, сортиране, URL ⇄ state
    vehicles.ts           # каскаден автомобилен филтър
    seo.ts                # title/meta/OG/Twitter/canonical/JSON-LD
    inquiry.ts            # изпращане на запитвания
    theme.tsx             # light/dark + localStorage
  components/
    layout/               # Header, Footer, Logo, ContactDetails
    catalog/              # ProductCard, FilterPanel, VehicleFinder, CatalogView, Gallery …
    search/SearchBox.tsx  # combobox с autocomplete (desktop dropdown + mobile fullscreen)
    inquiry/              # InquiryForm + глобален диалог
    ui/                   # Button, Badge, Select, Overlay (modal/drawer), …
  pages/                  # една страница = един route
```

### Маршрути

| URL | Страница |
|---|---|
| `/` | Начало |
| `/catalog` | Каталог (филтрите са в URL: `?q=&cat=&sub=&brand=&make=&model=&gen=&engine=&year=&sort=`) |
| `/products` | → пренасочва към `/catalog` |
| `/products/{slug}` | Продукт |
| `/categories`, `/categories/{slug}` | Категории / категория (`?sub=` за подкатегория) |
| `/brands`, `/brands/{slug}` | Марки / марка |
| `/about`, `/contact`, `/faq` | За нас, Контакти, ЧЗВ |
| `/privacy`, `/terms`, `/cookies` | Правни страници (шаблони) |

## Добавяне на продукти

Редактирайте `src/data/products.ts` — изтрийте генерираните демонстрационни записи и добавете реални:

```ts
{
  id: 'p-0001',
  slug: 'silikonovo-kolyano-90-76mm',       // уникален, латиница
  name: 'Силиконово коляно 90° 76 мм',
  brand: 'brand-slug',                     // slug от brands.ts (по избор)
  category: 'silikonovi-markuchi',         // slug от categories.ts
  subcategory: 'kolyana',                  // по избор
  shortDescription: '…',
  description: '…',
  images: [{ src: 'images/products/p-0001/01.webp', alt: '…' }],   // файлове в public/images/products/
  sku: '…',                                // по избор
  price: 49.9, currency: 'EUR',            // САМО ако има реална цена
  availability: 'in_stock',                // САМО ако има реални данни
  compatibility: [{ make: 'BMW', model: '3 Series', generation: 'E46', engine: '320d', yearFrom: 1998, yearTo: 2006 }],
  specifications: [{ label: 'Материал', value: 'Силикон' }],
  tags: ['…'],
  externalUrl: 'https://…',
  createdAt: '2026-10-01',
  featured: true,
}
```

**Правило: попълвайте само полета с реални данни.** UI-ят се адаптира сам:

- Няма цени → няма ценови филтър и сортиране по цена, а картите показват „Цена при запитване“.
- Няма `availability` → няма филтър „Наличност“.
- Няма `productType` → няма филтър „Тип продукт“.
- Няма `compatibility` → автомобилният филтър е скрит. Каскадата Марка → Модел → Поколение → Двигател → Година показва само нивата, за които има данни.
- Категории и марки без продукти не се показват.
- Product structured data (JSON-LD) се генерира само за записи без `isPlaceholder`. `Offer` се добавя само при реална цена.
- Демонстрационните записи са `noindex` и не влизат в `sitemap.xml`.

Когато няма повече демонстрационни записи, задайте `demoMode: false` в `src/config/site.ts`. Така изчезват бележките „Демонстрационни данни“.

**Снимки:** препоръчително WebP, 1600 px по дългата страна, неутрален/бял фон. Картите използват `object-contain` във фиксирано съотношение 4:3, така че снимките никога не се разтягат.

## Запитвания

Сайтът е статичен и няма собствен сървър. `src/lib/inquiry.ts` поддържа:

1. **`VITE_INQUIRY_ENDPOINT`** (препоръчително) — POST JSON към външна услуга: Formspree, Web3Forms, Basin, Cloudflare Worker или собствен API. В GitHub задайте *Settings → Secrets and variables → Actions → Variables → `VITE_INQUIRY_ENDPOINT`*.
2. Ако няма endpoint, но е попълнен `site.contact.email`, формата използва `mailto:`.
3. Ако няма нито едното, потребителят вижда ясно съобщение, че формата не е свързана.

Формата събира само име, телефон и/или email, съобщение и продукта (попълнен автоматично). Има задължително съгласие с Политиката за поверителност и honeypot срещу спам.

## Препоръчана архитектура (CMS / backend)

**Не** използвайте frontend login и не съхранявайте администраторски пароли в статичния сайт.

```
┌──────────────────────┐   build (GitHub Actions)   ┌───────────────────┐
│ Headless CMS          │ ─────────────────────────▶ │ GitHub Pages      │
│ продукти, категории,  │   webhook „publish“ →      │ публичен frontend │
│ марки, снимки, цени   │   repository_dispatch      └─────────┬─────────┘
└──────────────────────┘                                       │ POST
                                                              ▼
                                        ┌────────────────────────────────┐
                                        │ Serverless функция / API        │
                                        │ (запитвания → email/CRM/DB)     │
                                        └────────────────────────────────┘
```

Варианти, подредени по препоръка:

1. **Decap CMS / TinaCMS (git-based)** — админ панел, който записва в `src/data/*.json` в същото repo. Без отделен сървър и без разходи; GitHub OAuth за вход. Подходящ до няколко хиляди продукта.
2. **Headless CMS (Sanity, Strapi, Directus)** — данните се изтеглят **при build** (`scripts/fetch-catalog.ts` → JSON). Сайтът остава статичен и бърз, а CMS webhook стартира повторен деплой.
3. **Supabase / собствен API** — за реални наличности и цени в реално време или бъдещ онлайн магазин (количка, поръчки). Тогава `src/lib/catalog.ts` става асинхронен (`fetch` + кеш, напр. TanStack Query).

Компонентите не импортират `src/data` директно, а само `src/lib/catalog.ts`. Затова смяната на източника засяга единствено този модул.

При голям каталог (над ~5 000 артикула) заменете клиентското търсене (`src/lib/search.ts`) с Pagefind (статично) или Meilisearch/Algolia.

## UX решения (резултат от проучването)

Референции: структурата на kz-tuning.com (широк набор категории с подкатегории, филтър по марка/модел), български тунинг магазини (xtuning.bg, tuningstore.bg, nastauto.com, tuning-world.bg) и международни каталози за авточасти.

- **Търсенето е основен вход:** присъства в header-а (клавиш `/`), в hero секцията и на мобилен fullscreen екран. Има autocomplete за категории, марки и продукти. Работи с кирилица и латиница (`markuch` ≈ `маркуч`) и игнорира интервали (`E 46` ≈ `E46`).
- **Фасетни филтри с броячи,** изчислени спрямо останалите активни филтри. Опции без резултат са неактивни, а не скрити. Активните филтри се показват като chips с бутон за изчистване.
- **Състоянието е в URL:** всяко филтрирано състояние може да се сподели и работи с бутона „Назад“.
- **Автомобилен филтър като каскада:** всяко ниво зависи само от по-горните и празните нива не се показват.
- **Без количка:** вместо нея има запитване с автоматично попълнен продукт. Това е по-подходящо за тунинг части, където съвместимостта и цената често се уточняват.
- **Mobile-first:** филтрите са в drawer с бутон „Покажи N“, менюто е в drawer отдясно, а header-ът е sticky.
- **Визия:** графит, бяло и светлосиво с един дискретен оранжев акцент (активни състояния, индикатори). Двете теми имат отделни палитри (`src/index.css`), а не инверсия. Шрифтовете Inter и Inter Tight са self-hosted (без Google Fonts, без външни заявки).
- **Достъпност и анимации:** анимациите са умерени (fade/slide/scale) и спазват `prefers-reduced-motion`. Модалите задържат фокуса и се затварят с Esc.

## SEO

- Всяка страница задава собствени `title`, `meta description`, Open Graph, Twitter Card и `canonical` (`useSeo`).
- Build-ът генерира `robots.txt` и `sitemap.xml` (само реални записи; нужен е `VITE_SITE_URL`).
- Product JSON-LD се генерира само за реални записи, а FAQPage JSON-LD — на `/faq`.
- `public/og-image.png` се прегенерира с `python3 scripts/og-image.py "Име на бизнеса"`.

## Тествано

- `tsc` без грешки, production build.
- Без хоризонтален скрол на 320, 375, 390, 430, 768, 1024, 1440 и 1920 px за всички страници.
- Light и dark тема; запазване в localStorage; без проблясване при зареждане.
- Директно отваряне на вътрешни страници с query и hash през `404.html` (симулиран GitHub Pages сървър).
- Търсене (латиница → кирилица), празно състояние, автомобилен филтър, валидация на формата.

## Липсващи данни

Попълнете тези данни (търсете `TODO(данни)` в кода):

- [x] **Продукти** — 10 продукта от OLX (`src/data/products.ts`); снимки в `public/images/products/` (`scripts/import-images.py`)
- [ ] **Наличности, кодове на продуктите, съвместимост с автомобили** — не са посочени в обявите
- [ ] **Марки** на уредите, които не са Greddy (по снимките: Dragon Gauge, CRSPEED?) — да се потвърдят
- [ ] Лого на Greddy и други марки (`public/brands/`)
- [ ] **Реални категории** — потвърждение или корекция на структурата (`src/data/categories.ts`)
- [ ] **Име и лого на бизнеса** (върху снимките има воден знак „@AndonovTuning shop“) (`src/config/site.ts`, `src/components/layout/Logo.tsx`, `public/favicon.svg`)
- [ ] **Контакти** — телефон, email, адрес, работно време, Facebook/Instagram (`src/config/site.ts`)
- [ ] **Фирмени данни** за правните страници (ЕИК, адрес) и **преглед от юрист**
- [ ] **Текст „За нас“** (`src/pages/AboutPage.tsx`, секцията на началната страница)
- [ ] **Endpoint за запитвания** (`VITE_INQUIRY_ENDPOINT`)
- [ ] ЧЗВ за доставка, плащане, гаранция и връщане — **само при реални условия**
