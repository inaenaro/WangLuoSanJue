import wordJSONData from "@/public/words.json";

const partList = [
  ["n.", "名詞"],
  ["v.", "動詞"],
  ["adj.", "形容詞"],
  ["adv.", "副詞"],
  ["part.", "助詞"],
  ["pron.", "代名詞"],
  ["num.", "数詞"],
  ["cl.", "量詞"],
  ["pn.", "固有名詞"],
  ["phrase", "熟語"]

  // ["prep.", "前置詞"],
  // ["conj.", "接続詞"],
  // ["int.", "間投詞"],
  // ["aux.", "助動詞"]
  // art.
] as const;
export type Part = typeof partList[number][0];
export const partMap = new Map<Part, string>(partList);

type Genre = string;

//NOTE: string | ?
type Example = {
  "word": string,
  "pinyin": string,
  "meaning": string,
  "genre": Genre
};

export interface Word {
  "id": string,
  "word": string,
  "pinyin": string,
  "meanings": {
    "part": Part | "",
    "meaning": string,
    "meaning_short": string,
    "examples": Example[]
  }[],
  "lesson": number[],
  "notes"?: string,
  "hidden"?: boolean
};

const char = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";

export const wordMap = new Map<string, Word>(Object.entries(wordJSONData as Record<string, Omit<Word, "id">>)
  .map<[string, Word]>(([id, word]) => [id, {
    ...word,
    pinyin: word.pinyin.normalize("NFD"),
    id
  }])
  .sort(([, a], [, b]) => {
    for (let i = 0; i < 4; i++) {
      if (a.id[i] !== b.id[i]) {
        return char.indexOf(a.id[i]) - char.indexOf(b.id[i]);
      }
    }
    return 0;
  })
);
