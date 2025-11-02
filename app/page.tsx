'use client';
import { createContext, useContext, useReducer, useState } from "react";
import WordTest from "@/components/WordTest";
import GrammarTest from "@/components/GrammarTest";
import AudioTest from "@/components/AudioTest";
import SelectMode from "@/components/SelectMode";
import { InputStatusContext } from "@/components/Providers";
import { type Action, type Settings } from "./lib/settings";
import useKeydown from "./hooks/useKeyDown";

interface TestStatus {
  started: boolean;
  setStarted: React.Dispatch<React.SetStateAction<boolean>>;
  settings: Settings;
  dispatch: React.Dispatch<Action>;
}

const initialSettings: Settings = {
  mode: "word",
  questionType: "jp-to-pinyin",
  from: 1,
  to: 10,
  onlyUnmarked: false
};

export const TestStatusContext = createContext<TestStatus>({ started: false, setStarted: () => { }, settings: initialSettings, dispatch: () => { } });

export default function Home() {
  const { inputStatus } = useContext(InputStatusContext);
  const [started, setStarted] = useState(false);
  const [settings, dispatch] = useReducer(reducer, initialSettings);

  useKeydown(inputStatus);

  return (
    <div>
      <TestStatusContext.Provider value={{ started, setStarted, settings, dispatch }}>
        <SelectMode />
        {started ? (
          settings.mode === "word" ? <WordTest setStarted={setStarted} settings={settings} />
            : settings.mode === "grammar" ? <GrammarTest setStarted={setStarted} settings={settings} />
              : <AudioTest setStarted={setStarted} settings={settings} />
        ) : <div className="p-2" />}
      </TestStatusContext.Provider>
      <div className="border-t border-gray p-2">
        <div className="text-sm">
          <p>サイト利用上の注意:</p>
          <ul className="list-disc pl-5">
            <li>このサイトは作成の際に正確を期していますが、必ずしもそれを保証するものではありません。</li>
            <li>内容の誤りや不具合、改善案等がある場合は何らかの方法でサイト作成者に報告してください。</li>
            <li>音声読み上げにはブラウザの読み上げを使用しているため、ピンイン通りの発音ではないことがあります。</li>
            <li><a href="/table" className="text-[#310510] dark:text-[#e7c8c8] decoration-[#310510] dark:decoration-[#e7c8c8] underline hover:text-[#310510]/80 dark:hover:text-[#e7c8c8]/80 hover:decoration-[#310510]/80 dark:hover:decoration-[#e7c8c8]/80">ピンイン表はこちら</a></li>
          </ul>
        </div>
        <div className="text-xs text-gray">
          <p>Todo:</p>
          <ul className="list-disc pl-5">
            <li>文法問題追加</li>
            <li>第6-9課校閲</li>
            <li>キーボードのカーソル表示</li>
            <li>複数解対応</li>
            <li>ID機能で星印を端末間共有</li>
            <li>bad setState修正</li>
            <li>読み上げとの不一致への対応</li>
            <li>- 例: 照片, 軽声</li>
            <li>重複語の処理</li>
            <li>複数タブ開くとバグる</li>
          </ul>
        </div>
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
          return { mode: "grammar", questionType: "jp-to-cn", from: 1, to: 10 };
        case "audio":
          return { mode: "audio", from: 1, to: 10, onlyUnmarked: false };
      }
    case "setWordQuestionType":
      if (state.mode !== "word") {
        return state;
      }
      return { ...state, questionType: action.questionType };
    case "setGrammarQuestionType":
      if (state.mode !== "grammar") {
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
