import type { Availability, Product, VehicleFitment } from '../types/catalog';

export function formatPrice(p: Pick<Product, 'price' | 'currency'>): string | undefined {
  if (typeof p.price !== 'number') return undefined;
  return new Intl.NumberFormat('bg-BG', { style: 'currency', currency: p.currency ?? 'EUR', maximumFractionDigits: 2 }).format(p.price);
}

export const availabilityLabel: Record<Availability, string> = {
  in_stock: 'В наличност',
  on_order: 'По поръчка',
  out_of_stock: 'Изчерпан',
  discontinued: 'Спрян от производство',
};

export function formatYears(f: Pick<VehicleFitment, 'yearFrom' | 'yearTo'>): string | undefined {
  if (!f.yearFrom && !f.yearTo) return undefined;
  if (f.yearFrom && f.yearTo) return `${f.yearFrom}–${f.yearTo}`;
  return f.yearFrom ? `от ${f.yearFrom}` : `до ${f.yearTo}`;
}

export function formatFitment(f: VehicleFitment): string {
  return [f.make, f.model, f.generation, f.engine, formatYears(f)].filter(Boolean).join(' · ');
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}
