import { useEffect } from "react";

const KEY_OPTIONS = {
  t: "search",
  r: "reload",
  s: "start",
  e: "end",
  f: "showAnswer",
  j: "correct",
  k: "incorrect"
} as const;

type Key = keyof typeof KEY_OPTIONS;

function isKey(key: string): key is Key {
  return key in KEY_OPTIONS;
}

const useKeydown = (isSearching: boolean) => {
  useEffect(() => {
    /**
      * キーボードのキーが押されたときの処理
      * @param event
    */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSearching || !isKey(event.key)) return;
      event.preventDefault();
      const key = KEY_OPTIONS[event.key];
      if (key === "search") {
        const search = document.querySelector("#search") as HTMLInputElement;
        search.focus();
        return;
      }
      const button: HTMLElement | null = document.querySelector(`#${key}`);
      if (button) {
        button.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearching]);
};

export default useKeydown;