import { createContext, useReducer, useState } from "react";
import WordTest from "@/components/WordTest";
import GrammarTest from "@/components/GrammarTest";
import AudioTest from "@/components/AudioTest";
import SelectMode from "@/components/SelectMode";
import type { Settings, Action } from "../app/lib/settings";

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

export default function MainComponent() {
  const [started, setStarted] = useState(false);
  const [settings, dispatch] = useReducer(reducer, initialSettings);

  return (
    <TestStatusContext.Provider value={{ started, setStarted, settings, dispatch }}>
      <SelectMode />
      {started ? (
        settings.mode === "word" ? <WordTest setStarted={setStarted} settings={settings} />
          : settings.mode === "grammar" ? <GrammarTest setStarted={setStarted} settings={settings} />
            : <AudioTest setStarted={setStarted} settings={settings} />
      ) : <div className="p-2" />}
    </TestStatusContext.Provider>
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
