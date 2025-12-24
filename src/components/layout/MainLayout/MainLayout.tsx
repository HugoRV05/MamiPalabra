'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { BottomNav } from '../BottomNav';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isGamePage = pathname?.startsWith('/game');

  return (
    <>
      <main className={isGamePage ? styles.mainFullscreen : styles.main}>
        <div className={isGamePage ? styles.contentFullscreen : styles.content}>
          {children}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
