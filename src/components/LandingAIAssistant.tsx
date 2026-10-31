
/* Generated from the supplied HTML layout. Edit this section independently. */
import { useState } from 'react';

export default function LandingAIAssistant({ setCategory, setView }: { setCategory: (category: string) => void; setView: (view: 'grid' | 'table') => void }) {
  const [open, setOpen] = useState(() => window.innerWidth >= 768);
  return (
    <div className="ai-bubble">
      <div className="ai-bubble-head" id="aiBubbleHeader" role="button" tabIndex={0} onClick={() => setOpen((v) => !v)} onKeyDown={(event) => { if (event.key === "Enter") setOpen((v) => !v); }}>
        <span>Trợ lý AI — Bite to Business</span>
        <span id="aiChevron">{open ? "▾" : "▴"}</span>
      </div>
      <div className="ai-bubble-content" id="aiBubbleBody" style={{ display: open ? "block" : "none" }}>
        <div style={{ "color": "var(--text-body)", "marginBottom": "6px" }}>Chào bạn! Mình có thể tìm nguyên liệu, gợi ý đồ ăn chế biến sẵn hoặc đổi bố cục sang bảng so sánh giá:</div>
        <button type="button" className="ai-suggestion" id="btnAiPromptTable" onClick={() => { setView("table"); document.getElementById("catalog-preview")?.scrollIntoView({ behavior: "smooth" }); }}>“Tìm 10kg ức gà &amp; thịt heo, ưu tiên giá tốt, xem dạng bảng”</button>
        <button type="button" className="ai-suggestion" id="btnAiPromptPrepared" onClick={() => { setCategory("prepared"); setView("grid"); document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" }); }}>“Gợi ý các món chế biến sẵn giao nhanh ngày mai”</button>
      </div>
    </div>
  );
}

