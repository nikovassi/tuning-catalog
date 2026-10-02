import { CategoryCard } from '../components/catalog/CategoryCard';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SectionHeader } from '../components/ui/SectionHeader';
import { getCategories } from '../lib/catalog';
import { useSeo } from '../lib/seo';

export function CategoriesPage() {
  useSeo({ title: 'Категории', description: 'Всички категории тунинг продукти и аксесоари.', path: '/categories' });
  const cats = getCategories();
  return (
    <div className="container pt-6 sm:pt-8">
      <Breadcrumbs items={[{ label: 'Начало', to: '/' }, { label: 'Категории' }]} />
      <SectionHeader as="h1" className="mt-4" title="Категории" description={`${cats.length} категории продукти. Изберете категория, за да видите подкатегориите и продуктите в нея.`} />
      <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {cats.map((c) => <CategoryCard key={c.slug} category={c} />)}
      </div>
    </div>
  );
}
