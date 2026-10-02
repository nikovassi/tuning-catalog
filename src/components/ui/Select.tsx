import { ChevronDown } from 'lucide-react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn('relative', className)}>
      <select
        {...rest}
        className="input cursor-pointer appearance-none pr-10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" aria-hidden />
    </div>
  );
}
