import { CatalogView } from '../components/catalog/CatalogView';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { DemoNotice } from '../components/ui/DemoNotice';
import { site } from '../config/site';
import { dataFlags } from '../lib/catalog';
import { useSeo } from '../lib/seo';

export function CatalogPage() {
  useSeo({ title: 'Каталог', description: 'Всички тунинг продукти и аксесоари — филтрирайте по категория, марка и автомобил.', path: '/catalog' });
  return (
    <CatalogView
      header={
        <div className="animate-fade-up">
          <Breadcrumbs items={[{ label: 'Начало', to: '/' }, { label: 'Каталог' }]} />
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Каталог</h1>
          <p className="mt-2 max-w-2xl text-[15px] text-muted">Филтрирайте по категория, марка и автомобил или търсете директно по име и код.</p>
          {site.demoMode && dataFlags.hasPlaceholders && <DemoNotice className="mt-5" />}
        </div>
      }
    />
  );
}
