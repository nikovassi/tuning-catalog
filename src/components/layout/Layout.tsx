import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollManager />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
