"use client";

import { ThemeProvider, type ThemeProviderProps } from "next-themes";
import { createContext, FC, useEffect, useState } from "react";

export const CheckedWordsContext = createContext<{ checkedWords: Set<string>; setCheckedWords: React.Dispatch<React.SetStateAction<Set<string>>>; }>({ checkedWords: new Set(), setCheckedWords: () => { } });

export const Providers: FC<ThemeProviderProps> = (props) => {
  const [checkedWords, setCheckedWords] = useState<Set<string>>(new Set());

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
      {props.children}
    </CheckedWordsContext.Provider>
  </ThemeProvider>;
};