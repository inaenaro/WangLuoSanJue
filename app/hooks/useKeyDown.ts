import { InputStatus } from "@/components/Providers";
import { useEffect } from "react";

const KEY_OPTIONS_keyboarding = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), "1", "2", "3", "4", "'", ",", ".", "Escape", "Enter", "Backspace", "ArrowLeft", "ArrowRight"] as const;
type KeyOnKeyboading = (typeof KEY_OPTIONS_keyboarding)[number];

const KEY_OPTIONS = ["t", "s", "e", "p", "k", "a", "z", "x"] as const;
type Key = (typeof KEY_OPTIONS)[number];
const KeyMap: Record<Key, string> = {
  t: "search",
  s: "start",
  e: "end",
  p: "play-audio",
  k: "show-keyboard",
  a: "show-answer",
  z: "correct",
  x: "incorrect"
};

function isKeyOnKeyboarding(key: string): key is (typeof KEY_OPTIONS_keyboarding)[number] {
  return KEY_OPTIONS_keyboarding.includes(key as KeyOnKeyboading);
}

function isKey(key: string): key is Key {
  return KEY_OPTIONS.includes(key as Key);
}

const useKeydown = (inputStatus: InputStatus) => {
  useEffect(() => {
    /**
      * キーボードのキーが押されたときの処理
      * @param event
    */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (inputStatus === "searching") {
        if (event.key === "Escape") {
          event.preventDefault();
          const input: HTMLInputElement | null = document.querySelector("#close-search");
          input?.click();
        }
        return;
      }
      if (inputStatus === "answering") {
        if (event.key === "Enter") {
          event.preventDefault();
          const button: HTMLButtonElement | null = document.querySelector("#submit-answer");
          button?.click();
        } else if (event.key === "Escape") {
          event.preventDefault();
          const input: HTMLInputElement | null = document.querySelector("#answer");
          input?.blur();
        }
        return;
      }
      if (inputStatus === "keyboarding" && isKeyOnKeyboarding(event.key)) {
        event.preventDefault();
        if (event.key === "Escape") {
          const input: HTMLInputElement | null = document.querySelector("#close-keyboard");
          input?.click();
        } else if (event.key === "'") {
          const input: HTMLInputElement | null = document.querySelector("#keyboard-Ap");
          input?.click();
        } else if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(event.key)) {
          const shiftInput: HTMLInputElement | null = document.querySelector("#keyboard-Shift");
          shiftInput?.click();
          setTimeout(() => {
            const charInput: HTMLInputElement | null = document.querySelector(`#keyboard-${event.key.toLowerCase()}`);
            charInput?.click();
          }, 0);
        } else {
          const input: HTMLInputElement | null = document.querySelector(`#keyboard-${event.key}`);
          input?.click();
        }
        return;
      }
      if (inputStatus === "none" && isKey(event.key)) {
        event.preventDefault();
        if (event.key === "t") {
          const search: HTMLInputElement | null = document.querySelector("#search");
          search?.focus();
          return;
        } else {
          const button: HTMLInputElement | null = document.querySelector(`#${KeyMap[event.key]}`);
          button?.click();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputStatus]);
};

export default useKeydown;