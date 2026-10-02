import { useState } from 'react';
import { getCategory } from '../../lib/catalog';
import { cn } from '../../lib/cn';
import { asset } from '../../lib/paths';
import type { Product, ProductImage as Img } from '../../types/catalog';
import { CategoryIcon } from './CategoryIcon';

/**
 * Снимка с фиксирано съотношение и object-contain — без разтягане.
 * Без снимка: неутрален технически placeholder с иконата на категорията.
 */
export function ProductImage({
  product, image, className, imgClassName, priority, ratio = 'aspect-[4/3]',
}: { product: Product; image?: Img; className?: string; imgClassName?: string; priority?: boolean; ratio?: string }) {
  const img = image ?? product.images[0];
  const [failed, setFailed] = useState(false);
  const cat = getCategory(product.category);

  return (
    <div className={cn('relative overflow-hidden', img && !failed ? 'bg-white' : 'bg-surface-2', ratio, className)}>
      {img && !failed ? (
        <img
          src={asset(img.src)}
          alt={img.alt ?? product.name}
          width={img.width}
          height={img.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className={cn('absolute inset-0 h-full w-full object-contain p-[3%]', imgClassName)}
        />
      ) : (
        <div className={cn('absolute inset-0 grid place-items-center tech-grid', imgClassName)} role="img" aria-label={`${product.name} — няма снимка`}>
          <div className="flex flex-col items-center gap-3 text-subtle">
            <CategoryIcon name={cat?.icon ?? 'Package'} className="h-12 w-12 opacity-70" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-80">Няма снимка</span>
          </div>
        </div>
      )}
    </div>
  );
}
