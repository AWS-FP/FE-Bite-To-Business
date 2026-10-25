import './AuthWordmark.css';

export default function AuthWordmark() {
    return (
        <div
            className="auth-wordmark brand-name pointer-events-none absolute inset-0 select-none"
            aria-hidden="true"
        >
            {/* Bite to: mỗi chữ cái có vị trí và chuyển động riêng trong file CSS. */}
            <div className="auth-wordmark-left absolute inset-y-0 left-6 w-[calc(50%_-_324px)]">
                <span className="auth-wordmark-letter">B</span>
                <span className="auth-wordmark-letter">i</span>
                <span className="auth-wordmark-letter">t</span>
                <span className="auth-wordmark-letter">e</span>
                <span className="auth-wordmark-letter">t</span>
                <span className="auth-wordmark-letter">o</span>
            </div>

            {/* Business */}
            <div className="auth-wordmark-right absolute inset-y-0 right-6 w-[calc(50%_-_324px)]">
                <span className="auth-wordmark-letter">B</span>
                <span className="auth-wordmark-letter">u</span>
                <span className="auth-wordmark-letter">s</span>
                <span className="auth-wordmark-letter">i</span>
                <span className="auth-wordmark-letter">n</span>
                <span className="auth-wordmark-letter">e</span>
                <span className="auth-wordmark-letter">s</span>
                <span className="auth-wordmark-letter">s</span>
            </div>
        </div>
    );
}
