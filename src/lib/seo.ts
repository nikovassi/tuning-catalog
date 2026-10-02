import { useEffect } from 'react';
import { site } from '../config/site';
import { asset } from './paths';

interface SeoInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | null;
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

export function absoluteUrl(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const origin = site.url ? site.url.replace(/\/$/, '').replace(new RegExp(`${base}$`), '') : window.location.origin;
  return `${origin}${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function useSeo({ title, description, path, image, type = 'website', noindex, jsonLd }: SeoInput) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — ${site.tagline}`;
    const desc = description ?? site.description;
    const url = absoluteUrl(path ?? window.location.pathname.replace(import.meta.env.BASE_URL.replace(/\/$/, ''), ''));
    const img = new URL(asset(image ?? site.defaultOgImage), window.location.origin).href;

    document.title = fullTitle;
    setMeta('name', 'description', desc);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    setMeta('property', 'og:type', type === 'product' ? 'product' : type);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('property', 'og:locale', site.locale);
    setMeta('property', 'og:site_name', site.name);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', img);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    const id = 'page-jsonld';
    document.getElementById(id)?.remove();
    if (jsonLd) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.id = id;
      s.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }
  }, [title, description, path, image, type, noindex, jsonLd]);
}
