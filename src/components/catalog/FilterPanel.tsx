import { Check, ChevronDown } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { countBy, dataFlags, getBrand, getCategories, getCategory } from '../../lib/catalog';
import { cn } from '../../lib/cn';
import { applyFilters, type CatalogFilters } from '../../lib/filters';
import { availabilityLabel } from '../../lib/format';
import type { Availability, Product } from '../../types/catalog';
import { VehicleFinder } from './VehicleFinder';

interface Props {
  products: Product[];
  filters: CatalogFilters;
  onChange: (patch: Partial<CatalogFilters>) => void;
  /** Фиксирани от страницата филтри (напр. /categories/:slug) */
  locked?: { category?: boolean; brand?: boolean };
}

function Group({ title, children, defaultOpen = true, badge }: { title: string; children: ReactNode; defaultOpen?: boolean; badge?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line py-4 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 text-left text-[13px] font-semibold uppercase tracking-wider text-fg"
      >
        <span className="flex items-center gap-2">
          {title}
          {!!badge && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent/15 px-1.5 text-[11px] text-accent-text">{badge}</span>}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-subtle transition-transform duration-200', open && 'rotate-180')} aria-hidden />
      </button>
      {open && <div className="mt-3 animate-fade-in">{children}</div>}
    </div>
  );
}

function Option({ label, count, active, onClick, type = 'check' }: { label: string; count: number; active: boolean; onClick: () => void; type?: 'check' | 'radio' }) {
  return (
    <button
      type="button"
      role={type === 'check' ? 'checkbox' : 'radio'}
      aria-checked={active}
      onClick={onClick}
      disabled={!count && !active}
      className={cn(
        'group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[14px] transition-colors hover:bg-surface-2 disabled:opacity-40',
        active ? 'text-fg' : 'text-muted',
      )}
    >
      <span className={cn(
        'grid h-[18px] w-[18px] shrink-0 place-items-center border transition-colors',
        type === 'check' ? 'rounded-[5px]' : 'rounded-full',
        active ? 'border-fg bg-fg text-bg' : 'border-line-strong group-hover:border-fg/50',
      )}>
        {active && (type === 'check' ? <Check className="h-3 w-3" strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-bg" />)}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="font-mono text-[11px] tabular-nums text-subtle">{count}</span>
    </button>
  );
}

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export function FilterPanel({ products, filters, onChange, locked = {} }: Props) {
  const facets = useMemo(() => {
    const forCat = applyFilters(products, filters, ['category', 'subcategory']);
    const forSub = applyFilters(products, filters, ['subcategory']);
    const forBrand = applyFilters(products, filters, ['brands']);
    const forType = applyFilters(products, filters, ['types']);
    const forAvail = applyFilters(products, filters, ['availability']);
    return {
      cat: countBy('category', forCat),
      sub: countBy('subcategory', forSub),
      brand: countBy('brand', forBrand),
      type: countBy('productType', forType),
      avail: countBy('availability', forAvail),
    };
  }, [products, filters]);

  const category = filters.category ? getCategory(filters.category) : undefined;
  const subs = category?.subcategories.filter((s) => (facets.sub.get(s.slug) ?? 0) > 0 || filters.subcategory === s.slug) ?? [];
  const brandSlugs = [...new Set(products.map((p) => p.brand).filter((b): b is string => !!b))]
    .sort((a, b) => (getBrand(a)?.name ?? a).localeCompare(getBrand(b)?.name ?? b, 'bg'));
  const types = [...new Set(products.map((p) => p.productType).filter((t): t is string => !!t))].sort((a, b) => a.localeCompare(b, 'bg'));
  const avails = [...new Set(products.map((p) => p.availability).filter((a): a is Availability => !!a))];
  const priced = products.filter((p) => typeof p.price === 'number').map((p) => p.price!);

  return (
    <div className="text-fg">
      {dataFlags.hasCompatibility && (
        <Group title="Моят автомобил" badge={filters.make ? 1 : 0}>
          <VehicleFinder
            products={products}
            value={{ make: filters.make, model: filters.model, generation: filters.generation, engine: filters.engine, year: filters.year }}
            onChange={(v) => onChange({ make: v.make, model: v.model, generation: v.generation, engine: v.engine, year: v.year })}
          />
          {filters.make && (
            <p className="mt-3 text-[12px] leading-relaxed text-subtle">Показват се само продукти с въведена съвместимост за избрания автомобил.</p>
          )}
        </Group>
      )}

      {!locked.category && (
        <Group title="Категория" badge={filters.category ? 1 : 0}>
          <div className="-mx-2 flex flex-col">
            {getCategories().map((c) => (
              <Option
                key={c.slug}
                type="radio"
                label={c.name}
                count={facets.cat.get(c.slug) ?? 0}
                active={filters.category === c.slug}
                onClick={() => onChange({ category: filters.category === c.slug ? undefined : c.slug, subcategory: undefined })}
              />
            ))}
          </div>
        </Group>
      )}

      {subs.length > 0 && (
        <Group title="Подкатегория" badge={filters.subcategory ? 1 : 0}>
          <div className="-mx-2 flex flex-col">
            {subs.map((s) => (
              <Option
                key={s.slug}
                type="radio"
                label={s.name}
                count={facets.sub.get(s.slug) ?? 0}
                active={filters.subcategory === s.slug}
                onClick={() => onChange({ subcategory: filters.subcategory === s.slug ? undefined : s.slug })}
              />
            ))}
          </div>
        </Group>
      )}

      {!locked.brand && brandSlugs.length > 0 && (
        <Group title="Марка" badge={filters.brands.length}>
          <div className="-mx-2 flex flex-col">
            {brandSlugs.map((b) => (
              <Option key={b} label={getBrand(b)?.name ?? b} count={facets.brand.get(b) ?? 0} active={filters.brands.includes(b)} onClick={() => onChange({ brands: toggle(filters.brands, b) })} />
            ))}
          </div>
        </Group>
      )}

      {types.length > 0 && (
        <Group title="Тип продукт" badge={filters.types.length}>
          <div className="-mx-2 flex flex-col">
            {types.map((t) => (
              <Option key={t} label={t} count={facets.type.get(t) ?? 0} active={filters.types.includes(t)} onClick={() => onChange({ types: toggle(filters.types, t) })} />
            ))}
          </div>
        </Group>
      )}

      {priced.length > 1 && (
        <Group title="Цена">
          <PriceRange min={Math.floor(Math.min(...priced))} max={Math.ceil(Math.max(...priced))} filters={filters} onChange={onChange} />
        </Group>
      )}

      {avails.length > 0 && (
        <Group title="Наличност" badge={filters.availability.length}>
          <div className="-mx-2 flex flex-col">
            {avails.map((a) => (
              <Option key={a} label={availabilityLabel[a]} count={facets.avail.get(a) ?? 0} active={filters.availability.includes(a)} onClick={() => onChange({ availability: toggle(filters.availability, a) })} />
            ))}
          </div>
        </Group>
      )}
    </div>
  );
}

function PriceRange({ min, max, filters, onChange }: { min: number; max: number; filters: CatalogFilters; onChange: Props['onChange'] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <label className="text-[12px] text-muted">
        От
        <input type="number" inputMode="numeric" className="input mt-1" placeholder={String(min)} min={min} max={max}
          value={filters.priceMin ?? ''} onChange={(e) => onChange({ priceMin: e.target.value ? Number(e.target.value) : undefined })} />
      </label>
      <label className="text-[12px] text-muted">
        До
        <input type="number" inputMode="numeric" className="input mt-1" placeholder={String(max)} min={min} max={max}
          value={filters.priceMax ?? ''} onChange={(e) => onChange({ priceMax: e.target.value ? Number(e.target.value) : undefined })} />
      </label>
    </div>
  );
}
