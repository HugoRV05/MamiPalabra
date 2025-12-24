'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Icon, IconName } from '@/components/ui';
import { DICTIONARIES } from '@/config/dictionaries';
import { WORD_LENGTHS, DEFAULT_WORD_LENGTH } from '@/config/constants';
import { DictionaryType } from '@/types';
import styles from './PlayPage.module.css';

const getDictIcon = (type: DictionaryType): IconName => {
  const iconMap: Record<DictionaryType, IconName> = {
    general: 'book',
    easy: 'easy',
    hard: 'hard',
    nature: 'nature',
    food: 'food',
    travel: 'travel',
    home: 'home',
  };
  return iconMap[type];
};

export function PlayPage() {
  const router = useRouter();
  const [wordLength, setWordLength] = useState<number>(DEFAULT_WORD_LENGTH);
  const [dictionary, setDictionary] = useState<DictionaryType>('general');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartGame = () => {
    const params = new URLSearchParams({
      mode: 'unlimited',
      length: wordLength.toString(),
      dict: dictionary,
    });
    router.push(`/game?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={`${styles.header} ${mounted ? styles.headerVisible : ''}`}>
        <div className={styles.headerIconContainer}>
          <div className={styles.headerIconWrapper}>
            <Icon name="gamepad" size={32} className={styles.headerIcon} />
          </div>
          <div className={styles.headerGlow} />
        </div>
        <h1 className={styles.title}>Nueva Partida</h1>
        <p className={styles.subtitle}>Configura tu reto y empieza a jugar</p>
      </header>

      {/* Word Length Selector */}
      <section className={`${styles.section} ${styles.section1} ${mounted ? styles.visible : ''}`}>
        <div className={styles.sectionHeader}>
          <Icon name="hash" size={18} />
          <h2 className={styles.sectionTitle}>Número de letras</h2>
        </div>
        <div className={styles.lengthSelector}>
          {WORD_LENGTHS.map((length) => (
            <button
              key={length}
              className={`${styles.lengthButton} ${wordLength === length ? styles.lengthSelected : ''}`}
              onClick={() => setWordLength(length)}
            >
              <span className={styles.lengthNumber}>{length}</span>
              <span className={styles.lengthLabel}>letras</span>
            </button>
          ))}
        </div>
      </section>

      {/* Dictionary Selector */}
      <section className={`${styles.section} ${styles.section2} ${mounted ? styles.visible : ''}`}>
        <div className={styles.sectionHeader}>
          <Icon name="book" size={18} />
          <h2 className={styles.sectionTitle}>Diccionario</h2>
        </div>
        <div className={styles.dictionaryGrid}>
          {DICTIONARIES.map((dict) => (
            <button
              key={dict.type}
              className={`${styles.dictionaryCard} ${dictionary === dict.type ? styles.dictionarySelected : ''}`}
              onClick={() => setDictionary(dict.type)}
            >
              <div className={styles.dictionaryIcon}>
                <Icon name={getDictIcon(dict.type)} size={18} />
              </div>
              <span className={styles.dictionaryName}>{dict.name}</span>
              {dictionary === dict.type && (
                <div className={styles.dictionaryCheck}>
                  <Icon name="check" size={14} />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Start Button */}
      <div className={`${styles.footer} ${mounted ? styles.visible : ''}`}>
        <Button fullWidth size="lg" onClick={handleStartGame}>
          Comenzar Partida
        </Button>
      </div>
    </div>
  );
}
