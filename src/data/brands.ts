import type { Brand } from '../types/catalog';

/**
 * Марки (производители) на продуктите — само изрично посочени в източника.
 * Лого: поставете файла в public/brands/ и попълнете logo: 'brands/<file>.svg'.
 * „Тип VDO“ в обявите означава стил, а не марка — затова VDO не е добавена.
 */
export const brands: Brand[] = [
  { slug: 'greddy', name: 'Greddy' },
];
