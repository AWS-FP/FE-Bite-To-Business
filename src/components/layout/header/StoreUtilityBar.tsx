import LanguageSwitcher from '../../common/LanguageSwitcher';

export default function StoreUtilityBar() {
    return (
        <div className="border-0 border-b border-solid border-store-cream/15 bg-store-dark">
            <div className="mx-auto flex min-h-[40px] max-w-[1440px] items-center justify-end px-5 py-1.5 text-[11px] leading-[1.5]">
                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                </div>
            </div>
        </div>
    );
}
