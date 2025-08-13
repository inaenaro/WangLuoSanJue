import React from "react";
import * as pinyinsData from "@/public/pinyins.json";
import { type PinyinsData, type Consonant, vowels, consonants, mergeSyllable } from "@/app/lib/pinyin";

const pinyins: PinyinsData = pinyinsData;

export default function PinyinTable() {
  return (
    <div className="p-2">
      <p>ピンイン一覧 (総漢字数: {Object.keys(pinyins.kanjis).length}字)</p>
      <p className="text-sm text-text/80"><span className="decoration-text/80 underline">下線</span>付きの漢字は複数のピンインが登場している漢字です。</p>
      <p className="text-sm text-text/50">表全体と漢字列はスクロールできるよ</p>
      <div className="text-sm border-text border-2 overflow-x-scroll [scrollbar-width:none]">
        <div className="grid grid-cols-[2rem_repeat(35,minmax(6.25rem,1fr))] grid-rows-[2rem_1fr] divide-x divide-y divide-text">
          <div className="" />
          {vowels.map((vowel, i) => (
            <div key={i} className="flex flex-col justify-center text-center">
              <h3>{vowel}</h3>
            </div>
          ))}
          {(["", ...consonants] as (Consonant | '')[]).map((consonant, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col justify-center text-center">
                <h3>{consonant || "-"}</h3>
              </div>
              {vowels.map((vowel, j) => {
                const pinyin = mergeSyllable(consonant, vowel);
                if (!pinyin) return <div key={`${i}-${j}`} />;
                const syllables = pinyins.syllables[pinyin];
                return (
                  <div key={`${i}-${j}`}>
                    <div className="border-b border-gray p-1">
                      <h3>{pinyin}</h3>
                    </div>
                    <ul className="">
                      {syllables && (
                        <>
                          <KanjiList kanjiList={syllables.all} />
                          <KanjiList kanjiList={syllables["1"]} tone="1" even />
                          <KanjiList kanjiList={syllables["2"]} tone="2" />
                          <KanjiList kanjiList={syllables["3"]} tone="3" even />
                          <KanjiList kanjiList={syllables["4"]} tone="4" />
                        </>
                      )}
                    </ul>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

function KanjiList({ kanjiList, tone, even }: { kanjiList: string[], tone?: string, even?: boolean }) {
  return (
    <li className={`text-nowrap overflow-x-scroll p-0.5 [scrollbar-width:none] ${even ? 'bg-black/15 dark:bg-white/15' : 'bg-black/5 dark:bg-white/5'}`}>
      {tone && <span className="text-text/80">{tone}: </span>}
      {kanjiList.map((s, i) => (
        <span key={i} className="inline-block">
          <span className={`font-ch ${(pinyins.kanjis[s].all.length > 1) ? "decolation-text underline": ""}`}>{s}</span>
          {i < kanjiList.length - 1 && <Slash />}
        </span>
      ))}
    </li>
  );
}

function Slash() {
  return (
    <span className="text-text/50 mx-0.5">/</span>
  );
}
