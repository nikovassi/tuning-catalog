import { Clock, ExternalLink, Facebook, Globe, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { site } from '../../config/site';

const socialIcon = { facebook: Facebook, instagram: Instagram, youtube: Youtube, tiktok: Globe, other: Globe };

export const hasContactData = Boolean(
  site.contact.phones.length || site.contact.email || site.contact.address || site.contact.hours?.length || site.social.length,
);

/** Показва само реално попълнените контакти от config/site.ts. */
export function ContactDetails({ variant = 'list' }: { variant?: 'list' | 'cards' }) {
  const { phones, email, address, hours } = site.contact;
  const item = variant === 'cards' ? 'card flex gap-4 p-5' : 'flex gap-3';
  const icon = variant === 'cards' ? 'grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2' : 'mt-0.5 shrink-0 text-subtle';

  if (!hasContactData) return null;

  return (
    <div className={variant === 'cards' ? 'grid gap-4 sm:grid-cols-2' : 'flex flex-col gap-4 text-[14px]'}>
      {phones.length > 0 && (
        <div className={item}>
          <span className={icon}><Phone className="h-4 w-4" aria-hidden /></span>
          <div>
            <p className="eyebrow mb-1">Телефон</p>
            {phones.map((p) => (
              <a key={p.value} href={`tel:${p.value.replace(/\s/g, '')}`} className="block font-medium hover:text-accent-text">
                {p.value}{p.label && <span className="ml-1 font-normal text-subtle">· {p.label}</span>}
              </a>
            ))}
          </div>
        </div>
      )}
      {email && (
        <div className={item}>
          <span className={icon}><Mail className="h-4 w-4" aria-hidden /></span>
          <div><p className="eyebrow mb-1">Email</p><a href={`mailto:${email}`} className="font-medium break-all hover:text-accent-text">{email}</a></div>
        </div>
      )}
      {address && (
        <div className={item}>
          <span className={icon}><MapPin className="h-4 w-4" aria-hidden /></span>
          <div>
            <p className="eyebrow mb-1">{address.label ?? 'Адрес'}</p>
            <p className="font-medium">{[address.street, [address.postalCode, `гр. ${address.city}`].filter(Boolean).join(' ')].filter(Boolean).join(', ')}</p>
          </div>
        </div>
      )}
      {hours && hours.length > 0 && (
        <div className={item}>
          <span className={icon}><Clock className="h-4 w-4" aria-hidden /></span>
          <div>
            <p className="eyebrow mb-1">Работно време</p>
            {hours.map((h) => <p key={h.days}><span className="text-muted">{h.days}:</span> <span className="font-medium">{h.time}</span></p>)}
          </div>
        </div>
      )}
      {site.company?.website && (
        <div className={item}>
          <span className={icon}><Globe className="h-4 w-4" aria-hidden /></span>
          <div>
            <p className="eyebrow mb-1">Онлайн магазин</p>
            <a href={site.company.website.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-medium hover:text-accent-text">
              {site.company.website.label} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>
      )}
      {site.social.length > 0 && (
        <div className="flex gap-2">
          {site.social.map((s) => {
            const Icon = socialIcon[s.type];
            return (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted transition-colors hover:border-line-strong hover:text-fg">
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
