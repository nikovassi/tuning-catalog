import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { useId, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../../config/site';
import { cn } from '../../lib/cn';
import { inquiryConfigured, sendInquiry } from '../../lib/inquiry';
import { routes } from '../../lib/paths';
import { absoluteUrl } from '../../lib/seo';
import type { Product } from '../../types/catalog';
import { Button } from '../ui/Button';

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error' | 'not_configured';

/** Събира само минимално необходимото: име, телефон и/или email, съобщение. */
export function InquiryForm({ product, onDone, className }: { product?: Product; onDone?: () => void; className?: string }) {
  const id = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get('company_website')) return; // honeypot
    const v = (k: string) => String(fd.get(k) ?? '').trim();
    const data = { name: v('name'), phone: v('phone'), email: v('email'), message: v('message'), product: v('product') };

    const errs: Record<string, string> = {};
    if (data.name.length < 2) errs.name = 'Моля, въведете име.';
    if (!data.phone && !data.email) errs.contact = 'Въведете телефон или email, за да можем да отговорим.';
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Невалиден email адрес.';
    if (data.phone && !/^[+\d][\d\s()-]{5,}$/.test(data.phone)) errs.phone = 'Невалиден телефонен номер.';
    if (data.message.length < 5) errs.message = 'Моля, опишете накратко запитването.';
    if (!fd.get('consent')) errs.consent = 'Необходимо е съгласие с Политиката за поверителност.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus('sending');
    const res = await sendInquiry({
      ...data,
      phone: data.phone || undefined,
      email: data.email || undefined,
      product: data.product || undefined,
      productUrl: product ? absoluteUrl(routes.product(product.slug)) : undefined,
      consent: true,
    });
    if (res.ok) setStatus(res.via === 'mailto' ? 'mailto' : 'sent');
    else setStatus(res.reason === 'not_configured' ? 'not_configured' : 'error');
  }

  if (status === 'sent' || status === 'mailto') {
    return (
      <div className={cn('flex flex-col items-center py-6 text-center animate-fade-up', className)}>
        <CheckCircle2 className="h-12 w-12 text-success" aria-hidden />
        <h3 className="mt-4 text-lg font-semibold">{status === 'sent' ? 'Запитването е изпратено' : 'Отворихме вашия имейл клиент'}</h3>
        <p className="mt-1.5 max-w-sm text-[14px] text-muted">
          {status === 'sent' ? 'Благодарим! Ще се свържем с вас възможно най-скоро.' : 'Изпратете готовото съобщение от имейл клиента, за да достигне до нас.'}
        </p>
        {onDone && <Button variant="secondary" className="mt-6" onClick={onDone}>Затвори</Button>}
      </div>
    );
  }

  const field = (name: string) => ({ id: `${id}-${name}`, name, 'aria-invalid': !!errors[name] || undefined, 'aria-describedby': errors[name] ? `${id}-${name}-err` : undefined });
  const Err = ({ name }: { name: string }) => errors[name] ? <p id={`${id}-${name}-err`} className="mt-1.5 text-[12px] text-danger">{errors[name]}</p> : null;
  const label = 'mb-1.5 block text-[13px] font-medium text-fg';

  return (
    <form onSubmit={onSubmit} noValidate className={cn('grid gap-4', className)}>
      <div>
        <label htmlFor={`${id}-product`} className={label}>Продукт</label>
        <input {...field('product')} className="input bg-surface-2" defaultValue={product ? `${product.name}${product.sku ? ` (${product.sku})` : ''}` : ''} placeholder="По избор" />
      </div>
      <div>
        <label htmlFor={`${id}-name`} className={label}>Име <span className="text-accent-text">*</span></label>
        <input {...field('name')} className="input" autoComplete="name" required />
        <Err name="name" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-phone`} className={label}>Телефон</label>
          <input {...field('phone')} type="tel" inputMode="tel" className="input" autoComplete="tel" />
          <Err name="phone" />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={label}>Email</label>
          <input {...field('email')} type="email" inputMode="email" className="input" autoComplete="email" />
          <Err name="email" />
        </div>
      </div>
      {errors.contact && <p className="-mt-2 text-[12px] text-danger">{errors.contact}</p>}
      <div>
        <label htmlFor={`${id}-message`} className={label}>Съобщение <span className="text-accent-text">*</span></label>
        <textarea {...field('message')} rows={4} className="input h-auto resize-y py-3" placeholder="Напр. марка, модел и година на автомобила, въпрос за наличност…" />
        <Err name="message" />
      </div>
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-muted">
          <input type="checkbox" name="consent" className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded accent-[rgb(var(--fg))]" aria-invalid={!!errors.consent || undefined} />
          <span>
            Съгласявам се с{' '}
            <Link to={routes.privacy} target="_blank" className="font-medium text-fg underline underline-offset-2">Политиката за поверителност</Link>.
          </span>
        </label>
        <Err name="consent" />
      </div>

      {status === 'not_configured' && (
        <p role="alert" className="rounded-xl border border-dashed border-line-strong p-3 text-[13px] text-muted">
          Формата все още не е свързана с услуга за изпращане (виж README → „Запитвания“).
          {site.contact.phones[0] && <> Можете да се свържете с нас на <a className="font-medium text-fg" href={`tel:${site.contact.phones[0].value}`}>{site.contact.phones[0].value}</a>.</>}
        </p>
      )}
      {status === 'error' && <p role="alert" className="text-[13px] text-danger">Възникна грешка при изпращането. Моля, опитайте отново.</p>}

      <Button type="submit" variant="primary" size="lg" disabled={status === 'sending'} className="w-full sm:w-auto sm:justify-self-start">
        {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Изпрати запитване
      </Button>
      {!inquiryConfigured && status === 'idle' && site.demoMode && (
        <p className="text-[12px] text-subtle">Режим на разработка: изпращането не е конфигурирано.</p>
      )}
    </form>
  );
}
