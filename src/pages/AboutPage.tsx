import { ArrowRight } from 'lucide-react';
import { HeroVisual } from '../components/HeroVisual';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ButtonLink } from '../components/ui/Button';
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
          <h1 className="mt-3 text-3xl font-semibold tracking-[0.02em] sm:text-5xl">{site.name}</h1>
          <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-muted">
            <p>
              {site.company?.legalName ?? site.name} е фирма със седалище в гр. Стара Загора. Вече над 13 години изграждаме самостоятелни
              системи за зелена енергия и продаваме компоненти за възобновяеми източници — за планината, хижата, палатката или автомобила.
            </p>
            <p>
              В този каталог събираме тунинг продуктите и аксесоарите за автомобили — измервателни уреди, панели и още, подредени по
              категории, за да намерите нужното бързо и да ни изпратите запитване за цена и наличност.
            </p>
            {site.company?.website && (
              <p>
                Соларни системи, инвертори, акумулатори и още продукти ще намерите в онлайн магазина ни{' '}
                <a href={site.company.website.url} target="_blank" rel="noopener" className="font-medium text-fg underline underline-offset-2 hover:text-accent-text">{site.company.website.label}</a>.
              </p>
            )}
          </div>
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
