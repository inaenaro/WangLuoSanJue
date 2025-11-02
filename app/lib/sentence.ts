import sentenceJSONData from "@/public/sentence.json";

export interface Sentence {
  "chinese": string;
  "pinyin": string;
  "japanese": string;
  "lesson": number;
  "point"?: number;
  "id": string;
}

export const sentenceMap = new Map<string, Sentence>(Object.entries(sentenceJSONData as Record<string, Omit<Sentence, "id">>)
  .map(([id, sentence]) => [id, { ...sentence, pinyin: sentence.pinyin.normalize("NFD"), id }])
);

export function getRegExp(chinese: string) {
  // xxxxa[b]xxxx -> xxxxaxxxx or xxxxbxxxx
  // xxx｢aa[b]xxxx -> xxxxaaxxxx or xxxxbxxxx
  // xxxxa(b)xxxx -> xxxxaxxxx or xxxxabxxxx
  // const pattern = chinese
  //   .replace(/\s+/g, "") // remove spaces
  //   .trim();
  const pattern = chinese
    .replace(/\((.*?)\)/gu, (_, p1) => `(?:${p1.replace(/\//g, "|")})?`)
    .replace(/(?:｢([^\[\]]*?)|(.))\[(.*?)\]/gu, (_, p1, p2, p3) => `(?:${p1 || p2}|${p3.replace(/\//g, "|")})`)
  return new RegExp(`^${pattern}$`, "u");
}