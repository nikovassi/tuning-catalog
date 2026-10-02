import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { InquiryProvider } from './components/inquiry/InquiryContext';
import { ThemeProvider } from './lib/theme';
import './index.css';

// GitHub Pages SPA fallback: 404.html пренасочва към ?/__route=..., тук възстановяваме адреса.
(() => {
  const url = new URL(window.location.href);
  const route = url.searchParams.get('__route');
  if (route !== null) {
    url.searchParams.delete('__route');
    const rest = url.searchParams.toString();
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    window.history.replaceState(null, '', `${base}/${route.replace(/^\//, '')}${rest ? `?${rest}` : ''}${url.hash}`);
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <ThemeProvider>
        <InquiryProvider>
          <App />
        </InquiryProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
