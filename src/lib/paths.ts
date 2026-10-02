/** Абсолютен път към файл от /public, съобразен с base path (GitHub Pages). */
export function asset(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

export const routes = {
  home: '/',
  catalog: '/catalog',
  categories: '/categories',
  category: (slug: string) => `/categories/${slug}`,
  brands: '/brands',
  brand: (slug: string) => `/brands/${slug}`,
  product: (slug: string) => `/products/${slug}`,
  about: '/about',
  contact: '/contact',
  faq: '/faq',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
} as const;
