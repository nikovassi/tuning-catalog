import { BrandCard } from '../components/catalog/BrandCard';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionHeader } from '../components/ui/SectionHeader';
import { getBrands } from '../lib/catalog';
import { useSeo } from '../lib/seo';

export function BrandsPage() {
  useSeo({ title: 'Марки', description: 'Марките продукти в каталога.', path: '/brands' });
  const brands = getBrands();
  return (
    <div className="container pt-6 sm:pt-8">
      <Breadcrumbs items={[{ label: 'Начало', to: '/' }, { label: 'Марки' }]} />
      <SectionHeader as="h1" className="mt-4" title="Марки" description="Производителите на продуктите в каталога." />
      <div className="mt-8">
        {brands.length ? (
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {brands.map((b) => <BrandCard key={b.slug} brand={b} />)}
          </div>
        ) : (
          <EmptyState title="Все още няма въведени марки" description="Марките ще се появят тук, когато бъдат добавени към продуктите." />
        )}
      </div>
    </div>
  );
}
