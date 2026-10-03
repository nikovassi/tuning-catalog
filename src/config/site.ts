/**
 * Глобална конфигурация на сайта.
 * ВАЖНО: попълвайте само реални данни. Празните полета не се показват никъде в UI-а.
 * Източник на фирмените данни: energon07.com (страници „За нас“ и „Контакти“, 03.10.2026).
 * TODO(данни): ЕИК, точен адрес и работно време — не са публикувани на energon07.com.
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
    /** street е по избор; карта се показва само при mapEmbedUrl (реален адрес) */
    address?: { street?: string; city: string; postalCode?: string; country?: string; label?: string; mapEmbedUrl?: string };
    hours?: { days: string; time: string }[];
  };
  social: { label: string; url: string; type: 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'other' }[];
  company?: { legalName: string; eik?: string; vat?: string; website?: { label: string; url: string } };
  /** true докато в сайта има временни/шаблонни данни */
  demoMode: boolean;
}

const envUrl = (import.meta.env?.VITE_SITE_URL as string | undefined) ?? '';

export const site: SiteConfig = {
  name: 'ENERGON 07',
  shortName: 'E07',
  tagline: 'Тунинг продукти и аксесоари',
  description:
    'Каталог на ENERGON 07 с тунинг продукти и аксесоари за автомобили — измервателни уреди, интериор и още. Стара Загора.',
  url: envUrl.replace(/\/$/, ''),
  locale: 'bg_BG',
  defaultOgImage: 'og-image.png',
  contact: {
    phones: [{ value: '0895840296' }],
    email: 'yahooooo@abv.bg',
    address: { city: 'Стара Загора', label: 'Седалище' },
    hours: undefined,
  },
  social: [{ label: 'Facebook', url: 'https://www.facebook.com/magazinzaenergia', type: 'facebook' }],
  company: {
    legalName: 'ЕНЕРГОН 07 ЕООД',
    website: { label: 'energon07.com', url: 'https://energon07.com' },
  },
  demoMode: false,
};
