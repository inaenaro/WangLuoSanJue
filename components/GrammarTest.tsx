import { wordMap } from "@/app/lib/word";
import Test, { Subjects } from "@/components/Test";
import { type GrammarSettings } from "@/app/lib/settings";
import { getRegExp, type Sentence, sentenceMap } from "@/app/lib/sentence";
import { type Grammar } from "@/app/lib/grammar";

export default function GrammarTest({ setStarted, settings }: { setStarted: (p: boolean) => void, settings: GrammarSettings }) {
  // const { checkedWords } = useContext(CheckedWordsContext);

  let filteredSentences = Array.from(sentenceMap.values()).filter((sentence => settings.from <= sentence.lesson && sentence.lesson <= settings.to));

  // if (settings.onlyUnmarked) {
  //   filteredSentences = filteredSentences.filter((word) => !checkedWords.has(word.pinyin));
  // }

  if (filteredSentences.length === 0) {
    setStarted(false);
    alert("選択した条件に一致する文法事項がありません。");
    return;
  }

  const subjects: Subjects<Sentence> = {
    type: "grammar" as const,
    subjectList: filteredSentences,
    getQuestion: settings.questionType === "jp-to-cn" ? (subject: Sentence) => {
      return {
        subject,
        questionElement: <>
          <p className="text-sm">次の日本語文を中国語に訳せ。(空白を入れずに解答)</p>
          <p>{subject.japanese || "意味不明"}</p>
          <p className="text-xs text-text/50">別解は無数にあると思いますが、空気を読んでください。</p>
        </>,
        answers: getRegExp(subject.chinese.replace(/\s+|[]/g, "").trim()),
        answerElement: (<>
          <p className="text-lg font-ch">{subject.chinese}</p>
          <p className="text-text/80">ピンイン: {subject.pinyin}</p>
        </>)
      }
    } : settings.questionType === "cn-to-jp" ? (subject: Sentence) => {
      return {
        subject,
        questionElement: <>
          <p className="text-sm">次の中国語文を日本語に訳せ。</p>
          <p><span className="font-ch">{subject.chinese}</span></p>
        </>,
        answers: [subject.japanese || "意味不明"],
        answerElement: (<>
          <p>{subject.japanese || "意味不明"}</p>
          {/* <p className="text-text/80">ピンイン: {subject.pinyin.normalize("NFD")}</p> */}
        </>)
      }
    } : (subject: Sentence) => {
      // NOTE: 語頭大文字
      const splitted = subject.pinyin.split(/\s+/).map(s => s.replace(/[,.!?"]/g, ""));
      const sorted = splitted.sort(() => Math.random() - 0.5);
      return {
        subject,
        questionElement: <>
          <p className="text-sm">次の拼音の簡体字を並べ替えて中国語文を作れ。(空白を入れずに解答)</p>
          <p>{sorted.join(" / ")}</p>
        </>,
        answers: getRegExp(subject.chinese.replace(/\s+|[]/g, "").trim()),
        answerElement: (<>
          <p className="text-lg font-ch">{subject.chinese}</p>
          <p className="text-text/80">ピンイン: {subject.pinyin}</p>
        </>)
      }
    }
  }

  return (
    <Test setStarted={setStarted} hasAudio={false} answerType={settings.questionType === "cn-to-jp" ? "ja" : "cn"} subjects={subjects} />
  );
}

function getExampleSentence(sentence: Grammar) {
  const meaningMap: Record<string, string> = {};
  // Replace placeholders in the sentence and meaning with appropriate words from words.json
  // NOTE: キャプチャグループ
  const replacedSentence = sentence.sentence.replace(/\{(\d)\/g:([^}]+)\}/g, (_: any, i: string, genre: string) => {
    // 同じi
    // const matchingWords = wordMap.values().filter(word => word.meanings.some(m => m.genre?.includes(genre)));
    const matchingWords = Array.from(wordMap.values());
    const randomWord = matchingWords[Math.floor(Math.random() * matchingWords.length)];
    if (randomWord) {
      // meaningMap[i] = randomWord.meanings.find(m => m.genre?.includes(genre))?.meaning || "意味なし";
      meaningMap[i] = randomWord.meanings[0].meaning_short || "意味なし";
    }
    return randomWord ? randomWord.word : "___";
  });
  const replacedMeaning = sentence.meaning.replace(/\{(\d)\}/g, (_: any, i: string) => {
    return meaningMap[i] || "意味なし";
  });
  return { sentence: replacedSentence, meaning: replacedMeaning };
}
