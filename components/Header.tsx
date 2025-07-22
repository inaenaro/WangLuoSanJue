'use client';
import { useTheme } from "next-themes";
import SearchBox from "@/components/SearchBox";
import { useEffect, useState } from "react";
import { MdOutlineDarkMode, MdOutlineKeyboard, MdOutlineLightMode, MdOutlineQuestionMark } from "react-icons/md";

export default function Header({ title }: { title: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHelpFocused, setIsHelpFocused] = useState(false);
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
          className="size-9 flex items-center justify-center text-center rounded cursor-pointer"
        >
          {mounted && (theme === "dark" ? <MdOutlineDarkMode className="size-6" /> : <MdOutlineLightMode className="size-6" />)}
        </button>
        <div onMouseEnter={() => setIsHelpFocused(true)} onMouseLeave={() => setIsHelpFocused(false)} className="relative size-9">
          <MdOutlineQuestionMark className="absolute top-0 inset-x-2.5 size-4" />
          <MdOutlineKeyboard className="absolute bottom-0 inset-x-1 size-7" />
          {isHelpFocused ?
            <div className="absolute top-full right-0 w-48 p-2 rounded-md bg-background2 border border-gray">
              <p>通常</p>
              <Enclosed>T</Enclosed> 検索<br />
              <Enclosed>S</Enclosed> 開始<br />
              <Enclosed>E</Enclosed> 終了<br />
              <Enclosed>P</Enclosed> 再生<br />
              <Enclosed>A</Enclosed> 答えを表示<br />
              <Enclosed>Z</Enclosed> 正解<br />
              <Enclosed>X</Enclosed> 不正解<br />
              <p>仮想キーボード</p>
              <Enclosed>V</Enclosed> ü<br />
              <Enclosed>1</Enclosed> 第一声<br />
              <Enclosed>2</Enclosed> 第二声<br />
              <Enclosed>3</Enclosed> 第三声<br />
              <Enclosed>4</Enclosed> 第四声<br />
            </div>
            : null}
        </div>
      </div>
    </div>
  );
}

const Enclosed = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-block p-0 size-6 text-center border border-gray rounded-md">
    {children}
  </div>
);
