import React from "react";
import { MdClose, MdOutlineBackspace, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdOutlineKeyboardReturn } from "react-icons/md";

interface VirtualKeyboardProps {
  keyboardVisible: boolean;
  onKeyPress: (key: string) => void;
  targetRef: React.RefObject<HTMLInputElement | null>; // Update to input element
  onClose: () => void; // Add onClose prop to handle keyboard dismissal
  onEnter?: () => void;
}

const rows = [
  ["1", "2", "3", "4", "", "ArrowLeft", "ArrowRight", "Backspace", ""],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["", "a", "s", "d", "f", "g", "h", "j", "k", "l", "Enter"],
  // Todo: Shift, 句読点
  ["", "z", "x", "c", "ü", "b", "n", "m", ",", "."],
];

const keyMap: Record<string, string> = {
  "1": "̄",
  "2": "́",
  "3": "̌",
  "4": "̀",
  "v": "ü",
  ".": "。",
  ",": "，",
};

export default function VirtualKeyboard({ keyboardVisible, onKeyPress, targetRef, onClose, onEnter }: VirtualKeyboardProps) {
  const handleKeyPress = (key: string) => {
    if (targetRef.current) {
      const input = targetRef.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;

      if (key === "Backspace") {
        if (start === end && start > 0) {
          input.value = input.value.slice(0, start - 1) + input.value.slice(end);
          input.setSelectionRange(start - 1, start - 1);
        } else {
          input.value = input.value.slice(0, start) + input.value.slice(end);
          input.setSelectionRange(start, start);
        }
      } else if (key === "ArrowLeft") {
        const newPosition = Math.max(0, start - 1);
        input.setSelectionRange(newPosition, newPosition);
      } else if (key === "ArrowRight") {
        const newPosition = Math.min(input.value.length, end + 1);
        input.setSelectionRange(newPosition, newPosition);
      } else if (key === "Enter") {
        if (onEnter) {
          onEnter();
        }
      } else if (Object.keys(keyMap).includes(key)) {
        const char = keyMap[key];
        input.value = input.value.slice(0, start) + char + input.value.slice(end);
        input.setSelectionRange(start + char.length, start + char.length);
      } else {
        input.value = input.value.slice(0, start) + key + input.value.slice(end);
        input.setSelectionRange(start + key.length, start + key.length);
      }

      input.focus();
      onKeyPress(input.value);
    }
  };

  return (
    <div inert={!keyboardVisible} className={`fixed flex flex-col left-0 right-0 overflow-hidden w-full gap-2 p-2 bg-gray-800 border-gray border-t rounded items-center select-none duration-500 ${keyboardVisible ? "bottom-0" : "-bottom-full"} aanimate-show_keyboard`}>
      <div className="relative w-full flex justify-end">
        <button
          id="close-keyboard"
          onClick={onClose}
          className="absolute right-0 top-0 text-white rounded hover:bg-white/10 p-0.5"
        >
          <MdClose size={24} />
        </button>
      </div>
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2 w-full justify-center">
          {row.map((key, j) =>
            key ?
              <button
                id={`keyboard-${key}`}
                key={key}
                onClick={() => handleKeyPress(key)}
                className="w-[min(8%,2.5rem)] h-10 flex items-center justify-center bg-white/20 text-white rounded hover:bg-white/40 border border-gray"
              >
                {key === "ArrowLeft" ? <MdOutlineKeyboardArrowLeft size={20} />
                  : key === "ArrowRight" ? <MdOutlineKeyboardArrowRight size={20} />
                    : key === "Backspace" ? <MdOutlineBackspace size={20} />
                      : key === "Enter" ? <MdOutlineKeyboardReturn size={20} />
                        : Object.keys(keyMap).includes(key) ? keyMap[key]
                          : key}
              </button>
              : <div key={i + "-" + j} className="w-[min(8%,2.5rem)] h-10" />
          )}
        </div>
      ))}
    </div>
  );
}
