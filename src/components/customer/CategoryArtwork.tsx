import { useState } from 'react'

interface CategoryArtworkProps {
    categoryKey: string
    iconUrl: string
}

export default function CategoryArtwork({
                                            categoryKey,
                                            iconUrl,
                                        }: CategoryArtworkProps) {
    const [imgFailed, setImgFailed] = useState(false)

    if (iconUrl && !imgFailed) {
        return (
            <img
                src={iconUrl}
                alt=""
                aria-hidden="true"
                onError={() => setImgFailed(true)}
                className="h-28 w-28 object-contain opacity-45"
            />
        )
    }

    switch (categoryKey) {
        case 'meatPoultry':
            return (
                <svg className="h-28 w-28 opacity-45" viewBox="0 0 120 120" fill="none">
                    <ellipse
                        cx="52"
                        cy="64"
                        rx="34"
                        ry="26"
                        transform="rotate(-20 52 64)"
                        fill="#E0A96D"
                    />
                    <rect
                        x="74"
                        y="38"
                        width="24"
                        height="12"
                        rx="6"
                        transform="rotate(-25 74 38)"
                        fill="#FDE68A"
                    />
                    <circle cx="96" cy="28" r="8" fill="#FEF3C7" />
                    <circle cx="101" cy="37" r="8" fill="#FEF3C7" />
                </svg>
            )
        case 'fishSeafood':
            return (
                <svg className="h-28 w-28 opacity-45" viewBox="0 0 120 120" fill="none">
                    <ellipse cx="60" cy="64" rx="14" ry="30" fill="#FB7185" />
                    <circle cx="34" cy="36" r="13" fill="#FDA4AF" />
                    <circle cx="86" cy="36" r="13" fill="#FDA4AF" />
                    <path d="M48 92 L72 92 L60 108 Z" fill="#F43F5E" />
                </svg>
            )
        case 'eggs':
            return (
                <svg className="h-28 w-28 opacity-50" viewBox="0 0 120 120" fill="none">
                    <ellipse cx="32" cy="56" rx="13" ry="19" fill="#FCD34D" />
                    <ellipse cx="60" cy="56" rx="13" ry="19" fill="#FBBF24" />
                    <ellipse cx="88" cy="56" rx="13" ry="19" fill="#FCD34D" />
                    <rect x="14" y="64" width="92" height="22" rx="8" fill="#D6D3D1" />
                </svg>
            )
        case 'vegetablesMushrooms':
            return (
                <svg className="h-28 w-28 opacity-50" viewBox="0 0 120 120" fill="none">
                    <ellipse cx="44" cy="62" rx="22" ry="30" fill="#86EFAC" />
                    <polygon points="82,24 96,94 68,94" fill="#FB923C" />
                    <line
                        x1="44"
                        y1="40"
                        x2="44"
                        y2="92"
                        stroke="#22C55E"
                        strokeWidth="4"
                    />
                </svg>
            )
        case 'fruits':
            return (
                <svg className="h-28 w-28 opacity-50" viewBox="0 0 120 120" fill="none">
                    <circle cx="42" cy="54" r="18" fill="#FDBA74" />
                    <circle cx="64" cy="60" r="16" fill="#BEF264" />
                    <path
                        d="M78 24 C96 42, 96 68, 74 78"
                        stroke="#FDE047"
                        strokeWidth="14"
                        strokeLinecap="round"
                    />
                    <path d="M20 72 Q60 106 100 72 Z" fill="#D6BFA7" />
                </svg>
            )
        case 'riceGrainsFlour':
            return (
                <svg className="h-28 w-28 opacity-50" viewBox="0 0 120 120" fill="none">
                    <line
                        x1="48"
                        y1="104"
                        x2="78"
                        y2="22"
                        stroke="#D97706"
                        strokeWidth="5"
                    />
                    <ellipse
                        cx="56"
                        cy="72"
                        rx="8"
                        ry="15"
                        transform="rotate(-30 56 72)"
                        fill="#F59E0B"
                    />
                    <ellipse
                        cx="66"
                        cy="52"
                        rx="8"
                        ry="15"
                        transform="rotate(-30 66 52)"
                        fill="#FBBF24"
                    />
                    <ellipse
                        cx="74"
                        cy="34"
                        rx="8"
                        ry="15"
                        transform="rotate(-30 74 34)"
                        fill="#FCD34D"
                    />
                </svg>
            )
        case 'noodlesPasta':
            return (
                <svg className="h-28 w-28 opacity-50" viewBox="0 0 120 120" fill="none">
                    <ellipse cx="60" cy="84" rx="38" ry="16" fill="#FDE68A" />
                    <circle cx="60" cy="76" r="20" fill="#F97316" />
                    <rect x="54" y="20" width="12" height="44" rx="4" fill="#FCD34D" />
                    <rect x="64" y="18" width="38" height="8" rx="4" fill="#D6D3D1" />
                </svg>
            )
        case 'beansNuts':
            return (
                <svg className="h-28 w-28 opacity-50" viewBox="0 0 120 120" fill="none">
                    <path
                        d="M24 88 C24 44, 64 24, 98 28 C94 64, 68 92, 24 88 Z"
                        fill="#86EFAC"
                    />
                    <circle cx="48" cy="68" r="10" fill="#4ADE80" />
                    <circle cx="66" cy="54" r="10" fill="#4ADE80" />
                    <circle cx="82" cy="40" r="9" fill="#4ADE80" />
                </svg>
            )
        case 'dairyProducts':
            return (
                <svg className="h-28 w-28 opacity-55" viewBox="0 0 120 120" fill="none">
                    <rect x="30" y="42" width="60" height="58" rx="6" fill="#93C5FD" />
                    <polygon points="30,42 60,20 90,42" fill="#BFDBFE" />
                    <rect x="44" y="54" width="32" height="24" rx="4" fill="#FFFFFF" />
                </svg>
            )
        case 'tofuVegetarian':
            return (
                <svg className="h-28 w-28 opacity-55" viewBox="0 0 120 120" fill="none">
                    <rect x="26" y="58" width="32" height="26" rx="4" fill="#FDBA74" />
                    <rect x="62" y="58" width="32" height="26" rx="4" fill="#FB923C" />
                    <rect x="44" y="34" width="32" height="24" rx="4" fill="#FED7AA" />
                    <path d="M16 84 L104 84 L92 100 L28 100 Z" fill="#67E8F9" />
                </svg>
            )
        case 'oilSpicesSauces':
            return (
                <svg className="h-28 w-28 opacity-50" viewBox="0 0 120 120" fill="none">
                    <rect x="28" y="44" width="28" height="56" rx="6" fill="#FDA4AF" />
                    <polygon points="36,44 42,22 48,44" fill="#F43F5E" />
                    <rect x="64" y="44" width="28" height="56" rx="6" fill="#FEF08A" />
                    <polygon points="72,44 78,22 84,44" fill="#EAB308" />
                </svg>
            )
        case 'processedCanned':
            return (
                <svg className="h-28 w-28 opacity-50" viewBox="0 0 120 120" fill="none">
                    <rect x="32" y="30" width="56" height="72" rx="10" fill="#F87171" />
                    <rect x="38" y="20" width="44" height="10" rx="4" fill="#FBBF24" />
                    <rect x="40" y="50" width="40" height="28" rx="4" fill="#FDE68A" />
                </svg>
            )
        case 'bakeryDesserts':
            return (
                <svg className="h-28 w-28 opacity-55" viewBox="0 0 120 120" fill="none">
                    <polygon points="24,62 92,38 92,88 24,88" fill="#FDE047" />
                    <rect x="24" y="72" width="68" height="10" fill="#FB923C" />
                    <circle cx="68" cy="36" r="10" fill="#F3F4F6" />
                </svg>
            )
        default:
            return (
                <svg className="h-28 w-28 opacity-50" viewBox="0 0 120 120" fill="none">
                    <rect x="22" y="46" width="24" height="50" rx="5" fill="#93C5FD" />
                    <rect x="48" y="42" width="26" height="54" rx="5" fill="#FDA4AF" />
                    <rect x="76" y="46" width="24" height="50" rx="5" fill="#BBF7D0" />
                </svg>
            )
    }
}
