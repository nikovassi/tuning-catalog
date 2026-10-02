import { ArrowRight } from 'lucide-react';
import { SearchBox } from '../components/search/SearchBox';
import { ButtonLink } from '../components/ui/Button';
import { routes } from '../lib/paths';
import { useSeo } from '../lib/seo';

export function NotFoundPage() {
  useSeo({ title: 'Страницата не е намерена', noindex: true });
  return (
    <div className="container flex flex-col items-center py-24 text-center">
      <p className="font-mono text-sm text-accent-text">404</p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Страницата не е намерена</h1>
      <p className="mt-3 max-w-md text-muted">Адресът може да е променен или грешно изписан. Потърсете продукта или се върнете към каталога.</p>
      <SearchBox className="mt-8 w-full max-w-md text-left" />
      <ButtonLink to={routes.catalog} variant="primary" className="mt-6">Към каталога <ArrowRight className="h-4 w-4" /></ButtonLink>
    </div>
  );
}
