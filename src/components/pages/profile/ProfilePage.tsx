'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getStats, getHistory, GameHistoryEntry } from '@/services/stats';
import styles from './ProfilePage.module.css';

const getAssetPath = (path: string) => {
  const isProd = process.env.NODE_ENV === 'production';
  const basePath = isProd ? '/MamiPalabra' : '';
  return `${basePath}${path}`;
};

// SVG Icons
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);

// SVG Icons
const UserIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const FlameIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.5 1.5-4.5 3-6.5s2.5-3.5 2.5-5.5c0-.5.5-.5.5-.5s3 3.5 3 7c0 1.5-.5 2.5-.5 2.5s1.5-1 2-2c.167-.333.5-1 .5-1s2 1.5 2 4c0 4.866-3.134 9-6 9z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const InfinityIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0012 0V2z" />
  </svg>
);

const TargetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const LightningIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const DiamondIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 9l10 13L22 9l-10-7zm0 3.15L6.28 9 12 17.3 17.72 9 12 5.15z" />
  </svg>
);

const TimerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2 2" />
    <path d="M9 2h6" />
    <path d="M12 2v2" />
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff6b6b">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

interface ProfileStats {
  daily: {
    gamesPlayed: number;
    gamesWon: number;
    winPercentage: number;
    currentStreak: number;
    maxStreak: number;
    distribution: number[];
    averageAttempts: number;
  };
  unlimited: {
    gamesPlayed: number;
    gamesWon: number;
    winPercentage: number;
  };
  totalWordsLearned: number;
  memberSince: string;
}

interface Achievement {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
}

