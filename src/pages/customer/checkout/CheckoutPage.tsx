import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';
import CheckoutStepper from '@/components/customer/checkout/CheckoutStepper';
import CheckoutDelivery from '@/components/customer/checkout/CheckoutDelivery';
import CheckoutReview from '@/components/customer/checkout/CheckoutReview';
import CheckoutCoupon from '@/components/customer/checkout/CheckoutCoupon';
import CheckoutPayment from '@/components/customer/checkout/CheckoutPayment';
import CheckoutSummary from '@/components/customer/checkout/CheckoutSummary';
import { useCartStore } from '@/store/customer/cartStore';
import type { DeliveryDraft, DeliveryPackage } from '@/components/customer/checkout/checkoutData';
import '@/components/customer/checkout/checkout.css';

const HEADINGS = [
    { first: 'Gom hàng cho', accent: 'từng bếp' },
    { first: 'Duyệt', accent: 'báo giá' },
    { first: 'Thêm', accent: 'ưu đãi' },
    { first: 'Xác nhận', accent: 'đơn hàng' },
];

export default function CheckoutPage() {
    const location = useLocation();
    const initialAddress = typeof location.state?.deliveryAddress === 'string' ? location.state.deliveryAddress : '';
    const [step, setStep] = useState(0);
    const [packages, setPackages] = useState<DeliveryPackage[]>([]);
    const [assignments, setAssignments] = useState<Record<string, string>>({});
    const cartItems = useCartStore(state => state.items);
    const items = cartItems.map(item => ({ id: item.id, name: item.name, pack: item.spec, quantity: item.quantity, price: item.unitPrice * item.quantity, imageUrl: item.imageUrl }));

    const remaining = items.filter(item => !assignments[item.id]);
    const unusedPackages = packages.filter(p => !items.some(item => assignments[item.id] === p.id));
    const deliveryReady = items.length > 0 && packages.length > 0 && remaining.length === 0 && unusedPackages.length === 0;

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
    }


    return (
        <div className="btb-co-shell">
            <Header />

            <div className="btb-co-page">
                <main className="btb-co-main">

                    <div className="btb-co-hero">
                        <div>
                            <h1>{HEADINGS[step].first} <em>{HEADINGS[step].accent}</em></h1>
                        </div>
                        <div className="btb-co-hero__badge"><span>{String(packages.length).padStart(2, '0')} ĐIỂM GIAO</span><strong>{remaining.length} cần xếp</strong></div>
                    </div>
                    <CheckoutStepper step={step} onGoBack={index => { if (index < step) move(index); }} />
                    <div className="btb-co-grid">
                        <div className="btb-co-content">
                            {step === 0 && <CheckoutDelivery items={items} packages={packages} assignments={assignments} onCreatePackage={createPackage} onEditPackage={editPackage} onDeletePackage={deletePackage} onAssign={assign} initialAddress={initialAddress} />}
                            {step === 1 && <CheckoutReview items={items} packages={packages} assignments={assignments} />}
                            {step === 2 && <CheckoutCoupon />}
                            {step === 3 && <CheckoutPayment packages={packages} onEditDelivery={() => move(0)} />}
                        </div>
                        <CheckoutSummary items={items} step={step} packages={packages} assignments={assignments} nextDisabled={(step === 0 && !deliveryReady) || step === 3} onNext={next} onBack={() => move(Math.max(0, step - 1))} />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}

