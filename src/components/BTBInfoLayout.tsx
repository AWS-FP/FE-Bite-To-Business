import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import LandingHeader from '@/components/LandingHeader';
import Footer from '@/layouts/Footer';
import LandingPersonalization from '@/components/LandingPersonalization';
import '@/components/landing.css';
import '@/components/landingInfo.css';

type Props = { title: string; eyebrow: string; description: string; children: ReactNode };
export default function BTBInfoLayout({ title, eyebrow, description, children }: Props) {
    return (
        <div className="flex min-h-dvh flex-col bg-store-cream">
            <div className="btb-landing flex-1">
                <LandingHeader quoteCount={0} showToast={() => undefined} />
                <main id="main-content" className="btb-info">
                    <section className="btb-info__hero">
                        <div className="container">
                            <nav className="btb-info__crumbs" aria-label="Đường dẫn trang">
                                <Link to="/landing">Landing</Link><span aria-hidden="true">/</span>
                                <span aria-current="page">{title}</span>
                            </nav>
                            <span className="btb-info-eyebrow">{eyebrow}</span>
                            <h1>{title}</h1>
                            <p>{description}</p>
                            <div className="btb-info__hero-actions">
                                <Link className="btb-info__action" to="/register">Bắt đầu với BTB</Link>
                                <Link className="btb-info__action btb-info__action--outline" to="/landing">Khám phá Landing</Link>
                            </div>
                            <div className="btb-info__visual" aria-hidden="true">
                                <span>BTB</span><span>CHO DOANH NGHIỆP</span><span>CHO CÁ NHÂN</span>
                            </div>
                        </div>
                    </section>
                    {children}
                    <LandingPersonalization />
                    <section className="btb-info__bottom">
                        <div className="container btb-info__bottom-inner">
                            <div><span className="btb-info-eyebrow">TÌM HIỂU TIẾP</span><h2>Khám phá cách BTB đồng hành với bạn.</h2></div>
                            <div className="btb-info__bottom-links">
                                <Link to="/landing/why-btb">Vì sao chọn BTB?</Link>
                                <Link to="/landing/model">Mô hình BTB</Link>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </div>
    );
}