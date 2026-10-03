import { ArrowRight, Car, Layers, MessageSquareText, Search } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { site } from '../config/site';
import { HeroVisual } from '../components/HeroVisual';
import { BrandCard } from '../components/catalog/BrandCard';
import { CategoryCard } from '../components/catalog/CategoryCard';
import { ProductGrid } from '../components/catalog/ProductCard';
import { VehicleFinder } from '../components/catalog/VehicleFinder';
import { useInquiry } from '../components/inquiry/InquiryContext';
import { ContactDetails, hasContactData } from '../components/layout/ContactDetails';
import { SearchBox } from '../components/search/SearchBox';
import { Button, ButtonLink } from '../components/ui/Button';
import { DemoNotice } from '../components/ui/DemoNotice';
import { SectionHeader } from '../components/ui/SectionHeader';
import { dataFlags, getBrands, getCategories, getFeaturedProducts, getProducts } from '../lib/catalog';
import { serializeFilters } from '../lib/filters';
import { routes } from '../lib/paths';
import { useSeo } from '../lib/seo';
import { hasVehicle, type VehicleSelection } from '../lib/vehicles';

export function HomePage() {
  useSeo({ path: '/' });
  const { openInquiry } = useInquiry();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<VehicleSelection>({});
  const categories = getCategories();
  const brands = getBrands();
  const featured = getFeaturedProducts(6);
  const total = getProducts().length;

  const features = [
    { icon: Layers, title: 'Подреден каталог', text: `${categories.length} категории с подкатегории — от осветление до силов тунинг.` },
    { icon: Search, title: 'Бързо търсене', text: 'По име, марка, категория, код на продукта или автомобил.' },
    ...(dataFlags.hasCompatibility ? [{ icon: Car, title: 'Филтър по автомобил', text: 'Изберете марка и модел и вижте само съвместимите продукти.' }] : []),
    { icon: MessageSquareText, title: 'Директно запитване', text: 'Попитайте за цена, наличност и съвместимост с един клик.' },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 tech-grid [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_75%)]" aria-hidden />
        <div className="container relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:py-24">
          <div className="min-w-0 lg:col-span-7 animate-fade-up">
            <p className="eyebrow flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden /> {site.tagline}
            </p>
            <h1 className="mt-5 text-[2.5rem] font-semibold leading-[1.02] sm:text-6xl lg:text-[4.25rem]">
              Прецизен тунинг.<br />
              <span className="text-muted">Подреден каталог.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Продукти и аксесоари за вашия автомобил — намерете точната част за секунди и изпратете запитване.
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
              <ButtonLink to={routes.catalog} size="lg" variant="primary">
                Разгледай каталога <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink to={routes.contact} size="lg" variant="secondary">Свържи се с нас</ButtonLink>
            </div>
            <SearchBox className="mt-10 max-w-xl" size="lg" />
            <dl className="mt-8 flex gap-8 text-[13px]">
              <div><dt className="text-subtle">Продукти</dt><dd className="font-display text-2xl font-semibold tabular-nums">{total}</dd></div>
              <div><dt className="text-subtle">Категории</dt><dd className="font-display text-2xl font-semibold tabular-nums">{categories.length}</dd></div>
              {brands.length > 0 && <div><dt className="text-subtle">Марки</dt><dd className="font-display text-2xl font-semibold tabular-nums">{brands.length}</dd></div>}
            </dl>
          </div>
          <div className="min-w-0 relative hidden lg:col-span-5 lg:block">
            <HeroVisual className="mx-auto w-full max-w-[520px] text-fg animate-fade-in" />
          </div>
        </div>
      </section>

      {site.demoMode && dataFlags.hasPlaceholders && (
        <div className="container mt-6"><DemoNotice /></div>
      )}

      {/* КАТЕГОРИИ */}
      <section className="container py-16 sm:py-20" aria-labelledby="h-cats">
        <SectionHeader eyebrow="Каталог" title="Популярни категории" description="Започнете от категорията — всяка е разделена на подкатегории за по-лесна ориентация."
          action={<ButtonLink to={routes.categories} variant="ghost" size="sm">Всички категории <ArrowRight className="h-4 w-4" /></ButtonLink>} />
        <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {categories.slice(0, 8).map((c) => <CategoryCard key={c.slug} category={c} />)}
        </div>
      </section>

      {/* АВТОМОБИЛЕН ФИЛТЪР */}
      {dataFlags.hasCompatibility && (
        <section className="container" aria-labelledby="h-vehicle">
          <div className="relative overflow-hidden rounded-3xl panel-strong p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="min-w-0 lg:col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">Търсене по автомобил</p>
                <h2 id="h-vehicle" className="mt-3 text-2xl font-semibold sm:text-3xl">Части за вашия автомобил</h2>
                <p className="mt-3 text-[15px] opacity-70">Изберете марка и модел — показваме само продукти с въведена съвместимост.</p>
              </div>
              <form className="min-w-0 lg:col-span-8" onSubmit={(e) => { e.preventDefault(); navigate(`${routes.catalog}?${serializeFilters(vehicle)}`); }}>
                <div className="rounded-2xl bg-surface p-4 text-fg sm:p-5">
                  <VehicleFinder value={vehicle} onChange={setVehicle} layout="row" />
                  <Button type="submit" variant="accent" size="lg" className="mt-4 w-full" disabled={!hasVehicle(vehicle)}>
                    Покажи съвместимите продукти <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* ИЗБРАНИ ПРОДУКТИ */}
      {featured.length > 0 && (
        <section className="container py-16 sm:py-20" aria-labelledby="h-feat">
          <SectionHeader eyebrow="Подбрани" title="Избрани продукти"
            action={<ButtonLink to={routes.catalog} variant="ghost" size="sm">Целият каталог <ArrowRight className="h-4 w-4" /></ButtonLink>} />
          <ProductGrid products={featured} className="mt-8" />
        </section>
      )}

      {/* МАРКИ */}
      {brands.length > 0 && (
        <section className="border-y border-line bg-surface/50 py-16 sm:py-20" aria-labelledby="h-brands">
          <div className="container">
            <SectionHeader eyebrow="Производители" title="Популярни марки"
              action={<ButtonLink to={routes.brands} variant="ghost" size="sm">Всички марки <ArrowRight className="h-4 w-4" /></ButtonLink>} />
            <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {brands.slice(0, 8).map((b) => <BrandCard key={b.slug} brand={b} />)}
            </div>
          </div>
        </section>
      )}

      {/* ПРЕДИМСТВА */}
      <section className="container py-16 sm:py-20" aria-labelledby="h-adv">
        <SectionHeader eyebrow="Как работи" title="Създаден за бързо ориентиране" />
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="bg-surface p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <Icon className="h-6 w-6 text-fg" strokeWidth={1.5} aria-hidden />
                <span className="font-mono text-[11px] text-subtle">0{i + 1}</span>
              </div>
              <h3 className="mt-6 font-semibold">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ЗА НАС */}
      <section className="container" aria-labelledby="h-about">
        <div className="grid gap-8 rounded-3xl border border-line bg-surface p-6 sm:p-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">За нас</p>
            <h2 id="h-about" className="mt-3 text-2xl font-semibold sm:text-3xl">Тунинг каталогът на {site.name} от Стара Загора</h2>
          </div>
          <div className="flex flex-col justify-between gap-6">
            <p className="text-[15px] leading-relaxed text-muted">
              {site.company?.legalName ?? site.name} изгражда системи за зелена енергия и продава компоненти вече над 13 години.
              Тук сме събрали тунинг продуктите и аксесоарите за автомобили — подредени по категории, с цени и директно запитване.
            </p>
            <ButtonLink to={routes.about} variant="secondary" className="self-start">Повече за нас <ArrowRight className="h-4 w-4" /></ButtonLink>
          </div>
        </div>
      </section>

      {/* CTA + КОНТАКТИ */}
      <section className="container py-16 sm:py-20" aria-labelledby="h-cta">
        <div className="relative overflow-hidden rounded-3xl panel-strong px-6 py-12 sm:px-12 sm:py-16">
          <HeroVisual className="pointer-events-none absolute -right-24 -top-24 hidden w-[420px] text-white opacity-[0.12] md:block" />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 id="h-cta" className="text-3xl font-semibold sm:text-4xl">Не намирате точния продукт?</h2>
              <p className="mt-4 max-w-md text-[15px] opacity-70">Изпратете запитване с марка, модел и година на автомобила — ще проверим и ще ви отговорим.</p>
              <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
                <Button variant="accent" size="lg" onClick={() => openInquiry()}>Изпрати запитване</Button>
                <Link to={routes.contact} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/10">
                  Контакти
                </Link>
              </div>
            </div>
            {hasContactData && (
              <div className="rounded-2xl bg-surface p-6 text-fg"><ContactDetails /></div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
