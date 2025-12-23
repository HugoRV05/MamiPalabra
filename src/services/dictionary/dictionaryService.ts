import { WordEntry, DictionaryType, WordCategory } from '@/types';

// Import word lists by length
import words4 from './words/words-4.json';
import words5 from './words/words-5.json';
import words6 from './words/words-6.json';
import words7 from './words/words-7.json';

// Word pools organized by length
const wordsByLength: Record<number, WordEntry[]> = {
  4: words4 as WordEntry[],
  5: words5 as WordEntry[],
  6: words6 as WordEntry[],
  7: words7 as WordEntry[],
};

// Category mappings for special dictionary types
const EASY_CATEGORIES: WordCategory[] = ['home', 'food', 'general'];
const HARD_CATEGORIES: WordCategory[] = ['nature', 'travel'];

/**
 * Get all words for a given length
 */
function getAllWordsByLength(length: number): WordEntry[] {
  return wordsByLength[length] || [];
}

/**
 * Get word list filtered by dictionary type and length
 */
export function getWordList(dictionary: DictionaryType, length: number): WordEntry[] {
  const allWords = getAllWordsByLength(length);
  
  if (allWords.length === 0) {
    // Fallback to 5-letter words if length not available
    return wordsByLength[5] || [];
  }

  switch (dictionary) {
    case 'general':
      // Return all words for general dictionary
      return allWords;
    
    case 'easy':
      // Easy: common categories (home, food, general)
      return allWords.filter(w => EASY_CATEGORIES.includes(w.category));
    
    case 'hard':
      // Hard: less common categories (nature, travel)
      return allWords.filter(w => HARD_CATEGORIES.includes(w.category));
    
    case 'nature':
    case 'food':
    case 'travel':
    case 'home':
      // Themed dictionaries: filter by exact category match
      return allWords.filter(w => w.category === dictionary);
    
    default:
      return allWords;
  }
}

/**
 * Get a random word from the specified dictionary and length
 */
export function getRandomWord(dictionary: DictionaryType, length: number): WordEntry {
  const words = getWordList(dictionary, length);
  
  if (words.length === 0) {
    // Fallback to general 5-letter words
    const fallback = getWordList('general', 5);
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  
  return words[Math.floor(Math.random() * words.length)];
}

/**
 * Create a set of all valid words for validation
 */
const allValidWords = new Set<string>();
Object.values(wordsByLength).forEach(words => {
  words.forEach(w => allValidWords.add(w.word.toUpperCase()));
});

/**
 * Check if a word is valid (exists in any dictionary)
 */
export function isValidWord(word: string): boolean {
  return allValidWords.has(word.toUpperCase());
}

/**
 * Get the hint for a specific word
 */
export function getWordHint(word: string, dictionary: DictionaryType, length: number): string {
  const words = getWordList(dictionary, length);
  const entry = words.find(w => w.word.toUpperCase() === word.toUpperCase());
  return entry?.hint || 'Sin pista disponible';
}

/**
 * Get count of words available for a dictionary/length combination
 */
export function getWordCount(dictionary: DictionaryType, length: number): number {
  return getWordList(dictionary, length).length;
}
