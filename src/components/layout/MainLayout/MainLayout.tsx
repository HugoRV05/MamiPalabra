'use client';

import { ReactNode } from 'react';
import { BottomNav } from '../BottomNav';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
