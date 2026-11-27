import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFavoriteToggle } from '@/hooks/customer/useFavoriteToggle';
import { useStorefrontPurchaseAccess } from '@/hooks/customer/useStorefrontPurchaseAccess';

/** Customer favorite action for public product tiles; logged-out visitors go to login. */
export default function CustomerFavoriteButton({ productId }: { productId: string }) {
    const { t } = useTranslation('storefront');
    const purchaseAllowed = useStorefrontPurchaseAccess();
    const { favorite, pending, toggle } = useFavoriteToggle(productId);

    if (!purchaseAllowed) return null;

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
