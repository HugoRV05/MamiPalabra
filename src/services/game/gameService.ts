import { LetterState, Letter } from '@/types';

/**
 * Validates a guess against the target word and returns letter states
 */
export function validateGuess(guess: string, target: string): Letter[] {
  const guessArr = guess.toUpperCase().split('');
  const targetArr = target.toUpperCase().split('');
  
  const result: Letter[] = guessArr.map(char => ({
    char,
    state: 'absent' as LetterState,
  }));

  // First pass: mark correct letters
  const targetUsed = new Array(targetArr.length).fill(false);
  
  guessArr.forEach((char, i) => {
    if (char === targetArr[i]) {
      result[i].state = 'correct';
      targetUsed[i] = true;
    }
  });

  // Second pass: mark present letters
  guessArr.forEach((char, i) => {
    if (result[i].state !== 'correct') {
      const targetIndex = targetArr.findIndex((tc, ti) => 
        tc === char && !targetUsed[ti]
      );
      if (targetIndex !== -1) {
        result[i].state = 'present';
        targetUsed[targetIndex] = true;
      }
    }
  });

  return result;
}

/**
 * Updates the keyboard letter states based on guess results
 */
export function updateLetterStates(
  current: Record<string, LetterState>,
  guessResult: Letter[]
): Record<string, LetterState> {
  const updated = { ...current };
  
  guessResult.forEach(({ char, state }) => {
    const currentState = updated[char];
    
    // Priority: correct > present > absent
    if (state === 'correct') {
      updated[char] = 'correct';
    } else if (state === 'present' && currentState !== 'correct') {
      updated[char] = 'present';
    } else if (state === 'absent' && !currentState) {
      updated[char] = 'absent';
    }
  });

  return updated;
}

/**
 * Checks if the guess is a win
 */
export function checkWin(result: Letter[]): boolean {
  return result.every(letter => letter.state === 'correct');
}

/**
 * Reveals a random letter that exists in the target but hasn't been discovered
 */
export function revealLetter(target: string, discovered: string[]): string | null {
  const targetLetters = target.toUpperCase().split('');
  const undiscovered = targetLetters.filter(
    letter => !discovered.includes(letter)
  );
  
  if (undiscovered.length === 0) return null;
  
  // Get unique undiscovered letters
  const unique = [...new Set(undiscovered)];
  return unique[Math.floor(Math.random() * unique.length)];
}
