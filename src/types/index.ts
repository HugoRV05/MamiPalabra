/* ========== GAME TYPES ========== */

export type LetterState = "empty" | "filled" | "correct" | "present" | "absent";

export interface Letter {
  char: string;
  state: LetterState;
}

export interface Guess {
  letters: Letter[];
  submitted: boolean;
}

export type GameMode = "daily" | "unlimited";
export type GameStatus = "playing" | "won" | "lost";

export interface GameConfig {
  wordLength: number;
  dictionary: DictionaryType;
}

export interface HintsRemaining {
  letter: number; // Reveals a letter that exists in the word
  definition: number; // Shows cryptic definition
}

export interface GameState {
  mode: GameMode;
  targetWord: string;
  targetHint: string;
  guesses: Guess[];
  currentGuess: string;
  currentRow: number;
  letterStates: Record<string, LetterState>;
  hintsRemaining: HintsRemaining;
  revealedLetters: string[];
  status: GameStatus;
  config: GameConfig;
  startTime: number;
  endTime?: number;
}

export interface GameResult {
  mode: GameMode;
  won: boolean;
  attempts: number;
  word: string;
  config: GameConfig;
  duration: number; // in seconds
  hintsUsed: {
    letter: number;
    definition: number;
  };
  date: string; // ISO date string
}

/* ========== DICTIONARY TYPES ========== */

export type WordCategory =
  | "general"    // Palabras generales sin categoría específica
  | "nature"     // Animales, plantas, clima, elementos naturales
  | "food"       // Comida, ingredientes, bebidas
  | "travel"     // Transporte, lugares, viajes
  | "home";      // Casa, muebles, objetos cotidianos

export type DictionaryType =
  | "general"
  | "easy"
  | "hard"
  | "nature"
  | "food"
  | "travel"
  | "home";

export interface WordEntry {
  word: string;
  hint: string;
  category: WordCategory;
}

export interface Dictionary {
  type: DictionaryType;
  name: string;
  description: string;
  wordLengths: number[];
}

/* ========== STATISTICS TYPES ========== */

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[]; // Array of 6 numbers for attempts 1-6
  lastPlayedDate: string | null;
  averageGuesses: number;
}

export interface DailyStats {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  distribution: Record<number, number>; // attempts -> count
  lastPlayed: string | null; // ISO date
  failedWords: string[];
}

export interface UnlimitedStats {
  played: number;
  won: number;
  byLength: Record<number, { played: number; won: number }>;
  byDictionary: Record<DictionaryType, { played: number; won: number }>;
}

export interface PlayerStats {
  daily: DailyStats;
  unlimited: UnlimitedStats;
}

/* ========== THEME TYPES ========== */

export type Theme = "light" | "dark";

export interface UserPreferences {
  theme: Theme;
  lastConfig: GameConfig;
}
