import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { brands } from './src/data/brands';
import { categories } from './src/data/categories';
import { products } from './src/data/products';
import { site } from './src/config/site';

/**
 * Генерира при build:
 *  - 404.html — SPA fallback за GitHub Pages (директно отваряне на вътрешни страници)
 *  - robots.txt и sitemap.xml (само реални, не-демонстрационни записи)
 */
function staticSeo(base: string, siteUrl: string): Plugin {
  return {
    name: 'static-seo',
    apply: 'build',
    generateBundle() {
      const redirect = `<!doctype html><html lang="bg"><head><meta charset="utf-8"><title>Пренасочване…</title>
<script>
  var base = ${JSON.stringify(base)};
  var l = window.location;
  var path = l.pathname.indexOf(base) === 0 ? l.pathname.slice(base.length) : l.pathname.replace(/^\\//, '');
  var q = l.search ? '&' + l.search.slice(1) : '';
  l.replace(l.protocol + '//' + l.host + base + '?__route=' + encodeURIComponent(path) + q + l.hash);
</script></head><body></body></html>`;
      this.emitFile({ type: 'asset', fileName: '404.html', source: redirect });

      const origin = siteUrl.replace(/\/$/, '');
      const robots = ['User-agent: *', 'Allow: /', origin && `Sitemap: ${origin}/sitemap.xml`].filter(Boolean).join('\n') + '\n';
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });

      if (!origin) {
        this.warn('VITE_SITE_URL не е зададен — sitemap.xml не е генериран.');
        return;
      }
      const used = new Set(products.map((p) => p.category));
      const realBrands = new Set(products.filter((p) => !p.isPlaceholder).map((p) => p.brand));
      const paths = [
        '/', '/catalog', '/categories', '/brands', '/about', '/contact', '/faq', '/privacy', '/terms', '/cookies',
        ...categories.filter((c) => used.has(c.slug)).map((c) => `/categories/${c.slug}`),
        ...brands.filter((b) => !b.isPlaceholder && realBrands.has(b.slug)).map((b) => `/brands/${b.slug}`),
        ...products.filter((p) => !p.isPlaceholder).map((p) => `/products/${p.slug}`),
      ];
      const today = new Date().toISOString().slice(0, 10);
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${origin}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.BASE_PATH || '/';
  const siteUrl = env.VITE_SITE_URL || '';
  return {
    base,
    plugins: [
      react(),
      { name: 'site-name', transformIndexHtml: (html: string) => html.replace(/%VITE_SITE_NAME%/g, site.name) },
      staticSeo(base, siteUrl),
    ],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    build: { target: 'es2020', sourcemap: false, chunkSizeWarningLimit: 600 },
  };
});
