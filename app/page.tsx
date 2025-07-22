'use client';
import { useContext, useReducer, useState } from "react";
import WordTest from "../components/WordTest";
import GrammarTest from "../components/GrammarTest";
import AudioTest from "../components/AudioTest";
import SelectMode from "@/components/SelectMode";
import { type Action, type Settings } from "./lib/settings";
import useKeydown from "./hooks/useKeyDown";
import { InputStatusContext } from "@/components/Providers";

export default function Home() {
  const { inputStatus } = useContext(InputStatusContext);
  const [started, setStarted] = useState(false);
  const [settings, dispatch] = useReducer(reducer, { mode: "word", questionType: "jp-to-pinyin", from: 1, to: 10, onlyUnmarked: false });

  useKeydown(inputStatus);

  return (
    <div>
      <SelectMode started={started} setStarted={setStarted} settings={settings} dispatch={dispatch} />
      {started && (
        settings.mode === "word" ? <WordTest setStarted={setStarted} settings={settings} />
          : settings.mode === "grammar" ? <GrammarTest />
            : <AudioTest setStarted={setStarted} settings={settings} />
      )}
      <div className="border-t border-gray p-2">
        <p>Todo:</p>
        <ul className="list-disc pl-5">
          <li>文法問題</li>
          <li>第5-9課追加・校閲</li>
          <li>答えの表示改善</li>
          <li>ID機能で星印を端末間共有</li>
          <li>bad setState修正</li>
        </ul>
      </div>
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
