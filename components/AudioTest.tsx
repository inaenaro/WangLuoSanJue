import { useContext } from "react";
import { CheckedWordsContext } from "@/components/Providers";
import Test from "@/components/Test";
import { type Word } from "@/app/lib/word";
import { type AudioSettings } from "@/app/lib/settings";
import words from "@/public/words.json";

const wordData = (words as Word[]).map(word => ({
  ...word,
  pinyin: word.pinyin.normalize("NFD")
}));

export default function AudioTest({ setStarted, settings }: { setStarted: (p: boolean) => void, settings: AudioSettings }) {
  const { checkedWords } = useContext(CheckedWordsContext);

  let filteredWords = wordData.filter((word: { lesson: number[] }) => word.lesson.some(l => settings.from <= l && l <= settings.to));

  if (settings.onlyUnmarked) {
    filteredWords = filteredWords.filter((word) => !checkedWords.has(word.pinyin));
  }

  if (filteredWords.length === 0) {
    setStarted(false);
    alert("選択した条件に一致する単語がありません。");
    return;
  }

  const subjects = {
    type: "word" as const,
    subjectList: filteredWords,
    getQuestion: (subject: Word) => ({
      subject,
      questionElement: <p>読み上げられた単語は何？(ピンインで解答)</p>,
      answer: subject.pinyin.normalize("NFD").replace(/[^a-zA-Z\u2019\u0304\u0301\u030C\u0300\u0308]/g, ""),
      answerElement: (<>
        <p className="text-lg">{subject.pinyin}</p>
        <p className="text-text/80">中国語: <span className="font-ch">{subject.word}</span></p>
        <p className="text-text/80">意味: {subject.meanings[0]?.meaning || "意味なし"}</p>
      </>)
    })
  };

  return (
    <Test setStarted={setStarted} hasAudio={true} hasInput={true} subjects={subjects} />
  );
}
