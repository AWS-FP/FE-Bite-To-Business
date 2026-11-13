import { Truck } from 'lucide-react';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import type { Quote, QuotePackage } from '@/services/customer/quoteService';

interface QuoteReviewProps {
    quote: Quote;
    packages: QuotePackage[];
}

export default function QuoteReview({ quote, packages }: QuoteReviewProps) {
    return (
        <section className="rounded-2xl border border-store-ink/20 bg-white p-6">
            <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-store-cream text-store-green">
                    <Truck size={21} />
                </span>
                <div>
                    <h2 className="m-0 font-subheading text-xl font-bold">
                        Kiểm tra trước khi thanh toán
                    </h2>
                    <p className="mb-0 mt-1 text-sm text-store-muted">
                        {packages.length} gói giao hàng · {quote.items.length} sản phẩm
                    </p>
                </div>
            </div>
            <div className="mt-5 space-y-3">
                {packages.map((item) => (
                    <div key={item.id} className="rounded-xl border border-store-ink/10 p-4">
                        <strong>{item.name}</strong>
                        <p className="mb-0 mt-2 text-sm text-store-muted">
                            {item.recipientName} · {item.address}
                        </p>
                        <p className="mb-0 mt-1 text-sm text-store-muted">
                            {item.deliveryDate} · {item.deliveryTimeSlot}
                        </p>
                        <p className="mb-0 mt-2 text-sm font-bold">
                            Phí giao: {formatCurrencyVnd(Number(item.shippingFee))}
                        </p>
                    </div>
                ))}
            </div>
            <p className="mb-0 mt-5 rounded-xl bg-store-cream p-4 text-sm leading-relaxed">
                Chức năng tạo đơn và thanh toán đang được hoàn thiện. Bạn có thể quay lại để kiểm
                tra thông tin báo giá.
            </p>
        </section>
    );
}
