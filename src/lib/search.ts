import type { Brand, Category, Product } from '../types/catalog';
import { getBrand, getBrands, getCategories, getCategory, getProducts, getSubcategoryName } from './catalog';
import { formatFitment } from './format';
import { transliterate } from './slug';

/**
 * Клиентско търсене. Работи с кирилица и латиница едновременно
 * („маркуч“ ≈ „markuch“), игнорира интервали/тирета („E 46“ ≈ „e46“)
 * и изисква всяка дума от заявката да присъства в продукта.
 * При голям каталог (>5 000 артикула) заменете с Pagefind / Meilisearch / Algolia.
 */

export function normalize(s: string): string {
  return transliterate(s.normalize('NFKD').replace(/[̀-ͯ]/g, '')).replace(/[^a-z0-9]+/g, ' ').trim();
}
const compact = (s: string) => s.replace(/\s+/g, '');

interface Indexed {
  product: Product;
  name: string;
  strong: string; // марка, sku, категория
  all: string;
  allCompact: string;
}

let index: Indexed[] | null = null;

function buildIndex(): Indexed[] {
  return getProducts().map((p) => {
    const cat = getCategory(p.category);
    const brand = p.brand ? getBrand(p.brand)?.name : '';
    const strong = normalize([brand, p.sku, cat?.name, getSubcategoryName(p.category, p.subcategory), p.productType].filter(Boolean).join(' '));
    const name = normalize(p.name);
    const all = normalize(
      [p.name, brand, p.sku, cat?.name, getSubcategoryName(p.category, p.subcategory), p.productType, p.shortDescription,
        ...(p.tags ?? []), ...(p.compatibility ?? []).map(formatFitment)].filter(Boolean).join(' '),
    );
    return { product: p, name, strong, all, allCompact: compact(all) };
  });
}

export function searchProducts(query: string, list?: Product[]): Product[] {
  const q = normalize(query);
  if (!q) return list ?? getProducts();
  index ??= buildIndex();
  const tokens = q.split(' ').filter(Boolean);
  const allow = list ? new Set(list.map((p) => p.id)) : null;
  const qCompact = compact(q);

  const scored: { p: Product; s: number }[] = [];
  for (const it of index) {
    if (allow && !allow.has(it.product.id)) continue;
    const phrase = it.allCompact.includes(qCompact);
    const every = tokens.every((t) => it.all.includes(t) || it.allCompact.includes(t));
    if (!every && !phrase) continue;
    let s = 0;
    if (it.name.startsWith(q)) s += 50;
    if (it.name.includes(q)) s += 25;
    for (const t of tokens) {
      if (it.name.includes(t)) s += 10;
      if (it.strong.includes(t)) s += 6;
    }
    if (phrase) s += 8;
    scored.push({ p: it.product, s });
  }
  return scored.sort((a, b) => b.s - a.s).map((x) => x.p);
}

export interface Suggestions {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  total: number;
}

export function suggest(query: string, limit = 6): Suggestions {
  const q = normalize(query);
  if (!q) return { products: [], categories: [], brands: [], total: 0 };
  const found = searchProducts(query);
  const match = (name: string) => normalize(name).includes(q);
  return {
    products: found.slice(0, limit),
    categories: getCategories().filter((c) => match(c.name) || c.subcategories.some((s) => match(s.name))).slice(0, 3),
    brands: getBrands().filter((b) => match(b.name)).slice(0, 3),
    total: found.length,
  };
}
