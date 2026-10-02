import type { ReactNode } from 'react';
import { SearchX } from 'lucide-react';

export function EmptyState({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-16 text-center animate-fade-in">
      <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-surface-2 text-muted">
        {icon ?? <SearchX className="h-6 w-6" aria-hidden />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-md text-[15px] text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
