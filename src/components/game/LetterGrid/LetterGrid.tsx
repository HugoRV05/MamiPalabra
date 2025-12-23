'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Guess, LetterState } from '@/types';
import { MAX_ATTEMPTS, ANIMATION } from '@/config/constants';
import styles from './LetterGrid.module.css';

interface LetterGridProps {
  guesses: Guess[];
  currentGuess: string;
  currentRow: number;
  wordLength: number;
  isShaking?: boolean;
  isWon?: boolean;
}

interface TileProps {
  letter: string;
  state: LetterState;
  position: number;
  rowIndex: number;
  isRevealing?: boolean;
  isBouncing?: boolean;
  isCurrentRow?: boolean;
  isNewLetter?: boolean;
}

function Tile({ letter, state, position, rowIndex, isRevealing, isBouncing, isCurrentRow, isNewLetter }: TileProps) {
  const [revealed, setRevealed] = useState(false);
  const [animState, setAnimState] = useState<LetterState>('empty');
  const [showPop, setShowPop] = useState(false);

  useEffect(() => {
    if (isRevealing && state !== 'empty' && state !== 'filled') {
      const timer = setTimeout(() => {
        setRevealed(true);
        setAnimState(state);
      }, position * ANIMATION.FLIP_DELAY);

      return () => clearTimeout(timer);
    } else {
      setAnimState(state);
    }
  }, [isRevealing, state, position]);

  // Pop animation when new letter is typed
  useEffect(() => {
    if (isNewLetter && letter) {
      setShowPop(true);
      const timer = setTimeout(() => setShowPop(false), 150);
      return () => clearTimeout(timer);
    }
  }, [letter, isNewLetter]);

  const getStateClass = () => {
    if (revealed || (!isRevealing && state !== 'empty' && state !== 'filled')) {
      switch (animState) {
        case 'correct': return styles.tileCorrect;
        case 'present': return styles.tilePresent;
        case 'absent': return styles.tileAbsent;
        default: return '';
      }
    }
    if (state === 'filled') return styles.tileFilled;
    return styles.tileEmpty;
  };

  const getAnimClass = () => {
    const classes = [];
    if (isRevealing && revealed) classes.push(styles.tileFlip);
    if (isBouncing) classes.push(styles.tileBounce);
    if (showPop) classes.push(styles.tilePop);
    if (isCurrentRow && state === 'empty') classes.push(styles.tileReady);
    return classes.join(' ');
  };

  // Stagger animation delay for row entrance
  const staggerDelay = rowIndex * 50 + position * 30;

  return (
    <div
      className={`${styles.tile} ${getStateClass()} ${getAnimClass()}`}
      style={{
        animationDelay: isBouncing ? `${position * 100}ms` : undefined,
        '--stagger-delay': `${staggerDelay}ms`,
      } as React.CSSProperties}
    >
      <span className={styles.tileLetter}>{letter}</span>
    </div>
  );
}

export function LetterGrid({
  guesses,
  currentGuess,
  currentRow,
  wordLength,
  isShaking = false,
  isWon = false,
}: LetterGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [tileSize, setTileSize] = useState(62);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [prevGuessLength, setPrevGuessLength] = useState(0);

  // Calculate optimal tile size based on available space
  const calculateTileSize = useCallback(() => {
    if (!gridRef.current) return;

    const container = gridRef.current.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const availableWidth = containerRect.width - 32; // padding
    const availableHeight = containerRect.height - 32; // padding

    const gap = 6;
    const rows = MAX_ATTEMPTS;

    // Calculate max tile size that fits width
    const maxWidthTile = Math.floor((availableWidth - (wordLength - 1) * gap) / wordLength);
    
    // Calculate max tile size that fits height
    const maxHeightTile = Math.floor((availableHeight - (rows - 1) * gap) / rows);

    // Use the smaller of the two, with min/max constraints
    const optimalSize = Math.min(maxWidthTile, maxHeightTile);
    const finalSize = Math.max(40, Math.min(70, optimalSize));

    setTileSize(finalSize);
  }, [wordLength]);

  // Recalculate on mount and resize
  useEffect(() => {
    calculateTileSize();

    const handleResize = () => {
      calculateTileSize();
    };

    window.addEventListener('resize', handleResize);
    
    // Small delay to ensure container is properly sized
    const timer = setTimeout(calculateTileSize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [calculateTileSize]);

  // Track when a guess is submitted to trigger reveal animation
  useEffect(() => {
    const lastSubmittedRow = guesses.findIndex(g => !g.submitted);
    if (lastSubmittedRow > 0) {
      setRevealingRow(lastSubmittedRow - 1);
      const timer = setTimeout(() => {
        setRevealingRow(null);
      }, wordLength * ANIMATION.FLIP_DELAY + ANIMATION.FLIP_DURATION);
      return () => clearTimeout(timer);
    }
  }, [guesses, wordLength]);

  // Track new letters for pop animation
  useEffect(() => {
    setPrevGuessLength(currentGuess.length);
  }, [currentGuess]);

  const renderRow = (rowIndex: number) => {
    const guess = guesses[rowIndex];
    const isCurrentRowIndex = rowIndex === currentRow;
    const isRevealingThisRow = revealingRow === rowIndex;
    const isWonRow = isWon && guess?.submitted && 
      guess.letters.every(l => l.state === 'correct');

    const tiles = [];

    for (let i = 0; i < wordLength; i++) {
      let letter = '';
      let state: LetterState = 'empty';
      const isNewLetter = isCurrentRowIndex && i === currentGuess.length - 1 && currentGuess.length > prevGuessLength;

      if (isCurrentRowIndex) {
        letter = currentGuess[i] || '';
        state = letter ? 'filled' : 'empty';
      } else if (guess && guess.letters[i]) {
        letter = guess.letters[i].char;
        state = guess.letters[i].state;
      }

      tiles.push(
        <Tile
          key={i}
          letter={letter}
          state={state}
          position={i}
          rowIndex={rowIndex}
          isRevealing={isRevealingThisRow}
          isBouncing={isWonRow}
          isCurrentRow={isCurrentRowIndex}
          isNewLetter={isNewLetter}
        />
      );
    }

    const rowClass = `${styles.row} ${isShaking && isCurrentRowIndex ? styles.rowShake : ''}`;

    return (
      <div key={rowIndex} className={rowClass}>
        {tiles}
      </div>
    );
  };

  const rows = [];
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    rows.push(renderRow(i));
  }

  // Calculate font size based on tile size
  const fontSize = Math.max(1.2, tileSize * 0.5 / 16);

  return (
    <div 
      ref={gridRef}
      className={styles.grid}
      style={{
        '--tile-size': `${tileSize}px`,
        '--tile-font-size': `${fontSize}rem`,
        '--tile-gap': `${Math.max(4, Math.min(6, tileSize * 0.08))}px`,
      } as React.CSSProperties}
    >
      {rows}
    </div>
  );
}
