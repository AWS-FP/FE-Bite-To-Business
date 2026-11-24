import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { acceptPackageReturn, getPackageReturns, rejectPackageReturn } from '@/services/admin/packageReturnService';
import type { PackageReturnStatus } from '@/types/admin/packageReturn';

/** Danh sách yêu cầu trả hàng cho Admin, chọn một yêu cầu để xem form và chấp nhận / từ chối. */
export function usePackageReturns() {
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<PackageReturnStatus | ''>('REQUESTED');
    const [page, setPage] = useState(0);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ message: string; error: boolean } | null>(null);

    const list = useQuery({
        queryKey: ['admin', 'package-returns', status, page],
        queryFn: ({ signal }) => getPackageReturns(status || undefined, page, signal),
    });
    const selected = list.data?.content.find((item) => item.id === selectedId) ?? null;

    const decide = useMutation({
        mutationFn: (input: { id: string; accept: boolean; note?: string }) =>
            input.accept ? acceptPackageReturn(input.id) : rejectPackageReturn(input.id, input.note ?? ''),
        onSuccess: (_, input) => {
            setFeedback({
                message: input.accept
                    ? 'Đã chấp nhận trả hàng: hàng đã được nhập lại kho và khách sẽ nhận email.'
                    : 'Đã từ chối yêu cầu trả hàng và báo cho khách.',
                error: false,
            });
            setSelectedId(null);
            void queryClient.invalidateQueries({ queryKey: ['admin', 'package-returns'] });
        },
        onError: () => {
            setFeedback({ message: 'Không xử lý được yêu cầu. Có thể yêu cầu đã được xử lý trước đó.', error: true });
            void queryClient.invalidateQueries({ queryKey: ['admin', 'package-returns'] });
        },
    });

    function changeStatus(next: PackageReturnStatus | '') {
        setStatus(next);
        setPage(0);
        setSelectedId(null);
    }

    return { status, changeStatus, page, setPage, list, selected, setSelectedId, decide, feedback };
}
