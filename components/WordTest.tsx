'use client';
import { useState, useRef, useEffect } from "react";
import { button } from "./Button";
import VirtualKeyboard from "./VirtualKeyboard";

export default function WordTest() {
  const [testMode, setTestMode] = useState<"jp-to-pinyin" | "cn-to-jp" | "pinyin-to-jp">("jp-to-pinyin");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [markedWords, setMarkedWords] = useState<string[]>([]); // State for marked words
  const inputRef = useRef<HTMLInputElement>(null);

  // Load marked words from localStorage on component mount
  useEffect(() => {
    const savedWords = localStorage.getItem("markedWords");
    if (savedWords) {
      setMarkedWords(JSON.parse(savedWords));
    }
  }, []);

  // Save marked words to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("markedWords", JSON.stringify(markedWords));
  }, [markedWords]);

  const handleStartTest = async () => {
    setTestStarted(true);
    await handleRandomWord();
  };

  const handleRandomWord = async () => {
    const response = await fetch("/words.json");
    const words = await response.json();
    const randomWord = words[Math.floor(Math.random() * words.length)];

    switch (testMode) {
      case "jp-to-pinyin":
        setQuestion(`日本語: ${randomWord.meanings[0]?.meaning || "意味なし"}`);
        setAnswer(randomWord.pinyin.normalize("NFC"));
        setFeedback(""); // Reset feedback for new question
        break;
      case "cn-to-jp":
        setQuestion(`中国語: ${randomWord.word}`);
        setAnswer(`日本語: ${randomWord.meanings[0]?.meaning || "意味なし"}, ピンイン: ${randomWord.pinyin.normalize("NFC")}`);
        break;
      case "pinyin-to-jp":
        setQuestion(`ピンイン: ${randomWord.pinyin.normalize("NFC")}`);
        setAnswer(`日本語: ${randomWord.meanings[0]?.meaning || "意味なし"}, 中国語: ${randomWord.word}`);
        break;
      default:
        setQuestion("");
        setAnswer("");
    }
    setUserInput("");
    setShowAnswer(false);
  };

  const handleCheckAnswer = () => {
    if (userInput.trim().normalize('NFC') === answer.trim()) {
      setFeedback("正解です！");
      setShowAnswer(true); // Automatically show the answer
    } else {
      setFeedback("不正解です。");
    }
  };

  const handleEndTest = () => {
    setQuestion("");
    setAnswer("");
    setUserInput("");
    setFeedback("");
    setShowAnswer(false);
    setTestStarted(false);
  };

  const handleVirtualKeyPress = (value: string) => {
    setUserInput(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent adding a new line
      handleCheckAnswer(); // Trigger answer check
    }
  };

  const handleToggleMarkWord = () => {
    setMarkedWords((prev) =>
      prev.includes(question) ? prev.filter((word) => word !== question) : [...prev, question]
    );
  };

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        {(["jp-to-pinyin", "cn-to-jp", "pinyin-to-jp"] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setTestMode(mode)}
            disabled={testStarted}
            className={button({ style: testMode === mode ? "success" : "secondary" })/*`px-4 py-2 rounded ${testMode === mode ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
              } ${testStarted ? "opacity-50 cursor-not-allowed" : ""}`*/}
          >
            {
              mode === "jp-to-pinyin" ? "日本語からピンイン" :
                mode === "cn-to-jp" ? "中国語から日本語" :
                  "ピンインから日本語"
            }
          </button>
        ))}
      </div>
      {!testStarted && <button onClick={handleStartTest} className={button()}>開始</button>}
      {testStarted && question && (
        <div>
          <p className="font-ch">問題: {question}</p>
          {testMode === "jp-to-pinyin" && (
            <div>
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="答えを入力してください"
                // className="border rounded px-2 py-1 w-full"
                className="w-48 px-1 bg-background1 focus:outline-none"
                disabled={showAnswer} // Disable input when answer is shown
              />
              <button
                onClick={() => setKeyboardVisible((prev) => !prev)}
                className={button({ style: "secondary" })}
              >
                {keyboardVisible ? "キーボードを隠す" : "キーボードを表示"}
              </button>
              {keyboardVisible && (
                <VirtualKeyboard
                  onKeyPress={handleVirtualKeyPress}
                  targetRef={inputRef}
                  onClose={() => setKeyboardVisible(false)}
                  onEnter={handleCheckAnswer}
                />
              )}
              <button
                onClick={handleCheckAnswer}
                className={button()}
                disabled={showAnswer}
              >
                正誤判定
              </button>
              {feedback && <p className="mt-2">{feedback}</p>}
            </div>
          )}
          {showAnswer && <p>答え: {answer}</p>}
          {!showAnswer && (
            <button
              onClick={() => setShowAnswer(true)}
              className={button({ style: "danger" })}
              disabled={showAnswer}
            >
              答えを表示
            </button>
          )}
          {showAnswer && (
            <div className="mt-4 space-x-4">
              <button onClick={handleRandomWord} className={button({ style: "success" })}>次へ</button>
              <button onClick={handleEndTest} className={button({ style: "danger" })}>終了</button>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={markedWords.includes(question)}
                  onChange={handleToggleMarkWord}
                  className="form-checkbox h-5 w-5 text-green-500"
                />
                <span>チェックマークを付ける</span>
              </label>
            </div>
          )}
        </div>
      )}
      {markedWords.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold">チェックマークを付けた単語:</h3>
          <ul className="list-disc pl-5">
            {markedWords.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
