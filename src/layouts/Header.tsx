import { ChevronDown } from 'lucide-react';
import type { FormEvent, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { getRoleHome, ROUTES } from '@/router/routes';
import useSearchHistory from '@/hooks/useSearchHistory';
import {
    dryCategoryKeys,
    freshCategoryKeys,
    getCatalogSearchPath,
} from '@/constants/catalogNavigation';
import { useAuthStore } from '@/store/admin/authStore';
import LanguageSwitcher from '@/components/LanguageSwitcher';


import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import CategoryMegaMenu from '@/components/CategoryMegaMenu';



// Khu vực giao hàng, tài liệu và bộ chọn ngôn ngữ.
function StoreUtilityBar() {
    const { t } = useTranslation('storefront');
    const [deliveryArea, setDeliveryArea] = useState('ho-chi-minh');

    return (
        <div className="border-0 border-b border-solid border-store-cream/15 bg-store-dark">
            <div className="mx-auto flex min-h-[40px] max-w-[1440px] flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-5 py-1.5 text-[11px] leading-[1.5] max-[640px]:px-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 rounded-full border border-solid border-store-cream/20 bg-white/8 px-2 text-white">
                        <img
                            className="block shrink-0"
                            src="/images/storefront/map-pin.svg"
                            alt=""
                        />
                        <label
                            className="whitespace-nowrap max-[640px]:sr-only"
                            htmlFor="store-delivery-area"
                        >
                            {t('header.deliveryArea')}
                        </label>
                        <div className="relative">
                            <select
                                className="h-8 w-[140px] cursor-pointer appearance-none rounded-full border-0 bg-transparent pr-5 text-[11px] font-extrabold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-yellow"
                                id="store-delivery-area"
                                value={deliveryArea}
                                onChange={(event) => setDeliveryArea(event.target.value)}
                            >
                                <option className="bg-white text-store-ink" value="ho-chi-minh">
                                    {t('header.city')}
                                </option>
                                <option className="bg-white text-store-ink" value="ha-noi">
                                    {t('header.hanoi')}
                                </option>
                            </select>
                            <ChevronDown
                                className="pointer-events-none absolute top-2.5 right-0.5"
                                size={12}
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                    <p className="m-0 hidden items-center gap-1.5 font-bold text-store-yellow min-[1100px]:flex">
                        <img className="block shrink-0" src="/images/storefront/clock.svg" alt="" />
                        {t('header.deliveryNotice')}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Chưa có file bảng giá để tải: khóa nút thay vì trỏ đến file không tồn tại. */}
                    <span
                        className="hidden min-[1280px]:inline-flex"
                        title={t('header.notAvailable')}
                    >
                        <button
                            className="flex items-center gap-2 border-0 bg-transparent p-0 text-store-cream/75 disabled:cursor-not-allowed"
                            type="button"
                            disabled
                        >
                            <img
                                className="block shrink-0"
                                src="/images/storefront/file.svg"
                                alt=""
                            />
                            {t('header.priceList')}
                        </button>
                    </span>
                    <a
                        className="hidden items-center gap-2 text-store-cream/85 no-underline hover:text-store-yellow min-[1440px]:flex"
                        href="/documents/TCVN11892-1_2017_916963.pdf"
                        download="TCVN11892-1_2017_916963.pdf"
                    >
                        <img
                            className="block shrink-0"
                            src="/images/storefront/shield.svg"
                            alt=""
                        />
                        {t('header.certifications')}
                    </a>
                    <LanguageSwitcher />
                </div>
            </div>
        </div>
    );
}

