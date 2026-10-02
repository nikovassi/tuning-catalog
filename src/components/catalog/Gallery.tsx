import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/cn';
import type { Product } from '../../types/catalog';
import { ProductImage } from './ProductImage';

export function Gallery({ product }: { product: Product }) {
  const [i, setI] = useState(0);
  const imgs = product.images;
  const n = imgs.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);

  return (
    <div className="flex flex-col gap-3">
      <div
        className="group relative overflow-hidden rounded-2xl border border-line"
        tabIndex={n > 1 ? 0 : undefined}
        aria-roledescription={n > 1 ? 'галерия' : undefined}
        onKeyDown={(e) => { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); }}
      >
        <ProductImage key={i} product={product} image={imgs[i]} priority ratio="aspect-square sm:aspect-[4/3]" imgClassName="animate-fade-in" />
        {n > 1 && (
          <>
            {[-1, 1].map((d) => (
              <button key={d} type="button" onClick={() => go(d)} aria-label={d < 0 ? 'Предишна снимка' : 'Следваща снимка'}
                className={cn('absolute top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/90 text-fg shadow-card backdrop-blur transition-opacity sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100', d < 0 ? 'left-3' : 'right-3')}>
                {d < 0 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            ))}
            <span className="absolute bottom-3 right-3 rounded-md bg-surface/90 px-2 py-0.5 font-mono text-[11px] text-muted backdrop-blur">{i + 1} / {n}</span>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {imgs.map((img, idx) => (
            <button key={img.src} type="button" onClick={() => setI(idx)} aria-label={`Снимка ${idx + 1}`} aria-current={idx === i}
              className={cn('overflow-hidden rounded-xl border-2 transition-colors', idx === i ? 'border-fg' : 'border-transparent hover:border-line-strong')}>
              <ProductImage product={product} image={img} ratio="aspect-square" priority />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
