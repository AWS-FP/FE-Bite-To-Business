import { useMemo, useState } from 'react';
import { BRAND_PRODUCTS, RELATED_PRODUCTS } from './brandData';

const HISTORY_KEY = 'btb-brand-search-history-ui-v1';
const EXAMPLES = ['Thịt heo mát', 'Ức gà phi lê', 'Đồ chế biến'];

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
}

function readHistory(): string[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string').slice(0, 5)
      : [];
  } catch {
    return [];
  }
}

export default function BrandRecentSearch() {
  const [input, setInput] = useState('');
  const [recent, setRecent] = useState<string[]>(readHistory);
  const [selectedQuery, setSelectedQuery] = useState('');

  const matches = useMemo(() => {
    const query = normalize(selectedQuery.trim());
    if (!query) return [];
    const unique = [...BRAND_PRODUCTS, ...RELATED_PRODUCTS].filter(
      (item, index, all) => all.findIndex((other) => other.id === item.id) === index,
    );
    return unique.filter((item) =>
      normalize(`${item.name} ${item.category} ${item.description}`).includes(query),
    ).slice(0, 3);
  }, [selectedQuery]);

  function search(query: string) {
    const clean = query.trim().slice(0, 80);
    if (!clean) return;
    const next = [clean, ...recent.filter((item) => normalize(item) !== normalize(clean))].slice(0, 5);
    setSelectedQuery(clean);
    setRecent(next);
    setInput('');
    try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* optional */ }
  }

  function clear() {
    setRecent([]);
    setSelectedQuery('');
    try { sessionStorage.removeItem(HISTORY_KEY); } catch { /* optional */ }
  }

  return (
    <section className="btb-brand-recent" aria-labelledby="btb-brand-recent-title">
      <div className="btb-brand-recent__heading">
        <div className="btb-brand-recent__icon"><img src="/images/ui/brand/history.svg" alt="" /></div>
        <div>
          <h2 id="btb-brand-recent-title">Tìm kiếm gần đây</h2>
          <p>Từ khóa đã tìm, không đồng nghĩa với sản phẩm đã mua.</p>
        </div>
      </div>
      <form className="btb-brand-recent__form" role="search" onSubmit={(event) => { event.preventDefault(); search(input); }}>
        <label className="btb-brand-sr-only" htmlFor="btb-recent-search">Tìm sản phẩm mẫu</label>
        <input id="btb-recent-search" value={input} onChange={(event) => setInput(event.target.value)} maxLength={80} placeholder="Tìm thử một sản phẩm..." />
        <button type="submit" disabled={!input.trim()} aria-label="Tìm kiếm"><img src="/images/ui/brand/search.svg" alt="" /></button>
      </form>
      <div className="btb-brand-recent__chips">
        {(recent.length ? recent : EXAMPLES).map((word) => (
          <button type="button" key={word} onClick={() => search(word)} className={word === selectedQuery ? 'is-active' : ''}>{word}</button>
        ))}
        {!!recent.length && <button className="btb-brand-recent__clear" type="button" onClick={clear}>Xóa lịch sử</button>}
      </div>
      {selectedQuery && (
        <div className="btb-brand-recent__results" role="status">
          <strong>Kết quả demo cho “{selectedQuery}”</strong>
          {matches.length ? <ul>{matches.map((item) => <li key={item.id}>{item.name}</li>)}</ul> : <p>Chưa có sản phẩm phù hợp trong dữ liệu mẫu.</p>}
        </div>
      )}
      <p className="btb-brand-recent__footnote">Chỉ lưu trong phiên trình duyệt (sessionStorage) · Chưa gọi API.</p>
    </section>
  );
}
