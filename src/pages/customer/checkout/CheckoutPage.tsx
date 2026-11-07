import { useMemo, useState } from 'react';
import { CheckCircle2, CircleAlert, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';
import CheckoutStepper from '@/components/customer/checkout/CheckoutStepper';
import CheckoutDelivery from '@/components/customer/checkout/CheckoutDelivery';
import CheckoutReview from '@/components/customer/checkout/CheckoutReview';
import CheckoutCoupon from '@/components/customer/checkout/CheckoutCoupon';
import CheckoutPayment from '@/components/customer/checkout/CheckoutPayment';
import CheckoutSummary from '@/components/customer/checkout/CheckoutSummary';
import { CHECKOUT_ITEMS } from '@/components/customer/checkout/checkoutData';
import type { DeliveryDraft, DeliveryPackage } from '@/components/customer/checkout/checkoutData';
import '@/components/customer/checkout/checkout.css';

const HEADINGS = [
    { first: 'Gom hàng cho', accent: 'từng bếp', text: 'Tạo gói giao theo chi nhánh, rồi phân nguyên liệu vào đúng nơi nhận.' },
    { first: 'Duyệt', accent: 'báo giá', text: 'Kiểm tra từng điểm giao trước khi chốt đơn.' },
    { first: 'Thêm', accent: 'ưu đãi', text: 'Áp dụng ưu đãi trước khi gửi đơn tới nhà cung cấp.' },
    { first: 'Xác nhận', accent: 'đơn hàng', text: 'Chọn phương thức thanh toán để hoàn tất yêu cầu giao hàng.' },
];

export default function CheckoutPage() {
    const location = useLocation();
    const initialAddress = typeof location.state?.deliveryAddress === 'string' ? location.state.deliveryAddress : '';
    const [step, setStep] = useState(0);
    const [packages, setPackages] = useState<DeliveryPackage[]>([]);
    const [assignments, setAssignments] = useState<Record<string, string>>({});
    const [coupon, setCoupon] = useState(false);
    const [previewConfirmed, setPreviewConfirmed] = useState(false);

    const remaining = CHECKOUT_ITEMS.filter(item => !assignments[item.id]);
    const unusedPackages = packages.filter(p => !CHECKOUT_ITEMS.some(item => assignments[item.id] === p.id));
    const deliveryReady = packages.length > 0 && remaining.length === 0 && unusedPackages.length === 0;
    const helper = useMemo(() => {
        if (!packages.length) return 'Tạo ít nhất một gói giao để bắt đầu chia hàng.';
        if (remaining.length) return `Còn ${remaining.length} mặt hàng chưa được phân vào điểm giao.`;
        if (unusedPackages.length) return `Còn ${unusedPackages.length} điểm giao chưa được gán món hàng.`;
        return 'Đã sẵn sàng để xem báo giá mẫu.';
    }, [packages.length, remaining.length, unusedPackages.length]);

    function createPackage(draft: DeliveryDraft) {
        const id = `delivery-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setPackages(prev => [...prev, { ...draft, id }]);
    }

    function editPackage(id: string, draft: DeliveryDraft) {
        setPackages(prev => prev.map(p => p.id === id ? { ...draft, id } : p));
    }

    function deletePackage(id: string) {
        setPackages(prev => prev.filter(p => p.id !== id));
        setAssignments(prev => Object.fromEntries(Object.entries(prev).filter(([, packageId]) => packageId !== id)));
    }

    function assign(itemId: string, packageId: string) {
        setAssignments(prev => ({ ...prev, [itemId]: packageId }));
    }

    function move(nextStep: number) {
        setStep(nextStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function next() {
        if (step === 0 && !deliveryReady) return;
        if (step < 3) move(step + 1);
        else setPreviewConfirmed(true);
    }


    return (
        <div className="btb-co-shell">
            <Header />

            <div className="btb-co-page">
                <main className="btb-co-main">

                    <div className="btb-co-hero">
                        <div><span className="btb-co-hero__eyebrow">ĐIỀU PHỐI ĐƠN HÀNG · BẢN DỰNG GIAO DIỆN</span>
                            <h1>{HEADINGS[step].first} <em>{HEADINGS[step].accent}</em></h1>
                            <p>{HEADINGS[step].text}</p>
                        </div>
                        <div className="btb-co-hero__badge"><span>{String(packages.length).padStart(2, '0')} ĐIỂM GIAO</span><strong>{remaining.length} cần xếp</strong></div>
                    </div>
                    <CheckoutStepper step={step} onGoBack={index => { if (index < step) move(index); }} />
                    <p className="btb-co-demo-banner"><CircleAlert size={17} /> Giao diện mô phỏng theo Figma. Sản phẩm, giá, phí giao, ưu đãi và thanh toán đều là dữ liệu demo.</p>
                    <div className="btb-co-grid">
                        <div className="btb-co-content">
                            {step === 0 && <CheckoutDelivery packages={packages} assignments={assignments} onCreatePackage={createPackage} onEditPackage={editPackage} onDeletePackage={deletePackage} onAssign={assign} initialAddress={initialAddress} />}
                            {step === 1 && <CheckoutReview packages={packages} assignments={assignments} />}
                            {step === 2 && <CheckoutCoupon applied={coupon} onApply={setCoupon} packages={packages} assignments={assignments} />}
                            {step === 3 && <CheckoutPayment packages={packages} onEditDelivery={() => move(0)} />}
                        </div>
                        <CheckoutSummary step={step} packages={packages} assignments={assignments} coupon={coupon} helper={helper} nextDisabled={step === 0 && !deliveryReady} onNext={next} onBack={() => move(Math.max(0, step - 1))} />
                    </div>
                </main>
                {previewConfirmed && <div className="btb-co-modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setPreviewConfirmed(false); }}>
                    <section className="btb-co-modal" role="dialog" aria-modal="true" aria-labelledby="co-demo-dialog-title">
                        <button className="btb-co-modal__close" type="button" aria-label="Đóng" onClick={() => setPreviewConfirmed(false)}><X size={20} /></button>
                        <CheckCircle2 size={48} className="btb-co-modal__check" />
                        <span className="btb-co-overline">HOÀN THÀNH QUY TRÌNH GIAO DIỆN</span>
                        <h2 id="co-demo-dialog-title">Đã xem trước xác nhận đơn</h2>
                        <p>Đây là thao tác thử nghiệm. <strong>Chưa tạo đơn hàng thật, chưa thu tiền và không gửi yêu cầu thanh toán</strong>. Khi Backend và trang trạng thái được tích hợp, nút xác nhận mới có thể thực hiện luồng đặt hàng thực tế.</p>
                        <div className="btb-co-modal__actions"><button type="button" onClick={() => setPreviewConfirmed(false)}>Quay lại chỉnh sửa</button><Link to="/">Về trang chủ</Link></div>
                    </section>

                </div>}
            </div>

            <Footer />
        </div>
    );
}

