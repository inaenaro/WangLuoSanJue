'use client';
import { useState } from "react";
import { button } from "./Button";

export default function GrammarTest() {
  const [question, setQuestion] = useState<{ sentence: string; meaning: string } | null>(null);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");

  const fetchGrammarQuestion = async () => {
    const sentencesResponse = await fetch("/sentences.json");
    const sentences = await sentencesResponse.json();
    const wordsResponse = await fetch("/words.json");
    const words = await wordsResponse.json();

    const sentenceKeys = Object.keys(sentences);
    const randomKey = "1-2-1"//sentenceKeys[Math.floor(Math.random() * sentenceKeys.length)];
    const selectedSentence = sentences[randomKey];

    const meaningMap = {} as Record<string, string>;
    // Replace placeholders in the sentence and meaning with appropriate words from words.json
    const replacedSentence = selectedSentence.sentence.replace(/\{(\d)\/g:([^}]+)\}/g, (_: any, i: string, genre: string) => {
      // 同じi
      const matchingWords = words.filter((word: any) => word.meanings.some((m: any) => m.genre?.includes(genre)));
      const randomWord = matchingWords[Math.floor(Math.random() * matchingWords.length)];
      if (randomWord) {
        meaningMap[i] = randomWord.meanings.find((m: any) => m.genre?.includes(genre))?.meaning || "意味なし";
      }
      return randomWord ? randomWord.word : "___";
    });
    const replacedMeaning = selectedSentence.meaning.replace(/\{(\d)\}/g, (_: any, i: string) => {
      return meaningMap[i] || "意味なし";
    });

    setQuestion({ sentence: replacedSentence, meaning: replacedMeaning });
    setFeedback("");
    setUserInput("");
  };

  const handleCheckAnswer = () => {
    if (userInput.trim() === question?.sentence.trim()) {
      setFeedback("正解です！");
    } else {
      setFeedback(`不正解です。正しい答え: ${question?.sentence}`);
    }
  };

  return (
    <div>
      <button onClick={fetchGrammarQuestion} className={button({ style: "success" })}>
        開始
      </button>
      {question && (
        <div className="mt-4">
          <p className="font-ch">問題: {question.meaning}</p>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="答えを入力してください"
            className="border rounded px-2 py-1 w-full"
          />
          <button onClick={handleCheckAnswer} className="px-4 py-2 bg-green-500 text-white rounded mt-2">
            答えを確認
          </button>
          {feedback && <p className="mt-2">{feedback}</p>}
        </div>
      )}
    </div>
  );
}
