import { useExecutiveConfirmation } from '@/hooks/e-commerce/useExecutiveConfirmation';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { executiveApi } from '@/services/e-commerce/executiveAdminService';
import { executiveErrorMessage } from '@/services/e-commerce/executiveError';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';
import { useAuthStore } from '@/store/admin/authStore';

type ModerationInput = {
    id: string;
    action: 'HIDE' | 'RESTORE';
    reason?: string;
};

/** All review moderation state and destructive operations stay outside the UI component. */
export function useExecutiveReviews() {
    const tr = useExecutiveText();
    const confirm = useExecutiveConfirmation();
    const qc = useQueryClient();
    const ownUserId = useAuthStore((state) => state.session?.user?.id);
    const [status, setStatus] = useState('');
    const [stars, setStars] = useState('');
    const [page, setPage] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [failed, setFailed] = useState(false);

    const list = useQuery({
        queryKey: ['ecom', 'reviews', status, stars, page],
        queryFn: () =>
            executiveApi.reviews(status || undefined, stars ? Number(stars) : undefined, page, 20),
    });

    function notify(message: string, isError = false) {
        setFeedback(message);
        setFailed(isError);
    }

    const moderation = useMutation({
        mutationFn: ({ id, action, reason }: ModerationInput) =>
            executiveApi.moderateReview(id, action, reason),
        onSuccess: () => {
            notify(tr('Cập nhật đánh giá thành công.', 'Review moderation saved.'));
            void qc.invalidateQueries({ queryKey: ['ecom', 'reviews'] });
        },
        onError: (error) =>
            notify(
                executiveErrorMessage(error, tr('Không thể xử lý đánh giá.', 'Cannot moderate this review.')),
                true,
            ),
    });

    const deletion = useMutation({
        mutationFn: (id: string) => executiveApi.deleteReview(id),
        onSuccess: () => {
            notify(tr('Đã xóa đánh giá vĩnh viễn.', 'Review permanently deleted.'));
            // Avoid leaving users on an empty trailing page after deleting its last review.
            if (page > 0 && list.data?.items.length === 1) setPage(page - 1);
            void qc.invalidateQueries({ queryKey: ['ecom', 'reviews'] });
        },
        onError: (error) =>
            notify(
                executiveErrorMessage(error, tr('Không thể xóa đánh giá.', 'Cannot delete this review.')),
                true,
            ),
    });

    const busy = moderation.isPending || deletion.isPending;

    function changeStatus(value: string) {
        setStatus(value);
        setPage(0);
    }

    function changeStars(value: string) {
        setStars(value);
        setPage(0);
    }

    function hide(id: string) {
        if (busy) return;
        void confirm(tr('Ẩn đánh giá khỏi khách hàng?', 'Hide this review from customers?'),
            reason => moderation.mutateAsync({ id, action: 'HIDE', reason }),
            { title: tr('Ẩn đánh giá', 'Hide review'), reasonLabel: tr('Lý do ẩn (bắt buộc)', 'Reason (required)') });
    }

    function restore(id: string) {
        if (busy) return;
        void confirm(tr('Hiển thị lại đánh giá này?', 'Make this review visible again?'),
            () => moderation.mutateAsync({ id, action: 'RESTORE' }));
    }

    function remove(id: string) {
        if (busy) return;
        void confirm(tr(
            'Xóa vĩnh viễn đánh giá này? Không thể khôi phục sau khi xóa. Nếu chỉ muốn ẩn khỏi khách hàng, hãy chọn “Ẩn đánh giá”.',
            'Permanently delete this review? This cannot be undone. Use "Hide review" to remove it from public view temporarily.',
        ), () => deletion.mutateAsync(id), { danger: true, title: tr('Xóa đánh giá', 'Delete review') });
    }

    return {
        tr, ownUserId, status, stars, page, setPage, feedback, failed, list, busy,
        changeStatus, changeStars, hide, restore, remove,
    };
}
