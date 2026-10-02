/**
 * Глобална конфигурация на сайта.
 * ВАЖНО: попълнете само реални данни. Празните полета не се показват никъде в UI-а.
 * TODO(данни): име на бизнеса, контакти, адрес, работно време, социални профили.
 */
export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  defaultOgImage: string;
  contact: {
    phones: { label?: string; value: string }[];
    email?: string;
    address?: { street: string; city: string; postalCode?: string; country?: string; mapEmbedUrl?: string };
    hours?: { days: string; time: string }[];
  };
  social: { label: string; url: string; type: 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'other' }[];
  company?: { legalName: string; eik?: string; vat?: string };
  /** true докато каталогът съдържа само демонстрационни записи */
  demoMode: boolean;
}

const envUrl = (import.meta.env?.VITE_SITE_URL as string | undefined) ?? '';

export const site: SiteConfig = {
  // TODO(данни): заменете работното име с реалното име на бизнеса.
  name: 'Tuning Catalog',
  shortName: 'TC',
  tagline: 'Тунинг продукти и аксесоари',
  description:
    'Каталог с тунинг продукти и аксесоари за автомобили — осветление, окачване, изпускателни системи, интериор, екстериор и силов тунинг.',
  url: envUrl.replace(/\/$/, ''),
  locale: 'bg_BG',
  defaultOgImage: 'og-image.png',
  contact: {
    phones: [],
    email: undefined,
    address: undefined,
    hours: undefined,
  },
  social: [],
  company: undefined,
  demoMode: true,
};
