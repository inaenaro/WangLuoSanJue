'use client';
import { useState, useRef } from "react";

export default function AudioTest() {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [testStarted, setTestStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleStartTest = async () => {
    setTestStarted(true);
    await loadRandomAudio();
  };

  const loadRandomAudio = async () => {
    const response = await fetch("/audio.json"); // Replace with your actual audio data source
    const audios = await response.json();
    const randomAudio = audios[Math.floor(Math.random() * audios.length)];
    setAudioSrc(randomAudio.src);
    setAnswer(randomAudio.pinyin.normalize("NFC"));
    setUserInput("");
    setFeedback("");
  };

  const handleCheckAnswer = () => {
    if (userInput.trim().normalize("NFC") === answer.trim()) {
      setFeedback("正解です！");
    } else {
      setFeedback("不正解です。");
    }
  };

  const handleEndTest = () => {
    setAudioSrc(null);
    setAnswer("");
    setUserInput("");
    setFeedback("");
    setTestStarted(false);
  };

  return (
    <div>
      {!testStarted && (
        <button onClick={handleStartTest} className="px-4 py-2 bg-green-500 text-white rounded">
          開始
        </button>
      )}
      {testStarted && (
        <div>
          {audioSrc && (
            <div>
              <audio ref={audioRef} src={audioSrc} controls className="mb-4" />
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="ピンインを入力してください"
                className="border rounded px-2 py-1 w-full"
              />
              <button
                onClick={handleCheckAnswer}
                className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
              >
                答えを確認
              </button>
              {feedback && <p className="mt-2">{feedback}</p>}
            </div>
          )}
          <div className="mt-4 space-x-4">
            <button onClick={loadRandomAudio} className="px-4 py-2 bg-blue-500 text-white rounded">
              次へ
            </button>
            <button onClick={handleEndTest} className="px-4 py-2 bg-red-500 text-white rounded">
              終了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
