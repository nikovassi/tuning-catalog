import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCategoryCount } from '../../lib/catalog';
import { plural } from '../../lib/format';
import { asset, routes } from '../../lib/paths';
import type { Category } from '../../types/catalog';
import { CategoryIcon } from './CategoryIcon';

export function CategoryCard({ category, compact }: { category: Category; compact?: boolean }) {
  const count = getCategoryCount(category.slug);
  return (
    <Link
      to={routes.category(category.slug)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-card transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-4">
        {category.image ? (
          <img src={asset(category.image)} alt="" className="h-12 w-12 rounded-xl object-cover" loading="lazy" />
        ) : (
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-surface-2 text-fg transition-colors duration-300 group-hover:bg-inverse group-hover:text-inverse-fg">
            <CategoryIcon name={category.icon} className="h-6 w-6" />
          </span>
        )}
        <span className="font-mono text-[11px] tabular-nums text-subtle">{String(count).padStart(2, '0')}</span>
      </div>
      <h3 className="mt-5 text-base font-semibold">{category.name}</h3>
      {!compact && <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">{category.description}</p>}
      <div className="mt-4 flex items-center justify-between text-[13px]">
        <span className="text-subtle">{plural(count, 'продукт', 'продукта')}</span>
        <ArrowRight className="h-4 w-4 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-fg" aria-hidden />
      </div>
    </Link>
  );
}
