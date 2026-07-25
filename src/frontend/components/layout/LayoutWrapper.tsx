'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin') && pathname !== '/admin/edit-website';

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className={!isAdmin ? "flex-grow pt-24" : "flex-grow"}>
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
