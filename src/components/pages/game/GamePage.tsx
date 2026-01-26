'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Keyboard, LetterGrid } from '@/components/game';
import { Button, Icon } from '@/components/ui';
import { validateGuess, updateLetterStates, checkWin, revealLetter } from '@/services/game';
import { getRandomWord, getWordOfTheDay, isValidWord } from '@/services/dictionary';
import { recordGameResult, getStats, addToHistory } from '@/services/stats';
import { formatDateShort } from '@/utils';
import { Guess, LetterState, GameMode, GameStatus, DictionaryType, HintsRemaining } from '@/types';
import { MAX_ATTEMPTS, DEFAULT_WORD_LENGTH, MESSAGES } from '@/config/constants';
import styles from './GamePage.module.css';

const INITIAL_HINTS: HintsRemaining = { letter: 1, definition: 1 };

export function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const mode = (searchParams.get('mode') || 'unlimited') as GameMode;
  const wordLength = parseInt(searchParams.get('length') || String(DEFAULT_WORD_LENGTH));
  const dictionary = (searchParams.get('dict') || 'general') as DictionaryType;

  const [targetWord, setTargetWord] = useState('');
  const [targetHint, setTargetHint] = useState('');
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>({});
  const [status, setStatus] = useState<GameStatus>('playing');
  const [isShaking, setIsShaking] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hintsRemaining, setHintsRemaining] = useState<HintsRemaining>(INITIAL_HINTS);
  const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
  const [showHintPopup, setShowHintPopup] = useState<{ type: 'letter' | 'definition'; content: string } | null>(null);
  const [gameStats, setGameStats] = useState<{ currentStreak: number; maxStreak: number } | null>(null);
  const [ctaPhrase, setCtaPhrase] = useState('');
  const [mounted, setMounted] = useState(false);

  // Trigger mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Randomize CTA phrase when game ends
  useEffect(() => {
    if (status !== 'playing') {
      const phrases = MESSAGES.CTA_PHRASES;
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setCtaPhrase(randomPhrase);
    }
  }, [status]);

  useEffect(() => {
    let word: { word: string; hint: string };
    
    if (mode === 'daily') {
      word = getWordOfTheDay();
    } else {
      word = getRandomWord(dictionary, wordLength);
    }
    
    setTargetWord(word.word.toUpperCase());
    setTargetHint(word.hint);
    
    const emptyGuesses: Guess[] = Array(MAX_ATTEMPTS).fill(null).map(() => ({
      letters: [],
      submitted: false,
    }));
    setGuesses(emptyGuesses);
    
    // Reset all game state when mode/dictionary/wordLength changes
    setCurrentGuess('');
    setCurrentRow(0);
    setLetterStates({});
    setStatus('playing');
    setHintsRemaining(INITIAL_HINTS);
    setRevealedLetters([]);
    
    // Load current stats for display
    const stats = getStats(mode);
    setGameStats({ currentStreak: stats.currentStreak, maxStreak: stats.maxStreak });
  }, [mode, dictionary, wordLength]);

  // Record result when game ends
  useEffect(() => {
    if (status === 'won' || status === 'lost') {
      const attempts = status === 'won' ? currentRow + 1 : MAX_ATTEMPTS;
      const updatedStats = recordGameResult(mode, status === 'won', attempts);
      setGameStats({ currentStreak: updatedStats.currentStreak, maxStreak: updatedStats.maxStreak });
      
      // Save to history for daily mode
      if (mode === 'daily') {
        addToHistory({
          word: targetWord,
          hint: targetHint,
          won: status === 'won',
          attempts,
        });
      }
    }
  }, [status, currentRow, mode, targetWord, targetHint]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleKeyPress = useCallback((key: string) => {
    if (status !== 'playing') return;

    if (key === 'ENTER') {
      if (currentGuess.length !== targetWord.length) {
        showToast(MESSAGES.NOT_ENOUGH_LETTERS);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
        return;
      }

      if (!isValidWord(currentGuess)) {
        showToast(MESSAGES.NOT_IN_WORD_LIST);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
        return;
      }

      const result = validateGuess(currentGuess, targetWord);
      const won = checkWin(result);

      const newGuesses = [...guesses];
      newGuesses[currentRow] = {
        letters: result,
        submitted: true,
      };
      setGuesses(newGuesses);

      setLetterStates(prev => updateLetterStates(prev, result));

      const newRevealed = [...revealedLetters];
      result.forEach(({ char, state }) => {
        if ((state === 'correct' || state === 'present') && !newRevealed.includes(char)) {
          newRevealed.push(char);
        }
      });
      setRevealedLetters(newRevealed);

      if (won) {
        setStatus('won');
      } else if (currentRow >= MAX_ATTEMPTS - 1) {
        setStatus('lost');
      } else {
        setCurrentRow(prev => prev + 1);
        setCurrentGuess('');
      }
    } else if (key === 'BACK') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < targetWord.length) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, currentRow, guesses, status, targetWord, showToast, revealedLetters]);

  const handleLetterHint = useCallback(() => {
    if (hintsRemaining.letter <= 0) {
      showToast(MESSAGES.NO_HINTS_LEFT);
      return;
    }

    const letter = revealLetter(targetWord, revealedLetters);
    if (letter) {
      setRevealedLetters(prev => [...prev, letter]);
      setHintsRemaining(prev => ({ ...prev, letter: prev.letter - 1 }));
      setShowHintPopup({ type: 'letter', content: letter });
      setTimeout(() => setShowHintPopup(null), 2000);
    }
  }, [hintsRemaining.letter, targetWord, revealedLetters, showToast]);

  const handleDefinitionHint = useCallback(() => {
    if (hintsRemaining.definition <= 0) {
      showToast(MESSAGES.NO_HINTS_LEFT);
      return;
    }

    setHintsRemaining(prev => ({ ...prev, definition: prev.definition - 1 }));
    setShowHintPopup({ type: 'definition', content: targetHint });
    setTimeout(() => setShowHintPopup(null), 3000);
  }, [hintsRemaining.definition, targetHint, showToast]);

  const handlePlayAgain = useCallback(() => {
    if (mode === 'daily') {
      router.push('/');
    } else {
      const word = getRandomWord(dictionary, wordLength);
      setTargetWord(word.word.toUpperCase());
      setTargetHint(word.hint);
      setGuesses(Array(MAX_ATTEMPTS).fill(null).map(() => ({ letters: [], submitted: false })));
      setCurrentGuess('');
      setCurrentRow(0);
      setLetterStates({});
      setStatus('playing');
      setHintsRemaining(INITIAL_HINTS);
      setRevealedLetters([]);
    }
  }, [mode, dictionary, wordLength, router]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={`${styles.header} ${mounted ? styles.headerVisible : ''}`}>
        <Link href="/" className={styles.backButton} aria-label="Volver al inicio">
          <Icon name="back" size={20} />
        </Link>
        
        <div className={styles.titleWrapper}>
          {mode === 'daily' ? (
            <>
              <div className={styles.titleContent}>
                <span className={styles.titleMain}>Palabra del Día</span>
                <span className={styles.titleDate}>{formatDateShort(new Date())}</span>
              </div>
            </>
          ) : (
            <div className={styles.titleContent}>
              <span className={styles.titleMain}>Modo Libre</span>
              <span className={styles.titleSub}>{wordLength} letras</span>
            </div>
          )}
        </div>

        <div className={styles.hints}>
          <button
            className={`${styles.hintButton} ${hintsRemaining.letter <= 0 ? styles.hintDisabled : ''}`}
            onClick={handleLetterHint}
            disabled={status !== 'playing' || hintsRemaining.letter <= 0}
            title="Revelar letra"
            aria-label="Revelar letra"
          >
            <Icon name="letter-hint" size={20} />
          </button>
          <button
            className={`${styles.hintButton} ${hintsRemaining.definition <= 0 ? styles.hintDisabled : ''}`}
            onClick={handleDefinitionHint}
            disabled={status !== 'playing' || hintsRemaining.definition <= 0}
            title="Ver pista"
            aria-label="Ver pista"
          >
            <Icon name="lightbulb" size={20} />
          </button>
        </div>
      </header>

      {/* Game Area */}
      <div className={`${styles.gameArea} ${mounted ? styles.gameAreaVisible : ''}`}>
        <LetterGrid
          guesses={guesses}
          currentGuess={currentGuess}
          currentRow={currentRow}
          wordLength={targetWord.length || wordLength}
          isShaking={isShaking}
          isWon={status === 'won'}
        />
      </div>

      {/* Keyboard */}
      <div className={`${styles.keyboardArea} ${mounted ? styles.keyboardAreaVisible : ''}`}>
        <Keyboard
          onKeyPress={handleKeyPress}
          letterStates={letterStates}
          disabled={status !== 'playing'}
        />
      </div>

      {/* Toast */}
      {toast && <div className={styles.toast}>{toast}</div>}

      {/* Hint Popup */}
      {showHintPopup && (
        <div className={styles.hintPopup}>
          <div className={styles.hintTitle}>
            {showHintPopup.type === 'letter' ? MESSAGES.HINT_LETTER : MESSAGES.HINT_DEFINITION}
          </div>
          <div className={showHintPopup.type === 'letter' ? styles.hintContent : styles.hintDefinition}>
            {showHintPopup.content}
          </div>
        </div>
      )}

      {/* End Game Modal */}
      {status !== 'playing' && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={`${styles.modalIcon} ${status === 'won' ? styles.modalIconWon : styles.modalIconLost}`}>
              {status === 'won' ? <Icon name="trophy" size={48} /> : <Icon name="sad" size={48} />}
            </div>
            <h2 className={styles.modalTitle}>
              {status === 'won' 
                ? MESSAGES.WIN[Math.min(currentRow, MESSAGES.WIN.length - 1)]
                : MESSAGES.LOSE
              }
            </h2>
            <div className={styles.modalWord}>{targetWord}</div>
            
            {status === 'won' && <div className={styles.confetti} />}
            
            <div className={styles.modalStats}>
              <div className={styles.modalStat}>
                <div className={styles.modalStatValue}>
                  {status === 'won' ? currentRow + 1 : 'X'}
                </div>
                <div className={styles.modalStatLabel}>Intentos</div>
              </div>
              <div className={styles.modalStat}>
                <div className={styles.modalStatValue}>
                  {gameStats?.currentStreak ?? 0}
                </div>
                <div className={styles.modalStatLabel}>Racha</div>
              </div>
              <div className={styles.modalStat}>
                <div className={styles.modalStatValue}>
                  {gameStats?.maxStreak ?? 0}
                </div>
                <div className={styles.modalStatLabel}>Mejor</div>
              </div>
            </div>

            <div className={styles.modalActions}>
              {mode === 'unlimited' ? (
                <Button fullWidth onClick={handlePlayAgain} className={styles.primaryAction}>
                  Jugar otra vez
                </Button>
              ) : (
                <div className={styles.ctaWrapper}>
                  <p className={styles.ctaText}>{ctaPhrase}</p>
                  <Button 
                    fullWidth 
                    className={styles.ctaButton}
                    onClick={() => router.push('/game?mode=unlimited')}
                  >
                    Ir al modo ilimitado
                  </Button>
                </div>
              )}
              <Button fullWidth variant="secondary" onClick={() => router.push('/')}>
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
