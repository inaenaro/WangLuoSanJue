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
type Example = string | {
  "word": string,
  "pinyin": string,
  "meaning": string,
  "genre": Genre
};

export type Word = {
  "word": string,
  "pinyin": string,
  "meanings": {
    "part": Part,
    "meaning": string,
    "meaning_short": string,
    "example": Example
  }[],
  "lesson": number[],
  "notes"?: string,
  "hidden"?: boolean
};