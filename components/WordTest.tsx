'use client';
import { useContext, useEffect, useState } from "react";
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
  const [status, setStatus] = useState<-1 | 0 | 1>(-1);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    let filteredWords = wordData.filter((word: { lesson: number[] }) => word.lesson.some(l => settings.from <= l && l <= settings.to));

    if (settings.onlyUnmarked) {
      filteredWords = filteredWords.filter((word) => !checkedWords.has(word.pinyin));
    }

    if (filteredWords.length === 0) {
      alert("選択した条件に一致する単語がありません。");
      return;
    }

    setRemainingWords(filteredWords);
    setStarted(true);
    loadNextWord(filteredWords);
  }, []);

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
          question: `日本語: ${randomWord.meanings[0]?.meaning || "意味なし"}`,
          answer: randomWord.pinyin.normalize("NFD")
        });
        setStatus(-1); // Reset feedback for new question
        break;
      case "cn-to-jp":
        setQuestion({
          word: randomWord,
          question: `中国語: ${randomWord.word}`,
          answer: `日本語: ${randomWord.meanings[0]?.meaning || "意味なし"}, ピンイン: ${randomWord.pinyin.normalize("NFD")}`
        });
        break;
      case "pinyin-to-jp":
        setQuestion({
          word: randomWord,
          question: `ピンイン: ${randomWord.pinyin.normalize("NFD")}`,
          answer: `日本語: ${randomWord.meanings[0]?.meaning || "意味なし"}, 中国語: ${randomWord.word}`
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
      setStatus(1);
      setShowAnswer(true);
    } else {
      setStatus(0);
    }
  };

  const handleEndTest = () => {
    setQuestion(null);
    setUserInput("");
    setStatus(-1);
    setShowAnswer(false);
    setStarted(false);
  };

  return (
    <div className="p-2">
      {question && (
        <div className="flex flex-col gap-2">
          <p className="font-ch">問題: {question.question}</p>
          {settings.questionType === "jp-to-pinyin" && (
            <>
              <AnswerInput userInput={userInput} setUserInput={setUserInput} onEnter={handleCheckAnswer} placeholder="答えを入力してください" disabled={showAnswer} />
              <button
                id="submit-answer"
                onClick={handleCheckAnswer}
                className={`${button()} w-fit`}
                disabled={showAnswer}
              >
                正誤判定
              </button>
              {status !== -1 && <p className="mt-2">{status ? "正解！" : "不正解！"}</p>}
            </>
          )}
          {showAnswer && <p>答え: {question.answer}</p>}
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
            <div className="flex items-center gap-2">
              <WordCheckbox wordId={question.word.pinyin} />
              <p>単語に星印を付ける</p>
            </div>
            <div className="space-x-4">
              {/*要更新*/}
              <button id="correct" onClick={() => loadNextWord(remainingWords)} className={button({ style: "success" })}>正解</button>
              <button id="incorrect" onClick={handleEndTest} className={button({ style: "danger" })}>不正解</button>
            </div>
          </>)}
        </div>
      )}
    </div>
  );
}
