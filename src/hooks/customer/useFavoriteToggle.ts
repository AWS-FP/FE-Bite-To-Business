import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/admin/authStore';
import { addFavorite, favoriteStatuses, removeFavorite } from '@/services/customer/favoriteService';

/**
 * Trạng thái yêu thích của một sản phẩm cho Customer đang đăng nhập.
 * Trạng thái của mọi thẻ trên trang được gom thành một request (favoriteStatuses là batch loader).
 */
export function useFavoriteToggle(productId: string) {
    const navigate = useNavigate();
    const customer = useAuthStore((state) => state.session?.user.role === 'CUSTOMER');
    const [favorite, setFavorite] = useState(false);
    const [pending, setPending] = useState(false);

    useEffect(() => {
        if (!customer) return;
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
    }, [customer, productId]);

    // Khách chưa đăng nhập được chuyển tới trang đăng nhập.
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
            // Giữ nguyên trạng thái server đã xác nhận gần nhất.
        } finally {
            setPending(false);
        }
    };

    return { favorite, pending, toggle };
}
