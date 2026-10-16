import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function AppShell() {
  const { pathname, search } = useLocation();
  const main = useRef(null);

  useEffect(() => { main.current?.scrollTo({ top: 0 }); }, [pathname, search]);

  return (
    <>
      <Header />
      <Sidebar />
      <main
        ref={main}
        id="main"
        className="fixed bottom-[var(--bottom-h)] left-[var(--sidebar-w)] right-0 top-[var(--header-h)] overflow-y-auto"
      >
        <Outlet />
      </main>
      <MobileNav />
    </>
  );
}
