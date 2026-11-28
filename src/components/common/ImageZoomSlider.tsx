import { Minus, Plus } from 'lucide-react';

type Props = {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    label: string;
    decreaseLabel: string;
    increaseLabel: string;
    dark?: boolean;
};

export default function ImageZoomSlider({
    value,
    min,
    max,
    onChange,
    label,
    decreaseLabel,
    increaseLabel,
    dark = false,
}: Props) {
    const progress = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    const adjust = (delta: number) =>
        onChange(Math.max(min, Math.min(max, Math.round((value + delta) * 100) / 100)));
    const button = `grid size-9 shrink-0 place-items-center rounded-full border transition-colors focus-visible:!outline-2 focus-visible:!outline-offset-2 disabled:cursor-not-allowed disabled:opacity-35 ${dark ? '!border-white/25 !bg-white/10 !text-white hover:!bg-white/20 focus-visible:!outline-store-yellow' : '!border-store-green/20 !bg-white !text-store-green hover:!bg-surface-green focus-visible:!outline-store-green'}`;
    return (
        <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
                type="button"
                className={button}
                aria-label={decreaseLabel}
                disabled={value <= min}
                onClick={() => adjust(-0.1)}
            >
                <Minus size={16} />
            </button>
            <input
                type="range"
                min={min}
                max={max}
                step={0.05}
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
                aria-label={label}
                aria-valuetext={`${Math.round(value * 100)}%`}
                style={{
                    background: `linear-gradient(to right, ${dark ? '#ffdf40' : '#24593d'} ${progress}%, ${dark ? '#49655a' : '#dce7df'} ${progress}%)`,
                }}
                className={`!m-0 !h-2 !min-w-0 flex-1 !appearance-none !rounded-full !border-0 !p-0 cursor-pointer focus-visible:!outline-2 focus-visible:!outline-offset-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:shadow-md ${dark ? 'focus-visible:!outline-store-yellow [&::-webkit-slider-thumb]:border-store-yellow [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:border-store-yellow [&::-moz-range-thumb]:bg-white' : 'focus-visible:!outline-store-green [&::-webkit-slider-thumb]:border-store-green [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:border-store-green [&::-moz-range-thumb]:bg-white'}`}
            />
            <button
                type="button"
                className={button}
                aria-label={increaseLabel}
                disabled={value >= max}
                onClick={() => adjust(0.1)}
            >
                <Plus size={16} />
            </button>
        </div>
    );
}
