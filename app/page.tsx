'use client';
import { useContext } from "react";
import { InputStatusContext } from "@/components/Providers";
import useKeydown from "./hooks/useKeyDown";
import MainComponent from "@/components/MainComponent";

export default function Home() {
  const { inputStatus } = useContext(InputStatusContext);

  useKeydown(inputStatus);

  return (
    <div>
      <MainComponent />
      <div className="border-t border-gray p-2">
        <div className="text-sm">
          <p>サイト利用上の注意:</p>
          <ul className="list-disc pl-5">
            <li>このサイトは作成の際に正確を期していますが、必ずしもそれを保証するものではありません。</li>
            <li>内容の誤りや不具合、改善案等がある場合は何らかの方法でサイト作成者に報告してください。</li>
            <li>音声読み上げにはブラウザの読み上げを使用しているため、ピンイン通りの発音ではないことがあります。</li>
            <li><a href="/table" className="text-[#310510] dark:text-[#e7c8c8] decoration-[#310510] dark:decoration-[#e7c8c8] underline hover:text-[#310510]/80 dark:hover:text-[#e7c8c8]/80 hover:decoration-[#310510]/80 dark:hover:decoration-[#e7c8c8]/80">ピンイン表はこちら</a></li>
          </ul>
        </div>
        <div className="text-xs text-gray">
          <p>Todo:</p>
          <ul className="list-disc pl-5">
            <li>文法問題追加</li>
            <li>第6-9課校閲</li>
            <li>キーボードのカーソル表示</li>
            <li>複数解対応</li>
            <li>ID機能で星印を端末間共有</li>
            <li>bad setState修正</li>
            <li>読み上げとの不一致への対応</li>
            <li>- 例: 照片, 軽声</li>
            <li>重複語の処理</li>
            <li>複数タブ開くとバグる</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
