import grammarJSONData from "@/public/grammar.json";

export interface Grammar {
  "about": string;
  "sentence": string;
  "meaning": string;
  "examples"?: string[];
  "lesson": number;
  "id": string;
};

export const grammarMap = new Map<string, Grammar>(Object.entries(grammarJSONData as Record<string, Omit<Grammar, "id">>)
  .map(([id, grammar]) => [id, { ...grammar, id }])
);
