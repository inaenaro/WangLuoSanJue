'use client';
import React, { useRef } from "react";
import { MdClose, MdOutlineBackspace, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdOutlineKeyboardReturn } from "react-icons/md";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  targetRef: React.RefObject<HTMLInputElement | null>; // Update to input element
  onClose: () => void; // Add onClose prop to handle keyboard dismissal
  onEnter?: () => void; // Add optional onEnter prop for Enter key functionality
}

export default function VirtualKeyboard({ onKeyPress, targetRef, onClose, onEnter }: VirtualKeyboardProps) {
  const rows = [
    ["̄", "́", "̌", "̀", "", "Left", "Right", "Del", ""],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "ü", "b", "n", "m", "Enter"],
  ];

  const handleKeyPress = (key: string) => {
    if (targetRef.current) {
      const input = targetRef.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;

      if (key === "Del") {
        // Handle delete key
        if (start === end && start > 0) {
          input.value = input.value.slice(0, start - 1) + input.value.slice(end);
          input.setSelectionRange(start - 1, start - 1);
        } else {
          input.value = input.value.slice(0, start) + input.value.slice(end);
          input.setSelectionRange(start, start);
        }
      } else if (key === "←") {
        // Move cursor left
        const newPosition = Math.max(0, start - 1);
        input.setSelectionRange(newPosition, newPosition);
      } else if (key === "→") {
        // Move cursor right
        const newPosition = Math.min(input.value.length, end + 1);
        input.setSelectionRange(newPosition, newPosition);
      } else if (key === "Enter") {
        // Trigger the onEnter action if provided
        if (onEnter) {
          onEnter();
        }
      } else {
        // Insert key at cursor position
        input.value = input.value.slice(0, start) + key + input.value.slice(end);
        input.setSelectionRange(start + key.length, start + key.length);
      }

      input.focus();
      onKeyPress(input.value);
    }
  };

  return (
    <div className="fixed flex flex-col left-0 right-0 bottom-0 w-full gap-2 p-2 bg-gray-800 rounded items-center animate-show_keyboard">
      <div className="relative w-full flex justify-end">
        <button
          onClick={onClose}
          className="absolute right-0 top-0 text-white rounded hover:bg-white/10 p-0.5"
        >
          <MdClose size={24} />
        </button>
      </div>
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2 w-full justify-center">
          {row.map((key, j) =>
            key === "Left" ? (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="w-[min(8%,2.5rem)] h-10 flex items-center justify-center bg-white/20 text-white rounded hover:bg-white/40"
              >
                <MdOutlineKeyboardArrowLeft size={20} />
              </button>
            ) : key === "Right" ? (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="w-[min(8%,2.5rem)] h-10 flex items-center justify-center bg-white/20 text-white rounded hover:bg-white/40"
              >
                <MdOutlineKeyboardArrowRight size={20} />
              </button>
            ) : key === "Del" ? (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="w-[min(8%,2.5rem)] h-10 flex items-center justify-center bg-white/20 text-white rounded hover:bg-white/40"
              >
                <MdOutlineBackspace size={20} />
              </button>
            ) : key === "Enter" ? (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="w-[min(8%,2.5rem)] h-10 flex items-center justify-center bg-white/20 text-white rounded hover:bg-white/40"
              >
                <MdOutlineKeyboardReturn size={20} />
              </button>
            ) : key ? (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="w-[min(8%,2.5rem)] h-10 flex items-center justify-center bg-white/20 text-white rounded hover:bg-white/40"
              >
                {key}
              </button>
            ) : (
              <div key={i + "-" + j} className="w-[min(8%,2.5rem)] h-10" />
            )
          )}
        </div>
      ))}
    </div>
  );
}
