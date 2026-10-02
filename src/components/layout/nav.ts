import { routes } from '../../lib/paths';

export const mainNav = [
  { label: 'Начало', to: routes.home },
  { label: 'Каталог', to: routes.catalog },
  { label: 'Категории', to: routes.categories },
  { label: 'Марки', to: routes.brands },
  { label: 'За нас', to: routes.about },
  { label: 'Контакти', to: routes.contact },
];

export const legalNav = [
  { label: 'Политика за поверителност', to: routes.privacy },
  { label: 'Общи условия', to: routes.terms },
  { label: 'Бисквитки', to: routes.cookies },
];
