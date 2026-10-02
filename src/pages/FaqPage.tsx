import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SectionHeader } from '../components/ui/SectionHeader';
import { routes } from '../lib/paths';
import { useSeo } from '../lib/seo';

/**
 * Въпросите описват само как работи сайтът. TODO(данни): добавете въпроси за доставка,
 * плащане, гаранция и връщане САМО след като бизнесът предостави реалните условия.
 */
const faq: { q: string; a: React.ReactNode }[] = [
  { q: 'Как да намеря продукт за моя автомобил?', a: <>Използвайте търсачката (име, марка, код или модел автомобил) или <Link className="font-medium text-fg underline" to={routes.catalog}>каталога</Link> с филтрите по категория, марка и автомобил.</> },
  { q: 'Защо при някои продукти няма цена?', a: 'Цената на част от продуктите зависи от конфигурацията и наличността. В тези случаи е посочено „Цена при запитване“ — изпратете запитване и ще ви отговорим.' },
  { q: 'Как да изпратя запитване?', a: 'Натиснете „Запитване за продукта“ на страницата на продукта. Продуктът се попълва автоматично — остава да въведете име, телефон или email и съобщение.' },
  { q: 'Как да проверя дали продуктът е съвместим с автомобила ми?', a: 'Ако за продукта има въведени данни, те са в секция „Съвместимост“. Ако няма, посочете марка, модел, година и двигател в запитването.' },
  { q: 'Какви лични данни събирате?', a: <>Само данните, които въвеждате във формата за запитване, и само за да ви отговорим. Повече в <Link className="font-medium text-fg underline" to={routes.privacy}>Политиката за поверителност</Link>.</> },
];

export function FaqPage() {
  useSeo({
    title: 'Често задавани въпроси', path: '/faq',
    jsonLd: { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.filter((f) => typeof f.a === 'string').map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  });
  return (
    <div className="container max-w-3xl pt-6 sm:pt-8">
      <Breadcrumbs items={[{ label: 'Начало', to: '/' }, { label: 'Често задавани въпроси' }]} />
      <SectionHeader as="h1" className="mt-4" title="Често задавани въпроси" />
      <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-surface">
        {faq.map((f) => (
          <details key={f.q} className="group px-5 sm:px-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium">
              {f.q}
              <ChevronDown className="h-4 w-4 shrink-0 text-subtle transition-transform duration-200 group-open:rotate-180" aria-hidden />
            </summary>
            <div className="pb-5 text-[15px] leading-relaxed text-muted animate-fade-in">{f.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
