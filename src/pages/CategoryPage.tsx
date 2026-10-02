import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CatalogView } from '../components/catalog/CatalogView';
import { CategoryIcon } from '../components/catalog/CategoryIcon';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { cn } from '../lib/cn';
import { getCategory, getCategoryCount, getSubcategoryCount } from '../lib/catalog';
import { routes } from '../lib/paths';
import { useSeo } from '../lib/seo';
import { NotFoundPage } from './NotFoundPage';

export function CategoryPage() {
  const { slug = '' } = useParams();
  const [sp] = useSearchParams();
  const category = getCategory(slug);
  useSeo({ title: category?.name ?? 'Категорията не е намерена', description: category?.description, path: routes.category(slug), noindex: !category });
  if (!category) return <NotFoundPage />;

  const activeSub = sp.get('sub');
  const subs = category.subcategories.filter((s) => getSubcategoryCount(category.slug, s.slug) > 0);

  return (
    <CatalogView
      key={slug}
      preset={{ category: category.slug }}
      header={
        <div className="animate-fade-up">
          <Breadcrumbs items={[{ label: 'Начало', to: '/' }, { label: 'Категории', to: routes.categories }, { label: category.name }]} />
          <div className="mt-4 flex items-start gap-4">
            <span className="hidden h-14 w-14 shrink-0 place-items-center rounded-2xl bg-inverse text-inverse-fg sm:grid">
              <CategoryIcon name={category.icon} className="h-7 w-7" />
            </span>
            <div>
              <h1 className="text-3xl font-semibold sm:text-4xl">{category.name}</h1>
              <p className="mt-2 max-w-2xl text-[15px] text-muted">{category.description} <span className="text-subtle">· {getCategoryCount(category.slug)} продукта</span></p>
            </div>
          </div>
        </div>
      }
      belowHeader={subs.length > 0 && (
        <nav aria-label="Подкатегории" className="-mx-4 mt-6 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
          <ul className="flex gap-2">
            <li>
              <Link to={routes.category(category.slug)} className={cn('inline-flex whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors', !activeSub ? 'border-fg bg-fg text-bg' : 'border-line text-muted hover:border-line-strong hover:text-fg')}>
                Всички
              </Link>
            </li>
            {subs.map((s) => (
              <li key={s.slug}>
                <Link to={`${routes.category(category.slug)}?sub=${s.slug}`} className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors', activeSub === s.slug ? 'border-fg bg-fg text-bg' : 'border-line text-muted hover:border-line-strong hover:text-fg')}>
                  {s.name} <span className="font-mono text-[11px] opacity-60">{getSubcategoryCount(category.slug, s.slug)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    />
  );
}
