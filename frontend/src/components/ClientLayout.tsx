'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';

// Inner component that uses auth context
function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (!isAuthenticated && !isAuthPage) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthPage, router]);

  // Auth pages: no sidebar
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Protected pages: sidebar + main
  if (!isAuthenticated) return null;

  return (
    <div className="appLayout">
      <Sidebar />
      <main className="mainContent">{children}</main>
    </div>
  );
}

// Wrapper that provides AuthContext
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
