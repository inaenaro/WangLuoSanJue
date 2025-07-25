'use client';
import { JSX, useContext, useEffect, useState } from "react";
import { button } from "@/components/Button";
import AnswerInput from "@/components/AnswerInput";
import WordCheckbox from "@/components/WordCheckBox";
import { type Word } from "@/app/lib/word";
import words from "../public/words.json";
import { type WordSettings } from "@/app/lib/settings";
import { CheckedWordsContext } from "@/components/Providers";

type Question = {
  word: Word;
  question: string;
  answer: string;
  answerElement: JSX.Element;
};

const wordData = (words as Word[]).map(word => ({
  ...word,
  pinyin: word.pinyin.normalize("NFD")
}));

export default function WordTest({ setStarted, settings }: { setStarted: (p: boolean) => void, settings: WordSettings }) {
  const { checkedWords } = useContext(CheckedWordsContext);
  const [remainingWords, setRemainingWords] = useState<Word[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [userInput, setUserInput] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    let filteredWords = wordData.filter((word: { lesson: number[] }) => word.lesson.some(l => settings.from <= l && l <= settings.to));

    if (settings.onlyUnmarked) {
      filteredWords = filteredWords.filter((word) => !checkedWords.has(word.pinyin));
    }

    if (filteredWords.length === 0) {
      setStarted(false);
      alert("選択した条件に一致する単語がありません。");
      return;
    }

    setRemainingWords(filteredWords);
    // setStarted(true);
    loadNextWord(filteredWords);
  }, []);

  useEffect(() => {
    setIsIncorrect(false);
  }, [userInput]);

  const loadNextWord = (words: Word[]) => {
    if (words.length === 0) {
      alert("-終-");
      handleEndTest();
      return;
    }

    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];

    switch (settings.questionType) {
      case "jp-to-pinyin":
        setQuestion({
          word: randomWord,
          question: randomWord.meanings[0]?.meaning || "意味なし",
          answer: randomWord.pinyin.normalize("NFD").replace(/[^a-zA-Z\u2019\u0304\u0301\u030C\u0300]/g, ""),
          answerElement: <>
            <p className="text-lg">{randomWord.pinyin.normalize("NFD")}</p>
            <p className="text-text/80">中国語: <span className="font-ch">{randomWord.word}</span></p>
          </>
        });
        setIsIncorrect(false);
        break;
      case "cn-to-jp":
        setQuestion({
          word: randomWord,
          question: randomWord.word,
          answer: randomWord.meanings[0]?.meaning || "意味なし",
          answerElement: <>
            <p>{randomWord.meanings[0]?.meaning || "意味なし"}</p>
            <p className="text-text/80">ピンイン: {randomWord.pinyin.normalize("NFD")}</p>
          </>
        });
        break;
      case "pinyin-to-jp":
        setQuestion({
          word: randomWord,
          question: randomWord.pinyin.normalize("NFD"),
          answer: randomWord.meanings[0]?.meaning || "意味なし",
          answerElement: <>
            <p>{randomWord.meanings[0]?.meaning || "意味なし"}</p>
            <p className="text-text/80">中国語: <span className="font-ch">{randomWord.word}</span></p>
          </>
        });
        break;
      default:
        setQuestion(null);
    }
    setUserInput("");
    setRemainingWords(words.filter((_, index) => index !== randomIndex));
    setShowAnswer(false);
  };

  const handleCheckAnswer = () => {
    if (userInput.trim().normalize('NFD') === question?.answer.trim()) {
      setShowAnswer(true);
    } else {
      setIsIncorrect(true);
    }
  };

  const handleEndTest = () => {
    setQuestion(null);
    setUserInput("");
    setIsIncorrect(false);
    setShowAnswer(false);
    setStarted(false);
  };

  return (
    <div className="p-2">
      {question && (
        <div className="flex flex-col gap-2">
          <p>問題: <span className={settings.questionType === "cn-to-jp" ? "font-ch" : ""}>{question.question}</span></p>
          {settings.questionType === "jp-to-pinyin" && (
            <>
              <AnswerInput showKeyboard={showKeyboard} setShowKeyboard={setShowKeyboard} userInput={userInput} setUserInput={setUserInput} onEnter={handleCheckAnswer} placeholder="答えを入力してください" disabled={showAnswer} />
              <button
                id="submit-answer"
                onClick={handleCheckAnswer}
                className={`${button()} w-fit`}
                disabled={showAnswer}
              >
                正誤判定
              </button>
              {(!showAnswer) && isIncorrect && <p className="font-ch">你错了！</p>}
            </>
          )}
          {!showAnswer && (
            <button
              id="show-answer"
              onClick={() => setShowAnswer(true)}
              className={`${button({ style: "danger" })} w-fit`}
              disabled={showAnswer}
            >
              答えを表示
            </button>
          )}
          {showAnswer && (<>
            <div>
              <p>答え: </p>
              {/* <div className="ml-2 text-lg">
              {question.answer}
            </div> */}
              <div className="ml-2">
                {question.answerElement}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <WordCheckbox wordId={question.word.pinyin} />
              <p>単語に星印を付ける</p>
            </div>
            <div className="space-x-4">
              {/*要更新*/}
              <button id="correct" onClick={() => loadNextWord(remainingWords)} className={button({ style: "success" })}>次へ</button>
              <button id="incorrect" onClick={handleEndTest} className={button({ style: "danger" })}>終了</button>
            </div>
          </>)}
        </div>
      )}
    </div>
  );
}
