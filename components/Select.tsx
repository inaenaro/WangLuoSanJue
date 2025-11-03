import { ReactEventHandler } from "react";

export default function Select({ disabled = false, options, selected, onChange, className }: { disabled?: boolean, options: readonly string[], selected: string, onChange: ReactEventHandler<HTMLSelectElement>, className?: string }) {
  return (
    <select disabled={disabled} defaultValue={selected} onChange={onChange} className={`p-2 bg-background2 hover:bg-background2/70 disabled:opacity-70 border border-gray rounded-md cursor-pointer text-center ${className}`}>
      {options.map((letter) => (
        <option key={letter} value={letter} className="bg-[#402025]">
          {letter}
        </option>
      ))}
    </select>
  );
}
