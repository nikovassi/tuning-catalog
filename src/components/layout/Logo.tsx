import { Link } from 'react-router-dom';
import { site } from '../../config/site';

/** Wordmark на ENERGON 07 за тунинг каталога. */
export function Logo({ className = '', inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} title={site.name} aria-label={`${site.name} — начало`}>
      <span className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-lg ${inverse ? 'bg-white text-black' : 'bg-inverse text-inverse-fg'}`}>
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
          <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 12 L17.2 7.6" stroke="rgb(var(--accent))" strokeWidth="2" strokeLinecap="round" className="origin-center transition-transform duration-500 group-hover:rotate-[38deg]" style={{ transformOrigin: '12px 12px' }} />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        </svg>
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className={`truncate font-display text-[16px] font-bold tracking-[0.06em] sm:text-[17px] ${inverse ? 'text-white' : 'text-fg'}`}>{site.name}</span>
        <span className="mt-1 hidden truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-subtle min-[400px]:block">Tuning</span>
      </span>
    </Link>
  );
}
