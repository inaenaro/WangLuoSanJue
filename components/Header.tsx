'use client';
import SearchBox from "./SearchBox";
import { useState, useEffect } from "react";

export default function Header({ title }: { title: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme); // Apply theme to the root element
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="relative z-50 flex flex-wrap justify-between items-center p-2 border-b-[1px] border-b-[#80848e]">
      <h1 className="text-xl">
        <span className="text-[#80848e] mx-2">#</span>
        {title}
      </h1>
      <div className="flex flex-wrap justify-end items-center gap-2">
        <SearchBox />
        <button
          onClick={toggleTheme}
          className={`px-4 py-1 rounded ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {theme === "dark" ? "ホワイトモード" : "ダークモード"}
        </button>
      </div>
    </div>
  );
}