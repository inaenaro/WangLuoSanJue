'use client';
import { useState, useEffect, JSX } from "react";
import { button } from "@/components/Button";
import AnswerInput from "@/components/AnswerInput";
import WordCheckbox from "@/components/WordCheckBox";
import { Word } from "@/app/lib/word";
import { type Sentence } from "@/app/lib/sentence";

// subject: 出題対象(単語, 文章)
interface Question<T> {
  subject: T;
  answers: string[] | RegExp;
  questionElement: JSX.Element;
  answerElement: JSX.Element;
  // AudioSection, InputSectionの更新用
  key: number;
};

export interface Subjects<T> {
  type: T extends Word ? "word" : T extends Sentence ? "grammar" : "other";
  subjectList: T[];
  getQuestion: (subject: T) => Omit<Question<T>, "key">;
}

type TestProps<T> = {
  setStarted: (p: boolean) => void;
  hasAudio?: boolean;
  hasInput?: boolean;
  answerType: "ja" | "cn" | "pinyin";
  subjects: Subjects<T>;
}

export default function Test<T>({ setStarted, hasAudio, answerType, subjects }: TestProps<T>) {
  const { subjectList, getQuestion, type } = subjects;
  const [question, setQuestion] = useState<Question<T> | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [remainingSubjects, setRemainingSubjects] = useState<T[]>(subjectList);
  const [failedWords, setFailedWords] = useState<T[]>([]);

  useEffect(() => {
    // setRemainingSubjects(subjectList);
    // setStarted(true);
    loadNextWord(remainingSubjects);
  }, []);

  const loadNextWord = (subjects: T[], failed: boolean = false) => {
    speechSynthesis.cancel();
    const nextFailedWords = [...failedWords];

    if (failed && question) {
      nextFailedWords.push(question.subject);
    }

    const nextWords = subjects.length ? [...subjects] : nextFailedWords;

    if (nextWords.length === 0) {
      alert("--終--");
      handleEndTest();
      return;
    }

    if (subjects.length === 0) {
      setFailedWords([]);
    } else {
      setFailedWords(nextFailedWords);
    }

    const randomIndex = Math.floor(Math.random() * nextWords.length);
    const randomWord = nextWords[randomIndex];
    setQuestion({
      ...getQuestion(randomWord),
      key: question?.key ? question.key + 1 : 1
    });
    setShowAnswer(false);
    setRemainingSubjects(nextWords.filter((_, index) => index !== randomIndex));
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleEndTest = () => {
    setQuestion(null);
    setStarted(false);
    setShowAnswer(false);
    setRemainingSubjects([]);
    setFailedWords([]);
    speechSynthesis.cancel();
  };

  return (
    <div className="p-2">
      {question && (<>
        <div className="flex flex-col gap-2">
          <p>残りの問題数: {remainingSubjects.length + failedWords.length + 1}</p>
          <Embed title="問題">{question.questionElement}</Embed>
          {hasAudio && type === "word" && <AudioSection _key={`audio-${question.key}`} text={(question.subject as Word).word} />}
          {answerType !== "ja" && <InputSection _key={`input-${question.key}`} inputType={answerType} answers={question.answers} showAnswer={showAnswer} setShowAnswer={setShowAnswer} />}
          {!showAnswer &&
            <button
              id="show-answer"
              onClick={handleShowAnswer}
              className={`${button({ style: "danger" })} w-fit`}
            >
              答えを表示
            </button>}
          {showAnswer && (
            <>
              <Embed title="想定解">{question.answerElement}</Embed>
              {type === "word" &&
                <div className="flex items-center gap-2">
                  <WordCheckbox wordId={(question.subject as Word).id} />
                  <p>単語に星印を付ける</p>
                </div>
              }
              <div className="space-x-4">
                <button id="correct" onClick={() => loadNextWord(remainingSubjects)} className={button({ style: "success" })}>
                  次へ
                </button>
                <button id="incorrect" onClick={() => loadNextWord(remainingSubjects, true)} className={button({ style: "danger" })}>
                  後でやり直す
                </button>
              </div>
            </>
          )}
        </div>
      </>)}
    </div >
  );
}

function AudioSection({ text, _key }: { text: string, _key: string }) {
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    setPlayCount(0);
    speakText(text);
  }, [_key]);

  const speakText = (text: string) => {
    speechSynthesis.cancel();
    const reg = new RegExp(/\(.*?\)$|\[.*?\]$|\<.*?\>$|〜|～/g);
    const utterance = new SpeechSynthesisUtterance(text.replace(reg, ""));
    utterance.lang = "zh-CN";
    speechSynthesis.speak(utterance);
    setPlayCount((prev) => prev + 1);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        id="play-audio"
        onClick={() => speakText(text)}
        className={button({ style: "success" })}
      >
        再生
      </button>
      <span>再生回数: {playCount}</span>
    </div>
  );
}

function InputSection({ inputType, answers, showAnswer, setShowAnswer, _key }: { inputType: "cn" | "pinyin", answers: string[] | RegExp, showAnswer: boolean, setShowAnswer: (show: boolean) => void, _key: string }) {
  const [userInput, setUserInput] = useState("");
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  useEffect(() => {
    setUserInput("");
    setIsIncorrect(false);
    // focus input element
    if (!showKeyboard) {
      const input: HTMLInputElement | null = document.querySelector("#answer");
      input?.focus();
    }
  }, [_key]);

  useEffect(() => {
    setIsIncorrect(false);
  }, [userInput]);

  const handleCheckAnswer = () => {
    if (answers instanceof RegExp) {
      if (answers.test(userInput.trim().normalize("NFD"))) {
        setShowAnswer(true);
        return;
      }
    } else if (answers.includes(userInput.trim().normalize("NFD"))) {
      setShowAnswer(true);
      return;
    }
    setIsIncorrect(true);
  };

  return (<>
    <AnswerInput showKeyboard={showKeyboard} setShowKeyboard={setShowKeyboard} inputType={inputType} userInput={userInput} setUserInput={setUserInput} onEnter={handleCheckAnswer} disabled={showAnswer} />
    <button
      id="submit-answer"
      onClick={handleCheckAnswer}
      className={`${button({ style: "primary" })} w-fit`}
      disabled={showAnswer}
    >
      正誤判定
    </button>
    {!showAnswer && isIncorrect && <p className="font-ch">你错了！</p>}
  </>);
}

function Embed({ title, children }: { title?: string, children: React.ReactNode }) {
  return (
    <div className="p-2 rounded-[4px] border-l-4 border-l-[#ffff00]">
      {title && <h3 className="text-lg font-bold mb-1">{title}</h3>}
      <div className="ml-1">
        {children}
      </div>
    </div>
  );
}
