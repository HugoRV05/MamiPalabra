'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, Icon } from '@/components/ui';
import { getCombinedStats, getStats } from '@/services/stats';
import { hasPlayedToday } from '@/services/dictionary';
import { getGreeting } from '@/utils';
import { useIsMounted } from '@/hooks';
import styles from './HomePage.module.css';

// MAMI Logo Component
const MamiLogo = () => (
  <svg className={styles.logo} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="190" height="190" rx="45" fill="var(--color-bg-gradient-start)"/>
    <rect className={styles.logoTile1} x="20" y="20" width="75" height="75" rx="10" fill="var(--color-correct)"/>
    <text x="57.5" y="75" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="50" fill="var(--color-text-on-filled)" textAnchor="middle">M</text>
    <rect className={styles.logoTile2} x="105" y="20" width="75" height="75" rx="10" fill="var(--color-present)"/>
    <text x="142.5" y="75" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="50" fill="var(--color-text-on-filled)" textAnchor="middle">A</text>
    <rect className={styles.logoTile3} x="20" y="105" width="75" height="75" rx="10" fill="var(--color-absent)"/>
    <text x="57.5" y="160" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="50" fill="var(--color-text-on-filled)" textAnchor="middle">M</text>
    <rect className={styles.logoTile4} x="105" y="105" width="75" height="75" rx="10" fill="var(--color-correct)"/>
    <text x="142.5" y="160" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="50" fill="var(--color-text-on-filled)" textAnchor="middle">I</text>
    <path className={styles.logoHeart} d="M165 118c0-4-4-7-7-7-4 0-7 3-7 7 0 7 14 14 14 14s14-7 14-14c0-4-3-7-7-7-3 0-7 3-7 7" fill="var(--color-accent-yellow)"/>
  </svg>
);

// Decorative floating elements
const FloatingElements = () => (
  <div className={styles.floatingElements}>
    <span className={styles.floatingLetter} style={{ left: '10%', animationDelay: '0s' }}>A</span>
    <span className={styles.floatingLetter} style={{ left: '25%', animationDelay: '0.5s' }}>B</span>
    <span className={styles.floatingLetter} style={{ left: '40%', animationDelay: '1s' }}>C</span>
    <span className={styles.floatingLetter} style={{ left: '55%', animationDelay: '1.5s' }}>D</span>
    <span className={styles.floatingLetter} style={{ left: '70%', animationDelay: '2s' }}>E</span>
    <span className={styles.floatingLetter} style={{ left: '85%', animationDelay: '2.5s' }}>Ñ</span>
  </div>
);

interface Stats {
  currentStreak: number;
  maxStreak: number;
  totalWins: number;
  winPercentage: number;
  dailyStreak: number;
}

export function HomePage() {
  const greeting = getGreeting();
  const mounted = useIsMounted();
  const [stats, setStats] = useState<Stats>({
    currentStreak: 0,
    maxStreak: 0,
    totalWins: 0,
    winPercentage: 0,
    dailyStreak: 0,
  });
  const [alreadyPlayedToday, setAlreadyPlayedToday] = useState(false);

  useEffect(() => {
    // Load real stats
    const combined = getCombinedStats();
    const dailyStats = getStats('daily');
    
    setStats({
      currentStreak: combined.currentStreak,
      maxStreak: combined.maxStreak,
      totalWins: combined.totalWins,
      winPercentage: combined.winPercentage,
      dailyStreak: dailyStats.currentStreak,
    });

    // Check if user already played today's word
    setAlreadyPlayedToday(hasPlayedToday());
  }, []);

  return (
    <div className={styles.container}>
      <FloatingElements />
      
      {/* Hero Section */}
      <header className={`${styles.hero} ${mounted ? styles.heroVisible : ''}`}>
        <div className={styles.logoWrapper}>
          <MamiLogo />
        </div>
        <h1 className={styles.title}>MamiPalabra</h1>
        <p className={styles.subtitle}>{greeting.text} {greeting.subtext}</p>
      </header>

      {/* Main CTA - Daily Word */}
      <section className={`${styles.mainCta} ${mounted ? styles.ctaVisible : ''}`}>
        <div className={styles.ctaGlow} />
        <Card elevated className={styles.dailyCard}>
          <div className={styles.dailyBadge}>
          <Icon name="sparkles" size={20} />
            <span>Palabra del Día</span>
          </div>
          <h2 className={styles.dailyTitle}>¡Tu reto diario te espera!</h2>
          <p className={styles.dailySubtitle}>
            5 letras • 6 intentos • Racha: {stats.dailyStreak}
          </p>
          <Link href={alreadyPlayedToday ? "/game?mode=unlimited" : "/game?mode=daily"}>
            <Button fullWidth size="lg" className={styles.playButton}>
              <Icon name="play" size={24} />
              <span>{alreadyPlayedToday ? "Modo Ilimitado" : "Jugar Ahora"}</span>
            </Button>
          </Link>
        </Card>
      </section>

      {/* Stats Row */}
      <section className={`${styles.statsRow} ${mounted ? styles.statsVisible : ''}`}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <Icon name="flame" size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.currentStreak}</span>
            <span className={styles.statLabel}>Racha</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <Icon name="star" size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.maxStreak}</span>
            <span className={styles.statLabel}>Mejor</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <Icon name="trophy" size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalWins}</span>
            <span className={styles.statLabel}>Victorias</span>
          </div>
        </div>
      </section>

      {/* Unlimited Mode - Enhanced */}
      <section className={`${styles.unlimitedSection} ${mounted ? styles.unlimitedVisible : ''}`}>
        <Card elevated className={styles.unlimitedCard}>
          <div className={styles.unlimitedHeader}>
            <div className={styles.unlimitedIconWrapper}>
              <Icon name="infinity" size={32} />
            </div>
            <div className={styles.unlimitedBadge}>Sin límites</div>
          </div>
          <div className={styles.unlimitedContent}>
            <h3 className={styles.unlimitedTitle}>Modo Ilimitado</h3>
            <p className={styles.unlimitedSubtitle}>
              Practica sin restricciones. Elige la dificultad, el tema y la longitud de palabra que prefieras.
            </p>
          </div>
          <Link href="/play" className={styles.unlimitedButton}>
            <span>Configurar Partida</span>
            <Icon name="arrow-right" size={20} />
          </Link>
        </Card>
      </section>
    </div>
  );
}
