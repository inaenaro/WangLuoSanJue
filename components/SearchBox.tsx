'use client';
import { partMap, Word } from "@/app/lib/word";
import { useEffect, useState } from "react";
// import { useAsyncFn } from "react-use";
import words from "../public/words.json";

export default function SearchBox() {
  const [wordData, setWordData] = useState<Word[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Word[]>([]);

  useEffect(() => {
    const wordData = (words as Word[]).map(word => ({
      ...word,
      pinyin: word.pinyin.normalize("NFD")
    }));
    setWordData(wordData);
  }, []);

  const handleSearch = async (input: string) => {
    setSearchQuery(input);
    if (input.trim() === "") {
      setSearchResults([]);
      return;
    }
    const regex = new RegExp(normalizePinyin(input), "i");
    const results = wordData.filter(word =>
      word.word.match(regex) || normalizePinyin(word.pinyin).match(regex) || word.meanings.some((m: any) => m.meaning.match(regex))
    );
    setSearchResults(results);
  };

  return (
    <div className="relative flex gap-1 items-center h-8 rounded-md p-2 py-1">
      <div className="w-48 px-1 bg-background1">
        <input
          type="text"
          value={searchQuery}
          onInput={(e) => {
            handleSearch(e.currentTarget.value);
          }}
          placeholder="単語を検索"
          className="border border-gray rounded px-2 py-1 w-full bg-background2"
        />
      </div>
      {searchResults.length > 0 && (
        <div className="absolute top-8 border border-gray rounded p-1 max-w-xs bg-background2">
          <div className="flex justify-between items-center m-1">
            <p className="text-xs text-text/70">検索結果</p>
            <p className="text-xs text-right text-text/70">全{searchResults.length}件</p>
          </div>
          <div className="overflow-y-auto h-96 mt-1">
            {searchResults.map((word, index) => (
              // 単語の重複?
              <div key={index} className="p-1 m-1 border-b-[1px]a border-b-gray rounded bg-background1">
                <section className="flex justify-between items-center gap-1">
                  <div className="flex gap-2 items-end">
                    <p><span className="font-ch mr-1">{word.word}</span>({word.pinyin})<span className="ml-2 text-nowrap text-[0.6rem] text-text/70">第{"一二三四五六七八九十".split("")[word.lesson[0]]}課</span></p>
                  </div>
                  {/* <WordCheckbox wordId={word._id} /> */}
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

export function normalizePinyin(pinyin: string): string {
  return pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
