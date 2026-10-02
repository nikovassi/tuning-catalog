import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function SectionHeader({
  eyebrow, title, description, action, className, as: Tag = 'h2',
}: { eyebrow?: string; title: string; description?: string; action?: ReactNode; className?: string; as?: 'h1' | 'h2' }) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <Tag className={cn('font-semibold text-fg', Tag === 'h1' ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl')}>{title}</Tag>
        {description && <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
