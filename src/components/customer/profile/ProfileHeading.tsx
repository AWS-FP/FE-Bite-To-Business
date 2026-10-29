import { Pill } from './ProfileUI.tsx';

export default function ProfileHeading() {
    return (
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-5">
            <div>
                <Pill tone="yellow">CUSTOMER ACCOUNT PORTAL</Pill>
                <h1 className="m-0 mt-3 font-serif text-[26px] font-bold leading-tight text-white sm:text-[31px]">
                    Commercial Profile & B2B Purchasing Settings
                </h1>
            </div>
            <p className="m-0 max-w-[350px] text-xs leading-5 text-white/65">
                One representative account per entity · Account access managed through
                authentication
            </p>
        </div>
    );
}
