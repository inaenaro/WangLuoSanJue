'use client';
import { useTheme } from "next-themes";
import SearchBox from "./SearchBox";
import { useEffect, useState } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export default function Header({ title }: { title: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // document.documentElement.classList.remove("dark", "light");
    localStorage.removeItem("theme");
    // document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme ?? "dark");
  };

  return (
    <div className="relative z-50 flex flex-wrap justify-between items-center p-2 border-b-[1px] border-b-gray">
      <h1 className="text-xl">
        <span className="text-[#80848e] mx-2">#</span>
        <span className="font-ch">{title}</span>
      </h1>
      <div className="flex flex-wrap justify-end items-center gap-2">
        <SearchBox />
        <button
          onClick={toggleTheme}
          className="size-9 p-2 rounded"
        >
          {mounted && (theme === "dark" ? <MdOutlineDarkMode className="size-5" /> : <MdOutlineLightMode className="size-5" />)}
        </button>
      </div>
    </div>
  );
}