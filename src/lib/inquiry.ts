import { site } from '../config/site';

export interface InquiryPayload {
  name: string;
  phone?: string;
  email?: string;
  message: string;
  product?: string;
  productUrl?: string;
  consent: true;
}

export type InquiryResult = { ok: true; via: 'endpoint' | 'mailto' } | { ok: false; reason: 'not_configured' | 'network' };

const endpoint = (import.meta.env.VITE_INQUIRY_ENDPOINT as string | undefined) ?? '';

export const inquiryConfigured = Boolean(endpoint || site.contact.email);

/**
 * Изпращане на запитване. Статичният сайт няма собствен сървър, затова:
 * 1) VITE_INQUIRY_ENDPOINT — POST JSON към външна услуга/backend (препоръчително);
 * 2) иначе mailto: към site.contact.email;
 * 3) иначе — формата не е свързана и потребителят вижда ясно съобщение.
 */
export async function sendInquiry(data: InquiryPayload): Promise<InquiryResult> {
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, source: window.location.href, sentAt: new Date().toISOString() }),
      });
      return res.ok ? { ok: true, via: 'endpoint' } : { ok: false, reason: 'network' };
    } catch {
      return { ok: false, reason: 'network' };
    }
  }
  if (site.contact.email) {
    const subject = data.product ? `Запитване: ${data.product}` : 'Запитване от сайта';
    const body = [
      data.message,
      '',
      `Име: ${data.name}`,
      data.phone && `Телефон: ${data.phone}`,
      data.email && `Email: ${data.email}`,
      data.product && `Продукт: ${data.product}`,
      data.productUrl && `Линк: ${data.productUrl}`,
    ].filter(Boolean).join('\n');
    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return { ok: true, via: 'mailto' };
  }
  return { ok: false, reason: 'not_configured' };
}
