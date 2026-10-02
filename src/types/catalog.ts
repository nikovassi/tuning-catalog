/**
 * Модел на каталога. Всички полета, за които няма реални данни, са optional —
 * UI-ят показва секция/филтър само когато има стойност.
 * Структурата следва типичен headless CMS (Strapi, Sanity, Directus, Supabase),
 * за да може data слоят да се смени без промени по компонентите.
 */

export type Availability = 'in_stock' | 'on_order' | 'out_of_stock' | 'discontinued';

export interface ProductImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Specification {
  label: string;
  value: string;
}

/** Един запис за съвместимост. Всяко ниво е optional — „make“ е минимумът. */
export interface VehicleFitment {
  make: string;
  model?: string;
  generation?: string;
  engine?: string;
  yearFrom?: number;
  yearTo?: number;
  note?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** slug на марката от brands.ts */
  brand?: string;
  /** slug на категорията от categories.ts */
  category: string;
  /** slug на подкатегорията в рамките на категорията */
  subcategory?: string;
  productType?: string;
  shortDescription?: string;
  description?: string;
  images: ProductImage[];
  price?: number;
  currency?: 'BGN' | 'EUR';
  availability?: Availability;
  sku?: string;
  compatibility?: VehicleFitment[];
  specifications?: Specification[];
  tags?: string[];
  externalUrl?: string;
  /** Текст на бутона за externalUrl (по подразбиране „Страница на производителя“) */
  externalLabel?: string;
  /** ISO дата — използва се за сортиране „Най-нови“ */
  createdAt?: string;
  featured?: boolean;
  /** true = демонстрационен запис за разработка; не е реален продукт */
  isPlaceholder?: boolean;
}

export interface Subcategory {
  slug: string;
  name: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  /** Име на иконка от lucide-react (виж components/catalog/CategoryIcon.tsx) */
  icon: string;
  image?: string;
  subcategories: Subcategory[];
  order?: number;
}

export interface Brand {
  slug: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  country?: string;
  isPlaceholder?: boolean;
}
