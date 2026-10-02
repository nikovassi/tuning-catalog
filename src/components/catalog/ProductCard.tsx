import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBrand, getCategory } from '../../lib/catalog';
import { availabilityLabel, formatPrice } from '../../lib/format';
import { routes } from '../../lib/paths';
import type { Product } from '../../types/catalog';
import { Badge } from '../ui/Badge';
import { ProductImage } from './ProductImage';

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const brand = product.brand ? getBrand(product.brand) : undefined;
  const cat = getCategory(product.category);
  const price = formatPrice(product);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift">
      <div className="overflow-hidden">
        <ProductImage
          product={product}
          priority={priority}
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
      {product.isPlaceholder && <Badge tone="demo" className="absolute left-3 top-3 bg-surface/90 backdrop-blur">Пример</Badge>}
      {product.availability && (
        <Badge tone={product.availability === 'in_stock' ? 'success' : 'neutral'} className="absolute right-3 top-3">
          {availabilityLabel[product.availability]}
        </Badge>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex min-w-0 items-center gap-2 text-[12px] text-subtle">
          {brand && <span className="truncate font-semibold uppercase tracking-wider text-muted">{brand.name}</span>}
          {brand && cat && <span aria-hidden>·</span>}
          {cat && <span className="truncate">{cat.name}</span>}
        </div>
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-fg">
          <Link to={routes.product(product.slug)} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        {product.shortDescription && <p className="line-clamp-2 text-[13px] leading-relaxed text-muted">{product.shortDescription}</p>}

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className={price ? 'text-base font-semibold' : 'text-[13px] font-medium text-muted'}>{price ?? 'Цена при запитване'}</span>
          <span className="inline-flex items-center gap-1 text-[13px] font-medium text-fg transition-colors group-hover:text-accent-text">
            Виж продукта
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, className = '' }: { products: Product[]; className?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 ${className}`}>
      {products.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 6} />)}
    </div>
  );
}
