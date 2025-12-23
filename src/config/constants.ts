/* ========== GAME CONSTANTS ========== */

export const MAX_ATTEMPTS = 6;

export const WORD_LENGTHS = [4, 5, 6, 7] as const;

export const DEFAULT_WORD_LENGTH = 5;

export const HINTS_PER_GAME = {
  letter: 1,
  definition: 1,
} as const;

/* ========== KEYBOARD LAYOUT ========== */

export const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
] as const;

export const SPECIAL_KEYS = ['ENTER', 'BACK'] as const;

/* ========== ANIMATION DURATIONS ========== */

export const ANIMATION = {
  FLIP_DURATION: 500,
  FLIP_DELAY: 200,
  BOUNCE_DURATION: 100,
  SHAKE_DURATION: 600,
  POP_DURATION: 100,
} as const;

/* ========== STORAGE KEYS ========== */

export const STORAGE_KEYS = {
  STATS: 'mami-palabra-stats',
  PREFERENCES: 'mami-palabra-preferences',
  DAILY_STATE: 'mami-palabra-daily',
  UNLIMITED_STATE: 'mami-palabra-unlimited',
} as const;

/* ========== MESSAGES ========== */

export const MESSAGES = {
  WIN: [
    '¡Eres increíble, mami! 💖',
    '¡Qué lista eres, mami! ✨',
    '¡Muy bien, mami! 🌟',
    '¡Lo lograste, mami! 💪',
    '¡Casi no, pero sí! 😅',
    '¡Por los pelos, mami! 🎉',
  ],
  LOSE: '¡No pasa nada, mami! Mañana lo consigues 💕',
  NOT_ENOUGH_LETTERS: 'Faltan letras, mami',
  NOT_IN_WORD_LIST: 'Esa palabra no vale, mami',
  HINT_LETTER: 'Te doy una ayudita, la palabra tiene:',
  HINT_DEFINITION: 'Pista para ti, mami:',
  NO_HINTS_LEFT: 'Ya no quedan pistas, mami',
  CTA_PHRASES: [
    '¿Quieres jugar más, mami?',
    '¿Una partidita más?',
    'La diversión no tiene que parar...',
    '¡Hay más palabras esperándote!',
    '¿Te quedaste con ganas?',
    '¡El modo ilimitado te espera!',
    '¿Probamos otra palabra?',
    '¡No pares ahora!',
    '¿Quieres seguir entrenando?',
    '¡Mami, enséñales cómo se hace!',
  ],
} as const;
