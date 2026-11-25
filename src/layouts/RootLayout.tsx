import { Outlet, ScrollRestoration } from 'react-router-dom';
import { useInteractionTracking } from '@/a2ui/telemetry/useInteractionTracking';
import { useA2uiActions } from '@/a2ui/runtime/useA2uiActions';

/** Mở trang mới thì cuộn lên đầu; bấm Back thì quay lại đúng vị trí cũ. */
export default function RootLayout() {
    // Tín hiệu hành vi cho cá nhân hóa giao diện (tắt được ở khung trợ lý).
    useInteractionTracking();
    // Action từ giao diện AI (chat và trang) đi qua router/giỏ hàng thật.
    useA2uiActions();
    return (
        <>
            <Outlet />
            <ScrollRestoration />
        </>
    );
}
