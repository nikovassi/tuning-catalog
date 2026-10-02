import { InquiryForm } from '../components/inquiry/InquiryForm';
import { ContactDetails, hasContactData } from '../components/layout/ContactDetails';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { DemoNotice } from '../components/ui/DemoNotice';
import { site } from '../config/site';
import { useSeo } from '../lib/seo';

export function ContactPage() {
  useSeo({ title: 'Контакти', description: 'Свържете се с нас за цена, наличност и съвместимост на продукт.', path: '/contact' });
  const map = site.contact.address?.mapEmbedUrl;
  return (
    <div className="container pt-6 sm:pt-8">
      <Breadcrumbs items={[{ label: 'Начало', to: '/' }, { label: 'Контакти' }]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5">
          <p className="eyebrow">Контакти</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Свържете се с нас</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Попитайте за цена, наличност или съвместимост. За най-точен отговор посочете марка, модел, година и двигател на автомобила.
          </p>
          <div className="mt-8">
            {hasContactData ? <ContactDetails variant="cards" /> : site.demoMode && (
              <DemoNotice>Данните за контакт (телефон, email, адрес, работно време, социални профили) все още не са въведени — попълнете ги в src/config/site.ts.</DemoNotice>
            )}
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <div className="card p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Форма за запитване</h2>
            <p className="mt-1.5 text-[14px] text-muted">Полетата със * са задължителни. Нужен е телефон или email.</p>
            <InquiryForm className="mt-6" />
          </div>
        </div>
      </div>
      {map && (
        <div className="mt-10 overflow-hidden rounded-2xl border border-line">
          <iframe title="Карта" src={map} className="h-[360px] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      )}
    </div>
  );
}
