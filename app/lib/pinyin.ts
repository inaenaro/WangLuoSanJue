export interface Syllable {
  [pinyin: string]: {
    "all": string[],
    "1": string[],
    "2": string[],
    "3": string[],
    "4": string[]
  }
}

interface Kanji {
  [kanji: string]: {
    "all": string[],
    "pinyin": string[]
  }
};

export interface PinyinsData {
  kanjis: Kanji;
  syllables: Syllable;
}

export const consonants = [
  'b', 'p', 'm', 'f', 'd', 't', 'n', 'l',
  'g', 'k', 'h', 'j', 'q', 'x',
  'zh', 'ch', 'sh', 'r',
  'z', 'c', 's'
] as const;

export const vowels = [
  'a', 'o', 'e', 'ai', 'ei', 'ao', 'ou',
  'an', 'en', 'ang', 'eng', 'ong',
  'i', 'ia', 'ie', 'iao', 'iou',
  'ian', 'in', 'iang', 'ing', 'iong',
  'u', 'ua', 'uo', 'uai', 'uei',
  'uan', 'uen', 'uang', 'ueng',
  'u\u0308', 'u\u0308e', 'u\u0308an', 'u\u0308n'
] as const;

export type Consonant = typeof consonants[number];
export type Vowel = typeof vowels[number];

export const validPinyins: Record<Vowel, (Consonant | '')[]> = {
  "a": ['', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'zh', 'ch', 'sh', 'z', 'c', 's'],
  "o": ['', 'b', 'p', 'm', 'f'],
  "e": ['', 'm', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'],
  "ai": ['', 'b', 'p', 'm', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'zh', 'ch', 'sh', 'z', 'c', 's'],
  "ei": ['', 'b', 'p', 'm', 'f', 'd', 'n', 'l', 'g', 'k', 'h', 'zh', 'sh', 'z'],
  "ao": ['', 'b', 'p', 'm', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'],
  "ou": ['', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'],
  "an": ['', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'],
  "en": ['', 'b', 'p', 'm', 'f', 'd', 'n', 'g', 'k', 'h', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'],
  "ang": ['', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'],
  "eng": ['', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'],
  "ong": ['d', 't', 'n', 'l', 'g', 'k', 'h', 'zh', 'ch', 'r', 'z', 'c', 's'],
  "i": ['', 'b', 'p', 'm', 'd', 't', 'n', 'l', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'],
  "ia": ['', 'l', 'j', 'q', 'x'],
  "ie": ['', 'b', 'p', 'm', 'd', 't', 'n', 'l', 'j', 'q', 'x'],
  "iao": ['', 'b', 'p', 'm', 'd', 't', 'n', 'l', 'j', 'q', 'x'],
  "iou": ['', 'm', 'd', 'n', 'l', 'j', 'q', 'x'],
  "ian": ['', 'b', 'p', 'm', 'd', 't', 'n', 'l', 'j', 'q', 'x'],
  "in": ['', 'b', 'p', 'm', 'n', 'l', 'j', 'q', 'x'],
  "iang": ['', 'n', 'l', 'j', 'q', 'x'],
  "ing": ['', 'b', 'p', 'm', 'd', 't', 'n', 'l', 'j', 'q', 'x'],
  "iong": ['', 'j', 'q', 'x'],
  "u": ['', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'],
  "ua": ['', 'g', 'k', 'h', 'zh', 'sh', 'r'],
  "uo": ['', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'],
  "uai": ['', 'g', 'k', 'h', 'zh', 'ch', 'sh'],
  "uei": ['', 'd', 't', 'g', 'k', 'h', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'],
  "uan": ['', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'],
  "uen": ['', 'd', 't', 'l', 'g', 'k', 'h', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'],
  "uang": ['', 'g', 'k', 'h', 'zh', 'ch', 'sh'],
  "ueng": [''],
  "u\u0308": ['', 'n', 'l', 'j', 'q', 'x'],
  "u\u0308e": ['', 'n', 'l', 'j', 'q', 'x'],
  "u\u0308an": ['', 'j', 'q', 'x'],
  "u\u0308n": ['', 'j', 'q', 'x'],
}

export function getVowelWithoutConsonant(vowel: Vowel) {
  if (/^(?:a|o|e)/.test(vowel)) {
    return vowel;
  } else if (/^i(?:a|o|e)/.test(vowel)) {
    return vowel.replace(/^i/, 'y');
  } else if (/^i/.test(vowel)) {
    return "y" + vowel;
  } else if (/^u\u0308/.test(vowel)) {
    return vowel.replace(/^u\u0308/, 'yu');
  } else if (/^u(?:a|o|e)/.test(vowel)) {
    return vowel.replace(/^u/, 'w');
  } else if (/^u/.test(vowel)) {
    return "w" + vowel;
  } else {
    return null;
  }
}

export function splitSyllable(syllable: string): { consonant: Consonant | '', vowel: Vowel } | null {
  const matchedConsonant = syllable.match(new RegExp(`^(${consonants.join('|')})`));
  const consonant = (matchedConsonant ? matchedConsonant[0] : '') as Consonant;
  if (!consonant) {
    const vowel = vowels.find(v => getVowelWithoutConsonant(v) === syllable);
    if (vowel) {
      return { consonant: '', vowel };
    } else {
      return null;
    }
  } else {
    const vowel = vowels.find(v => mergeSyllable(consonant, v) === syllable);
    if (vowel) {
      return { consonant, vowel };
    } else {
      return null;
    }
  }
}

//TODO: 声調
export function isValidSyllable(syllable: string) {
  if (syllable === "er" || syllable === "ng") return true;
  const splittedSyllable = splitSyllable(syllable);
  if (!splittedSyllable) return false;
  const { consonant, vowel } = splittedSyllable;
  return validPinyins[vowel].includes(consonant);
}

export function mergeSyllable(consonant: Consonant | '', vowel: Vowel) {
  if (!validPinyins[vowel].includes(consonant)) {
    return null;
  }
  if (consonant === '') {
    return getVowelWithoutConsonant(vowel);
  }
  if (["iou", "uei", "uen"].includes(vowel)) {
    return consonant + vowel.replace(/o|e/, '');
  }
  if (["j", "q", "x"].includes(consonant) && /^u\u0308/.test(vowel)) {
    return consonant + vowel.replace(/^u\u0308/, 'u');
  }
  return consonant + vowel;
}

// ng
export function getSyllableWithTone(syllable: string, tone: 1 | 2 | 3 | 4) {
  const tones = ["", "\u0304", "\u0301", "\u030c", "\u0300"];
  if (syllable.includes("a")) {
    return syllable.replace("a", `a${tones[tone]}`);
  } else if (syllable.includes("o")) {
    return syllable.replace("o", `o${tones[tone]}`);
  } else if (syllable.includes("e")) {
    return syllable.replace("e", `e${tones[tone]}`);
  } else if (syllable.endsWith("n") || syllable.endsWith("ng")) {
    return syllable.replace(/(n|ng)$/, `${tones[tone]}$1`);
  } else {
    return syllable + tones[tone];
  }
}
