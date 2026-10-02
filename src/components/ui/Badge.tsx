import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'neutral' | 'accent' | 'success' | 'outline' | 'demo';

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-muted',
  accent: 'bg-accent/10 text-accent-text',
  success: 'bg-success/10 text-success',
  outline: 'border border-line text-muted',
  demo: 'border border-dashed border-line-strong text-subtle',
};

export function Badge({ tone = 'neutral', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium leading-5', tones[tone], className)}>
      {children}
    </span>
  );
}