// Ô tìm kiếm, chọn danh mục và lịch sử tìm kiếm.
function StoreSearch() {
    const { t } = useTranslation('storefront');
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [categoryKey, setCategoryKey] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const { history, isLoadingHistory, isHistoryUnavailable, recordSearch } = useSearchHistory();
    const categoryKeys = [...freshCategoryKeys, ...dryCategoryKeys];

    async function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSearching) return;

        // Chọn nhóm là thêm từ khóa vào tìm kiếm; chưa giả lập filter bằng ID danh mục.
        let searchText = keyword.trim();
        if (categoryKey) {
            searchText = `${t(`categories.${categoryKey}`)} ${searchText}`.trim();
        }
        searchText = searchText.replace(/\s+/gu, ' ').trim();
        if (!searchText) return;

        await searchFor(searchText);
    }

    async function searchFor(searchText: string) {
        if (isSearching) return;
        setIsSearching(true);
        try {
            // Lưu xong rồi chuyển trang; lỗi lưu lịch sử vẫn cho tìm kiếm bình thường.
            const canNavigate = await recordSearch(searchText);
            if (canNavigate) navigate(getCatalogSearchPath(searchText));
        } finally {
            setIsSearching(false);
        }
    }

    async function handleHistoryClick(event: MouseEvent<HTMLAnchorElement>, searchText: string) {
        // Giữ hành vi mở tab mới khi dùng Ctrl/Cmd+click.
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0)
            return;
        event.preventDefault();
        await searchFor(searchText);
    }

    return (
        <div className="min-w-0 flex-1 max-[960px]:order-3 max-[960px]:basis-full">
            <form
                className="flex h-[46px] min-w-0 items-center rounded-full border-2 border-solid border-store-ink bg-[#fffdf9] shadow-[3px_3px_0_#14132b]"
                role="search"
                aria-label={t('search.label')}
                onSubmit={handleSearch}
            >
                <div className="relative ml-2 hidden w-[116px] shrink-0 border-0 border-r border-solid border-store-ink/20 pr-1.5 min-[640px]:block">
                    <select
                        className="h-7 w-full min-w-0 cursor-pointer appearance-none truncate border-0 bg-transparent pr-4 text-[10px] font-bold text-store-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-green"
                        aria-label={t('search.category')}
                        value={categoryKey}
                        onChange={(event) => setCategoryKey(event.target.value)}
                    >
                        <option value="">{t('search.allCategories')}</option>
                        {categoryKeys.map((key) => (
                            <option key={key} value={key}>
                                {t(`categories.${key}`)}
                            </option>
                        ))}
                    </select>
                    <img
                        className="pointer-events-none absolute top-[7px] right-1.5 block"
                        src="/images/storefront/chevron-down.svg"
                        alt=""
                    />
                </div>

                <input
                    className="h-9 min-w-0 flex-1 rounded-full border-0 bg-transparent px-2.5 text-[12px] text-store-ink outline-none placeholder:text-[#7a7d85] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-store-green"
                    type="search"
                    name="q"
                    aria-label={t('search.label')}
                    placeholder={t('search.placeholder')}
                    maxLength={100}
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />

                <button
                    className="flex h-full shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-r-full border-0 border-l-2 border-solid border-store-ink bg-store-yellow px-3.5 text-[12px] font-extrabold text-store-ink transition-colors hover:bg-[#ffe96d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-wait disabled:opacity-70 max-[640px]:px-3"
                    type="submit"
                    aria-label={t('search.submit')}
                    disabled={isSearching}
                    aria-busy={isSearching}
                >
                    <img className="block shrink-0" src="/images/storefront/search.svg" alt="" />
                    <span className="max-[640px]:hidden">{t('search.submit')}</span>
                </button>
            </form>

            <div
                className="mt-2 flex min-h-[20px] items-center gap-1.5 overflow-x-auto px-2 text-[11px] leading-[1.5] [scrollbar-width:thin]"
                aria-label={t('search.history')}
            >
                <span className="shrink-0 text-store-cream/75">{t('search.history')}</span>
                {isLoadingHistory && (
                    <span className="shrink-0 text-store-cream/60" role="status">
                        · {t('search.loadingHistory')}
                    </span>
                )}
                {isHistoryUnavailable && (
                    <span className="shrink-0 text-store-cream/60" role="status">
                        · {t('search.historyUnavailable')}
                    </span>
                )}
                {!isLoadingHistory && !isHistoryUnavailable && history.length === 0 && (
                    <span className="shrink-0 text-store-cream/60">
                        · {t('search.emptyHistory')}
                    </span>
                )}
                {history.map((searchText) => (
                    <Link
                        className="shrink-0 rounded-full border border-solid border-white/15 bg-white/10 px-2 py-0.5 text-store-cream no-underline hover:bg-white/20"
                        key={searchText}
                        to={getCatalogSearchPath(searchText)}
                        onClick={(event) => handleHistoryClick(event, searchText)}
                    >
                        {searchText}
                    </Link>
                ))}
            </div>
        </div>
    );
}

