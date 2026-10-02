import type { Category } from '../types/catalog';

/**
 * Структура на категориите. Подкатегориите са организационни — не съдържат продуктови факти.
 * TODO(данни): синхронизирайте с реалния асортимент; премахнете категориите без продукти
 * или ги оставете — празните категории не се показват в публичните списъци.
 */
export const categories: Category[] = [
  {
    slug: 'osvetlenie', name: 'Авто осветление', icon: 'Lightbulb', order: 1,
    description: 'Фарове, стопове, мигачи, крушки и дневни светлини.',
    subcategories: [
      { slug: 'farove', name: 'Фарове' },
      { slug: 'stopove', name: 'Стопове' },
      { slug: 'migachi', name: 'Мигачи' },
      { slug: 'krushki', name: 'Крушки' },
      { slug: 'dnevni-svetlini', name: 'Дневни светлини' },
    ],
  },
  {
    slug: 'okachvane', name: 'Спортни окачвания', icon: 'ArrowDownUp', order: 2,
    description: 'Пружини, регулируеми окачвания, амортисьори и компоненти.',
    subcategories: [
      { slug: 'pruzhini', name: 'Понижаващи пружини' },
      { slug: 'koilovers', name: 'Регулируеми окачвания' },
      { slug: 'amortisyori', name: 'Амортисьори' },
      { slug: 'komponenti', name: 'Тампони и компоненти' },
    ],
  },
  {
    slug: 'sedalki', name: 'Спортни седалки', icon: 'Armchair', order: 3,
    description: 'Седалки тип „кофа“, колани и монтажни релси.',
    subcategories: [
      { slug: 'kofi', name: 'Седалки тип кофа' },
      { slug: 'kolani', name: 'Колани' },
      { slug: 'relsi', name: 'Релси и конзоли' },
    ],
  },
  {
    slug: 'interior', name: 'Интериор', icon: 'CircleDot', order: 4,
    description: 'Волани, скоростни топки, педали и интериорни аксесоари.',
    subcategories: [
      { slug: 'volani', name: 'Волани' },
      { slug: 'topki', name: 'Скоростни топки' },
      { slug: 'pedali', name: 'Педали' },
      { slug: 'aksesoari', name: 'Аксесоари за салона' },
    ],
  },
  {
    slug: 'izpuskane', name: 'Изпускателна система', icon: 'Wind', order: 5,
    description: 'Гърнета, резонатори, колектори, скоби и термоизолация.',
    subcategories: [
      { slug: 'garneta', name: 'Гърнета' },
      { slug: 'rezonatori', name: 'Резонатори' },
      { slug: 'kolektori', name: 'Колектори' },
      { slug: 'skobi', name: 'Скоби и V-band' },
      { slug: 'termoizolatsiya', name: 'Термоизолация' },
    ],
  },
  {
    slug: 'eksterior', name: 'Екстериор', icon: 'Car', order: 6,
    description: 'Решетки, брони, спойлери, огледала и декоративни елементи.',
    subcategories: [
      { slug: 'reshetki', name: 'Решетки' },
      { slug: 'broni', name: 'Брони и лайстни' },
      { slug: 'spoyleri', name: 'Спойлери' },
      { slug: 'ogledala', name: 'Огледала' },
    ],
  },
  {
    slug: 'silov-tuning', name: 'Силов тунинг', icon: 'Gauge', order: 7,
    description: 'Турбо компоненти, контролери, горивни системи и дюзи.',
    subcategories: [
      { slug: 'turbo', name: 'Турбо компоненти' },
      { slug: 'boost-kontroleri', name: 'Boost контролери' },
      { slug: 'gorivna-sistema', name: 'Горивна система' },
      { slug: 'blow-off', name: 'Blow-off клапани' },
    ],
  },
  {
    slug: 'silikonovi-markuchi', name: 'Силиконови маркучи', icon: 'Spline', order: 8,
    description: 'Прави, коляна, редукции и вакуумни маркучи.',
    subcategories: [
      { slug: 'pravi', name: 'Прави' },
      { slug: 'kolyana', name: 'Коляна' },
      { slug: 'redukcii', name: 'Редукции' },
      { slug: 'vakuumni', name: 'Вакуумни' },
    ],
  },
  {
    slug: 'aluminievi-trabi', name: 'Алуминиеви тръби', icon: 'Pipette', order: 9,
    description: 'Прави и огънати тръби за интеркулер и всмукателни системи.',
    subcategories: [
      { slug: 'pravi', name: 'Прави' },
      { slug: 'ogunati', name: 'Огънати' },
    ],
  },
  {
    slug: 'interkuleri', name: 'Интеркулери', icon: 'Grid3x3', order: 10,
    description: 'Универсални и специфични интеркулери и комплекти.',
    subcategories: [
      { slug: 'universalni', name: 'Универсални' },
      { slug: 'komplekti', name: 'Комплекти' },
    ],
  },
  {
    slug: 'distantsionni-flantsi', name: 'Дистанционни фланци', icon: 'Disc3', order: 11,
    description: 'Фланци за джанти и монтажни болтове.',
    subcategories: [
      { slug: 'flantsi', name: 'Фланци' },
      { slug: 'boltove', name: 'Болтове и гайки' },
    ],
  },
  {
    slug: 'ohladitelna-sistema', name: 'Охладителна система', icon: 'Snowflake', order: 12,
    description: 'Радиатори, маслени охладители, вентилатори и AN фитинги.',
    subcategories: [
      { slug: 'radiatori', name: 'Радиатори' },
      { slug: 'maslen-ohladitel', name: 'Маслени охладители' },
      { slug: 'an-fitingi', name: 'AN фитинги' },
    ],
  },
  {
    slug: 'uredi', name: 'Измервателни уреди', icon: 'Activity', order: 13,
    description: 'Уреди за температура, налягане и обороти, комплекти и аксесоари за монтаж.',
    subcategories: [
      { slug: 'temperatura', name: 'Температура' },
      { slug: 'nalyagane', name: 'Налягане' },
      { slug: 'oborotomeri', name: 'Оборотомери' },
      { slug: 'komplekti', name: 'Комплекти уреди' },
      { slug: 'stoyki', name: 'Стойки' },
    ],
  },
  {
    slug: 'filtri', name: 'Спортни филтри', icon: 'Filter', order: 14,
    description: 'Конусни и панелни въздушни филтри и аксесоари.',
    subcategories: [
      { slug: 'konusni', name: 'Конусни' },
      { slug: 'panelni', name: 'Панелни' },
    ],
  },
  {
    slug: 'drugi', name: 'Други', icon: 'Package', order: 15,
    description: 'Продукти извън основните категории.',
    subcategories: [],
  },
];
