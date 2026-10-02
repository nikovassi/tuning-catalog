/**
 * Data access слой. Компонентите НЕ импортират директно от src/data —
 * само от тук. При преминаване към CMS/API се сменя имплементацията на
 * този модул (напр. fetch + кеш), без промени по UI-а.
 */
import { brands as brandData } from '../data/brands';
import { categories as categoryData } from '../data/categories';
import { products as productData } from '../data/products';
import type { Brand, Category, Product } from '../types/catalog';

const bySlug = <T extends { slug: string }>(list: T[]) => new Map(list.map((x) => [x.slug, x]));

const productMap = bySlug(productData);
const categoryMap = bySlug(categoryData);
const brandMap = bySlug(brandData);

export const getProducts = (): Product[] => productData;
export const getProduct = (slug: string): Product | undefined => productMap.get(slug);

export const getCategory = (slug: string): Category | undefined => categoryMap.get(slug);
export const getBrand = (slug: string): Brand | undefined => brandMap.get(slug);

export function countBy<K extends keyof Product>(key: K, list: Product[] = productData): Map<string, number> {
  const m = new Map<string, number>();
  for (const p of list) {
    const v = p[key];
    if (typeof v === 'string') m.set(v, (m.get(v) ?? 0) + 1);
  }
  return m;
}

const categoryCounts = countBy('category');
const brandCounts = countBy('brand');

export const getCategoryCount = (slug: string) => categoryCounts.get(slug) ?? 0;
export const getBrandCount = (slug: string) => brandCounts.get(slug) ?? 0;

/** Категории, които имат поне един продукт, подредени по `order`. */
export function getCategories({ includeEmpty = false } = {}): Category[] {
  return [...categoryData]
    .filter((c) => includeEmpty || getCategoryCount(c.slug) > 0)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

/** Марки с поне един продукт, по азбучен ред. */
export function getBrands({ includeEmpty = false } = {}): Brand[] {
  return [...brandData]
    .filter((b) => includeEmpty || getBrandCount(b.slug) > 0)
    .sort((a, b) => a.name.localeCompare(b.name, 'bg'));
}

export function getSubcategoryName(categorySlug: string, subSlug?: string): string | undefined {
  if (!subSlug) return undefined;
  return categoryMap.get(categorySlug)?.subcategories.find((s) => s.slug === subSlug)?.name;
}

export function getSubcategoryCount(categorySlug: string, subSlug: string): number {
  return productData.filter((p) => p.category === categorySlug && p.subcategory === subSlug).length;
}

export function getFeaturedProducts(limit = 8): Product[] {
  const featured = productData.filter((p) => p.featured);
  return (featured.length ? featured : productData).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const same = productData.filter((p) => p.id !== product.id && p.category === product.category);
  const rest = productData.filter((p) => p.id !== product.id && p.category !== product.category && p.brand && p.brand === product.brand);
  return [...same, ...rest].slice(0, limit);
}

/** Флагове за наличие на данни — решават кои филтри/секции се показват. */
export const dataFlags = {
  hasPrices: productData.some((p) => typeof p.price === 'number'),
  hasAvailability: productData.some((p) => !!p.availability),
  hasProductTypes: productData.some((p) => !!p.productType),
  hasBrands: productData.some((p) => !!p.brand),
  hasCompatibility: productData.some((p) => (p.compatibility?.length ?? 0) > 0),
  hasPlaceholders: productData.some((p) => p.isPlaceholder),
};
