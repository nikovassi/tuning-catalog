import { ArrowRight, ExternalLink, Menu, Search } from 'lucide-react';
import { site } from '../../config/site';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getCategories } from '../../lib/catalog';
import { cn } from '../../lib/cn';
import { routes } from '../../lib/paths';
import { ThemeToggle } from '../ThemeToggle';
import { useInquiry } from '../inquiry/InquiryContext';
import { SearchBox } from '../search/SearchBox';
import { Button } from '../ui/Button';
import { Overlay } from '../ui/Overlay';
import { Logo } from './Logo';
import { legalNav, mainNav } from './nav';

export function Header() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openInquiry } = useInquiry();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenu(false); setSearch(false); }, [location.pathname, location.search]);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn('relative rounded-lg px-3 py-2 text-[14px] font-medium transition-colors', isActive ? 'text-fg' : 'text-muted hover:text-fg');

  return (
    <header className={cn('sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300',
      scrolled ? 'border-line bg-bg/85 shadow-card backdrop-blur-xl' : 'border-transparent bg-bg/70 backdrop-blur-md')}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2">Към съдържанието</a>
      <div className="container flex h-16 items-center gap-3">
        <Logo className="min-w-0" />

        <nav aria-label="Основна навигация" className="ml-4 hidden items-center lg:flex">
          {mainNav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={linkCls}>
              {({ isActive }) => (
                <>
                  {n.label}
                  <span className={cn('absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-accent transition-transform duration-300', isActive ? 'scale-x-100' : 'scale-x-0')} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2">
          <SearchBox className="hidden w-[16rem] md:block lg:hidden xl:block xl:w-[18rem] 2xl:w-[22rem]" placeholder="Търсене…" />
          <button type="button" onClick={() => setSearch(true)} aria-label="Търсене"
            className="grid h-10 w-10 place-items-center rounded-xl text-muted transition-colors hover:bg-surface-2 hover:text-fg md:hidden lg:grid xl:hidden">
            <Search className="h-5 w-5" />
          </button>
          <ThemeToggle />
          <Button variant="primary" size="sm" className="ml-1 hidden sm:inline-flex" onClick={() => openInquiry()}>
            Запитване
          </Button>
          <button type="button" onClick={() => setMenu(true)} aria-label="Меню" aria-expanded={menu}
            className="grid h-10 w-10 place-items-center rounded-xl text-fg transition-colors hover:bg-surface-2 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Overlay open={search} onClose={() => setSearch(false)} label="Търсене" variant="fullscreen" className="border-0" showClose={false}>
        <div className="flex h-full flex-col p-4">
          <div className="flex items-center gap-2">
            <SearchBox mode="panel" autoFocus className="flex flex-1 flex-col" placeholder="Продукт, марка, автомобил, код…" />
            <Button variant="ghost" size="sm" className="self-start mt-0.5" onClick={() => setSearch(false)}>Отказ</Button>
          </div>
        </div>
      </Overlay>

      <Overlay open={menu} onClose={() => setMenu(false)} label="Меню" variant="drawer-right">
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="flex h-16 items-center border-b border-line px-5"><Logo /></div>
          <nav aria-label="Мобилна навигация" className="flex flex-col p-3">
            {mainNav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'}
                className={({ isActive }) => cn('flex items-center justify-between rounded-xl px-3 py-3 text-[16px] font-medium transition-colors',
                  isActive ? 'bg-surface-2 text-fg' : 'text-muted hover:bg-surface-2 hover:text-fg')}>
                {n.label}
                <ArrowRight className="h-4 w-4 opacity-40" aria-hidden />
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-line p-5">
            <p className="eyebrow mb-3">Категории</p>
            <div className="flex flex-wrap gap-2">
              {getCategories().slice(0, 8).map((c) => (
                <NavLink key={c.slug} to={routes.category(c.slug)} className="rounded-lg border border-line px-2.5 py-1.5 text-[13px] text-muted hover:border-line-strong hover:text-fg">
                  {c.name}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="mt-auto border-t border-line p-5">
            <Button variant="primary" size="lg" className="w-full" onClick={() => { setMenu(false); openInquiry(); }}>Изпрати запитване</Button>
            {site.company?.website && (
              <a href={site.company.website.url} target="_blank" rel="noopener" className="mt-3 flex items-center justify-center gap-1.5 text-[13px] font-medium text-muted hover:text-fg">
                Онлайн магазин {site.company.website.label} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            )}
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
              {legalNav.map((l) => <NavLink key={l.to} to={l.to} className="text-[12px] text-subtle hover:text-fg">{l.label}</NavLink>)}
            </div>
          </div>
        </div>
      </Overlay>
    </header>
  );
}
