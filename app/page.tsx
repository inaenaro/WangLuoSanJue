'use client';
import { useReducer, useState } from "react";
import WordTest from "../components/WordTest";
import GrammarTest from "../components/GrammarTest";
import AudioTest from "../components/AudioTest";
import SelectMode from "@/components/SelectMode";

export type Mode = "word" | "grammar" | "audio";

export const wordQuestionTypes = ["jp-to-pinyin", "cn-to-jp", "pinyin-to-jp"] as const;
export type WordQuestionType = (typeof wordQuestionTypes)[number];

export type WordOptions = {
  mode: "word";
  questionType: WordQuestionType;
  from: number;
  to: number;
  onlyUnmarked: boolean;
};

export type GrammarOptions = {
  mode: "grammar";
  from: number;
  to: number;
};

export type AudioOptions = {
  mode: "audio";
  from: number;
  to: number;
  onlyUnmarked: boolean;
};

export type Options = WordOptions | GrammarOptions | AudioOptions;

export type Action =
  | { actionType: "setMode"; mode: Mode }
  | { actionType: "setWordQuestionType"; questionType: WordQuestionType }
  | { actionType: "setFrom"; from: number }
  | { actionType: "setTo"; to: number }
  | { actionType: "setOnlyUnmarked"; onlyUnmarked: boolean };

export default function Home() {
  const [started, setStarted] = useState(false);
  const [options, dispatch] = useReducer(reducer, { mode: "word", questionType: "jp-to-pinyin", from: 1, to: 10, onlyUnmarked: false });

  return (
    <div>
      <SelectMode started={started} setStarted={setStarted} options={options} dispatch={dispatch} />
      {started && (
        options.mode === "word" ? <WordTest started={started} setStarted={setStarted} options={options} />
          : options.mode === "grammar" ? <GrammarTest />
            : <AudioTest started={started} setStarted={setStarted} options={options} />
      )}
    </div>
  );
}

function reducer(state: Options, action: Action): Options {
  switch (action.actionType) {
    case "setMode":
      switch (action.mode) {
        case "word":
          return { mode: "word", questionType: "jp-to-pinyin", from: 1, to: 10, onlyUnmarked: false };
        case "grammar":
          return { mode: "grammar", from: 1, to: 10 };
        case "audio":
          return { mode: "audio", from: 1, to: 10, onlyUnmarked: false };
      }
    case "setWordQuestionType":
      if (state.mode !== "word") {
        return state;
      }
      return { ...state, questionType: action.questionType };
    case "setFrom":
      return { ...state, from: action.from };
    case "setTo":
      return { ...state, to: action.to };
    case "setOnlyUnmarked":
      if (state.mode === "grammar") {
        return state;
      }
      return { ...state, onlyUnmarked: action.onlyUnmarked };
  }
}
