'use client';
import { useState } from "react";
import { button } from "../components/Button";
import WordTest from "../components/WordTest";
import GrammarTest from "../components/GrammarTest";
import AudioTest from "../components/AudioTest";

export default function Home() {
  const [mode, setMode] = useState<"word" | "grammar" | "audio">("word");

  return (
    <div>
      <div>
        <button onClick={() => setMode("word")} className={button({ style: mode === "word" ? "primary" : "secondary" })}>単語モード</button>
        <button onClick={() => setMode("grammar")} className={button({ style: mode === "grammar" ? "primary" : "secondary" })}>文法モード</button>
        <button onClick={() => setMode("audio")} className={button({ style: mode === "audio" ? "primary" : "secondary" })}>リスニングモード</button>
      </div>
      <div>
        {mode === "word" && <WordTest />}
        {mode === "grammar" && <GrammarTest />}
        {mode === "audio" && <AudioTest />}
      </div>
    </div>
  );
}
