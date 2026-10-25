import { useTranslation } from 'react-i18next'
import AuthJournal from './AuthJournal'
import AuthWordmark from './AuthWordmark'

// Chỉ chứa phần trang trí của trang đăng nhập.
export default function LoginDecoration() {
  const { t } = useTranslation()

  return (
    <>
      {/* Màn hình từ 1200px: ảnh và nội dung nằm hai bên form. */}
      <div
        className="auth-desktop-decoration pointer-events-none absolute inset-0 min-h-0 select-none max-[1200px]:hidden"
        aria-hidden="true"
      >
        <AuthWordmark />

        {/* Ảnh đồ uống bên trái. */}
        <div
          className="auth-photo absolute top-[65px] left-[6%] h-[252px] w-[184px] -rotate-6
          overflow-hidden rounded-t-[130px] border-4 border-solid border-auth-cream
          bg-[#dce1d5] shadow-[10px_10px_0_#17133a]"
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
          bg-[#e7d7c6] shadow-[10px_10px_0_#17133a]"
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
          bg-[#a0afa5] shadow-[10px_10px_0_#17133a]"
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
          bg-[#c9d5ac] shadow-[4px_4px_0_#17133a]"
        >
          <img
            src="/images/login/vegies.jpg"
            className="block h-full w-full object-cover"
            alt=""
            decoding="async"
          />
        </div>

        <div
          className="auth-photo absolute top-[540px] right-[22%] h-[120px] w-[120px] -rotate-[8deg]
          overflow-hidden rounded-[32px] border-4 border-solid border-auth-cream
          bg-[#ddd5b6] shadow-[10px_10px_0_#17133a]"
        >
          <img
            src="/images/login/snack.jpg"
            className="block h-full w-full object-cover"
            alt=""
            decoding="async"
          />
        </div>

        <div
          className="auth-fresh-sticker absolute top-[260px] left-[3%] grid h-24 w-24
          -rotate-[14deg] content-center rounded-full bg-[#ff9bd2] text-center font-label
          text-[11px] leading-[1.25] font-bold uppercase shadow-[4px_4px_0_#17133a]"
        >
          {t('auth.fresh')}
          <br />
          {t('auth.everyMorning')}
          <span className="mt-1">★</span>
        </div>

        {/* Khung Journal dùng chung, trang đăng nhập chỉ đặt vị trí. */}
        <AuthJournal className="top-[430px] left-[3%] w-[340px] origin-top-left scale-[0.84]" />

        {/* Ba bước dành cho Customer vừa gửi đăng ký. */}
        <aside
          className="auth-paper-note absolute top-[295px] right-[3%] w-[290px]
          origin-top-right rotate-2 scale-[0.86] bg-white px-6 pt-7 pb-6 shadow-[8px_8px_0_#17133a]"
        >
          <span className="absolute -top-3 left-[calc(50%_-_48px)] h-6 w-24 -rotate-3 bg-[#ff9bd2d9]" />
          <h2 className="m-0 font-subheading text-[24px] leading-[1.15] font-bold">
            {t('auth.loginNote.title')}
          </h2>

          <ol className="mt-5 mb-0 list-none p-0">
            <li className="flex items-baseline gap-3">
              <span className="auth-note-number font-display text-[24px] leading-none font-bold text-auth-green">
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
            <li className="mt-3 flex items-baseline gap-3 border-0 border-t border-dashed border-[#17133a25] pt-3">
              <span className="auth-note-number font-display text-[24px] leading-none font-bold text-auth-green">
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
            <li className="mt-3 flex items-baseline gap-3 border-0 border-t border-dashed border-[#17133a25] pt-3">
              <span className="auth-note-number font-display text-[24px] leading-none font-bold text-auth-green">
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

      {/* Màn hình nhỏ: ba ảnh và lời giới thiệu nằm phía trên form. */}
      <div
        className="auth-mobile-intro mx-auto hidden max-w-[540px] px-2 pt-3 pb-[14px]
          max-[1200px]:block max-[600px]:mx-5 max-[600px]:px-0"
        aria-hidden="true"
      >
        <div className="auth-mobile-photos mb-2.5 flex h-[76px] items-end gap-2.5">
          <div
            className="auth-photo h-[76px] w-[54px] -rotate-6 overflow-hidden rounded-t-[40px]
            border-2 border-solid border-auth-cream bg-[#dce1d5] shadow-[4px_4px_0_#17133a]"
          >
            <img
              src="/images/login/beverages.jpg"
              className="block h-full w-full object-cover"
              alt=""
              decoding="async"
            />
          </div>
          <div
            className="auth-photo h-10 w-[68px] rotate-6 overflow-hidden rounded-[50px]
            border-2 border-solid border-auth-cream bg-[#a0afa5] shadow-[4px_4px_0_#17133a]"
          >
            <img
              src="/images/login/porks.jpg"
              className="block h-full w-full object-cover"
              alt=""
              decoding="async"
            />
          </div>
          <div
            className="auth-photo h-[54px] w-[54px] overflow-hidden rounded-full
            border-2 border-solid border-auth-cream bg-[#e7d7c6] shadow-[4px_4px_0_#17133a]"
          >
            <img
              src="/images/login/fishes.jpg"
              className="block h-full w-full object-cover"
              alt=""
              decoding="async"
            />
          </div>
        </div>

        <p className="mt-0 mb-[5px] text-[11px] font-bold text-[#ff9bd2]">
          {t('auth.food')} | B2B Journal
        </p>
        <h2 className="m-0 max-w-[380px] font-display text-[19px] leading-[1.2] font-extrabold text-white">
          {t('auth.heroTitle')}
        </h2>
      </div>
    </>
  )
}
