'use client';
import { useReducer, useState } from "react";
import WordTest from "../components/WordTest";
import GrammarTest from "../components/GrammarTest";
import AudioTest from "../components/AudioTest";
import SelectMode from "@/components/SelectMode";
import { type Action, type Settings } from "./lib/settings";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [settings, dispatch] = useReducer(reducer, { mode: "word", questionType: "jp-to-pinyin", from: 1, to: 10, onlyUnmarked: false });

  return (
    <div>
      <SelectMode started={started} setStarted={setStarted} settings={settings} dispatch={dispatch} />
      {started && (
        settings.mode === "word" ? <WordTest setStarted={setStarted} settings={settings} />
          : settings.mode === "grammar" ? <GrammarTest />
            : <AudioTest setStarted={setStarted} settings={settings} />
      )}
    </div>
  );
}

function reducer(state: Settings, action: Action): Settings {
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
