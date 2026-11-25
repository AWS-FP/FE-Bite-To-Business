import { useEffect, useState } from 'react';

/**
 * Chờ khôi phục phiên đăng nhập mà không nói cho khách biết: thường xong trong vài trăm ms nên không hiện gì;
 * chỉ khi mạng chậm (quá 400 ms) mới hiện một vòng quay nhỏ, không có chữ.
 */
export default function QuietLoader() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => setVisible(true), 400);
        return () => window.clearTimeout(timer);
    }, []);

    return (
        <div role="status" aria-label="Loading" className="grid min-h-[60vh] place-items-center">
            {visible && (
                <span className="size-8 animate-spin rounded-full border-[3px] border-store-ink/15 border-t-store-green" />
            )}
        </div>
    );
}
