import { ArrowRight, ExternalLink, MessageSquareText } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Gallery } from '../components/catalog/Gallery';
import { ProductGrid } from '../components/catalog/ProductCard';
import { ShareButtons } from '../components/catalog/ShareButtons';
import { useInquiry } from '../components/inquiry/InquiryContext';
import { Badge } from '../components/ui/Badge';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button, ButtonLink } from '../components/ui/Button';
import { DemoNotice } from '../components/ui/DemoNotice';
import { site } from '../config/site';
import { getBrand, getCategory, getProduct, getRelatedProducts, getSubcategoryName } from '../lib/catalog';
import { availabilityLabel, formatPrice, formatYears } from '../lib/format';
import { asset, routes } from '../lib/paths';
import { absoluteUrl, useSeo } from '../lib/seo';
import type { Product } from '../types/catalog';
import { NotFoundPage } from './NotFoundPage';

const schemaAvailability = { in_stock: 'InStock', on_order: 'BackOrder', out_of_stock: 'OutOfStock', discontinued: 'Discontinued' } as const;

/** Product schema само за реални записи; Offer — само ако има цена. */
function productJsonLd(p: Product) {
  if (p.isPlaceholder) return null;
  const brand = p.brand ? getBrand(p.brand) : undefined;
  const url = absoluteUrl(routes.product(p.slug));
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    url,
    ...(p.description || p.shortDescription ? { description: p.description ?? p.shortDescription } : {}),
    ...(p.sku ? { sku: p.sku } : {}),
    ...(brand ? { brand: { '@type': 'Brand', name: brand.name } } : {}),
    ...(p.images.length ? { image: p.images.map((i) => new URL(asset(i.src), window.location.origin).href) } : {}),
    category: getCategory(p.category)?.name,
    ...(typeof p.price === 'number'
      ? { offers: { '@type': 'Offer', price: p.price, priceCurrency: p.currency ?? 'EUR', url, ...(p.availability ? { availability: `https://schema.org/${schemaAvailability[p.availability]}` } : {}) } }
      : {}),
  };
}

