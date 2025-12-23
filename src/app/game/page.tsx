'use client';

import { Suspense } from 'react';
import { GamePage } from '@/components/pages/game';
import { Spinner } from '@/components/ui';
import styles from './page.module.css';

// Loading component for Suspense
function GameLoading() {
  return (
    <div className={styles.loadingContainer}>
      <Spinner size="lg" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<GameLoading />}>
      <GamePage />
    </Suspense>
  );
}
