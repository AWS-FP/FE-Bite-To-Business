import { Outlet, ScrollRestoration } from 'react-router-dom';

/** Mở trang mới thì cuộn lên đầu; bấm Back thì quay lại đúng vị trí cũ. */
export default function RootLayout() {
    return (
        <>
            <Outlet />
            <ScrollRestoration />
        </>
    );
}
