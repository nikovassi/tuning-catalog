import type { Product, VehicleFitment } from '../types/catalog';

export interface VehicleSelection {
  make?: string;
  model?: string;
  generation?: string;
  engine?: string;
  year?: number;
}

export const VEHICLE_LEVELS = ['make', 'model', 'generation', 'engine', 'year'] as const;
export type VehicleLevel = (typeof VEHICLE_LEVELS)[number];

export const vehicleLevelLabel: Record<VehicleLevel, string> = {
  make: 'Марка автомобил',
  model: 'Модел',
  generation: 'Поколение',
  engine: 'Двигател',
  year: 'Година',
};

export function hasVehicle(v: VehicleSelection): boolean {
  return VEHICLE_LEVELS.some((k) => v[k] !== undefined && v[k] !== '');
}

export function fitmentMatches(f: VehicleFitment, v: VehicleSelection): boolean {
  if (v.make && f.make !== v.make) return false;
  if (v.model && f.model !== v.model) return false;
  if (v.generation && f.generation !== v.generation) return false;
  if (v.engine && f.engine !== v.engine) return false;
  if (v.year) {
    if (f.yearFrom && v.year < f.yearFrom) return false;
    if (f.yearTo && v.year > f.yearTo) return false;
    if (!f.yearFrom && !f.yearTo) return false;
  }
  return true;
}

export function productFits(p: Product, v: VehicleSelection): boolean {
  if (!hasVehicle(v)) return true;
  return (p.compatibility ?? []).some((f) => fitmentMatches(f, v));
}

const uniqSorted = (xs: (string | undefined)[]) =>
  [...new Set(xs.filter((x): x is string => !!x))].sort((a, b) => a.localeCompare(b, 'bg', { numeric: true }));

/** Каскадни опции: всяко ниво зависи само от избраните по-горни нива. */
export function vehicleOptions(products: Product[], v: VehicleSelection) {
  const all = products.flatMap((p) => p.compatibility ?? []);
  const atMake = all.filter((f) => !v.make || f.make === v.make);
  const atModel = atMake.filter((f) => !v.model || f.model === v.model);
  const atGen = atModel.filter((f) => !v.generation || f.generation === v.generation);
  const atEngine = atGen.filter((f) => !v.engine || f.engine === v.engine);

  const years = new Set<number>();
  for (const f of atEngine) {
    if (!f.yearFrom && !f.yearTo) continue;
    const from = f.yearFrom ?? f.yearTo!;
    const to = f.yearTo ?? new Date().getFullYear();
    for (let y = from; y <= to; y++) years.add(y);
  }

  return {
    make: uniqSorted(all.map((f) => f.make)),
    model: v.make ? uniqSorted(atMake.map((f) => f.model)) : [],
    generation: v.model ? uniqSorted(atModel.map((f) => f.generation)) : [],
    engine: v.make ? uniqSorted(atGen.map((f) => f.engine)) : [],
    year: v.make ? [...years].sort((a, b) => b - a) : [],
  };
}

export function describeVehicle(v: VehicleSelection): string {
  return [v.make, v.model, v.generation, v.engine, v.year].filter(Boolean).join(' ');
}

/** Нулира всички нива под променено ниво. */
export function setVehicleLevel(v: VehicleSelection, level: VehicleLevel, value: string | undefined): VehicleSelection {
  const idx = VEHICLE_LEVELS.indexOf(level);
  const next: VehicleSelection = {};
  VEHICLE_LEVELS.forEach((k, i) => {
    if (i < idx) (next as Record<string, unknown>)[k] = v[k];
  });
  if (value) (next as Record<string, unknown>)[level] = level === 'year' ? Number(value) : value;
  // двигател и година не зависят строго от поколение — запазваме ги, ако са по-горе
  return next;
}
