import { Outlet, ScrollRestoration } from 'react-router-dom';
import { useInteractionTracking } from '@/a2ui/telemetry/useInteractionTracking';

/** Mở trang mới thì cuộn lên đầu; bấm Back thì quay lại đúng vị trí cũ. */
export default function RootLayout() {
    // Tín hiệu hành vi cho cá nhân hóa giao diện (tắt được ở khung trợ lý).
    useInteractionTracking();
    return (
        <>
            <Outlet />
            <ScrollRestoration />
        </>
    );
}