export function ProductPage() {
  const { slug = '' } = useParams();
  const product = getProduct(slug);
  const { openInquiry } = useInquiry();
  const jsonLd = useMemo(() => (product ? productJsonLd(product) : null), [product]);

  useSeo({
    title: product?.name ?? 'Продуктът не е намерен',
    description: product?.shortDescription ?? product?.description?.slice(0, 160),
    path: routes.product(slug),
    image: product?.images[0]?.src,
    type: 'product',
    noindex: !product || product.isPlaceholder,
    jsonLd,
  });

  if (!product) return <NotFoundPage />;

  const brand = product.brand ? getBrand(product.brand) : undefined;
  const cat = getCategory(product.category);
  const sub = getSubcategoryName(product.category, product.subcategory);
  const price = formatPrice(product);
  const related = getRelatedProducts(product);
  const url = absoluteUrl(routes.product(product.slug));

  const meta: { label: string; value: React.ReactNode }[] = [
    brand && { label: 'Марка', value: <Link to={routes.brand(brand.slug)} className="font-medium hover:text-accent-text">{brand.name}</Link> },
    cat && { label: 'Категория', value: <Link to={routes.category(cat.slug)} className="font-medium hover:text-accent-text">{cat.name}</Link> },
    sub && cat && { label: 'Подкатегория', value: <Link to={`${routes.category(cat.slug)}?sub=${product.subcategory}`} className="font-medium hover:text-accent-text">{sub}</Link> },
    product.productType && { label: 'Тип', value: product.productType },
    product.sku && { label: 'Код', value: <span className="font-mono text-[13px]">{product.sku}</span> },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  return (
    <div className="container pt-6 sm:pt-8">
      <Breadcrumbs items={[
        { label: 'Начало', to: '/' },
        { label: 'Каталог', to: routes.catalog },
        ...(cat ? [{ label: cat.name, to: routes.category(cat.slug) }] : []),
        { label: product.name },
      ]} />

      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-7 animate-fade-in">
          <Gallery product={product} />
        </div>

        <div className="min-w-0 lg:col-span-5 animate-fade-up">
          <div className="lg:sticky lg:top-24">
            <div className="flex flex-wrap items-center gap-2">
              {brand && <span className="text-[12px] font-semibold uppercase tracking-wider text-muted">{brand.name}</span>}
              {product.isPlaceholder && <Badge tone="demo">Демонстрационен запис</Badge>}
            </div>
            <h1 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">{product.name}</h1>
            {product.shortDescription && <p className="mt-3 text-[15px] leading-relaxed text-muted">{product.shortDescription}</p>}

            <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-line py-5">
              <span className={price ? 'font-display text-3xl font-semibold' : 'text-lg font-semibold'}>{price ?? 'Цена при запитване'}</span>
              {product.availability && (
                <Badge tone={product.availability === 'in_stock' ? 'success' : 'neutral'} className="text-[12px]">{availabilityLabel[product.availability]}</Badge>
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Button variant="primary" size="lg" onClick={() => openInquiry(product)}>
                <MessageSquareText className="h-4 w-4" /> Запитване за продукта
              </Button>
              <ButtonLink to={routes.contact} variant="secondary" size="lg">Свържи се с нас</ButtonLink>
            </div>
            {product.externalUrl && (
              <a href={product.externalUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-fg">
                {product.externalLabel ?? 'Страница на производителя'} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            {meta.length > 0 && (
              <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-[14px]">
                {meta.map((m) => (
                  <div key={m.label} className="contents">
                    <dt className="text-subtle">{m.label}</dt>
                    <dd className="min-w-0 truncate text-fg">{m.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-6 -ml-3"><ShareButtons title={product.name} url={url} /></div>
            {product.isPlaceholder && site.demoMode && <DemoNotice className="mt-6">Това е демонстрационен запис за разработката. Данните ще бъдат заменени с реална продуктова информация.</DemoNotice>}
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-12">
        <section className="card p-6 sm:p-8 lg:col-span-7" aria-labelledby="h-desc">
          <h2 id="h-desc" className="text-lg font-semibold">Описание</h2>
          {product.description
            ? <div className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-muted">{product.description}</div>
            : <p className="mt-4 text-[15px] text-subtle">Няма въведено описание. Свържете се с нас за подробности.</p>}
        </section>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <section className="card p-6 sm:p-8" aria-labelledby="h-specs">
            <h2 id="h-specs" className="text-lg font-semibold">Технически характеристики</h2>
            {product.specifications?.length ? (
              <dl className="mt-4 divide-y divide-line text-[14px]">
                {product.specifications.map((s) => (
                  <div key={s.label} className="flex justify-between gap-6 py-2.5">
                    <dt className="text-subtle">{s.label}</dt>
                    <dd className="text-right font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            ) : <p className="mt-4 text-[14px] text-subtle">Няма въведени характеристики.</p>}
          </section>

          <section className="card p-6 sm:p-8" aria-labelledby="h-fit">
            <h2 id="h-fit" className="text-lg font-semibold">Съвместимост</h2>
            {product.compatibility?.length ? (
              <ul className="mt-4 divide-y divide-line text-[14px]">
                {product.compatibility.map((f, i) => (
                  <li key={i} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5">
                    <span className="font-medium">{[f.make, f.model, f.generation].filter(Boolean).join(' ')}</span>
                    <span className="text-subtle">{[f.engine, formatYears(f)].filter(Boolean).join(' · ')}</span>
                    {f.note && <span className="w-full text-[12px] text-subtle">{f.note}</span>}
                  </li>
                ))}
              </ul>
            ) : <p className="mt-4 text-[14px] text-subtle">Няма въведени данни за съвместимост. Попитайте ни за вашия автомобил.</p>}
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="h-rel">
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
            <h2 id="h-rel" className="text-2xl font-semibold">Подобни продукти</h2>
            {cat && <ButtonLink to={routes.category(cat.slug)} variant="ghost" size="sm" className="-ml-3 sm:ml-0">{cat.name} <ArrowRight className="h-4 w-4" /></ButtonLink>}
          </div>
          <ProductGrid products={related} className="mt-6 xl:grid-cols-4" />
        </section>
      )}
    </div>
  );
}
