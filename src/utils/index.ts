/**
 * Utility functions for the MamiPalabra app
 */

/**
 * Returns a greeting based on the current time of day
 */
export function getGreeting(): { text: string; subtext: string } {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return { text: '¡Buenos días!', subtext: '¿Lista para jugar?' };
  } else if (hour >= 12 && hour < 19) {
    return { text: '¡Buenas tardes!', subtext: 'Un juego rápido?' };
  } else {
    return { text: '¡Buenas noches!', subtext: 'Relájate y juega' };
  }
}

/**
 * Formats a date to a localized string
 */
export function formatDate(date: Date, locale: string = 'es-ES'): string {
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formats a date to a short string (e.g., "23 Dic")
 */
export function formatDateShort(date: Date): string {
  const day = date.getDate();
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${day} ${months[date.getMonth()]}`;
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Clamps a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
