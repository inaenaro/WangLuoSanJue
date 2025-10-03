import { useContext } from "react";
import { wordMap, type Word } from "@/app/lib/word";
import { type WordSettings } from "@/app/lib/settings";
import { CheckedWordsContext } from "@/components/Providers";
import Test from "@/components/Test";

export default function WordTest({ setStarted, settings }: { setStarted: (p: boolean) => void, settings: WordSettings }) {
  const { checkedWords } = useContext(CheckedWordsContext);

  let filteredWords = Array.from(wordMap.values()).filter((word: { lesson: number[] }) => word.lesson.some(l => settings.from <= l && l <= settings.to));

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
    getQuestion: settings.questionType === "jp-to-pinyin" ? (subject: Word) => ({
      subject,
      questionElement: <p>{subject.meanings[0]?.meaning || "意味不明"}</p>,
      answer: subject.pinyin.normalize("NFD").replace(/[^a-zA-Z\u2019\u0304\u0301\u030C\u0300\u0308]/g, ""),
      answerElement: (<>
        <p className="text-lg">{subject.pinyin.normalize("NFD")}</p>
        <p className="text-text/80">中国語: <span className="font-ch">{subject.word}</span></p>
      </>)
    }) : settings.questionType === "cn-to-jp" ? (subject: Word) => ({
      subject,
      questionElement: <p><span className="font-ch">{subject.word}</span></p>,
      answer: subject.meanings[0]?.meaning || "意味不明",
      answerElement: (<>
        <p>{subject.meanings[0]?.meaning || "意味不明"}</p>
        <p className="text-text/80">ピンイン: {subject.pinyin.normalize("NFD")}</p>
      </>)
    }) : (subject: Word) => ({
      subject,
      questionElement: <p>{subject.pinyin.normalize("NFD")}</p>,
      answer: subject.meanings[0]?.meaning || "意味不明",
      answerElement: (<>
        <p>{subject.meanings[0]?.meaning || "意味不明"}</p>
        <p className="text-text/80">中国語: <span className="font-ch">{subject.word}</span></p>
      </>)
    })
  }

  return (
    <Test setStarted={setStarted} hasAudio={false} hasInput={settings.questionType === "jp-to-pinyin"} subjects={subjects} />
  );
}
