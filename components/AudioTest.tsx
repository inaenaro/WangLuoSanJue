'use client';
import { useRef, useState, useEffect } from "react";
import { button } from "./Button";
import VirtualKeyboard from "./VirtualKeyboard";

export default function AudioTest() {
  const [textToSpeak, setTextToSpeak] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [testStarted, setTestStarted] = useState(false);
  const [wordMeaning, setWordMeaning] = useState<string | null>(null);
  const [playCount, setPlayCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [remainingWords, setRemainingWords] = useState<any[]>([]); // State for remaining words
  const [markedWords, setMarkedWords] = useState<string[]>([]); // State for marked words
  const [onlyUnmarked, setOnlyUnmarked] = useState(false); // Option to filter unmarked words
  const inputRef = useRef<HTMLInputElement>(null);

  // Load marked words from localStorage on component mount
  useEffect(() => {
    const savedMarkedWords = localStorage.getItem("markedWords");
    if (savedMarkedWords) {
      setMarkedWords(JSON.parse(savedMarkedWords));
    }
  }, []);

  // Save marked words to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("markedWords", JSON.stringify(markedWords));
  }, [markedWords]);

  const handleStartTest = async () => {
    const response = await fetch("/words.json"); // Fetch words from words.json
    const words = await response.json();
    let filteredWords = selectedLesson
      ? words.filter((word: { lesson: number[] }) => word.lesson.includes(selectedLesson)) // Filter by lesson
      : words; // Include all lessons if no specific lesson is selected

    if (onlyUnmarked) {
      filteredWords = filteredWords.filter((word: { word: string }) => !markedWords.includes(word.word)); // Filter unmarked words
    }

    if (filteredWords.length === 0) {
      alert("選択した条件に一致する単語がありません。");
      return;
    }

    setRemainingWords(filteredWords); // Set all filtered words as remaining
    setTestStarted(true);
    loadNextWord(filteredWords);
  };

  const loadNextWord = (words: any[]) => {
    if (words.length === 0) {
      alert("すべての問題が終了しました！");
      handleEndTest();
      return;
    }

    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    setTextToSpeak(randomWord.word); // Use the Chinese word for speech synthesis
    setAnswer(randomWord.pinyin.normalize("NFD")); // Set the correct pinyin as the answer
    setWordMeaning(randomWord.meanings[0]?.meaning || "意味なし"); // Set the word meaning
    setUserInput("");
    setFeedback("");
    setPlayCount(0); // Reset play count
    setShowAnswer(false); // Reset answer visibility
    setRemainingWords(words.filter((_, index) => index !== randomIndex)); // Remove the current word from remaining
    speakText(randomWord.word);
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN"; // Set language to Chinese
    speechSynthesis.speak(utterance);
    setPlayCount((prev) => prev + 1); // Increment play count
  };

  const handleCheckAnswer = () => {
    if (userInput.trim().normalize("NFD") === answer.trim()) {
      setFeedback("正解です！");
      setShowAnswer(true); // Automatically show the answer if correct
    } else {
      setFeedback("不正解です。");
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleEndTest = () => {
    setTextToSpeak(null);
    setAnswer("");
    setUserInput("");
    setFeedback("");
    setWordMeaning(null);
    setTestStarted(false);
    setShowAnswer(false);
    setRemainingWords([]);
    speechSynthesis.cancel(); // Stop any ongoing speech
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

  const toggleMarkWord = () => {
    if (textToSpeak) {
      setMarkedWords((prev) =>
        prev.includes(textToSpeak) ? prev.filter((word) => word !== textToSpeak) : [...prev, textToSpeak]
      );
    }
  };

  return (
    <div>
      {!testStarted && (
        <div>
          <label className="block mb-2">
            レッスンを選択してください:
            <select
              value={selectedLesson ?? ""}
              onChange={(e) => setSelectedLesson(e.target.value ? Number(e.target.value) : null)}
              className="border rounded px-2 py-1 w-full mt-1"
            >
              <option value="">すべてのレッスン</option>
              {Array.from({ length: 8 }, (_, i) => i + 1).map((lesson) => (
                <option key={lesson} value={lesson}>
                  レッスン {lesson}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              checked={onlyUnmarked}
              onChange={(e) => setOnlyUnmarked(e.target.checked)}
              className="form-checkbox h-5 w-5 text-green-500"
            />
            <span>チェックマークがついていない問題だけを出題する</span>
          </label>
          <button onClick={handleStartTest} className={button({ style: "primary" })}>
            開始
          </button>
        </div>
      )}
      {testStarted && (
        <div>
          <p>残りの問題数: {remainingWords.length}</p>
          {textToSpeak && (
            <div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => speakText(textToSpeak)}
                  className={button({ style: "success" })}
                >
                  再生
                </button>
                <span>再生回数: {playCount}</span>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onKeyDown={handleKeyDown}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="ピンインを入力してください"
                className="border rounded px-2 py-1 w-full"
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
                className={button({ style: "primary" })}
                disabled={showAnswer} // Disable "答えを確認" button when answer is shown
              >
                答えを確認
              </button>
              {feedback && <p className="mt-2">{feedback}</p>}
              {showAnswer && (
                <div className="mt-4">
                  <p>中国語: {textToSpeak}</p>
                  <p>ピンイン: {answer}</p>
                  <p>意味: {wordMeaning}</p>
                  <label className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      checked={markedWords.includes(textToSpeak)}
                      onChange={toggleMarkWord}
                      className="form-checkbox h-5 w-5 text-green-500"
                    />
                    <span>チェックマークを付ける</span>
                  </label>
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
      )}
    </div>
  );
}
