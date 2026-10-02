import { ArrowRight } from 'lucide-react';
import { HeroVisual } from '../components/HeroVisual';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ButtonLink } from '../components/ui/Button';
import { DemoNotice } from '../components/ui/DemoNotice';
import { site } from '../config/site';
import { getBrands, getCategories, getProducts } from '../lib/catalog';
import { routes } from '../lib/paths';
import { useSeo } from '../lib/seo';

export function AboutPage() {
  useSeo({ title: 'За нас', path: '/about' });
  return (
    <div className="container pt-6 sm:pt-8">
      <Breadcrumbs items={[{ label: 'Начало', to: '/' }, { label: 'За нас' }]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="min-w-0 lg:col-span-7">
          <p className="eyebrow">За нас</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">{site.name}</h1>
          {/* TODO(данни): реалната история, опит и специализация на бизнеса. Не добавяйте непроверими твърдения. */}
          <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-muted">
            <p>Каталогът събира тунинг продукти и аксесоари на едно място — подредени по категории, марки и съвместимост с автомобила.</p>
            <p>Целта ни е да намерите нужния продукт бързо и да получите ясен отговор за цена, наличност и съвместимост чрез директно запитване.</p>
          </div>
          {site.demoMode && <DemoNotice className="mt-6">Текстът на тази страница е временен. Добавете реалното представяне на бизнеса в src/pages/AboutPage.tsx.</DemoNotice>}
          <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
            <ButtonLink to={routes.catalog} variant="primary" size="lg">Разгледай каталога <ArrowRight className="h-4 w-4" /></ButtonLink>
            <ButtonLink to={routes.contact} variant="secondary" size="lg">Контакти</ButtonLink>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-5">
          <div className="card relative overflow-hidden p-8">
            <HeroVisual className="mx-auto w-full max-w-sm text-fg" />
            <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-6 text-center">
              <div><dd className="font-display text-2xl font-semibold">{getProducts().length}</dd><dt className="text-[12px] text-subtle">продукта</dt></div>
              <div><dd className="font-display text-2xl font-semibold">{getCategories().length}</dd><dt className="text-[12px] text-subtle">категории</dt></div>
              <div><dd className="font-display text-2xl font-semibold">{getBrands().length}</dd><dt className="text-[12px] text-subtle">марки</dt></div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
