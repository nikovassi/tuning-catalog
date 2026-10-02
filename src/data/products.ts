import type { Product, ProductImage } from '../types/catalog';

/**
 * ПРОДУКТОВА БАЗА
 * ----------------------------------------------------------------------------
 * Източник: обявите на продавача в OLX.bg, изпратени от Александър Андонов (02.10.2026).
 * Данните са взети само от обявите: заглавие, описание, параметри, цена, снимки.
 * Нищо не е добавено извън тях. Наличност и OEM номера не са посочени в обявите,
 * затова липсват. „Тип VDO“ означава стил на уреда, а не марка.
 *
 * Снимките са в public/products/<slug>/ (виж scripts/import-images.py).
 * Как да добавите продукт — виж README.md → „Добавяне на продукти“.
 */

const gallery = (slug: string, count: number, alt: string): ProductImage[] =>
  Array.from({ length: count }, (_, i) => ({
    src: `products/${slug}/${String(i + 1).padStart(2, '0')}.webp`,
    alt: i === 0 ? alt : `${alt} — снимка ${i + 1}`,
  }));

const olx = (id: string, path: string) => `https://www.olx.bg/d/ad/${path}-CID1625-ID${id}.html`;

const NEW = { label: 'Състояние', value: 'Ново' };

export const products: Product[] = [
  {
    id: 'olx-9Csv5',
    slug: 'panel-12v-24v-usb-voltmetar-zapalka',
    name: 'Панел за вграждане 12V/24V — двойно USB, волтметър, запалка и ключ 20A',
    category: 'interior',
    subcategory: 'aksesoari',
    shortDescription: 'Водозащитен панел за вграждане с двойно USB зарядно, волтметър, букса за запалка и превключвател 20A.',
    description:
      'Водозащитено табло за вграждане — панел с двойно USB зарядно, волтметър, 12V/24V букса за запалка и 1 бр. превключвател 20A.\n\n' +
      'Контролният панел е универсален и намира приложение при автомобили, кемпери, каравани, офроуд автомобили, лодки, бусове и др.',
    images: gallery('panel-12v-24v-usb-voltmetar-zapalka', 9, 'Панел за вграждане 12V/24V с USB, волтметър и запалка'),
    price: 25.56,
    currency: 'EUR',
    specifications: [
      NEW,
      { label: 'Работно напрежение', value: '12V / 24V DC' },
      { label: 'Подсветка', value: 'Синя, зелена или червена' },
      { label: 'Размер на панела', value: '104 × 87 мм' },
      { label: 'USB изход', value: '5V DC, 4.2A (2 × 2.1A)' },
      { label: 'Ключ — максимален ток', value: '20A (12V)' },
      { label: 'Включва', value: 'Двойно USB, волтметър, букса за запалка, ключ вкл./изкл.' },
    ],
    tags: ['панел', 'табло', 'USB зарядно', 'волтметър', 'запалка', 'превключвател', 'кемпер', 'лодка', 'бус', 'офроуд', '12V', '24V'],
    externalUrl: olx('9Csv5', '12v-24v-panel-za-vgrazhdane-usb-zaryadno-zapalka-voltmetar-bushon-kopche'),
    externalLabel: 'Обява в OLX',
    createdAt: '2026-10-02',
    featured: true,
  },
  {
    id: 'olx-85VaU',
    slug: 'ured-temperatura-maslo-tip-vdo-52mm',
    name: 'Уред за температура на масло тип VDO 52 мм',
    category: 'uredi',
    subcategory: 'temperatura',
    shortDescription: 'Нов уред за температура на масло тип VDO, с датчик и бяла сменяема подсветка.',
    description:
      'Нов уред за температура на масло с включен датчик. Тип VDO с бяла подсветка, която може да се вади и сменя. ' +
      'Предлагат се и други уреди от същата и други серии.',
    images: gallery('ured-temperatura-maslo-tip-vdo-52mm', 5, 'Уред за температура на масло тип VDO 52 мм'),
    price: 21,
    currency: 'EUR',
    specifications: [
      { label: 'Измерва', value: 'Температура на масло' },
      { label: 'Диаметър', value: '52 мм' },
      { label: 'Подсветка', value: 'Бяла, сменяема' },
      { label: 'В комплекта', value: 'Датчик' },
    ],
    tags: ['уред', 'часовник', 'тунинг уреди', 'VDO', 'температура масло', '52мм'],
    externalUrl: olx('85VaU', 'izmervatelen-ured-temperatura-maslo-tip-vdo-52mm-tuning-uredi-ured-chasovnik-izmervane-uredi-tuning-temperatura'),
    externalLabel: 'Обява в OLX',
    createdAt: '2026-10-02',
    featured: true,
  },
  {
    id: 'olx-7RIE3',
    slug: 'greddy-ured-temperatura-voda-displey',
    name: 'Greddy уред за температура на вода с дисплей и стрелка',
    brand: 'greddy',
    category: 'uredi',
    subcategory: 'temperatura',
    shortDescription: 'Нов, неотварян уред Greddy за температура на вода — дисплей и стрелка до 120 °C, 8 цвята подсветка, със сензор.',
    description:
      'Нов, неотварян измервателен уред Greddy за температура на вода — комбиниран: дисплей и стрелка до 120 градуса, в комплект със сензор.\n\n' +
      '8 цвята подсветка, избират се от менюто. Задният надпис също има подсветка. Предлага се цялата серия Greddy.',
    images: gallery('greddy-ured-temperatura-voda-displey', 8, 'Greddy уред за температура на вода с дисплей'),
    price: 62,
    currency: 'EUR',
    specifications: [
      NEW,
      { label: 'Измерва', value: 'Температура на вода (антифриз)' },
      { label: 'Скала', value: 'до 120 °C' },
      { label: 'Индикация', value: 'Стрелка + дисплей' },
      { label: 'Подсветка', value: '8 цвята, избор от менюто' },
      { label: 'В комплекта', value: 'Сензор' },
    ],
    tags: ['Greddy', 'Греди', 'уред', 'часовник', 'температура вода', 'антифриз', 'дисплей', 'тунинг уреди'],
    externalUrl: olx('7RIE3', 'greddy-temperatura-voda-gredy-gredi-greydi-temperatura-antifriz-ured-uredi-gredy-visok-klas-displey-smyana-na-tsveta-izmervatelen-chasovnik-manometar'),
    externalLabel: 'Обява в OLX',
    createdAt: '2026-10-02',
    featured: true,
  },
  {
    id: 'olx-80gfm',
    slug: 'ured-nalyagane-maslo-7-bar',
    name: 'Уред за налягане на масло до 7 bar с тъмно стъкло',
    category: 'uredi',
    subcategory: 'nalyagane',
    shortDescription: 'Нов, неотварян уред за налягане на масло в барове, с датчик и тъмно стъкло.',
    description:
      'Нов, неотварян измервателен уред за налягане на маслото в барове, в комплект с датчик. Тъмно стъкло.\n\n' +
      'Предлагат се и други уреди от тази серия, както и преходник за бърз монтаж на датчика за налягане на маслото.',
    images: gallery('ured-nalyagane-maslo-7-bar', 8, 'Уред за налягане на масло до 7 bar'),
    price: 28,
    currency: 'EUR',
    specifications: [
      NEW,
      { label: 'Измерва', value: 'Налягане на масло' },
      { label: 'Скала', value: 'до 7 bar' },
      { label: 'Стъкло', value: 'Тъмно' },
      { label: 'В комплекта', value: 'Датчик' },
    ],
    tags: ['уред', 'манометър', 'часовник', 'налягане масло', 'бар', 'bar', 'тунинг уреди'],
    externalUrl: olx('80gfm', 'izmervatelen-ured-nalyagane-na-maslo-bar-v-bar-uredi-manometar-do-7-bara-uredi-voltmetar-chasovnik-izmervane-akumulator-uredi-tuning-temperatura'),
    externalLabel: 'Обява в OLX',
    createdAt: '2026-10-02',
  },
  {
    id: 'olx-7fkWl',
    slug: 'komplekt-uredi-vdo-temperatura-nalyagane-maslo-voltmetar',
    name: 'Комплект 3 уреда тип VDO 52 мм — температура масло, налягане масло, волтметър',
    category: 'uredi',
    subcategory: 'komplekti',
    shortDescription: 'Чисто нов комплект от 3 уреда тип VDO с датчици и стойка — температура и налягане на масло, волтметър.',
    description:
      'Измервателни уреди за температура на маслото, налягане на маслото и волтметър тип VDO — точни, стилни, чисто нови. С включени датчици и стойка.\n\n' +
      'Предлагат се и преходници за свързване на датчика за масло към оригиналния филтър без дупчене или заварки.',
    images: gallery('komplekt-uredi-vdo-temperatura-nalyagane-maslo-voltmetar', 6, 'Комплект 3 уреда тип VDO — температура масло, налягане масло, волтметър'),
    price: 46.02,
    currency: 'EUR',
    specifications: [
      { label: 'Уреди', value: 'Температура масло, налягане масло, волтметър' },
      { label: 'Брой', value: '3' },
      { label: 'Диаметър', value: '52 мм' },
      { label: 'Напрежение', value: '12V' },
      { label: 'В комплекта', value: 'Датчици и стойка' },
    ],
    tags: ['комплект', 'уреди', 'VDO', 'температура масло', 'налягане масло', 'волтметър', 'стойка', '52мм', 'тунинг уреди'],
    externalUrl: olx('7fkWl', 'izmervatelni-uredi-komplekt-3br-tip-vdo-temperatura-nalyagane-maslo'),
    externalLabel: 'Обява в OLX',
    createdAt: '2026-10-02',
    featured: true,
  },
  {
    id: 'olx-7fcQP',
    slug: 'ured-temperatura-maslo-led',
    name: 'Уред за температура на масло с LED подсветка и тъмно стъкло',
    category: 'uredi',
    subcategory: 'temperatura',
    shortDescription: 'Нов уред за температура на масло с датчик, тъмно стъкло и ярка LED подсветка.',
    description:
      'Авто уред за температура на маслото с включен датчик. С тъмно стъкло при изключен контакт — стилен и точен уред. Свети ярко с LED подсветка.',
    images: gallery('ured-temperatura-maslo-led', 5, 'Уред за температура на масло с LED подсветка'),
    price: 23,
    currency: 'EUR',
    specifications: [
      NEW,
      { label: 'Измерва', value: 'Температура на масло' },
      { label: 'Подсветка', value: 'LED' },
      { label: 'Стъкло', value: 'Тъмно' },
      { label: 'В комплекта', value: 'Датчик' },
    ],
    tags: ['уред', 'часовник', 'температура масло', 'LED', 'тунинг уреди'],
    externalUrl: olx('7fcQP', 'imervatelen-ured-temperatura-maslo-tuning-uredi-bustmetar-manometri'),
    externalLabel: 'Обява в OLX',
    createdAt: '2026-10-02',
  },
  {
    id: 'olx-7fl3t',
    slug: 'komplekt-uredi-vdo-temperatura-voda-nalyagane-maslo',
    name: 'Комплект 3 уреда тип VDO 52 мм — температура масло, налягане масло, температура вода',
    category: 'uredi',
    subcategory: 'komplekti',
    shortDescription: 'Чисто нов комплект от 3 уреда тип VDO с датчици и стойка — температура масло, налягане масло, температура вода.',
    description:
      'Комплект измервателни уреди тип VDO — температура на масло, налягане на масло и температура на вода. Точни, стилни, чисто нови. С включени датчици и стойка.\n\n' +
      'Предлагат се и преходници за свързване на датчика за масло към оригиналния филтър без дупчене или заварки.',
    images: gallery('komplekt-uredi-vdo-temperatura-voda-nalyagane-maslo', 5, 'Комплект 3 уреда тип VDO — температура масло, налягане масло, температура вода'),
    price: 46.02,
    currency: 'EUR',
    specifications: [
      { label: 'Уреди', value: 'Температура масло, налягане масло, температура вода' },
      { label: 'Брой', value: '3 + стойка' },
      { label: 'Диаметър', value: '52 мм' },
      { label: 'Напрежение', value: '12V' },
      { label: 'В комплекта', value: 'Датчици и стойка' },
    ],
    tags: ['комплект', 'уреди', 'VDO', 'температура вода', 'температура масло', 'налягане масло', 'стойка', '52мм', 'тунинг уреди'],
    externalUrl: olx('7fl3t', 'izmervatelni-uredi-tip-vdo-temperatura-voda-nalyagane-na-maslo-tuning'),
    externalLabel: 'Обява в OLX',
    createdAt: '2026-10-02',
  },
  {
    id: 'olx-862v8',
    slug: 'ured-nalyagane-maslo-tip-vdo-52mm-stoyka',
    name: 'Уред за налягане на масло тип VDO 52 мм с метална стойка',
    category: 'uredi',
    subcategory: 'nalyagane',
    shortDescription: 'Уред тип VDO за налягане на масло в барове, с метална стойка, датчик и сменяема бяла LED подсветка.',
    description:
      'Измервателен уред тип VDO за налягане на маслото в барове, с метална стойка за монтаж. Бяла LED подсветка, която може да се сменя. 52 мм, с датчик в комплекта.',
    images: gallery('ured-nalyagane-maslo-tip-vdo-52mm-stoyka', 7, 'Уред за налягане на масло тип VDO 52 мм с метална стойка'),
    price: 25.56,
    currency: 'EUR',
    specifications: [
      { label: 'Измерва', value: 'Налягане на масло (bar)' },
      { label: 'Диаметър', value: '52 мм' },
      { label: 'Подсветка', value: 'Бяла LED, сменяема' },
      { label: 'В комплекта', value: 'Датчик и метална стойка' },
    ],
    tags: ['уред', 'манометър', 'часовник', 'VDO', 'налягане масло', 'стойка', '52мм', 'тунинг уреди'],
    externalUrl: olx('862v8', 'izmervatelen-ured-tip-vdo-nalyagane-maslo-tuning-uredi-izmervatelni-ure'),
    externalLabel: 'Обява в OLX',
    createdAt: '2026-10-02',
  },
  {
    id: 'olx-7MlPS',
    slug: 'oborotomer-80mm-shift-lampa',
    name: 'Оборотомер 80 мм до 11 000 об/мин с шифт лампа',
    category: 'uredi',
    subcategory: 'oborotomeri',
    shortDescription: 'Нов оборотомер 80 мм със шифт лампа с регулируем праг и 7 цвята подсветка.',
    description:
      'Нов оборотомер до 11 000 оборота със шифт лампа. Диаметър 80 мм. Подходящ за двигатели до 8 цилиндъра. ' +
      'Може да се настрои при колко оборота да светва лампата. 7 цвята подсветка по избор.',
    images: gallery('oborotomer-80mm-shift-lampa', 6, 'Оборотомер 80 мм с шифт лампа'),
    price: 61.36,
    currency: 'EUR',
    specifications: [
      { label: 'Скала', value: 'до 11 000 об/мин' },
      { label: 'Диаметър', value: '80 мм' },
      { label: 'Двигатели', value: 'до 8 цилиндъра' },
      { label: 'Шифт лампа', value: 'Да, с регулируем праг' },
      { label: 'Подсветка', value: '7 цвята по избор' },
      { label: 'Напрежение', value: '12V' },
    ],
    tags: ['оборотомер', 'обортомер', 'шифт лампа', 'shift light', 'уред', 'тунинг уреди', '12V'],
    externalUrl: olx('7MlPS', 'obortomer-s-lampa-oborotomer-sas-shift-lampa-tuning-uredi-bustmetar-12v'),
    externalLabel: 'Обява в OLX',
    createdAt: '2026-10-02',
    featured: true,
  },
  {
    id: 'olx-7MRJH',
    slug: 'greddy-ured-nalyagane-gorivo-60mm',
    name: 'Greddy уред за налягане на гориво 60 мм с дисплей и аларма',
    brand: 'greddy',
    category: 'uredi',
    subcategory: 'nalyagane',
    shortDescription: 'Нов, неотварян уред Greddy 60 мм за налягане на гориво до 8 bar — дисплей, аларма, 7 цвята подсветка, със сензор.',
    description:
      'Нов, неотварян уред Greddy 60 мм със 7 цвята подсветка по избор. Измерва налягането на горивото до 8 бара — бензин или дизел. ' +
      'Сензор, стойка и кабели са включени в комплекта.\n\n' +
      'Измерва и напрежението на акумулатора и го показва на дисплея. Има аларма за високо и ниско налягане, като прагът в барове се задава. ' +
      'Предлага се цялата серия Greddy.',
    images: gallery('greddy-ured-nalyagane-gorivo-60mm', 12, 'Greddy уред за налягане на гориво 60 мм'),
    price: 66,
    currency: 'EUR',
    specifications: [
      NEW,
      { label: 'Тип', value: 'Оригинален' },
      { label: 'Измерва', value: 'Налягане на гориво, напрежение на акумулатора' },
      { label: 'Скала', value: 'до 8 bar' },
      { label: 'Гориво', value: 'Бензин или дизел' },
      { label: 'Диаметър', value: '60 мм' },
      { label: 'Аларма', value: 'Високо и ниско налягане, настройваем праг' },
      { label: 'Подсветка', value: '7 цвята по избор' },
      { label: 'В комплекта', value: 'Сензор, стойка, кабели' },
    ],
    tags: ['Greddy', 'Греди', 'уред', 'часовник', 'манометър', 'налягане гориво', 'бензин', 'дизел', 'дисплей', 'тунинг уреди'],
    externalUrl: olx('7MRJH', 'ured-nalyagane-gorivo-benzin-60mm-greddy-gredi-greydi-gredy-buustmetar-uredi-gredy-visok-klas-displey-smyana-na-tsveta-izmervatelen-chasovnik-manometar'),
    externalLabel: 'Обява в OLX',
    createdAt: '2026-10-02',
    featured: true,
  },
];
