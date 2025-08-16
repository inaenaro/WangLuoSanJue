'use client';
import { partMap, type Word } from "@/app/lib/word";
import { useContext, useEffect, useState } from "react";
import words from "@/public/words.json";
import WordCheckbox from "@/components/WordCheckBox";
import { InputStatusContext } from "@/components/Providers";
import { MdOutlineClose, MdOutlineNavigateBefore, MdOutlineNavigateNext, MdOutlineSearch, MdOutlineVolumeUp } from "react-icons/md";
import * as pinyinsData from "@/public/pinyins.json";
import { getSyllableWithTone, isValidSyllable, type Syllable, type PinyinsData } from "@/app/lib/pinyin";

const pinyins: PinyinsData = pinyinsData;

export default function SearchBox() {
  const { setInputStatus } = useContext(InputStatusContext);
  const [wordData, setWordData] = useState<Word[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Word[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const wordData = (words as Word[]).map(word => ({
      ...word,
      pinyin: word.pinyin.normalize("NFD")
    }));
    setWordData(wordData);
  }, []);

  const handleSearch = async (input: string) => {
    setSearchQuery(input);
    setPage(1);
    if (input.trim() === "") {
      setSearchResults([]);
      return;
    }
    // 単語, ピンイン, ピンイン(声調無視), 意味
    const results: [Word[], Word[], Word[], Word[]] = [[], [], [], []]
    const regex = new RegExp(input.replace(/\\/g, "\\\\"), "i");
    const regexNormalized = new RegExp(normalizePinyin(input.replace(/\\/g, "\\\\").replace(/\/\//g, "")), "i");
    const regexNormalizedIgnoreTone = new RegExp(normalizePinyin(input.replace(/\\/g, "\\\\").replace(/\/\//g, ""), true), "i");
    wordData.forEach(word => {
      if (word.word.match(regex)) {
        results[0].push(word);
      } else if (normalizePinyin(word.pinyin.replace(/\/\//g, "")).match(regexNormalized)) {
        results[1].push(word);
      } else if (normalizePinyin(word.pinyin.replace(/\/\//g, ""), true).match(regexNormalizedIgnoreTone)) {
        results[2].push(word);
      } else if (word.meanings.some(m => m.meaning.match(regex))) {
        results[3].push(word);
      }
    });
    setSearchResults(results.flat());
  };

  const speakText = (text: string) => {
    speechSynthesis.cancel();
    const reg = new RegExp(/\(.*?\)$|\[.*?\]$/);
    const utterance = new SpeechSynthesisUtterance(text.replace(reg, ""));
    utterance.lang = "zh-CN";
    speechSynthesis.speak(utterance);
  };

  let matchedKanjis: {
    tone: 0 | 1 | 2 | 3 | 4;
    kanjiLists: Syllable[string];
  } | null = null;

  const normalizedInput = normalizePinyin(searchQuery, true);

  if (searchQuery && isValidSyllable(normalizedInput)) {
    const tone = ([1, 2, 3, 4] as const).find(i => getSyllableWithTone(normalizedInput, i) === searchQuery);
    matchedKanjis = {
      tone: tone ?? 0,
      kanjiLists: pinyins.syllables[normalizedInput] || {
        all: [],
        "1": [],
        "2": [],
        "3": [],
        "4": []
      }
    }
  }

  return (
    <div className="relative flex gap-1 items-center p-2 py-1 bg-background2 border border-gray rounded">
      <input
        id="search"
        type="text"
        value={searchQuery}
        onInput={(e) => {
          handleSearch(e.currentTarget.value);
        }}
        onFocus={() => setInputStatus("searching")}
        /* やばそう */
        onBlur={() => setInputStatus("none")}
        placeholder="単語/ピンイン/意味 (ü=v)"
        className="w-48 focus:outline-none"
      />
      {searchQuery ?
        <button id="close-search" onClick={() => { setSearchQuery(""); setSearchResults([]); }} className="size-5 cursor-pointer">
          <MdOutlineClose className="size-5" />
        </button>
        : <MdOutlineSearch className="size-5" />}
      {searchResults.length > 0 && (
        <div className="z-10 absolute top-8 left-0 w-64 border border-gray rounded p-1 max-w-xs bg-background2">
          <div className="flex justify-between items-center m-1 mb-0">
            <p className="w-30 text-xs text-text/70">検索結果({20 * (page - 1) + 1}~{Math.min(20 * page, searchResults.length)}件)</p>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="text-xs text-text/70 disabled:text-text/30"
              ><MdOutlineNavigateBefore className="size-6" /></button>
              <button
                disabled={page * 20 >= searchResults.length}
                onClick={() => setPage((prev) => prev + 1)}
                className="text-xs text-text/70 disabled:text-text/30"
              ><MdOutlineNavigateNext className="size-6" /></button>
            </div>
            <p className="w-12 text-xs text-right text-text/70">全{searchResults.length}件</p>
          </div>
          <div className="overflow-y-auto h-96">
            {page === 1 && matchedKanjis ? <div className="m-1 bg-background1 rounded">
              {normalizedInput !== "ng" ? !matchedKanjis.tone ?
                <>
                  <KanjiList kanjiList={matchedKanjis.kanjiLists.all} syllable={normalizedInput} />
                  <KanjiList kanjiList={matchedKanjis.kanjiLists["1"]} syllable={normalizedInput} tone={1} even />
                  <KanjiList kanjiList={matchedKanjis.kanjiLists["2"]} syllable={normalizedInput} tone={2} />
                  <KanjiList kanjiList={matchedKanjis.kanjiLists["3"]} syllable={normalizedInput} tone={3} even />
                  <KanjiList kanjiList={matchedKanjis.kanjiLists["4"]} syllable={normalizedInput} tone={4} />
                </>
                : <>
                  <KanjiList kanjiList={matchedKanjis.kanjiLists.all} syllable={normalizedInput} />
                  <KanjiList kanjiList={matchedKanjis.kanjiLists[matchedKanjis.tone]} syllable={normalizedInput} tone={matchedKanjis.tone} even />
                </>
                : <>
                  <KanjiList kanjiList={matchedKanjis.kanjiLists.all} syllable={normalizedInput} />
                </>
              }
            </div> : null}
            {searchResults.slice(20 * (page - 1), 20 * page).map((word, index) => (
              // NOTE: 単語の重複?
              <div key={index} className="p-1 m-1 rounded bg-background1">
                <section className="items-center">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <p className="font-ch mr-1">{word.word}</p>
                      <button onClick={() => speakText(word.word)} className="size-4 rounded cursor-pointer">
                        <MdOutlineVolumeUp />
                      </button>
                    </div>
                    <WordCheckbox wordId={word.pinyin} />
                  </div>
                  <div className="flex gap-1 items-center">
                    <p className="text-sm">{word.pinyin}</p>
                    <p className="ml-2 text-nowrap text-xs text-text/70 font-ch">第{"零一二三四五六七八九十".split("")[word.lesson[0]] ?? "?"}课</p>
                  </div>
                </section>
                {word.meanings.map((detail, i) => (
                  <div key={i}>
                    <p className="border-l-2 rounded-xs border-l-gray px-1">{(partMap.get(detail.part) ? `[${partMap.get(detail.part)![0]}]` : "") + detail.meaning}</p>
                  </div>
                ))}
                {word.notes && <div className="text-[0.6rem] text-black/70 dark:text-[#dbdee1]/70">{word.notes.split('\n').map((x, i) => <p key={i}>- {x}</p>)}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function normalizePinyin(pinyin: string, ignoreTone: boolean = false): string {
  const normalized = pinyin.normalize("NFD").replace(/v/g, "u\u0308").replace(/[']/g, "’").replace(/\s/g, "");
  return ignoreTone ? normalized.replace(/[\u0304\u0301\u030C\u0300]/g, "") : normalized;
}

function KanjiList({ kanjiList, syllable, tone, even }: { kanjiList: string[], syllable: string, tone?: 1 | 2 | 3 | 4, even?: boolean }) {
  return (
    <p className={`text-nowrap overflow-x-scroll p-0.5 px-1 [scrollbar-width:none] ${even ? 'bg-black/15 dark:bg-white/15' : 'bg-black/5 dark:bg-white/5'}`}>
      {tone && <span className="text-text/80">{getSyllableWithTone(syllable, tone)}: </span>}
      {kanjiList.length ? kanjiList.map((s, i) => (
        <span key={i} className="inline-block">
          <span className={`font-ch ${(pinyins.kanjis[s].pinyin.length > 1) ? "border border-text/80" : ""}`}>{s}</span>
          {i < kanjiList.length - 1 && <Slash />}
        </span>
      )) : <span className="text-text/50">-</span>}
    </p>
  );
}

function Slash() {
  return (
    <span className="text-text/50 mx-0.5">/</span>
  );
}
