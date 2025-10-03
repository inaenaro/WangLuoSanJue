"use client";

import { ThemeProvider, type ThemeProviderProps } from "next-themes";
import { createContext, FC, useEffect, useState } from "react";
import { wordMap } from "@/app/lib/word";

export type InputStatus = "none" | "searching" | "answering" | "keyboarding"

export const CheckedWordsContext = createContext<{ checkedWords: Set<string>; setCheckedWords: React.Dispatch<React.SetStateAction<Set<string>>>; }>({ checkedWords: new Set(), setCheckedWords: () => { } });
export const InputStatusContext = createContext<{ inputStatus: InputStatus; setInputStatus: React.Dispatch<React.SetStateAction<InputStatus>>; }>({ inputStatus: "none", setInputStatus: () => { } });

export const Providers: FC<ThemeProviderProps> = (props) => {
  const [checkedWords, setCheckedWords] = useState<Set<string>>(new Set());
  const [inputStatus, setInputStatus] = useState<InputStatus>("none");

  useEffect(() => {
    try {
      const storedChecked = localStorage.getItem("checked");
      if (storedChecked) {
        const checkedWords = storedChecked.split(",");
        const newCheckedWords = new Set<string>();
        const isValid = checkedWords.reduce((isValid, s) => {
          if (wordMap.has(s)) {
            newCheckedWords.add(s);
            return isValid;
          } else {
            const word = wordMap.values().find(w => w.pinyin === s.normalize("NFD"));
            if (word) {
              newCheckedWords.add(word.id);
            }
            return false;
          }
        }, true);
        if (!isValid) {
          localStorage.setItem("checked", Array.from(newCheckedWords).join(","));
        }
        setCheckedWords(newCheckedWords);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);


  return <ThemeProvider defaultTheme="dark" attribute="class" {...props}>
    <CheckedWordsContext.Provider value={{ checkedWords, setCheckedWords }}>
      <InputStatusContext.Provider value={{ inputStatus, setInputStatus }}>
        {props.children}
      </InputStatusContext.Provider>
    </CheckedWordsContext.Provider>
  </ThemeProvider>;
};