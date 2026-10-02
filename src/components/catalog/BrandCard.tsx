import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBrandCount } from '../../lib/catalog';
import { plural } from '../../lib/format';
import { asset, routes } from '../../lib/paths';
import type { Brand } from '../../types/catalog';
import { Badge } from '../ui/Badge';

export function BrandCard({ brand }: { brand: Brand }) {
  const count = getBrandCount(brand.slug);
  return (
    <Link
      to={routes.brand(brand.slug)}
      className="group flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift"
    >
      <div className="grid h-20 place-items-center rounded-xl bg-surface-2">
        {brand.logo ? (
          <img src={asset(brand.logo)} alt={brand.name} className="max-h-12 max-w-[70%] object-contain" loading="lazy" />
        ) : (
          <span className="font-display text-xl font-semibold tracking-tight text-muted">{brand.name}</span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <h3 className="truncate font-semibold">{brand.name}</h3>
        {brand.isPlaceholder && <Badge tone="demo">Пример</Badge>}
      </div>
      <div className="mt-1 flex items-center justify-between text-[13px] text-subtle">
        <span>{plural(count, 'продукт', 'продукта')}</span>
        <span className="inline-flex items-center gap-1 font-medium text-fg">
          Разгледай <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
