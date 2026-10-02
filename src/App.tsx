import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { NotFoundPage } from './pages/NotFoundPage';

const ProductPage = lazy(() => import('./pages/ProductPage').then((m) => ({ default: m.ProductPage })));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage })));
const BrandsPage = lazy(() => import('./pages/BrandsPage').then((m) => ({ default: m.BrandsPage })));
const BrandPage = lazy(() => import('./pages/BrandPage').then((m) => ({ default: m.BrandPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const FaqPage = lazy(() => import('./pages/FaqPage').then((m) => ({ default: m.FaqPage })));
const PrivacyPage = lazy(() => import('./pages/LegalPage').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/LegalPage').then((m) => ({ default: m.TermsPage })));
const CookiesPage = lazy(() => import('./pages/LegalPage').then((m) => ({ default: m.CookiesPage })));

const Fallback = () => <div className="container py-24"><div className="h-8 w-48 animate-pulse rounded-lg bg-surface-2" /></div>;

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="products" element={<Navigate to="/catalog" replace />} />
          <Route path="products/:slug" element={<ProductPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:slug" element={<CategoryPage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="brands/:slug" element={<BrandPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="cookies" element={<CookiesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
