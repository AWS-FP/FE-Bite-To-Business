import { useState } from 'react';
import type { FormEvent } from 'react';

export default function BrandQuoteCTA() {
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contact.trim()) {
      setMessage('Vui lòng nhập email hoặc số điện thoại.');
      return;
    }
    setMessage('Đây là form demo UI. Thông tin chưa được gửi hoặc lưu lên Backend.');
  }

  return (
    <section className="btb-brand-quote" id="btb-brand-quote" aria-labelledby="btb-brand-quote-title">
      <div className="btb-brand-container">
        <div className="btb-brand-quote__card">
          <div>
            <span className="btb-brand-quote__eyebrow">DÀNH CHO THU MUA & CHỦ QUÁN F&B</span>
            <h2 id="btb-brand-quote-title">Nhận bảng giá sỉ <em>theo thương hiệu</em></h2>
            <p>Để lại thông tin để xem trước giao diện yêu cầu báo giá. Chức năng gửi sẽ được tích hợp sau.</p>
          </div>
          <form className="btb-brand-quote__form" onSubmit={handleSubmit}>
            <label htmlFor="btb-brand-contact" className="btb-brand-sr-only">Email hoặc số điện thoại</label>
            <input id="btb-brand-contact" type="text" value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Email hoặc số điện thoại" autoComplete="off" />
            <button type="submit" className="btb-brand-btn btb-brand-btn--navy">Nhận báo giá ngay <img src="/images/ui/brand/arrow-right-light.svg" alt="" /></button>
            {message && <p className="btb-brand-quote__message" role="status">{message}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}