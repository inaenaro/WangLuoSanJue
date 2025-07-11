"use client";

import { ThemeProvider, type ThemeProviderProps } from "next-themes";
import { FC } from "react";

export const Providers: FC<ThemeProviderProps> = (props) => {
  return <ThemeProvider defaultTheme="dark" attribute="class" {...props}>{props.children}</ThemeProvider>;
};