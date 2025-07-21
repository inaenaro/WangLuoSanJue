import { CheckedWordsContext } from "@/components/Providers";
import { useContext } from "react";
import { MdOutlineStar } from "react-icons/md";

export default function WordCheckbox({ wordId }: { wordId: string }) {
  const { checkedWords, setCheckedWords } = useContext(CheckedWordsContext);

  const handleCheck = (checked: boolean) => {
    const newCheckedWords = new Set(checkedWords);
    if (checked) {
      newCheckedWords.add(wordId);
    } else {
      newCheckedWords.delete(wordId);
    }
    setCheckedWords(newCheckedWords);
    try {
      localStorage.setItem("checked", Array.from(newCheckedWords).join(","));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="relative size-6 content-center">
      <input type="checkbox" checked={checkedWords.has(wordId)} onChange={(e) => handleCheck(e.currentTarget.checked)} className="appearance-none absolute box-border inset-0 size-6 bg-[#ee1c25] border-2 rounded-md border-gray" />
      {checkedWords.has(wordId) ? <MdOutlineStar className="relative size-6 text-[#ffff00] p-1 pointer-events-none" /> : null}
    </div>
  );
}