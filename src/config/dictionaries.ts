import { Dictionary, DictionaryType } from '@/types';

export const DICTIONARIES: Dictionary[] = [
  {
    type: 'general',
    name: 'General',
    description: 'Mezcla balanceada de palabras',
    wordLengths: [4, 5, 6, 7],
  },
  {
    type: 'easy',
    name: 'Fácil',
    description: 'Palabras muy comunes',
    wordLengths: [4, 5, 6, 7],
  },
  {
    type: 'hard',
    name: 'Difícil',
    description: 'Para expertos en vocabulario',
    wordLengths: [4, 5, 6, 7],
  },
  {
    type: 'nature',
    name: 'Naturaleza',
    description: 'Animales, plantas y más',
    wordLengths: [4, 5, 6, 7],
  },
  {
    type: 'food',
    name: 'Comida',
    description: 'Ingredientes y platos',
    wordLengths: [4, 5, 6, 7],
  },
  {
    type: 'travel',
    name: 'Viajes',
    description: 'Lugares y aventuras',
    wordLengths: [4, 5, 6, 7],
  },
  {
    type: 'home',
    name: 'Hogar',
    description: 'Cosas del día a día',
    wordLengths: [4, 5, 6, 7],
  },
];

export function getDictionaryInfo(type: DictionaryType): Dictionary | undefined {
  return DICTIONARIES.find(d => d.type === type);
}

export function getDictionaryLabel(type: DictionaryType): string {
  const dict = getDictionaryInfo(type);
  return dict ? dict.name : type;
}
