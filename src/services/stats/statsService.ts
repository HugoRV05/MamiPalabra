import { GameStats, GameMode } from '@/types';

const STATS_KEY = 'mami-palabra-stats';

export interface GameHistoryEntry {
  word: string;
  hint: string;
  date: string; // YYYY-MM-DD
  won: boolean;
  attempts: number;
}

export interface AllStats {
  daily: GameStats;
  unlimited: GameStats;
  history: GameHistoryEntry[];
}

const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0], // Indices 0-5 for attempts 1-6
  lastPlayedDate: null,
  averageGuesses: 0,
};

const defaultAllStats: AllStats = {
  daily: { ...defaultStats },
  unlimited: { ...defaultStats },
  history: [],
};

/**
 * Load all stats from localStorage
 */
export function loadStats(): AllStats {
  if (typeof window === 'undefined') return defaultAllStats;
  
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) return defaultAllStats;
    
    const parsed = JSON.parse(stored) as AllStats;
    
    // Ensure all properties exist (handle old data structure)
    return {
      daily: { ...defaultStats, ...parsed.daily },
      unlimited: { ...defaultStats, ...parsed.unlimited },
      history: parsed.history || [],
    };
  } catch {
    return defaultAllStats;
  }
}

/**
 * Save all stats to localStorage
 */
function saveStats(stats: AllStats): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
}

/**
 * Get stats for a specific game mode
 */
export function getStats(mode: GameMode): GameStats {
  const allStats = loadStats();
  return allStats[mode];
}

/**
 * Record a game result
 */
export function recordGameResult(
  mode: GameMode,
  won: boolean,
  attempts: number // 1-6 for wins, 6 for losses
): GameStats {
  const allStats = loadStats();
  const stats = allStats[mode];
  const today = new Date().toDateString();
  
  // Update games played
  stats.gamesPlayed += 1;
  
  if (won) {
    stats.gamesWon += 1;
    
    // Update guess distribution (attempts is 1-6, array is 0-indexed)
    if (attempts >= 1 && attempts <= 6) {
      stats.guessDistribution[attempts - 1] += 1;
    }
    
    // Update streaks
    if (stats.lastPlayedDate === today) {
      // Already played today, don't update streak
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (stats.lastPlayedDate === yesterdayStr || stats.lastPlayedDate === null) {
        // Played yesterday or first game, increment streak
        stats.currentStreak += 1;
      } else {
        // Missed a day, reset streak
        stats.currentStreak = 1;
      }
      
      if (stats.currentStreak > stats.maxStreak) {
        stats.maxStreak = stats.currentStreak;
      }
    }
    
    // Update average guesses
    const totalGuesses = stats.guessDistribution.reduce(
      (sum, count, index) => sum + count * (index + 1),
      0
    );
    stats.averageGuesses = totalGuesses / stats.gamesWon;
  } else {
    // Lost - reset streak
    stats.currentStreak = 0;
  }
  
  stats.lastPlayedDate = today;
  
  // Save updated stats
  allStats[mode] = stats;
  saveStats(allStats);
  
  return stats;
}

/**
 * Check if daily game was already played today
 */
export function hasPlayedToday(): boolean {
  const stats = getStats('daily');
  const today = new Date().toDateString();
  return stats.lastPlayedDate === today;
}

/**
 * Get combined stats for display
 */
export function getCombinedStats(): {
  totalGames: number;
  totalWins: number;
  winPercentage: number;
  currentStreak: number;
  maxStreak: number;
} {
  const allStats = loadStats();
  
  const totalGames = allStats.daily.gamesPlayed + allStats.unlimited.gamesPlayed;
  const totalWins = allStats.daily.gamesWon + allStats.unlimited.gamesWon;
  
  return {
    totalGames,
    totalWins,
    winPercentage: totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0,
    currentStreak: Math.max(allStats.daily.currentStreak, allStats.unlimited.currentStreak),
    maxStreak: Math.max(allStats.daily.maxStreak, allStats.unlimited.maxStreak),
  };
}

/**
 * Reset all stats (for debugging/testing)
 */
export function resetStats(): void {
  saveStats(defaultAllStats);
}

/**
 * Add a game result to history (for daily mode)
 */
export function addToHistory(entry: Omit<GameHistoryEntry, 'date'>): void {
  const allStats = loadStats();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if already played today (avoid duplicates)
  const alreadyPlayed = allStats.history.some(h => h.date === today);
  if (alreadyPlayed) return;
  
  const newEntry: GameHistoryEntry = {
    ...entry,
    date: today,
  };
  
  // Add to beginning, keep max 30 entries
  allStats.history = [newEntry, ...allStats.history].slice(0, 30);
  saveStats(allStats);
}

/**
 * Get game history
 */
export function getHistory(): GameHistoryEntry[] {
  const allStats = loadStats();
  return allStats.history;
}
