const fs = require('fs');

// Load files
const words5 = JSON.parse(fs.readFileSync('C:\\Users\\rodri\\Antigravity\\MamiPalabra\\src\\services\\dictionary\\words\\words-5.json', 'utf8'));
const allWords5 = JSON.parse(fs.readFileSync('C:\\Users\\rodri\\Antigravity\\MamiPalabra\\src\\services\\dictionary\\words\\all-words-5.json', 'utf8'));

console.log(`Final solution words in words-5.json: ${words5.length}`);
console.log(`Final validation words in all-words-5.json: ${allWords5.length}`);

// Simple validation set logic (mocking dictionaryService.ts)
const allValidWords = new Set();
words5.forEach(w => allValidWords.add(w.word.toUpperCase()));
allWords5.forEach(w => allValidWords.add(w.toUpperCase()));

function test(word) {
  const valid = allValidWords.has(word.toUpperCase());
  console.log(`Word "${word}": ${valid ? 'VALID' : 'INVALID'}`);
  return valid;
}

const tests = [
  'GATOS', // Old solution
  'LENTO', // New solution at the end
  'FELPA', // Only in validation list
  'ZANCA', // Only in validation list
  'XXXXX', // Junk
  'ZZZZZ'  // Junk
];

tests.forEach(test);

// Verify all solution words are in validation set (implicitly they are because we add both)
const missing = words5.filter(w => !allValidWords.has(w.word.toUpperCase()));
if (missing.length > 0) {
  console.log(`ERROR: ${missing.length} solution words not in validation set!`);
} else {
  console.log('SUCCESS: All solution words are valid.');
}
