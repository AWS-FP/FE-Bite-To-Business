import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuoteStepsProps {
    step: number;
    busy: boolean;
    onSelectStep: (step: number) => void;
}

export default function QuoteSteps({ step, busy, onSelectStep }: QuoteStepsProps) {
    const { t } = useTranslation('quote');
    const steps = [t('steps.cart'), t('steps.pricing'), t('steps.delivery'), t('steps.review')];
    return (
        <nav aria-label={t('steps.navigation')} className="my-8 grid grid-cols-4 gap-3">
            {steps.map((label, index) => {
                const active = index === step;
                const buttonColor = active
                    ? 'border-store-green bg-store-green text-white'
                    : 'border-store-ink/15 bg-white text-store-ink';
                const circleColor = active ? 'border-white' : 'border-store-green text-store-green';

                return (
                    <button
                        key={label}
                        type="button"
                        disabled={index > step || busy}
                        onClick={() => onSelectStep(index)}
                        aria-current={active ? 'step' : undefined}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-4 text-left ${buttonColor} disabled:opacity-60`}
                    >
                        <span
                            className={`grid size-9 shrink-0 place-items-center rounded-full border font-bold ${circleColor}`}
                        >
                            {index < step ? <Check size={17} /> : `0${index + 1}`}
                        </span>
                        <span className="font-bold">{label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
