import { WordEntry } from '@/types';
import { getWordList } from './dictionaryService';

/**
 * Generates the word of the day based on the current date.
 * Uses a deterministic algorithm so everyone gets the same word.
 */
export function getWordOfTheDay(): WordEntry {
  const words = getWordList('general', 5);
  
  // Use date as seed for deterministic selection
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Get positive index
  const index = Math.abs(hash) % words.length;
  
  return words[index];
}

/**
 * Check if the user has already played today's word
 */
export function hasPlayedToday(): boolean {
  if (typeof window === 'undefined') return false;
  
  const lastPlayed = localStorage.getItem('mami-palabra-daily-date');
  const today = new Date().toISOString().split('T')[0];
  
  return lastPlayed === today;
}

/**
 * Get time until next word of the day
 */
export function getTimeUntilNextWord(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
}
