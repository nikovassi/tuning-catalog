import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  variant?: 'dialog' | 'drawer-right' | 'drawer-left' | 'fullscreen';
  className?: string;
  showClose?: boolean;
}

/** Достъпен модал/drawer: Esc, клик извън, заключване на скрола, фокус в съдържанието. */
export function Overlay({ open, onClose, label, children, variant = 'dialog', className, showClose = true }: OverlayProps) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${sbw}px`;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => {
      const target = panel.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current;
      target?.focus();
    });
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const pos = {
    dialog: 'items-end sm:items-center justify-center sm:p-6',
    'drawer-right': 'justify-end',
    'drawer-left': 'justify-start',
    fullscreen: '',
  }[variant];

  const panelCls = {
    dialog: 'w-full sm:max-w-lg max-h-[92dvh] rounded-t-2xl sm:rounded-2xl animate-fade-up',
    'drawer-right': 'h-full w-[min(100%,24rem)] animate-slide-in-right',
    'drawer-left': 'h-full w-[min(100%,24rem)] animate-slide-in-left',
    fullscreen: 'h-full w-full animate-fade-in',
  }[variant];

  return createPortal(
    <div className={cn('fixed inset-0 z-[60] flex', pos)}>
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] animate-fade-in" onClick={onClose} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cn('relative flex flex-col overflow-hidden border border-line bg-surface shadow-pop outline-none', panelCls, className)}
      >
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Затвори"
            className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-xl text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
