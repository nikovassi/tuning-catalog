import { FlaskConical } from 'lucide-react';
import { cn } from '../../lib/cn';

/** Видимо означение, че показаните данни са демонстрационни. Изчезва, когато няма placeholder записи. */
export function DemoNotice({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div role="note" className={cn('flex items-start gap-3 rounded-xl border border-dashed border-line-strong bg-surface/60 px-4 py-3 text-[13px] leading-relaxed text-muted', className)}>
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-accent-text" aria-hidden />
      <p>{children ?? 'Каталогът съдържа демонстрационни записи. Реалните продукти, снимки и данни ще бъдат добавени.'}</p>
    </div>
  );
}
