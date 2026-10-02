import { ArrowDownWideNarrow, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBrand, getCategory, getProducts, getSubcategoryName } from '../../lib/catalog';
import { applyFilters, availableSorts, countActive, parseFilters, serializeFilters, sortProducts, type CatalogFilters } from '../../lib/filters';
import { availabilityLabel, plural } from '../../lib/format';
import { describeVehicle } from '../../lib/vehicles';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Overlay } from '../ui/Overlay';
import { Select } from '../ui/Select';
import { FilterPanel } from './FilterPanel';
import { ProductGrid } from './ProductCard';

const PAGE = 24;

interface Props {
  header: ReactNode;
  preset?: { category?: string; brand?: string };
  belowHeader?: ReactNode;
}

export function CatalogView({ header, preset = {}, belowHeader }: Props) {
  const [sp, setSp] = useSearchParams();
  const [mobileFilters, setMobileFilters] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  const filters: CatalogFilters = useMemo(() => {
    const f = parseFilters(sp);
    if (preset.category) f.category = preset.category;
    if (preset.brand) f.brands = [preset.brand];
    return f;
  }, [sp, preset.category, preset.brand]);

  const all = getProducts();
  const results = useMemo(() => sortProducts(applyFilters(all, filters), filters.sort), [all, filters]);
  const sorts = availableSorts(!!filters.q);
  const active = countActive(filters, { category: preset.category, brands: preset.brand ? [preset.brand] : [] });

  useEffect(() => setLimit(PAGE), [sp]);

  const update = (patch: Partial<CatalogFilters>) => {
    const next = { ...filters, ...patch };
    if (preset.category) next.category = undefined;
    if (preset.brand) next.brands = next.brands.filter((b) => b !== preset.brand);
    setSp(serializeFilters(next), { replace: true });
  };

  const clearAll = () => setSp(filters.q ? serializeFilters({ q: filters.q }) : new URLSearchParams(), { replace: true });

  const chips: { label: string; onRemove: () => void }[] = [];
  if (filters.category && !preset.category) chips.push({ label: getCategory(filters.category)?.name ?? filters.category, onRemove: () => update({ category: undefined, subcategory: undefined }) });
  if (filters.subcategory && filters.category) chips.push({ label: getSubcategoryName(filters.category, filters.subcategory) ?? filters.subcategory, onRemove: () => update({ subcategory: undefined }) });
  filters.brands.filter((b) => b !== preset.brand).forEach((b) => chips.push({ label: getBrand(b)?.name ?? b, onRemove: () => update({ brands: filters.brands.filter((x) => x !== b) }) }));
  filters.types.forEach((t) => chips.push({ label: t, onRemove: () => update({ types: filters.types.filter((x) => x !== t) }) }));
  filters.availability.forEach((a) => chips.push({ label: availabilityLabel[a], onRemove: () => update({ availability: filters.availability.filter((x) => x !== a) }) }));
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) chips.push({ label: `Цена ${filters.priceMin ?? 0}–${filters.priceMax ?? '…'}`, onRemove: () => update({ priceMin: undefined, priceMax: undefined }) });
  if (filters.make) chips.push({ label: describeVehicle(filters), onRemove: () => update({ make: undefined, model: undefined, generation: undefined, engine: undefined, year: undefined }) });

  const scope = useMemo(() => all.filter((p) => (!preset.category || p.category === preset.category) && (!preset.brand || p.brand === preset.brand)), [all, preset.category, preset.brand]);
  const panel = <FilterPanel products={scope} filters={filters} onChange={update} locked={{ category: !!preset.category, brand: !!preset.brand }} />;

  return (
    <div className="container pb-8 pt-6 sm:pt-8">
      {header}
      {belowHeader}

      <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_1fr] xl:grid-cols-[18rem_1fr]">
        <aside className="hidden lg:block" aria-label="Филтри">
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2 no-scrollbar">
            <div className="flex items-center justify-between pb-2">
              <p className="text-[15px] font-semibold">Филтри</p>
              {active > 0 && <button type="button" onClick={clearAll} className="text-[13px] font-medium text-muted hover:text-fg">Изчисти ({active})</button>}
            </div>
            {panel}
          </div>
        </aside>

        <section aria-label="Продукти" className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" aria-hidden />
              <input
                type="search"
                aria-label="Търсене в резултатите"
                placeholder="Търси по име, марка, код, автомобил…"
                className="input pl-10"
                value={filters.q ?? ''}
                onChange={(e) => update({ q: e.target.value || undefined, sort: filters.sort === 'relevance' && !e.target.value ? 'newest' : filters.sort })}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1 lg:hidden" onClick={() => setMobileFilters(true)}>
                <SlidersHorizontal className="h-4 w-4" /> Филтри
                {active > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] text-accent-fg">{active}</span>}
              </Button>
              <label className="flex flex-1 items-center gap-2 sm:flex-none">
                <span className="sr-only">Сортиране</span>
                <ArrowDownWideNarrow className="hidden h-4 w-4 text-subtle sm:block" aria-hidden />
                <Select value={filters.sort} onChange={(e) => update({ sort: e.target.value as CatalogFilters['sort'] })} className="w-full sm:w-52">
                  {sorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </Select>
              </label>
            </div>
          </div>

          <div className="mt-4 flex min-h-8 flex-wrap items-center gap-2">
            <p className="mr-2 text-[13px] text-muted" aria-live="polite">
              <span className="font-semibold text-fg tabular-nums">{results.length}</span> {results.length === 1 ? 'продукт' : 'продукта'}
            </p>
            {chips.map((c) => (
              <button key={c.label} type="button" onClick={c.onRemove}
                className="group inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 text-[12px] font-medium text-fg transition-colors hover:border-line-strong animate-scale-in">
                {c.label}
                <X className="h-3.5 w-3.5 text-subtle group-hover:text-fg" aria-label="Премахни" />
              </button>
            ))}
            {chips.length > 1 && <button type="button" onClick={clearAll} className="text-[12px] font-medium text-muted underline-offset-2 hover:text-fg hover:underline">Изчисти всички</button>}
          </div>

          <div className="mt-5">
            {results.length ? (
              <>
                <ProductGrid products={results.slice(0, limit)} />
                {results.length > limit && (
                  <div className="mt-10 flex flex-col items-center gap-3">
                    <p className="text-[13px] text-subtle">Показани {limit} от {plural(results.length, 'продукт', 'продукта')}</p>
                    <Button variant="secondary" onClick={() => setLimit((l) => l + PAGE)}>Покажи още</Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title={filters.q ? 'Не открихме продукти по това търсене.' : 'Няма продукти по избраните филтри.'}
                description={filters.q ? `Няма резултати за „${filters.q}“. Опитайте с друга дума, код или по-обща заявка.` : 'Премахнете част от филтрите, за да видите повече продукти.'}
                action={<Button variant="primary" onClick={() => setSp(new URLSearchParams(), { replace: true })}>Покажи всички продукти</Button>}
              />
            )}
          </div>
        </section>
      </div>

      <Overlay open={mobileFilters} onClose={() => setMobileFilters(false)} label="Филтри" variant="drawer-left">
        <div className="flex h-16 shrink-0 items-center border-b border-line px-5">
          <p className="text-[16px] font-semibold">Филтри</p>
        </div>
        <div className="flex-1 overflow-y-auto px-5">{panel}</div>
        <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-line p-4">
          <Button variant="secondary" onClick={clearAll} disabled={!active}>Изчисти</Button>
          <Button variant="primary" onClick={() => setMobileFilters(false)}>Покажи {results.length}</Button>
        </div>
      </Overlay>
    </div>
  );
}
