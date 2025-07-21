"use client";

import { ThemeProvider, type ThemeProviderProps } from "next-themes";
import { createContext, FC, useEffect, useState } from "react";

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
        setCheckedWords(new Set(storedChecked.split(",").filter(Boolean)));
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