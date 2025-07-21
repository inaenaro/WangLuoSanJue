'use client';
import { partMap, Word } from "@/app/lib/word";
import { useEffect, useState } from "react";
import words from "../public/words.json";
import WordCheckbox from "./WordCheckBox";
import { MdOutlineClose, MdOutlineSearch } from "react-icons/md";

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
    const regex = new RegExp(input, "i");
    const regex_normalized = new RegExp(normalizePinyin(input), "i");
    const results = wordData.filter(word =>
      word.word.match(regex) || normalizePinyin(word.pinyin).match(regex_normalized) || word.meanings.some((m: any) => m.meaning.match(regex))
    );
    setSearchResults(results);
  };

  return (
    <div id="search" className="relative flex gap-1 items-center p-2 py-1 bg-background2 border border-gray rounded">
      <input
        type="text"
        value={searchQuery}
        onInput={(e) => {
          handleSearch(e.currentTarget.value);
        }}
        placeholder="単語/ピンイン/意味"
        className="w-48 focus:outline-none"
      />
      {searchQuery ? <MdOutlineClose onClick={() => { setSearchQuery(""); setSearchResults([]); }} className="size-5 cursor-pointer" /> : <MdOutlineSearch className="size-5" />}
      {searchResults.length > 0 && (
        <div className="absolute top-8 left-0 w-64 border border-gray rounded p-1 max-w-xs bg-background2">
          <div className="flex justify-between items-center m-1">
            <p className="text-xs text-text/70">検索結果(上位20件)</p>
            <p className="text-xs text-right text-text/70">全{searchResults.length}件</p>
          </div>
          <div className="overflow-y-auto h-96 mt-1">
            {searchResults.slice(0, 20).map((word, index) => (
              // 単語の重複?
              <div key={index} className="p-1 m-1 rounded bg-background1">
                <section className="items-center">
                  <div className="flex justify-between">
                    <p className="font-ch mr-1">{word.word}</p>
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

export function normalizePinyin(pinyin: string): string {
  return pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