// Giỏ hàng và tài khoản đăng nhập.
function StoreAccountActions() {
    const { t } = useTranslation('storefront');
    const session = useAuthStore((state) => state.session);
    const user = session?.user;

    let accountPath: string = ROUTES.LOGIN;
    let accountLabel = t('header.login');
    let initials = '';
    if (user) {
        const displayName = `${user.lastName} ${user.firstName}`.trim() || user.email;
        accountLabel = t('header.account', { name: displayName });
        accountPath = getRoleHome(user.role);
        if (user.role === 'CUSTOMER') accountPath = ROUTES.PROFILE;
        initials = `${user.lastName.charAt(0)}${user.firstName.charAt(0)}`.toUpperCase();
        if (!initials) initials = user.email.charAt(0).toUpperCase();
    }

    return (
        <div className="flex shrink-0 items-center gap-2 max-[960px]:ml-auto max-[640px]:gap-1.5">
            <Link
                className="hidden min-h-[40px] items-center justify-center rounded-full border-2 border-solid border-store-ink bg-store-yellow px-3 text-[12px] font-bold text-store-ink no-underline shadow-[2px_2px_0_#14132b] hover:bg-[#ffe96d] min-[1536px]:flex"
                to={user ? accountPath : ROUTES.REGISTER}
            >
                {t('header.wholesale')}
            </Link>

            {/* Tổng tiền và số lượng sẽ lấy từ API Quote; chưa có dữ liệu thì không hiện số giả. */}
            <Link
                className="flex min-h-[42px] items-center justify-center rounded-full border-2 border-solid border-store-ink bg-store-cream px-2.5 text-store-ink no-underline shadow-[2px_2px_0_#14132b] hover:bg-white max-[640px]:min-h-[44px] max-[640px]:px-2"
                to={ROUTES.QUOTES}
                aria-label={t('header.quote')}
            >
                <img className="block shrink-0" src="/images/storefront/cart.svg" alt="" />
            </Link>

            {!user && (
                <div className="flex shrink-0 items-center gap-1.5">
                    <Link
                        className="store-sign-up flex min-h-[40px] items-center justify-center rounded-full border-2 border-solid border-store-ink bg-[#7EBC89] px-3 text-[12px] font-bold whitespace-nowrap text-store-ink no-underline shadow-[2px_2px_0_#14132b] hover:bg-[#91c99b] max-[640px]:min-h-[44px] max-[640px]:px-2"
                        to={ROUTES.REGISTER}
                    >
                        {t('header.register')}
                    </Link>
                    <Link
                        className="store-sign-in flex min-h-[40px] items-center justify-center rounded-full border-2 border-solid border-store-ink bg-store-cream px-3 text-[12px] font-bold whitespace-nowrap text-store-ink no-underline shadow-[2px_2px_0_#14132b] hover:bg-white max-[640px]:min-h-[44px] max-[640px]:px-2"
                        to={ROUTES.LOGIN}
                    >
                        {t('header.login')}
                    </Link>
                </div>
            )}

            {user && (
                <Link
                    className="flex size-[40px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-solid border-store-ink bg-store-cream text-[13px] font-extrabold text-store-green no-underline shadow-[2px_2px_0_#14132b] hover:bg-white"
                    to={accountPath}
                    aria-label={accountLabel}
                    title={accountLabel}
                >
                    {user.avatarUrl && (
                        <img
                            className="block size-full object-cover"
                            src={user.avatarUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                        />
                    )}
                    {!user.avatarUrl && <span>{initials}</span>}
                </Link>
            )}
        </div>
    );
}

// Thanh điều hướng danh mục và các nhóm sản phẩm.

function StoreNavigation() {
  const { t } = useTranslation('storefront');

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] =
    useState(false);

  const [menuTop, setMenuTop] = useState(0);

  const navRef = useRef<HTMLElement>(null);
  const categoryButtonRef = useRef<HTMLButtonElement>(null);

  // Mở/đóng Mega Menu ngay trên trang hiện tại
  function toggleCategoryMenu() {
    const bottom =
      navRef.current?.getBoundingClientRect().bottom ?? 0;

    setMenuTop(bottom);
    setIsCategoryMenuOpen((current) => !current);
  }

  // Đóng menu và trả focus về nút mở
  const closeCategoryMenu = useCallback(() => {
    setIsCategoryMenuOpen(false);
    categoryButtonRef.current?.focus();
  }, []);

  // Cập nhật vị trí Mega Menu khi resize hoặc scroll
  useEffect(() => {
    if (!isCategoryMenuOpen) return;

    function updatePosition() {
      const bottom =
        navRef.current?.getBoundingClientRect().bottom ?? 0;

      setMenuTop(bottom);
    }

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener(
        'scroll',
        updatePosition,
        true
      );
    };
  }, [isCategoryMenuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="border-0 border-t border-solid border-store-cream/10 bg-store-dark/75"
        aria-label={t('header.navigation')}
      >
        <div className="mx-auto flex min-h-[48px] max-w-[1440px] items-center gap-4 px-5 py-1.5 max-[640px]:gap-3 max-[640px]:px-3">

          {/* Nút mở danh mục */}
          <button
            ref={categoryButtonRef}
            type="button"
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border-2 border-solid border-store-ink bg-store-yellow px-3 py-1.5 text-[12px] font-extrabold text-store-ink shadow-[2px_2px_0_#14132b] hover:bg-[#ffe96d] max-[640px]:px-2.5 max-[640px]:text-[11px]"
            aria-haspopup="dialog"
            aria-expanded={isCategoryMenuOpen}
            aria-controls={
              isCategoryMenuOpen
                ? 'btb-category-mega-menu'
                : undefined
            }
            onClick={toggleCategoryMenu}
          >
            <img
              className="block shrink-0"
              src="/images/storefront/menu.svg"
              width={16}
              height={16}
              alt=""
            />

            {t('header.categories')}
          </button>

          {/* Các liên kết Header giữ nguyên */}
          <div className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto py-1.5 text-[12px] leading-[1.5] whitespace-nowrap [scrollbar-width:thin]">

            <Link
              className="text-store-cream no-underline hover:text-store-yellow"
              to={`${ROUTES.CATALOG}?sale=true`}
            >
              {t('header.deals')}
            </Link>

            <Link
              className="text-store-cream no-underline hover:text-store-yellow"
              to={ROUTES.CATALOG}
            >
              {t('header.standardFood')}
            </Link>

            <Link
              className="text-store-cream no-underline hover:text-store-yellow"
              to={`${ROUTES.CATALOG}?type=combo`}
            >
              {t('header.combos')}
            </Link>
          </div>

          {/* Thông điệp VAT */}
          <span className="ml-auto hidden shrink-0 items-center gap-1.5 text-[12px] font-semibold text-[#f490b1] min-[1440px]:flex">
            {t('header.invoice')}

            <img
              className="block shrink-0"
              src="/images/storefront/arrow-right.svg"
              alt=""
            />
          </span>
        </div>
      </nav>

      {/* Mega Menu hiển thị trên trang hiện tại */}
      <CategoryMegaMenu
        open={isCategoryMenuOpen}
        top={menuTop}
        onClose={closeCategoryMenu}
      />
    </>
  );
}


// Header mua sắm dùng chung; page nào cần thì import trực tiếp.
export default function Header() {
    const { t } = useTranslation('storefront');

    return (
        <header className="relative z-20 border-0 border-b-2 border-solid border-[#00b9c9] bg-store-green font-body text-store-cream">
            <a
                className="sr-only rounded bg-store-yellow p-3 text-store-ink focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-30"
                href="#main-content"
            >
                {t('skipToContent')}
            </a>
            <StoreUtilityBar />
            <div className="mx-auto flex min-h-[100px] max-w-[1440px] items-center gap-3 px-5 py-3 max-[960px]:flex-wrap max-[960px]:gap-y-3 max-[640px]:gap-2 max-[640px]:px-3 max-[640px]:py-2.5">
                <Link
                    className="flex w-fit shrink-0 items-center gap-2 text-white no-underline max-[640px]:gap-1.5"
                    to={ROUTES.HOME}
                    aria-label={t('home')}
                >
                    <img
                        className="block h-auto w-[100px] shrink-0 object-contain max-[640px]:w-[52px]"
                        src="/images/storefront/brand-logo.png"
                        alt=""
                        width={100}
                        height={67}
                    />
                    <span className="brand-name flex flex-col text-[20px] leading-[1.1] tracking-[-0.5px] max-[640px]:text-[16px]">
                        <span>Bite to</span>
                        <span>Business</span>
                    </span>
                </Link>
                <StoreSearch />
                <StoreAccountActions />
            </div>
            <StoreNavigation />
        </header>
    );
}
