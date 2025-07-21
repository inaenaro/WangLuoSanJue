'use client';
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";

import VirtualKeyboard from "@/components/VirtualKeyboard";
import { MdOutlineKeyboard } from "react-icons/md";
import { InputStatusContext } from "@/components/Providers";

export default function AnswerInput({ userInput, setUserInput, onEnter, ...props }: { userInput: string; setUserInput: Dispatch<SetStateAction<string>>; onEnter: () => void; } & React.ComponentPropsWithoutRef<'input'>) {
  const { inputStatus, setInputStatus } = useContext(InputStatusContext);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.disabled) {
      setKeyboardVisible(false);
      setInputStatus("none");
    }
  }, [props.disabled]);

  useEffect(() => {
    if (inputStatus === "searching") {
      setKeyboardVisible(false);
    }
  }, [inputStatus]);

  const handleVirtualKeyPress = (value: string) => {
    setUserInput(value);
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
        onFocus={() => {
          !keyboardVisible && setInputStatus("answering");
        }}
        onBlur={() => {
          !keyboardVisible && setInputStatus("none")
        }}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder={props.placeholder || ""}
        className={`h-9 border border-gray rounded p-1 max-w-80 bg-background2 disabled:text-text/80 disabled:cursor-not-allowed ${props.className || ''}`}
        disabled={props.disabled}
        readOnly={keyboardVisible}
      />
      {!props.disabled && <div className="flex items-center gap-2">
        <button
          onClick={() => setKeyboardVisible((prev) => {
            if (prev) {
              setInputStatus("answering");
              inputRef.current?.focus();
            } else {
              setInputStatus("keyboarding");
            }
            return !prev;
          })}
          className="flex justify-center items-center size-9 min-w-9 bg-background2 hover:bg-gray/40 rounded-xl border-gray border-1 cursor-pointer"
          disabled={props.disabled}
        >
          <MdOutlineKeyboard className={`size-6 ${keyboardVisible ? "" : "text-text/50"}`} />
        </button>
        <p className="text-[0.5rem] max-h-9">ONのときは直接入力出来ません</p>
        </div>}
        {(
          <VirtualKeyboard
            keyboardVisible={keyboardVisible}
            onKeyPress={handleVirtualKeyPress}
            targetRef={inputRef}
            onClose={() => {
              setKeyboardVisible(false);
              inputRef.current?.focus();
              setInputStatus("answering");
            }}
            onEnter={onEnter}
          />
        )}
      </div>);
}