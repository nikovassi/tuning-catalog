import { ArrowRight, CornerDownLeft, Folder, Search, Tag, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBrand, getCategory } from '../../lib/catalog';
import { cn } from '../../lib/cn';
import { routes } from '../../lib/paths';
import { suggest } from '../../lib/search';
import { ProductImage } from '../catalog/ProductImage';

interface Props {
  /** inline: падащо меню под полето; panel: резултатите са винаги под полето (мобилен диалог) */
  mode?: 'inline' | 'panel';
  autoFocus?: boolean;
  onNavigate?: () => void;
  className?: string;
  placeholder?: string;
  size?: 'md' | 'lg';
}

type Item = { key: string; to: string; kind: 'product' | 'category' | 'brand' | 'all' };

export function SearchBox({ mode = 'inline', autoFocus, onNavigate, className, placeholder = 'Търси продукт, марка, автомобил или код…', size = 'md' }: Props) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [debounced, setDebounced] = useState('');
  const navigate = useNavigate();
  const listId = useId();
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 90);
    return () => clearTimeout(t);
  }, [q]);

  const s = useMemo(() => suggest(debounced), [debounced]);
  const items: Item[] = useMemo(() => {
    if (!debounced.trim()) return [];
    return [
      ...s.categories.map((c) => ({ key: `c-${c.slug}`, to: routes.category(c.slug), kind: 'category' as const })),
      ...s.brands.map((b) => ({ key: `b-${b.slug}`, to: routes.brand(b.slug), kind: 'brand' as const })),
      ...s.products.map((p) => ({ key: `p-${p.slug}`, to: routes.product(p.slug), kind: 'product' as const })),
      { key: 'all', to: `${routes.catalog}?q=${encodeURIComponent(debounced.trim())}`, kind: 'all' as const },
    ];
  }, [s, debounced]);

  useEffect(() => setActive(-1), [debounced]);

  useEffect(() => {
    if (mode !== 'inline') return;
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [mode]);

  // „/“ фокусира търсенето (desktop)
  useEffect(() => {
    if (mode !== 'inline') return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) { e.preventDefault(); input.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mode]);

  const go = (to: string) => {
    navigate(to);
    setOpen(false);
    setQ('');
    input.current?.blur();
    onNavigate?.();
  };

  const submit = () => {
    if (active >= 0 && items[active]) return go(items[active].to);
    if (q.trim()) go(`${routes.catalog}?q=${encodeURIComponent(q.trim())}`);
  };

  const showResults = (mode === 'panel' || open) && q.trim().length > 0;
  let idx = -1;
  const optProps = (to: string) => {
    idx += 1;
    const i = idx;
    return {
      id: `${listId}-${i}`,
      role: 'option',
      'aria-selected': active === i,
      onMouseEnter: () => setActive(i),
      onClick: () => go(to),
      className: cn('flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors', active === i ? 'bg-surface-2' : 'hover:bg-surface-2'),
    } as const;
  };

  return (
    <div ref={root} className={cn('relative', className)}>
      <div className="relative">
        <Search className={cn('pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle', size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} aria-hidden />
        <input
          ref={input}
          type="search"
          role="combobox"
          aria-expanded={showResults}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          aria-label="Търсене в каталога"
          autoFocus={autoFocus}
          data-autofocus={autoFocus ? '' : undefined}
          value={q}
          placeholder={placeholder}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, items.length - 1)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
            else if (e.key === 'Enter') { e.preventDefault(); submit(); }
            else if (e.key === 'Escape') { setOpen(false); input.current?.blur(); }
          }}
          className={cn(
            'input pl-10 pr-10 [&::-webkit-search-cancel-button]:hidden',
            size === 'lg' ? 'h-14 rounded-2xl pl-12 text-base' : 'h-10 bg-surface-2/70 hover:bg-surface',
          )}
        />
        {q ? (
          <button type="button" aria-label="Изчисти" onClick={() => { setQ(''); input.current?.focus(); }}
            className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-subtle hover:bg-surface-2 hover:text-fg">
            <X className="h-4 w-4" />
          </button>
        ) : mode === 'inline' && (
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-line px-1.5 font-mono text-[11px] text-subtle lg:block">/</kbd>
        )}
      </div>

      {showResults && (
        <div
          id={listId}
          role="listbox"
          className={cn(
            'overflow-y-auto overscroll-contain',
            mode === 'inline'
              ? 'absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[70vh] min-w-[22rem] rounded-2xl border border-line bg-surface p-2 shadow-pop animate-scale-in'
              : 'mt-4 flex-1',
          )}
        >
          {s.total === 0 && !s.categories.length && !s.brands.length ? (
            <div className="px-4 py-8 text-center">
              <p className="font-medium">Не открихме продукти по това търсене.</p>
              <p className="mt-1 text-[13px] text-muted">Проверете изписването или опитайте с по-обща дума.</p>
              <button type="button" onClick={() => go(routes.catalog)} className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-accent-text hover:underline">
                Покажи всички продукти <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              {(s.categories.length > 0 || s.brands.length > 0) && (
                <div className="mb-1 border-b border-line pb-1">
                  <p className="eyebrow px-3 pb-1 pt-2">Категории и марки</p>
                  {s.categories.map((c) => (
                    <div key={c.slug} {...optProps(routes.category(c.slug))}>
                      <Folder className="h-4 w-4 text-subtle" aria-hidden />
                      <span className="text-[14px]">{c.name}</span>
                    </div>
                  ))}
                  {s.brands.map((b) => (
                    <div key={b.slug} {...optProps(routes.brand(b.slug))}>
                      <Tag className="h-4 w-4 text-subtle" aria-hidden />
                      <span className="text-[14px]">{b.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {s.products.length > 0 && <p className="eyebrow px-3 pb-1 pt-2">Продукти</p>}
              {s.products.map((p) => (
                <div key={p.slug} {...optProps(routes.product(p.slug))}>
                  <ProductImage product={p} ratio="aspect-square" className="h-11 w-11 shrink-0 rounded-lg" imgClassName="[&_svg]:h-5 [&_svg]:w-5 [&_span]:hidden" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium">{p.name}</p>
                    <p className="truncate text-[12px] text-subtle">
                      {[p.brand && getBrand(p.brand)?.name, getCategory(p.category)?.name, p.sku].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </div>
              ))}
              <div {...optProps(`${routes.catalog}?q=${encodeURIComponent(debounced.trim())}`)}>
                <Search className="h-4 w-4 text-subtle" aria-hidden />
                <span className="flex-1 text-[14px]">
                  Всички резултати за „<span className="font-medium">{debounced.trim()}</span>“ <span className="text-subtle">({s.total})</span>
                </span>
                <CornerDownLeft className="h-4 w-4 text-subtle" aria-hidden />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
