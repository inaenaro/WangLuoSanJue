'use client';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import VirtualKeyboard from "./VirtualKeyboard";
import { MdOutlineKeyboard } from "react-icons/md";

export default function AnswerInput({ userInput, setUserInput, onEnter, ...props }: { userInput: string; setUserInput: Dispatch<SetStateAction<string>>; onEnter: () => void; } & React.ComponentPropsWithoutRef<'input'>) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.disabled) {
      setKeyboardVisible(false);
    }
  }, [props.disabled]);

  const handleVirtualKeyPress = (value: string) => {
    setUserInput(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (keyboardVisible) {
      e.preventDefault(); // Prevent default behavior
      const cursorPosition = inputRef.current?.selectionStart || 0;
      const newValue =
        userInput.slice(0, cursorPosition) + e.key + userInput.slice(cursorPosition);
      setUserInput(newValue);
      setTimeout(() => {
        inputRef.current?.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
      }, 0);
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex gap-2 relative"
    >
      <input
        {...props}
        ref={inputRef}
        type="text"
        value={userInput}
        onKeyDown={handleKeyDown}
        onChange={(e) => setUserInput(e.target.value)}
        onClick={() => setKeyboardVisible(false)}
        placeholder={props.placeholder || ""}
        className={`h-9 border border-gray rounded p-1 max-w-80 bg-background2 disabled:text-text/80 disabled:cursor-not-allowed ${props.className || ''}`}
        disabled={props.disabled}
        readOnly={keyboardVisible}
      />
      {!props.disabled && <button
        onClick={() => setKeyboardVisible((prev) => !prev)}
        className="flex justify-center items-center size-9 bg-background2 hover:bg-gray/40 rounded-xl border-gray border-1 cursor-pointer"
        disabled={props.disabled}
      >
        <MdOutlineKeyboard className={`size-6 ${keyboardVisible ? "" : "text-text/50"}`} />
      </button>}
      {keyboardVisible && (
        <VirtualKeyboard
          onKeyPress={handleVirtualKeyPress}
          targetRef={inputRef}
          onClose={() => setKeyboardVisible(false)}
          onEnter={onEnter}
        />
      )}
    </div>);
}