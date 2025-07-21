export type Mode = "word" | "grammar" | "audio";

export const wordQuestionTypes = ["jp-to-pinyin", "cn-to-jp", "pinyin-to-jp"] as const;
export type WordQuestionType = (typeof wordQuestionTypes)[number];

export type WordSettings = {
  mode: "word";
  questionType: WordQuestionType;
  from: number;
  to: number;
  onlyUnmarked: boolean;
};

export type GrammarSettings = {
  mode: "grammar";
  from: number;
  to: number;
};

export type AudioSettings = {
  mode: "audio";
  from: number;
  to: number;
  onlyUnmarked: boolean;
};

export type Settings = WordSettings | GrammarSettings | AudioSettings;

export type Action =
  | { actionType: "setMode"; mode: Mode }
  | { actionType: "setWordQuestionType"; questionType: WordQuestionType }
  | { actionType: "setFrom"; from: number }
  | { actionType: "setTo"; to: number }
  | { actionType: "setOnlyUnmarked"; onlyUnmarked: boolean };