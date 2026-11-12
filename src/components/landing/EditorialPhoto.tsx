import { useEffect, useState, type ImgHTMLAttributes } from 'react';

/**
 * Ảnh biên tập cho các trang giới thiệu, không phải ảnh kho/đối tác của BTB.
 * Ưu tiên /public/images/editorial; nếu chưa tải ảnh về sẽ dùng link Unsplash,
 * cuối cùng là ảnh sẵn có trong dự án để không bị khung trắng.
 */
export const EDITORIAL_PHOTOS = {
    warehouse: { local: '/images/editorial/warehouse.jpg', online: 'https://images.unsplash.com/photo-1769355104335-acef3aa4c9b6?fit=crop&fm=jpg&w=1600&q=80', fallback: '/images/register/canned-food.jpg' },
    market: { local: '/images/editorial/market.jpg', online: 'https://images.unsplash.com/photo-1724908097678-1cb50ee5e352?fit=crop&fm=jpg&w=1600&q=80', fallback: '/images/email/fresh-produce.png' },
    produce: { local: '/images/editorial/produce.jpg', online: 'https://images.unsplash.com/photo-1771659753573-e8498a262168?fit=crop&fm=jpg&w=1600&q=80', fallback: '/images/email/fresh-produce.png' },
    seafood: { local: '/images/editorial/seafood.jpg', online: 'https://images.unsplash.com/photo-1772654271379-484eeabecc37?fit=crop&fm=jpg&w=1600&q=80', fallback: '/images/email/fresh-seafood.png' },
    kitchen: { local: '/images/editorial/kitchen.jpg', online: 'https://images.unsplash.com/photo-1775403834271-619d9a264f0e?fit=crop&fm=jpg&w=1600&q=80', fallback: '/images/register/chicken-boil.jpg' },
    chef: { local: '/images/editorial/chef.jpg', online: 'https://images.unsplash.com/photo-1776353744117-9e8595e8092c?fit=crop&fm=jpg&w=1600&q=80', fallback: '/images/register/ham.jpg' },
    vegetables: { local: '/images/editorial/vegetables.jpg', online: 'https://images.unsplash.com/photo-1761567523932-6c461c249729?fit=crop&fm=jpg&w=1600&q=80', fallback: '/images/login/vegies.jpg' },
} as const;

export type EditorialPhotoKey = keyof typeof EDITORIAL_PHOTOS;
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onError'> & {
    photo: EditorialPhotoKey;
};

export default function EditorialPhoto({ photo, alt = '', ...props }: Props) {
    const [attempt, setAttempt] = useState(0);
    useEffect(() => setAttempt(0), [photo]);
    const item = EDITORIAL_PHOTOS[photo];
    const choices = [item.local, item.online, item.fallback];

    return (
        <img
            {...props}
            src={choices[attempt]}
            alt={alt}
            onError={() => setAttempt((current) => Math.min(current + 1, choices.length - 1))}
        />
    );
}
