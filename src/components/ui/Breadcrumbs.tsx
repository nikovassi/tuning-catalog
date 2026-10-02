import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Crumb { label: string; to?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Навигационна пътека" className="min-w-0">
      <ol className="flex min-w-0 flex-wrap items-center gap-1 text-[13px] text-subtle">
        {items.map((c, i) => (
          <li key={i} className="flex min-w-0 items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />}
            {c.to ? (
              <Link to={c.to} className="truncate transition-colors hover:text-fg">{c.label}</Link>
            ) : (
              <span aria-current="page" className="truncate text-muted">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
