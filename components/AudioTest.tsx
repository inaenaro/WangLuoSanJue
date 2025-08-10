'use client';
import { useState, useContext, useEffect } from "react";
import { button } from "@/components/Button";
import AnswerInput from "@/components/AnswerInput";
import WordCheckbox from "@/components/WordCheckBox";
import { CheckedWordsContext } from "@/components/Providers";
import { type Word } from "@/app/lib/word";
import words from "@/public/words.json";
import { type AudioSettings } from "@/app/lib/settings";

const wordData = (words as Word[]).map(word => ({
  ...word,
  pinyin: word.pinyin.normalize("NFD")
}));

type Question = {
  word: Word;
  answer: string;
};

export default function AudioTest({ setStarted, settings }: { setStarted: (p: boolean) => void, settings: AudioSettings }) {
  const { checkedWords } = useContext(CheckedWordsContext);
  const [question, setQuestion] = useState<Question | null>(null);
  const [userInput, setUserInput] = useState("");
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [remainingWords, setRemainingWords] = useState<Word[]>([]);
  const [showKeyboard, setShowKeyboard] = useState(false);

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
      answer: randomWord.pinyin.normalize("NFD").replace(/[^a-zA-Z\u2019\u0304\u0301\u030C\u0300\u0308]/g, "")
    });
    setUserInput("");
    setIsIncorrect(false);
    setPlayCount(0);
    setShowAnswer(false);
    setRemainingWords(words.filter((_, index) => index !== randomIndex));
    speakText(randomWord.word);
  };

  const speakText = (text: string) => {
    speechSynthesis.cancel();
    const reg = new RegExp(/\(.*?\)$|\[.*?\]$/);
    const utterance = new SpeechSynthesisUtterance(text.replace(reg, ""));
    utterance.lang = "zh-CN";
    speechSynthesis.speak(utterance);
    setPlayCount((prev) => prev + 1);
  };

  const handleCheckAnswer = () => {
    if (userInput.trim().normalize("NFD") === question?.answer.trim()) {
      setShowAnswer(true);
    } else {
      setIsIncorrect(true);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleEndTest = () => {
    setQuestion(null);
    setUserInput("");
    setIsIncorrect(false);
    setStarted(false);
    setShowAnswer(false);
    setRemainingWords([]);
    speechSynthesis.cancel(); // Stop any ongoing speech
  };

  return (
    <div className="p-2">
      {question && (<>
        <div className="flex flex-col gap-2">
          <p>残りの問題数: {remainingWords.length}</p>
          <div className="flex items-center space-x-2">
            <button
              id="play-audio"
              onClick={() => speakText(question.word.word)}
              className={button({ style: "success" })}
            >
              再生
            </button>
            <span>再生回数: {playCount}</span>
          </div>
          <AnswerInput showKeyboard={showKeyboard} setShowKeyboard={setShowKeyboard} userInput={userInput} setUserInput={setUserInput} onEnter={handleCheckAnswer} placeholder="ピンインを入力してください" disabled={showAnswer} />
          <button
            id="submit-answer"
            onClick={handleCheckAnswer}
            className={`${button({ style: "primary" })} w-fit`}
            disabled={showAnswer}
          >
            正誤判定
          </button>
          {!showAnswer && (<>
            {isIncorrect && <p className="font-ch">你错了！</p>}
            <button
              id="show-answer"
              onClick={handleShowAnswer}
              className={`${button({ style: "danger" })} w-fit`}
            >
              答えを表示
            </button>
          </>)}
          {showAnswer && (
            <>
              <div className="">
                <p>答え: </p>
                <div className="ml-2">
                  <p className="text-lg">{question.word.pinyin}</p>
                  <p className="text-text/80">中国語: <span className="font-ch">{question.word.word}</span></p>
                  <p className="text-text/80">意味: {question.word.meanings[0]?.meaning || "意味なし"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <WordCheckbox wordId={question.word.pinyin} />
                <p>単語に星印を付ける</p>
              </div>
              <div className="space-x-4">
                <button id="correct" onClick={() => loadNextWord(remainingWords)} className={button({ style: "success" })}>
                  次へ
                </button>
                <button id="incorrect" onClick={handleEndTest} className={button({ style: "danger" })}>
                  終了
                </button>
              </div>
            </>
          )}
        </div>
      </>)}
    </div >
  );
}
