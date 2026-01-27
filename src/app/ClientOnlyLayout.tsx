'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ClientOnlyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeaderFooter = ['/login', '/signup'].includes(pathname);
  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main className="min-h-[70vh]">{children}</main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
