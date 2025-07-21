'use client';

import { type ActionDispatch } from "react";
import { useState } from "react";
import { button } from "./Button";
import Select from "./Select";
import { AudioOptions, GrammarOptions, WordOptions, WordQuestionType, wordQuestionTypes, type Action, type Options } from "@/app/page";
import { MdOutlineArrowRightAlt, MdOutlineKeyboardDoubleArrowDown, MdOutlineKeyboardDoubleArrowUp, MdOutlineStar } from "react-icons/md";

type Dispatch = ActionDispatch<[action: Action]>;

export default function SelectMode({ started, setStarted, options, dispatch }: { started: boolean; setStarted: (started: boolean) => void; options: Options; dispatch: Dispatch; }) {
  const [collapsed, setCollapsed] = useState(false); // State to track collapse/expand

  return (
    <div className="border-b border-gray p-2">
      <div className={`duration-500 ease-in-out ${collapsed ? "max-h-0" : "max-h-screen"} overflow-hidden`}>
        <div className="grid grid-cols-3 gap-1 p-1 my-2 w-fit rounded-md border border-gray">
          <button disabled={started} onClick={() => dispatch({ actionType: "setMode", mode: "word" })} className={`text-nowrap flex justify-center ${button({ style: options.mode === "word" ? "primary" : "secondary" })}`}>単語</button>
          <button disabled={started} onClick={() => dispatch({ actionType: "setMode", mode: "grammar" })} className={`text-nowrap flex justify-center ${button({ style: options.mode === "grammar" ? "primary" : "secondary" })}`}>文法</button>
          <button disabled={started} onClick={() => dispatch({ actionType: "setMode", mode: "audio" })} className={`text-nowrap flex justify-center ${button({ style: options.mode === "audio" ? "primary" : "secondary" })}`}>リスニング</button>
        </div>
        {options.mode === "word" && (
          <WordOption started={started} options={options} dispatch={dispatch} />
        )}
        {options.mode === "grammar" && (
          <GrammarOption started={started} options={options} dispatch={dispatch} />
        )}
        {options.mode === "audio" && (
          <AudioOption started={started} options={options} dispatch={dispatch} />
        )}
      </div>
      <div className="flex justify-between items-center">
        {started
          ? <button
            onClick={() => {setStarted(false); setCollapsed(false);}}
            className={button({ style: "danger" })}
          >終了</button>
          : <button
            onClick={() => {setStarted(true); setCollapsed(true);}}
            className={button({ style: "success" })}
          >開始</button>}
        <button onClick={() => setCollapsed((prev) => !prev)} className="size-8 cursor-pointer">
          {collapsed
            ? <MdOutlineKeyboardDoubleArrowDown className="size-6" />
            : <MdOutlineKeyboardDoubleArrowUp className="size-6" />
          }
        </button>
      </div>
    </div>
  );
}

const questionTypeMap: Record<WordQuestionType, { from: string; to: string; }> = {
  "jp-to-pinyin": {
    from: "日",
    to: "拼音"
  },
  "cn-to-jp": {
    from: "中",
    to: "日"
  },
  "pinyin-to-jp": {
    from: "拼音",
    to: "日"
  }
};

function WordOption({ started, options, dispatch }: { started: boolean; options: WordOptions; dispatch: Dispatch; }) {
  return (
    <div className="my-2">
      <div className="grid grid-cols-3 gap-1 p-1 my-2 w-fit rounded-md border border-gray">
        {wordQuestionTypes.map(questionType => (
          <button
            key={questionType}
            onClick={() => dispatch({ actionType: "setWordQuestionType", questionType })}
            disabled={started}
            className={button({ style: options.questionType === questionType ? "primary" : "secondary" })}
          >
            <div className="flex justify-center text-center items-center gap-1">
              <p className="font-ch text-nowrap">{questionTypeMap[questionType].from}</p>
              <MdOutlineArrowRightAlt className="min-w-4 size-4" />
              <p className="font-ch text-nowrap">{questionTypeMap[questionType].to}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-6 my-2">
        <SelectLesson options={options} dispatch={dispatch} disabled={started} />
        <ToggleOnlyUnmarked options={options} dispatch={dispatch} disabled={started} />
      </div>
    </div>
  );
}

function GrammarOption({ started, options, dispatch }: { started: boolean; options: GrammarOptions; dispatch: Dispatch; }) {
  return (
    <div className="my-2">
      <div className="my-2">
        <SelectLesson options={options} dispatch={dispatch} disabled={started} />
      </div>
    </div>
  );
}

function AudioOption({ started, options, dispatch }: { started: boolean; options: AudioOptions; dispatch: Dispatch; }) {
  return (
    <div className="my-2">
      <div className="flex flex-wrap gap-6 my-2">
        <SelectLesson options={options} dispatch={dispatch} disabled={started} />
        <ToggleOnlyUnmarked options={options} dispatch={dispatch} disabled={started} />
      </div>
    </div>
  );
}

const lessons = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"].map(x => `第${x}课`);

function SelectLesson({ options, dispatch, disabled }: { options: Options; dispatch: Dispatch; disabled?: boolean }) {
  return (
    <label className="block w-fit">
      範囲:
      <Select
        disabled={disabled}
        options={lessons}
        selected={lessons[options.from - 1]}
        onChange={(e) => dispatch({ actionType: "setFrom", from: (lessons.indexOf(e.currentTarget.value) + 1) || 1 })}
        className="font-ch mx-1"
      />
      から
      <Select
        disabled={disabled}
        options={lessons}
        selected={lessons[options.to - 1]}
        onChange={(e) => dispatch({ actionType: "setTo", to: (lessons.indexOf(e.currentTarget.value) + 1) || 10 })}
        className="font-ch mx-1"
      />
      まで
    </label>
  );
}

function ToggleOnlyUnmarked({ options, dispatch, disabled }: { options: WordOptions | AudioOptions; dispatch: Dispatch; disabled?: boolean }) {
  return (
    <label className="flex items-center space-x-2 w-fit">
      <div className="relative">
        <div className={`absolute inset-y-1 size-5 bg-white-text p-1 rounded-full pointer-events-none duration-500 ease-in-out ${options.onlyUnmarked ? "transform-[translateX(calc(3.5rem+(-1.25rem)+(-0.25rem)))]" : "transform-[translateX(0.25rem)]"}`} />
        <input
          type="checkbox"
          checked={options.onlyUnmarked}
          onChange={(e) => dispatch({ actionType: "setOnlyUnmarked", onlyUnmarked: e.target.checked })}
          className={`align-middle appearance-none box-border h-7 w-14 disabled:opacity-70 border-2 rounded-full border-gray cursor-pointer transition-colors duration-500 ease-in-out ${options.onlyUnmarked ? "bg-[#ee1c25]" : "bg-[#4d505b]"}`}
          disabled={disabled}
        />
      </div>
      <span className="inline-flex justify-center"><MdOutlineStar className="inline-block size-6 min-w-6 text-[#ffff00]" />を付けていない単語のみ</span>
    </label>
  );
}
