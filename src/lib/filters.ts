import type { Availability, Product } from '../types/catalog';
import { dataFlags } from './catalog';
import { searchProducts } from './search';
import { productFits, type VehicleSelection } from './vehicles';

export type SortKey = 'newest' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'relevance';

export interface CatalogFilters extends VehicleSelection {
  q?: string;
  category?: string;
  subcategory?: string;
  brands: string[];
  types: string[];
  availability: Availability[];
  priceMin?: number;
  priceMax?: number;
  sort: SortKey;
}

export const sortOptions: { value: SortKey; label: string; needsPrice?: boolean; needsQuery?: boolean }[] = [
  { value: 'relevance', label: 'Най-подходящи', needsQuery: true },
  { value: 'newest', label: 'Най-нови' },
  { value: 'name-asc', label: 'Име A–Я' },
  { value: 'name-desc', label: 'Име Я–A' },
  { value: 'price-asc', label: 'Цена възходящо', needsPrice: true },
  { value: 'price-desc', label: 'Цена низходящо', needsPrice: true },
];

export function availableSorts(hasQuery: boolean) {
  return sortOptions.filter((o) => (!o.needsPrice || dataFlags.hasPrices) && (!o.needsQuery || hasQuery));
}

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);
const num = (v: string | null) => (v && !Number.isNaN(Number(v)) ? Number(v) : undefined);

export function parseFilters(sp: URLSearchParams): CatalogFilters {
  const q = sp.get('q') ?? undefined;
  return {
    q,
    category: sp.get('cat') ?? undefined,
    subcategory: sp.get('sub') ?? undefined,
    brands: list(sp.get('brand')),
    types: list(sp.get('type')),
    availability: list(sp.get('avail')) as Availability[],
    priceMin: num(sp.get('min')),
    priceMax: num(sp.get('max')),
    make: sp.get('make') ?? undefined,
    model: sp.get('model') ?? undefined,
    generation: sp.get('gen') ?? undefined,
    engine: sp.get('engine') ?? undefined,
    year: num(sp.get('year')),
    sort: (sp.get('sort') as SortKey) ?? (q ? 'relevance' : 'newest'),
  };
}

export function serializeFilters(f: Partial<CatalogFilters>): URLSearchParams {
  const sp = new URLSearchParams();
  const set = (k: string, v: unknown) => {
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) return;
    sp.set(k, Array.isArray(v) ? v.join(',') : String(v));
  };
  set('q', f.q);
  set('cat', f.category);
  set('sub', f.subcategory);
  set('brand', f.brands);
  set('type', f.types);
  set('avail', f.availability);
  set('min', f.priceMin);
  set('max', f.priceMax);
  set('make', f.make);
  set('model', f.model);
  set('gen', f.generation);
  set('engine', f.engine);
  set('year', f.year);
  if (f.sort && f.sort !== (f.q ? 'relevance' : 'newest')) set('sort', f.sort);
  return sp;
}

type Facet = 'category' | 'subcategory' | 'brands' | 'types' | 'availability' | 'price' | 'vehicle' | 'q';

/** Прилага всички филтри без изброените — за изчисляване на броячи по фасети. */
export function applyFilters(products: Product[], f: CatalogFilters, skip: Facet[] = []): Product[] {
  const has = (k: Facet) => !skip.includes(k);
  let out = products.filter((p) => {
    if (has('category') && f.category && p.category !== f.category) return false;
    if (has('subcategory') && f.subcategory && p.subcategory !== f.subcategory) return false;
    if (has('brands') && f.brands.length && (!p.brand || !f.brands.includes(p.brand))) return false;
    if (has('types') && f.types.length && (!p.productType || !f.types.includes(p.productType))) return false;
    if (has('availability') && f.availability.length && (!p.availability || !f.availability.includes(p.availability))) return false;
    if (has('price') && (f.priceMin !== undefined || f.priceMax !== undefined)) {
      if (typeof p.price !== 'number') return false;
      if (f.priceMin !== undefined && p.price < f.priceMin) return false;
      if (f.priceMax !== undefined && p.price > f.priceMax) return false;
    }
    if (has('vehicle') && !productFits(p, f)) return false;
    return true;
  });
  if (has('q') && f.q) out = searchProducts(f.q, out);
  return out;
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const arr = [...products];
  const byName = (a: Product, b: Product) => a.name.localeCompare(b.name, 'bg', { numeric: true });
  switch (sort) {
    case 'relevance':
      return arr; // searchProducts вече е подредил
    case 'name-asc':
      return arr.sort(byName);
    case 'name-desc':
      return arr.sort((a, b) => byName(b, a));
    case 'price-asc':
      return arr.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    case 'price-desc':
      return arr.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    case 'newest':
    default:
      return arr.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
  }
}

export function countActive(f: CatalogFilters, preset: Partial<CatalogFilters> = {}): number {
  let n = 0;
  if (f.category && !preset.category) n++;
  if (f.subcategory) n++;
  n += f.brands.filter((b) => !preset.brands?.includes(b)).length;
  n += f.types.length + f.availability.length;
  if (f.priceMin !== undefined || f.priceMax !== undefined) n++;
  if (f.make) n++;
  return n;
}
