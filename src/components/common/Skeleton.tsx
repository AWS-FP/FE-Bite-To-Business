import { motion, useReducedMotion } from 'motion/react';

/** Decorative placeholder. Its parent owns the loading semantics and layout. */
export default function Skeleton({ className = '' }: { className?: string }) {
    const reducedMotion = useReducedMotion();
    return (
        <span
            aria-hidden="true"
            className={`block relative overflow-hidden rounded-md bg-[#e3e9e3] ${className}`}
        >
            {!reducedMotion && (
                <motion.span
                    className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.55, repeat: Infinity, ease: 'linear' }}
                />
            )}
        </span>
    );
}
