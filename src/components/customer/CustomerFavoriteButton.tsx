import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/admin/authStore';
import {
    addFavorite,
    getFavoriteStatus,
    removeFavorite,
} from '@/services/customer/favoriteService';

/** Customer favorite action for public product tiles; logged-out visitors go to login. */
export default function CustomerFavoriteButton({ productId }: { productId: string }) {
    const { t } = useTranslation('storefront');
    const navigate = useNavigate();
    const customer = useAuthStore((state) => state.session?.user.role === 'CUSTOMER');
    const [favorite, setFavorite] = useState(false);
    const [pending, setPending] = useState(false);

    useEffect(() => {
        if (!customer) return;
        let current = true;
        getFavoriteStatus(productId)
            .then((status) => {
                if (current) setFavorite(status.favorite);
            })
            .catch(() => {});
        return () => {
            current = false;
        };
    }, [customer, productId]);

    const toggle = async () => {
        if (!customer) {
            navigate('/login');
            return;
        }
        if (pending) return;
        setPending(true);
        try {
            if (favorite) await removeFavorite(productId);
            else await addFavorite(productId);
            setFavorite((current) => !current);
        } catch {
            // Preserve the last confirmed server state.
        } finally {
            setPending(false);
        }
    };

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={pending}
            aria-pressed={favorite}
            aria-label={t(favorite ? 'customerUI.removeFavorite' : 'customerUI.addFavorite')}
            className={`absolute right-2.5 top-2.5 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-store-line bg-white/95 shadow-sm transition hover:scale-110 hover:bg-store-yellow disabled:cursor-wait disabled:opacity-60 ${favorite ? 'text-red-500' : 'text-store-green'}`}
        >
            <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
        </button>
    );
}
