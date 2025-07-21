'use client';
import { useState, useContext, useEffect } from "react";
import { button } from "@/components/Button";
import AnswerInput from "@/components/AnswerInput";
import WordCheckbox from "@/components/WordCheckBox";
import { CheckedWordsContext } from "@/components/Providers";
import { type Word } from "@/app/lib/word";
import words from "../public/words.json";
import { type AudioOptions } from "@/app/page";

const wordData = (words as Word[]).map(word => ({
  ...word,
  pinyin: word.pinyin.normalize("NFD")
}));

type Question = {
  word: Word;
  answer: string;
};

export default function AudioTest({ started, setStarted, options }: { started: boolean; setStarted: (p: boolean) => void, options: AudioOptions }) {
  const { checkedWords } = useContext(CheckedWordsContext);
  const [question, setQuestion] = useState<Question | null>(null);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [playCount, setPlayCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [remainingWords, setRemainingWords] = useState<any[]>([]);

  useEffect(() => {
    let filteredWords = wordData.filter((word: { lesson: number[] }) => word.lesson.some(l => options.from <= l && l <= options.to));

    if (options.onlyUnmarked) {
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
    speechSynthesis.cancel();
    if (words.length === 0) {
      alert("すべての問題が終了しました！");
      handleEndTest();
      return;
    }

    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    setQuestion({
      word: randomWord,
      answer: randomWord.pinyin.normalize("NFD")
    });
    setUserInput("");
    setFeedback("");
    setPlayCount(0);
    setShowAnswer(false);
    setRemainingWords(words.filter((_, index) => index !== randomIndex));
    speakText(randomWord.word);
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    speechSynthesis.speak(utterance);
    setPlayCount((prev) => prev + 1);
  };

  const handleCheckAnswer = () => {
    if (userInput.trim().normalize("NFD") === question?.answer.trim()) {
      setFeedback("正解です！");
      setShowAnswer(true);
    } else {
      setFeedback("不正解です。");
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleEndTest = () => {
    setQuestion(null);
    setUserInput("");
    setFeedback("");
    setStarted(false);
    setShowAnswer(false);
    setRemainingWords([]);
    speechSynthesis.cancel(); // Stop any ongoing speech
  };

  return (
    <div className="p-2">

      <div>
        <p>残りの問題数: {remainingWords.length}</p>
        {question && (
          <div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => speakText(question.word.word)}
                className={button({ style: "success" })}
              >
                再生
              </button>
              <span>再生回数: {playCount}</span>
            </div>
            <AnswerInput userInput={userInput} setUserInput={setUserInput} onEnter={handleCheckAnswer} placeholder="ピンインを入力してください" disabled={showAnswer} />
            <button
              onClick={handleCheckAnswer}
              className={button({ style: "primary" })}
              disabled={showAnswer}
            >
              答えを確認
            </button>
            {feedback && <p className="mt-2">{feedback}</p>}
            {showAnswer && (
              <div className="mt-4">
                <p>中国語: {question.word.word}</p>
                <p>ピンイン: {question.answer}</p>
                <p>意味: {question.word.meanings[0]?.meaning || "意味なし"}</p>
                <WordCheckbox wordId={question.word.pinyin} />
              </div>
            )}
          </div>
        )}
        {!showAnswer && (
          <button
            onClick={handleShowAnswer}
            className={button({ style: "danger" })}
          >
            答えを表示
          </button>
        )}
        {showAnswer && (
          <div className="mt-4 space-x-4">
            <button onClick={() => loadNextWord(remainingWords)} className={button({ style: "success" })}>
              次へ
            </button>
            <button onClick={handleEndTest} className={button({ style: "danger" })}>
              終了
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
