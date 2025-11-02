'use client';

import { useContext, useEffect, useState } from "react";
import { button } from "@/components/Button";
import Select from "@/components/Select";
import { type WordQuestionType, wordQuestionTypes, grammarQuestionTypes, GrammarQuestionType } from "@/app/lib/settings";
import { MdOutlineArrowRightAlt, MdOutlineKeyboardDoubleArrowDown, MdOutlineKeyboardDoubleArrowUp, MdOutlineStar } from "react-icons/md";
import { TestStatusContext } from "@/app/page";

export default function SelectMode() {
  const { started, setStarted, settings, dispatch } = useContext(TestStatusContext);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (started) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [started]);

  return (
    <div className="border-b border-gray p-2">
      <div className={`duration-500 ease-in-out ${collapsed ? "max-h-0" : "max-h-screen"} overflow-hidden`}>
        <div className="grid grid-cols-3 gap-1 p-1 my-2 w-fit rounded-md border border-gray">
          <button disabled={started} onClick={() => dispatch({ actionType: "setMode", mode: "word" })} className={`text-nowrap flex justify-center ${button({ style: settings.mode === "word" ? "primary" : "secondary" })}`}>単語</button>
          <button disabled={started} onClick={() => dispatch({ actionType: "setMode", mode: "grammar" })} className={`text-nowrap flex justify-center ${button({ style: settings.mode === "grammar" ? "primary" : "secondary" })}`}>文法</button>
          <button disabled={started} onClick={() => dispatch({ actionType: "setMode", mode: "audio" })} className={`text-nowrap flex justify-center ${button({ style: settings.mode === "audio" ? "primary" : "secondary" })}`}>リスニング</button>
        </div>
        {settings.mode === "word" && (
          <WordOption />
        )}
        {settings.mode === "grammar" && (
          <GrammarOption />
        )}
        {settings.mode === "audio" && (
          <AudioOption />
        )}
      </div>
      <div className="flex justify-between items-center">
        {started
          ? <button
            id="end"
            onClick={() => setStarted(false)}
            className={button({ style: "danger" })}
          >終了</button>
          : <button
            id="start"
            onClick={() => setStarted(true)}
            className={button({ style: "success" })}
          >開始</button>}
        <button onClick={() => setCollapsed((prev) => !prev)} className="size-8 p-1 cursor-pointer">
          {collapsed
            ? <MdOutlineKeyboardDoubleArrowDown className="size-6" />
            : <MdOutlineKeyboardDoubleArrowUp className="size-6" />
          }
        </button>
      </div>
    </div>
  );
}

const questionTypeMap: Record<WordQuestionType | GrammarQuestionType, { type: "trans"; from: string; to: string; } | { type: "other"; text: string; }> = {
  "jp-to-pinyin": {
    type: "trans",
    from: "日",
    to: "拼音"
  },
  "cn-to-jp": {
    type: "trans",
    from: "中",
    to: "日"
  },
  "pinyin-to-jp": {
    type: "trans",
    from: "拼音",
    to: "日"
  },
  "jp-to-cn": {
    type: "trans",
    from: "日",
    to: "中"
  },
  "sort": {
    type: "other",
    text: "並び替え"
  }
};

function WordOption() {
  const { started } = useContext(TestStatusContext);

  return (
    <div className="my-2">
      <div className="grid grid-cols-3 gap-1 p-1 my-2 w-fit rounded-md border border-gray">
        <SelectQuestionType />
      </div>
      <div className="flex flex-wrap gap-6 my-2">
        <SelectLesson disabled={started} />
        <ToggleOnlyUnmarked disabled={started} />
      </div>
    </div>
  );
}

function GrammarOption() {
  const { started } = useContext(TestStatusContext);

  return (
    <div className="my-2">
      <div className="grid grid-cols-3 gap-1 p-1 my-2 w-fit rounded-md border border-gray">
        <SelectQuestionType />
      </div>
      <div className="my-2">
        <SelectLesson disabled={started} />
      </div>
    </div>
  );
}

function AudioOption() {
  const { started } = useContext(TestStatusContext);

  return (
    <div className="my-2">
      <div className="flex flex-wrap gap-6 my-2">
        <SelectLesson disabled={started} />
        <ToggleOnlyUnmarked disabled={started} />
      </div>
    </div>
  );
}

function SelectQuestionType() {
  const { settings, dispatch, started } = useContext(TestStatusContext);

  if (settings.mode === "audio") return null;
  const questionTypes = settings.mode === "word" ? wordQuestionTypes : grammarQuestionTypes;

  return (<>
    {questionTypes.map(questionType => (
      <button
        key={questionType}
        onClick={() => dispatch(
          settings.mode === "word" ? { actionType: "setWordQuestionType", questionType: questionType as WordQuestionType }
            : { actionType: "setGrammarQuestionType", questionType: questionType as GrammarQuestionType }
        )}
        disabled={started}
        className={button({ style: settings.questionType === questionType ? "primary" : "secondary" })}
      >
        {questionTypeMap[questionType].type === "trans"
          ? <div className="flex justify-center text-center items-center gap-1">
            <p className="text-nowrap">{questionTypeMap[questionType].from}</p>
            <MdOutlineArrowRightAlt className="min-w-4 size-4" />
            <p className="text-nowrap">{questionTypeMap[questionType].to}</p>
          </div>
          : <div className="text-center">
            <p className="text-nowrap">{questionTypeMap[questionType].text}</p>
          </div>
        }
      </button>
    ))}
  </>);
}

const lessons = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"].map(x => `第${x}课`);

function SelectLesson({ disabled }: { disabled?: boolean }) {
  const { settings, dispatch } = useContext(TestStatusContext);

  return (
    <label className="block w-fit">
      範囲:
      <Select
        disabled={disabled}
        options={lessons}
        selected={lessons[settings.from - 1]}
        onChange={(e) => dispatch({ actionType: "setFrom", from: (lessons.indexOf(e.currentTarget.value) + 1) || 1 })}
        className="font-ch mx-1"
      />
      から
      <Select
        disabled={disabled}
        options={lessons}
        selected={lessons[settings.to - 1]}
        onChange={(e) => dispatch({ actionType: "setTo", to: (lessons.indexOf(e.currentTarget.value) + 1) || 10 })}
        className="font-ch mx-1"
      />
      まで
    </label>
  );
}

function ToggleOnlyUnmarked({ disabled }: { disabled?: boolean }) {
  const { settings, dispatch } = useContext(TestStatusContext);

  if (settings.mode === "grammar") return null;

  return (
    <label className="flex items-center space-x-2 w-fit">
      <div className="relative">
        <div className={`absolute inset-y-1 size-5 bg-white-text p-1 rounded-full pointer-events-none duration-500 ease-in-out ${settings.onlyUnmarked ? "transform-[translateX(calc(3.5rem+(-1.25rem)+(-0.25rem)))]" : "transform-[translateX(0.25rem)]"}`} />
        <input
          type="checkbox"
          checked={settings.onlyUnmarked}
          onChange={(e) => dispatch({ actionType: "setOnlyUnmarked", onlyUnmarked: e.target.checked })}
          className={`align-middle appearance-none box-border h-7 w-14 disabled:opacity-70 border-2 rounded-full border-gray cursor-pointer transition-colors duration-500 ease-in-out ${settings.onlyUnmarked ? "bg-[#ee1c25]" : "bg-[#4d505b]"}`}
          disabled={disabled}
        />
      </div>
      <span className="inline-flex justify-center"><MdOutlineStar className="inline-block size-6 min-w-6 text-[#ffff00]" />を付けていない単語のみ</span>
    </label>
  );
}
