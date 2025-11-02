'use client';
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import VirtualKeyboard from "@/components/VirtualKeyboard";
import { InputStatusContext } from "@/components/Providers";
import { MdOutlineKeyboard } from "react-icons/md";

type AnswerInputProps = {
  showKeyboard: boolean;
  setShowKeyboard: Dispatch<SetStateAction<boolean>>;
  inputType: "pinyin" | "cn";
  userInput: string;
  setUserInput: Dispatch<SetStateAction<string>>;
  onEnter: () => void;
} & React.ComponentPropsWithoutRef<'input'>;

export default function AnswerInput({ showKeyboard, setShowKeyboard, inputType, userInput, setUserInput, onEnter, ...props }: AnswerInputProps) {
  const { inputStatus, setInputStatus } = useContext(InputStatusContext);
  const [keyboardVisible, setKeyboardVisible] = useState(showKeyboard);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.disabled) {
      setKeyboardVisible(false);
      setInputStatus("none");
    } else if (showKeyboard) {
      setKeyboardVisible(true);
      setInputStatus("keyboarding");
    }
  }, [props.disabled]);

  useEffect(() => {
    if (inputStatus === "searching") {
      setKeyboardState(false);
    }
  }, [inputStatus]);

  function setKeyboardState(visible: boolean) {
    setKeyboardVisible(visible);
    setShowKeyboard(visible);
  }

  return (
    <div
      className="flex gap-2 relative"
    >
      <input
        id="answer"
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
        placeholder={inputType === "pinyin" ? "ピンインを入力してください" : "请输入中文"}
        className={`h-9 border border-gray rounded p-1 w-60 max-w-60 bg-background2 disabled:text-text/80 disabled:cursor-not-allowed ${inputType === "cn" ? "font-ch" : ""} ${props.className || ''}`}
        disabled={props.disabled}
        readOnly={keyboardVisible}
      />
      {!props.disabled && inputType === "pinyin" && <div className="flex items-center gap-2">
        <button
          id="show-keyboard"
          onClick={() => {
            if (keyboardVisible) {
              setInputStatus("answering");
              inputRef.current?.focus();
            } else {
              setInputStatus("keyboarding");
            }
            setKeyboardState(!keyboardVisible);
          }}
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
          setUserInput={setUserInput}
          targetRef={inputRef}
          onClose={() => {
            setKeyboardState(false);
            inputRef.current?.focus();
            setInputStatus("answering");
          }}
          onEnter={onEnter}
        />
      )}
    </div>);
}