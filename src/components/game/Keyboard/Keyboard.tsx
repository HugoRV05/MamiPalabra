'use client';

import { useCallback, useEffect } from 'react';
import { KEYBOARD_ROWS, SPECIAL_KEYS } from '@/config/constants';
import { LetterState } from '@/types';
import { Icon } from '@/components/ui';
import styles from './Keyboard.module.css';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStates: Record<string, LetterState>;
  disabled?: boolean;
}

export function Keyboard({ onKeyPress, letterStates, disabled = false }: KeyboardProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;
      
      const key = event.key.toUpperCase();
      
      if (key === 'ENTER') {
        onKeyPress('ENTER');
      } else if (key === 'BACKSPACE') {
        onKeyPress('BACK');
      } else if (/^[A-ZÑ]$/.test(key)) {
        onKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress, disabled]);

  const handleClick = useCallback((key: string) => {
    if (disabled) return;
    
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    onKeyPress(key);
  }, [onKeyPress, disabled]);

  const getKeyClass = (key: string): string => {
    const classes = [styles.key];
    
    if (SPECIAL_KEYS.includes(key as typeof SPECIAL_KEYS[number])) {
      classes.push(styles.keySpecial);
    } else {
      const state = letterStates[key];
      if (state === 'correct') classes.push(styles.keyCorrect);
      else if (state === 'present') classes.push(styles.keyPresent);
      else if (state === 'absent') classes.push(styles.keyAbsent);
    }
    
    return classes.join(' ');
  };

  const renderKey = (key: string) => {
    if (key === 'BACK') {
      return <Icon name="delete" size={24} />;
    }
    if (key === 'ENTER') {
      return <Icon name="enter" size={20} />;
    }
    return key;
  };

  return (
    <div className={styles.keyboard}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((key) => (
            <button
              key={key}
              className={getKeyClass(key)}
              onClick={() => handleClick(key)}
              disabled={disabled}
              aria-label={key === 'BACK' ? 'Borrar' : key === 'ENTER' ? 'Enviar' : key}
            >
              {renderKey(key)}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
