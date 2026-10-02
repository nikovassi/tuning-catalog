import { Link } from 'react-router-dom';
import { site } from '../../config/site';
import { getCategories } from '../../lib/catalog';
import { routes } from '../../lib/paths';
import { ContactDetails, hasContactData } from './ContactDetails';
import { Logo } from './Logo';
import { legalNav, mainNav } from './nav';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-muted">{site.description}</p>
        </div>
        <div className="lg:col-span-2">
          <p className="eyebrow mb-4">Навигация</p>
          <ul className="space-y-2.5 text-[14px]">
            {mainNav.map((n) => <li key={n.to}><Link to={n.to} className="text-muted transition-colors hover:text-fg">{n.label}</Link></li>)}
            <li><Link to={routes.faq} className="text-muted transition-colors hover:text-fg">Често задавани въпроси</Link></li>
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="eyebrow mb-4">Категории</p>
          <ul className="space-y-2.5 text-[14px]">
            {getCategories().slice(0, 7).map((c) => (
              <li key={c.slug}><Link to={routes.category(c.slug)} className="text-muted transition-colors hover:text-fg">{c.name}</Link></li>
            ))}
            <li><Link to={routes.categories} className="font-medium text-fg hover:text-accent-text">Всички категории →</Link></li>
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="eyebrow mb-4">Контакти</p>
          {hasContactData ? <ContactDetails /> : (
            <p className="text-[14px] text-muted">
              Изпратете ни запитване през <Link to={routes.contact} className="font-medium text-fg underline underline-offset-2">формата за контакт</Link>.
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container flex flex-col gap-3 py-6 text-[12px] text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.company?.legalName ?? site.name}. Всички права запазени.</p>
          <nav aria-label="Правна информация" className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNav.map((l) => <Link key={l.to} to={l.to} className="transition-colors hover:text-fg">{l.label}</Link>)}
          </nav>
        </div>
      </div>
    </footer>
  );
}
