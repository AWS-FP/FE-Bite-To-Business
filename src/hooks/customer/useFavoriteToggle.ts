import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/admin/authStore';
import { addFavorite, favoriteStatuses, removeFavorite } from '@/services/customer/favoriteService';

/**
 * Trạng thái yêu thích của một sản phẩm cho Customer đang đăng nhập.
 * Trạng thái của mọi thẻ trên trang được gom thành một request (favoriteStatuses là batch loader).
 */
export function useFavoriteToggle(productId: string, knownFavorite?: boolean, onRemoved?: (id: string) => void) {
    const navigate = useNavigate();
    const customer = useAuthStore((state) => state.session?.user.role === 'CUSTOMER');
    const [favorite, setFavorite] = useState(knownFavorite ?? false);
    const [pending, setPending] = useState(false);

    const inFlight = useRef(false);

    useEffect(() => {
        if (!customer || knownFavorite !== undefined) return;
        let current = true;
        favoriteStatuses
            .get(productId)
            .then((liked) => {
                if (current) setFavorite(liked);
            })
            .catch(() => {});
        return () => {
            current = false;
        };
    }, [customer, productId, knownFavorite]);

    // Khách chưa đăng nhập được chuyển tới trang đăng nhập.
    const toggle = async () => {
        if (!customer) {
            navigate('/login');
            return;
        }
        if (inFlight.current) return;
        inFlight.current = true;
        setPending(true);
        try {
            const wasFavorite = knownFavorite ?? favorite;
            if (wasFavorite) await removeFavorite(productId);
            else await addFavorite(productId);
            setFavorite(!wasFavorite);
            if (wasFavorite) onRemoved?.(productId);
        } catch {
            // Giữ nguyên trạng thái server đã xác nhận gần nhất.
        } finally {
            inFlight.current = false;
            setPending(false);
        }
    };

    return { favorite: knownFavorite ?? favorite, pending, toggle };
}
