'use client';
import { useState } from "react";

export default function SearchBox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = async () => {
    const response = await fetch("/words.json");
    const words = await response.json();
    const results = words.filter((word: any) =>
      word.word.includes(searchQuery) || word.meanings.some((m: any) => m.meaning.includes(searchQuery))
    );
    setSearchResults(results.map((word: any) => `${word.word} (${word.pinyin}): ${word.meanings[0]?.meaning || "意味なし"}`));
  };

  return (
    <div className="relative flex gap-1 items-center h-8 rounded-md p-2 py-1 bg-background1">
      <div className="w-48 px-1 bg-background1 focus:outline-none">
        <input
          type="text"
          value={searchQuery}
          onInput={(e) => {
            setSearchQuery(e.currentTarget.value);
            handleSearch();
          }}
          placeholder="単語を検索"
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      {searchResults.length > 0 && (
        <div className="mt-2 bg-white border rounded p-2 max-w-xs">
          {searchResults.map((result, index) => (
            <p key={index} className="text-sm">{result}</p>
          ))}
        </div>
      )}
    </div>
  );
}
