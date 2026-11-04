import { Check } from 'lucide-react';

const STEPS = [
    ['Organize items', 'Chia theo chi nhánh'],
    ['Review quote', 'Kiểm tra báo giá'],
    ['Apply coupon', 'Thêm ưu đãi'],
    ['Submit order', 'Xác nhận thanh toán'],
] as const;

type Props = {
    step: number;
    onGoBack: (target: number) => void;
};

export default function CheckoutStepper({ step, onGoBack }: Props) {
    return (
        <nav className="btb-co-stepper" aria-label="Tiến trình thanh toán">
            {STEPS.map(([heading, subtitle], index) => {
                const done = index < step;
                const active = index === step;
                return (
                    <button
                        key={heading}
                        type="button"
                        className={`btb-co-stepper__item ${done ? 'is-done' : ''} ${active ? 'is-active' : ''}`}
                        onClick={() => onGoBack(index)}
                        disabled={index >= step}
                        aria-current={active ? 'step' : undefined}
                        aria-label={`${index + 1}. ${subtitle}${done ? ' - đã hoàn thành' : ''}`}
                    >
                        <span className="btb-co-stepper__circle">{done ? <Check size={16} /> : String(index + 1).padStart(2, '0')}</span>
                        <span className="btb-co-stepper__text"><strong>{heading}</strong><small>{subtitle}</small></span>
                    </button>
                );
            })}
        </nav>
    );
}
