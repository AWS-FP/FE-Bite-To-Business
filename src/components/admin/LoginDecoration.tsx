import { useTranslation } from 'react-i18next';
import AuthJournal from './AuthJournal';
import AuthWordmark from './AuthWordmark';
import AuthFreshSticker from './AuthFreshSticker';

// Chỉ chứa phần trang trí của trang đăng nhập.
export default function LoginDecoration() {
    const { t } = useTranslation();

    return (
        <>
            {/* Màn hình từ 1200px: ảnh và nội dung nằm hai bên form. */}
            <div
                className="auth-desktop-decoration pointer-events-none relative col-start-1 row-start-1 min-h-[900px] select-none max-[1200px]:hidden"
                aria-hidden="true"
            >
                <AuthWordmark />

                {/* Ảnh đồ uống bên trái. */}
                <div
                    className="auth-photo absolute top-[65px] left-[6%] h-[252px] w-[184px] -rotate-6
 overflow-hidden rounded-t-[130px] border-4 border-solid border-auth-cream
 bg-surface-green shadow-[10px_10px_0_var(--color-auth-ink)]"
                >
                    <img
                        src="/images/login/beverages.jpg"
                        className="block h-full w-full object-cover"
                        alt=""
                        decoding="async"
                    />
                </div>

                {/* Ảnh cá trong khung tròn. */}
                <div
                    className="auth-photo absolute top-[255px] left-[17%] h-[142px] w-[142px]
 overflow-hidden rounded-full border-4 border-solid border-auth-cream
 bg-warning-soft shadow-[10px_10px_0_var(--color-auth-ink)]"
                >
                    <img
                        src="/images/login/fishes.jpg"
                        className="block h-full w-full object-cover"
                        alt=""
                        decoding="async"
                    />
                </div>

                {/* Ảnh thịt và rau bên phải. */}
                <div
                    className="auth-photo absolute top-[90px] right-[6%] h-[126px] w-[218px] rotate-[8deg]
 overflow-hidden rounded-[100px] border-4 border-solid border-auth-cream
 bg-surface-soft shadow-[10px_10px_0_var(--color-auth-ink)]"
                >
                    <img
                        src="/images/login/porks.jpg"
                        className="block h-full w-full object-cover"
                        alt=""
                        decoding="async"
                    />
                </div>

                <div
                    className="auth-photo absolute top-[60px] right-[19%] h-[94px] w-[94px]
 overflow-hidden rounded-full border-4 border-solid border-auth-cream
 bg-store-mint shadow-[4px_4px_0_var(--color-auth-ink)]"
                >
                    <img
                        src="/images/login/vegies.jpg"
                        className="block h-full w-full object-cover"
                        alt=""
                        decoding="async"
                    />
                </div>

                <div
                    className="auth-photo absolute top-[170px] right-[1%] h-[100px] w-[100px] -rotate-[8deg]
 overflow-hidden rounded-[32px] border-4 border-solid border-auth-cream
 bg-store-yellow shadow-[10px_10px_0_var(--color-auth-ink)]"
                >
                    <img
                        src="/images/login/snack.jpg"
                        className="block h-full w-full object-cover"
                        alt=""
                        decoding="async"
                    />
                </div>

                <AuthFreshSticker className="top-[270px] left-[3%]" />

                {/* Khung Journal dùng chung, trang đăng nhập chỉ đặt vị trí. */}
                <AuthJournal className="top-[430px] left-[3%] w-[340px] origin-top-left scale-[0.84]" />

                {/* Ba bước dành cho Customer vừa gửi đăng ký. */}
                <aside
                    className="auth-paper-note absolute top-[295px] right-[3%] w-[320px]
 origin-top-right rotate-2 scale-[0.86] border-2 border-auth-ink bg-white px-7 pt-9 pb-9 shadow-[8px_8px_0_var(--color-auth-ink)]"
                >
                    <span className="absolute -top-3 left-[calc(50%_-_48px)] h-6 w-24 -rotate-3 bg-store-pink/85" />
                    <span className="absolute right-0 bottom-0 h-2 w-16 bg-store-yellow" />
                    <h2 className="m-0 whitespace-nowrap font-subheading text-[17px] leading-[1.3] font-bold">
                        {t('auth.loginNote.title')}
                    </h2>

                    <ol className="mt-7 mb-0 list-none p-0">
                        <li className="flex items-start gap-3">
                            <span className="auth-note-number w-8 shrink-0 font-display text-[24px] leading-6 font-bold text-auth-green">
                                01
                            </span>
                            <div>
                                <strong className="block font-subheading text-[13px] leading-5">
                                    {t('auth.loginNote.step1')}
                                </strong>
                                <p className="mt-0.5 mb-0 font-subtext text-[11px] leading-[1.5] text-auth-muted">
                                    {t('auth.loginNote.detail1')}
                                </p>
                            </div>
                        </li>
                        <li className="mt-5 flex items-start gap-3 border-0 border-t border-dashed border-auth-ink/15 pt-5">
                            <span className="auth-note-number w-8 shrink-0 font-display text-[24px] leading-6 font-bold text-auth-green">
                                02
                            </span>
                            <div>
                                <strong className="block font-subheading text-[13px] leading-5">
                                    {t('auth.loginNote.step2')}
                                </strong>
                                <p className="mt-0.5 mb-0 font-subtext text-[11px] leading-[1.5] text-auth-muted">
                                    {t('auth.loginNote.detail2')}
                                </p>
                            </div>
                        </li>
                        <li className="mt-5 flex items-start gap-3 border-0 border-t border-dashed border-auth-ink/15 pt-5">
                            <span className="auth-note-number w-8 shrink-0 font-display text-[24px] leading-6 font-bold text-auth-green">
                                03
                            </span>
                            <div>
                                <strong className="block font-subheading text-[13px] leading-5">
                                    {t('auth.loginNote.step3')}
                                </strong>
                                <p className="mt-0.5 mb-0 font-subtext text-[11px] leading-[1.5] text-auth-muted">
                                    {t('auth.loginNote.detail3')}
                                </p>
                            </div>
                        </li>
                    </ol>
                </aside>
            </div>
        </>
    );
}
