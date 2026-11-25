import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/router/routes';

function useEnglish() {
    const { i18n } = useTranslation();
    return !!i18n.resolvedLanguage?.startsWith('en');
}

function ErrorLayout({ code, title, message, children }: {
    code: string; title: string; message: string; children: React.ReactNode;
}) {
    return (
        <main className="grid min-h-screen place-items-center bg-store-cream px-4 py-12 text-store-ink">
            <div className="w-full max-w-lg text-center">
                <Link to={ROUTES.HOME} className="mb-8 inline-flex items-center gap-3 no-underline">
                    <img src="/images/storefront/brand-logo.png" alt="Bite to Business" className="h-14 w-auto" />
                </Link>
                <p className="m-0 font-subheading text-7xl font-bold text-store-green">{code}</p>
                <h1 className="mb-3 mt-4 font-subheading text-2xl font-bold">{title}</h1>
                <p className="mx-auto mb-8 mt-0 max-w-md text-store-muted">{message}</p>
                <div className="flex flex-wrap justify-center gap-3">{children}</div>
            </div>
        </main>
    );
}

const primary = 'rounded-lg bg-store-green px-5 py-2.5 font-semibold text-white no-underline hover:opacity-90';
const secondary = 'rounded-lg border border-store-ink/20 bg-white px-5 py-2.5 font-semibold text-store-ink no-underline hover:bg-store-ink/5';

/** Đường dẫn không tồn tại. */
export function NotFoundPage() {
    const en = useEnglish();
    return (
        <ErrorLayout
            code="404"
            title={en ? 'Page not found' : 'Không tìm thấy trang'}
            message={en
                ? 'The page you are looking for does not exist or has been moved.'
                : 'Trang bạn tìm không tồn tại hoặc đã được chuyển sang địa chỉ khác.'}
        >
            <Link to={ROUTES.HOME} className={primary}>{en ? 'Back to home' : 'Về trang chủ'}</Link>
            <button type="button" className={secondary} onClick={() => window.history.back()}>
                {en ? 'Go back' : 'Quay lại'}
            </button>
        </ErrorLayout>
    );
}

/** Lỗi khi hiển thị trang (thay màn hình lỗi mặc định của React Router). Không hiện chi tiết kỹ thuật cho khách. */
export function RouteErrorPage() {
    const en = useEnglish();
    const error = useRouteError();
    if (isRouteErrorResponse(error) && error.status === 404) {
        return <NotFoundPage />;
    }
    // Sau khi deploy bản mới, file JS cũ có thể không còn: tải lại trang là đủ.
    const message = error instanceof Error ? error.message : '';
    const staleBundle = /dynamically imported module|Loading chunk|Failed to fetch/i.test(message);
    if (import.meta.env.DEV) {
        console.error(error);
    }
    return (
        <ErrorLayout
            code={staleBundle ? '↻' : '500'}
            title={staleBundle
                ? (en ? 'A new version is available' : 'Đã có phiên bản mới')
                : (en ? 'Something went wrong' : 'Đã có lỗi xảy ra')}
            message={staleBundle
                ? (en ? 'Please reload the page to continue.' : 'Vui lòng tải lại trang để tiếp tục.')
                : (en
                    ? 'We could not display this page. Please try again in a moment.'
                    : 'Chúng tôi chưa hiển thị được trang này. Bạn vui lòng thử lại sau ít phút.')}
        >
            <button type="button" className={primary} onClick={() => window.location.reload()}>
                {en ? 'Reload page' : 'Tải lại trang'}
            </button>
            <a href={ROUTES.HOME} className={secondary}>{en ? 'Back to home' : 'Về trang chủ'}</a>
        </ErrorLayout>
    );
}