export function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [history, setHistory] = useState<GameHistoryEntry[]>([]);
  const [stats, setStats] = useState<ProfileStats>({
    daily: {
      gamesPlayed: 0,
      gamesWon: 0,
      winPercentage: 0,
      currentStreak: 0,
      maxStreak: 0,
      distribution: [0, 0, 0, 0, 0, 0],
      averageAttempts: 0,
    },
    unlimited: {
      gamesPlayed: 0,
      gamesWon: 0,
      winPercentage: 0,
    },
    totalWordsLearned: 0,
    memberSince: 'Diciembre 2024',
  });

  const [achievements] = useState<Achievement[]>([
    { id: 'first-win', name: 'Primera Victoria', icon: '🏆', unlocked: true },
    { id: 'streak-3', name: 'Racha de 3', icon: '🔥', unlocked: true },
    { id: 'streak-7', name: 'Racha de 7', icon: '⚡', unlocked: false },
    { id: 'perfect', name: 'Perfeccionista', icon: '💎', unlocked: false },
    { id: 'daily-master', name: 'Maestro Diario', icon: '📅', unlocked: false },
    { id: 'speed-demon', name: 'Velocista', icon: '⏱️', unlocked: false },
  ]);

  useEffect(() => {
    setMounted(true);
    
    // Load theme
    const savedTheme = localStorage.getItem('mami-palabra-theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      setIsDarkMode(systemDark);
      // No need to set data-theme here, CSS media query handles it
    }
    
    // Listen for system theme changes if no manual preference is set
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('mami-palabra-theme')) {
        setIsDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Load real stats
    const dailyStats = getStats('daily');
    const unlimitedStats = getStats('unlimited');
    
    // Calculate average attempts
    const totalAttempts = dailyStats.guessDistribution.reduce(
      (sum, count, index) => sum + (count * (index + 1)), 0
    );
    const averageAttempts = dailyStats.gamesWon > 0 
      ? (totalAttempts / dailyStats.gamesWon).toFixed(1)
      : 0;
    
    setStats({
      daily: {
        gamesPlayed: dailyStats.gamesPlayed,
        gamesWon: dailyStats.gamesWon,
        winPercentage: dailyStats.gamesPlayed > 0 
          ? Math.round((dailyStats.gamesWon / dailyStats.gamesPlayed) * 100)
          : 0,
        currentStreak: dailyStats.currentStreak,
        maxStreak: dailyStats.maxStreak,
        distribution: dailyStats.guessDistribution,
        averageAttempts: Number(averageAttempts),
      },
      unlimited: {
        gamesPlayed: unlimitedStats.gamesPlayed,
        gamesWon: unlimitedStats.gamesWon,
        winPercentage: unlimitedStats.gamesPlayed > 0
          ? Math.round((unlimitedStats.gamesWon / unlimitedStats.gamesPlayed) * 100)
          : 0,
      },
      totalWordsLearned: dailyStats.gamesWon + unlimitedStats.gamesWon,
      memberSince: 'Diciembre 2024',
    });
    
    // Load game history
    setHistory(getHistory());

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('mami-palabra-theme', newTheme);
  };

  const distribution = stats.daily.distribution.map((count, index) => ({
    attempts: index + 1,
    count,
  }));

  const maxCount = Math.max(...distribution.map(d => d.count), 1);
  const bestAttempt = distribution.reduce(
    (best, curr) => curr.count > best.count ? curr : best,
    { attempts: 0, count: 0 }
  ).attempts;

  // Calculate level based on total words learned
  const level = Math.floor(stats.totalWordsLearned / 5) + 1;
  const titleByLevel = (lvl: number) => {
    if (lvl >= 20) return 'Maestra de Palabras';
    if (lvl >= 10) return 'Experta Lingüística';
    if (lvl >= 5) return 'Aprendiz Avanzada';
    return 'Aprendiz de Palabras';
  };

  return (
    <div className={styles.container}>
      {/* Hero Header */}
      <header className={`${styles.heroHeader} ${mounted ? styles.heroHeaderVisible : ''}`}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            <Image 
              src={getAssetPath("/mami.jpeg")}
              alt="Foto de Mami" 
              width={140} 
              height={140}
              className={styles.avatarImage}
              priority
            />
          </div>
          <div className={styles.levelBadge}>Nv. {level}</div>
        </div>
        <h1 className={styles.userName}>Mami</h1>
        <p className={styles.userTitle}>
          <StarIcon />
          <span>{titleByLevel(level)}</span>
        </p>
      </header>

      {/* Quick Stats */}
      <div className={`${styles.quickStats} ${mounted ? styles.quickStatsVisible : ''}`}>
        <div className={styles.quickStatItem}>
          <div className={styles.quickStatValue}>{stats.totalWordsLearned}</div>
          <div className={styles.quickStatLabel}>Palabras</div>
        </div>
        <div className={styles.quickStatItem}>
          <div className={styles.quickStatValue}>{stats.daily.winPercentage}%</div>
          <div className={styles.quickStatLabel}>Victorias</div>
        </div>
        <div className={styles.quickStatItem}>
          <div className={styles.quickStatValue}>{stats.daily.averageAttempts || '-'}</div>
          <div className={styles.quickStatLabel}>Promedio</div>
        </div>
      </div>

      {/* Streak Card */}
      <div className={`${styles.streakCard} ${mounted ? styles.streakCardVisible : ''}`}>
        <div className={styles.streakIcon}>
          <FlameIcon />
        </div>
        <div className={styles.streakContent}>
          <div className={styles.streakValue}>{stats.daily.currentStreak} días</div>
          <div className={styles.streakLabel}>Racha actual</div>
        </div>
        <div className={styles.streakBest}>
          <div className={styles.streakBestValue}>{stats.daily.maxStreak}</div>
          <div className={styles.streakBestLabel}>Mejor racha</div>
        </div>
      </div>

      {/* Daily Stats */}
      <section className={`${styles.section} ${mounted ? styles.sectionVisible : ''}`} style={{ '--animation-delay': '0.2s' } as React.CSSProperties}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <CalendarIcon />
          </div>
          <h2 className={styles.sectionTitle}>Palabra del Día</h2>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statCardIcon}>
              <TrophyIcon />
            </div>
            <div className={styles.statCardValue}>{stats.daily.gamesWon}</div>
            <div className={styles.statCardLabel}>Victorias</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardIcon}>
              <TargetIcon />
            </div>
            <div className={styles.statCardValue}>{stats.daily.gamesPlayed}</div>
            <div className={styles.statCardLabel}>Jugadas</div>
          </div>
        </div>
      </section>

      {/* Distribution */}
      <section className={`${styles.section} ${mounted ? styles.sectionVisible : ''}`} style={{ '--animation-delay': '0.3s' } as React.CSSProperties}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <BarChartIcon />
          </div>
          <h2 className={styles.sectionTitle}>Distribución de Intentos</h2>
        </div>
        <div className={styles.glassCard}>
          <div className={styles.distribution}>
            {distribution.map(({ attempts, count }) => (
              <div key={attempts} className={styles.distributionRow}>
                <span className={styles.distributionLabel}>{attempts}</span>
                <div className={styles.distributionBar}>
                  <div 
                    className={styles.distributionFill}
                    data-best={attempts === bestAttempt && count > 0}
                    style={{ width: `${Math.max((count / maxCount) * 100, count > 0 ? 15 : 8)}%` }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unlimited Stats */}
      <section className={`${styles.section} ${mounted ? styles.sectionVisible : ''}`} style={{ '--animation-delay': '0.4s' } as React.CSSProperties}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <InfinityIcon />
          </div>
          <h2 className={styles.sectionTitle}>Modo Ilimitado</h2>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statCardIcon}>
              <TrophyIcon />
            </div>
            <div className={styles.statCardValue}>{stats.unlimited.gamesWon}</div>
            <div className={styles.statCardLabel}>Victorias</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardIcon}>
              <ClockIcon />
            </div>
            <div className={styles.statCardValue}>{stats.unlimited.gamesPlayed}</div>
            <div className={styles.statCardLabel}>Partidas</div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className={`${styles.section} ${mounted ? styles.sectionVisible : ''}`} style={{ '--animation-delay': '0.5s' } as React.CSSProperties}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <TrophyIcon />
          </div>
          <h2 className={styles.sectionTitle}>Logros</h2>
        </div>
        <div className={styles.achievementsList}>
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`${styles.achievement} ${!achievement.unlocked ? styles.achievementLocked : ''}`}
            >
              <span className={styles.achievementIcon}>{achievement.icon}</span>
              <span className={styles.achievementName}>{achievement.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* History Section */}
      <section className={`${styles.section} ${mounted ? styles.sectionVisible : ''}`} style={{ '--animation-delay': '0.55s' } as React.CSSProperties}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <BookIcon />
          </div>
          <h2 className={styles.sectionTitle}>Historial de Palabras</h2>
        </div>
        <button 
          className={styles.historyButton}
          onClick={() => setShowHistoryModal(true)}
        >
          <span>Ver palabras anteriores</span>
          <span className={styles.historyCount}>{history.length}</span>
        </button>
      </section>

      {/* Settings */}
      <section className={`${styles.section} ${mounted ? styles.sectionVisible : ''}`} style={{ '--animation-delay': '0.6s' } as React.CSSProperties}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <SettingsIcon />
          </div>
          <h2 className={styles.sectionTitle}>Ajustes</h2>
        </div>
        <div className={styles.settingsList}>
          <div className={styles.settingsItem}>
            <div className={styles.settingsLabel}>
              <div className={styles.settingsLabelIcon}>
                <MoonIcon />
              </div>
              <span>Modo Oscuro</span>
            </div>
            <button 
              className={`${styles.toggle} ${isDarkMode ? styles.toggleActive : ''}`}
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              <div className={styles.toggleThumb} />
            </button>
          </div>
        </div>
      </section>

      {/* Version Footer */}
      <footer className={`${styles.versionFooter} ${mounted ? styles.versionFooterVisible : ''}`}>
        <p>MamiPalabra <span>v1.0</span></p>
        <p className={styles.footerLove}>Hecho con <HeartIcon /> para Mami</p>
      </footer>

      {/* History Modal */}
      {showHistoryModal && (
        <div className={styles.historyModalOverlay} onClick={() => setShowHistoryModal(false)}>
          <div className={styles.historyModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.historyModalHeader}>
              <h2>Historial de Palabras</h2>
              <button 
                className={styles.historyModalClose}
                onClick={() => setShowHistoryModal(false)}
                aria-label="Cerrar"
              >
                <CloseIcon />
              </button>
            </div>
            <div className={styles.historyModalContent}>
              {history.length === 0 ? (
                <div className={styles.historyEmpty}>
                  <p>Aún no hay palabras en tu historial.</p>
                  <p>¡Juega la palabra del día para empezar!</p>
                </div>
              ) : (
                <div className={styles.historyList}>
                  {history.map((entry, index) => (
                    <div key={index} className={styles.historyItem}>
                      <div className={styles.historyItemHeader}>
                        <span className={styles.historyDate}>
                          {new Date(entry.date).toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </span>
                        <span className={`${styles.historyResult} ${entry.won ? styles.historyWon : styles.historyLost}`}>
                          {entry.won ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className={styles.historyWord}>{entry.word}</div>
                      <div className={styles.historyDetails}>
                        <span className={styles.historyAttempts}>
                          {entry.won ? `${entry.attempts} intentos` : 'No acertada'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
