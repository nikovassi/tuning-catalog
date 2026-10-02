import { ExternalLink } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { CatalogView } from '../components/catalog/CatalogView';
import { Badge } from '../components/ui/Badge';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { getBrand, getBrandCount } from '../lib/catalog';
import { asset, routes } from '../lib/paths';
import { useSeo } from '../lib/seo';
import { NotFoundPage } from './NotFoundPage';

export function BrandPage() {
  const { slug = '' } = useParams();
  const brand = getBrand(slug);
  useSeo({ title: brand?.name ?? 'Марката не е намерена', description: brand ? `Продукти на ${brand.name} в каталога.` : undefined, path: routes.brand(slug), noindex: !brand || brand.isPlaceholder });
  if (!brand) return <NotFoundPage />;

  return (
    <CatalogView
      key={slug}
      preset={{ brand: brand.slug }}
      header={
        <div className="animate-fade-up">
          <Breadcrumbs items={[{ label: 'Начало', to: '/' }, { label: 'Марки', to: routes.brands }, { label: brand.name }]} />
          <div className="mt-4 flex flex-wrap items-center gap-5">
            <div className="grid h-16 w-28 place-items-center rounded-2xl border border-line bg-surface">
              {brand.logo ? <img src={asset(brand.logo)} alt={brand.name} className="max-h-10 max-w-[80%] object-contain" /> : <span className="font-display font-semibold text-muted">{brand.name}</span>}
            </div>
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-semibold sm:text-4xl">{brand.name} {brand.isPlaceholder && <Badge tone="demo">Пример</Badge>}</h1>
              <p className="mt-1 text-[15px] text-muted">
                {getBrandCount(brand.slug)} продукта{brand.country && ` · ${brand.country}`}
                {brand.website && <a href={brand.website} target="_blank" rel="noopener noreferrer" className="ml-3 inline-flex items-center gap-1 font-medium text-fg hover:text-accent-text">Официален сайт <ExternalLink className="h-3.5 w-3.5" /></a>}
              </p>
            </div>
          </div>
          {brand.description && <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-muted">{brand.description}</p>}
        </div>
      }
    />
  );
}
