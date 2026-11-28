type IllustrationKind = 'published' | 'draft' | 'promotion';

function PublishedArtwork() {
    return (
        <>
            <ellipse cx="86" cy="98" rx="66" ry="7" fill="#b7d4be" opacity=".45" />
            <circle cx="101" cy="49" r="43" fill="#d8eadb" />
            <g stroke="#568768" strokeWidth="1.5" strokeLinejoin="round">
                <path d="M71 35 105 20 139 36 105 53Z" fill="#f5faf2" />
                <path d="M71 35 105 53V87L71 69Z" fill="#a9cbb2" />
                <path d="M105 53 139 36V70L105 87Z" fill="#c7dfcb" />
                <path d="m88 28 34 16-10 5-34-16Z" fill="#e3b86a" stroke="none" />
                <path d="m112 49 10-5v15l-10 5Z" fill="#d9b673" stroke="none" />
                <path d="M121 69 130 65M121 74 130 70" strokeLinecap="round" />
                <path d="M23 60 60 43 98 60 60 78Z" fill="#eaf4e5" />
                <path d="M23 60 60 78V99L23 81Z" fill="#a0c4aa" />
                <path d="M60 78 98 60V81L60 99Z" fill="#d3e5ce" />
                <path d="m36 54 37 17 10-5-37-17Z" fill="#e4bc78" stroke="none" />
                <path d="M35 72 49 79V87L35 80Z" fill="#f3f8ee" stroke="none" />
                <path d="m39 77 6 3" strokeLinecap="round" />
                <path d="m76 84 12-6m-12 11 12-6" strokeLinecap="round" />
            </g>
            <g transform="rotate(9 56 35)">
                <rect x="37" y="13" width="33" height="36" rx="5" fill="#f9fcf6" stroke="#568768" strokeWidth="1.5" />
                <rect x="43" y="19" width="21" height="13" rx="2" fill="#c7dfcb" />
                <path d="M48 29q0-10 10-8 1 8-8 9m0 0 4-5" fill="#87b293" stroke="#568768" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M44 37h18m-18 5h12" stroke="#80a58a" strokeWidth="1.6" strokeLinecap="round" />
            </g>
            <g fill="none" stroke="#739b7a" strokeWidth="1.7" strokeLinecap="round">
                <path d="M15 31h12m-6-6v12M145 14h8m-4-4v8M8 64l7-3M145 82l7 3" />
                <path d="M11 47q4-5 11-7" strokeDasharray="2 4" />
            </g>
            <circle cx="129" cy="12" r="2.5" fill="#d6b36c" />
        </>
    );
}

function DraftArtwork() {
    return (
        <>
            <ellipse cx="87" cy="99" rx="62" ry="6" fill="#bdcfdf" opacity=".55" />
            <circle cx="91" cy="51" r="43" fill="#dce9f3" />
            <g transform="rotate(-13 62 56)" stroke="#88a8be" strokeWidth="1.4">
                <rect x="29" y="23" width="65" height="73" rx="5" fill="#c2d9e9" />
                <path d="M40 36h41M40 44h31M40 80h38M40 87h25" strokeLinecap="round" />
            </g>
            <g transform="rotate(8 91 54)" stroke="#6d94b0" strokeWidth="1.5" strokeLinejoin="round">
                <path d="M60 13h49l15 15v65a4 4 0 0 1-4 4H60a4 4 0 0 1-4-4V17a4 4 0 0 1 4-4Z" fill="#f8fbfd" />
                <path d="M109 13v15h15" fill="#c7ddec" />
                <rect x="65" y="24" width="30" height="6" rx="2" fill="#7fa8c3" stroke="none" />
                <rect x="65" y="38" width="15" height="17" rx="2" fill="#dce9f3" />
                <path d="m68 51 4-6 4 3 4-6v11H68Z" fill="#9cbcd0" stroke="none" />
                <path d="M86 41h25m-25 6h19m-19 6h23" strokeLinecap="round" />
                <rect x="65" y="63" width="7" height="7" rx="1" fill="#e3edf5" />
                <rect x="65" y="76" width="7" height="7" rx="1" fill="#e3edf5" />
                <path d="m66 66 2 2 5-6M78 67h31M78 80h22" strokeLinecap="round" />
            </g>
            <g transform="rotate(34 130 67)" stroke="#987538" strokeWidth="1.3" strokeLinejoin="round">
                <path d="M126 43h9v44l-4.5 9-4.5-9Z" fill="#f1d58b" />
                <path d="M126 48h9v5h-9Z" fill="#d7e6ee" stroke="#6d94b0" />
                <path d="M126 43v-5q4.5-5 9 0v5Z" fill="#dfaca7" />
                <path d="m126 87 4.5 9 4.5-9Z" fill="#faf2d9" />
                <path d="m129 93 1.5 3 1.5-3Z" fill="#647583" stroke="none" />
                <path d="M130.5 55v29" stroke="#c6a158" />
            </g>
            <path d="M13 45q-5 16 10 28m-8-1 8 1-1-8" fill="none" stroke="#92adc0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 4" />
            <path d="M143 17v10m-5-5h10M22 14v8m-4-4h8" stroke="#7fa8c3" strokeWidth="1.6" strokeLinecap="round" />
        </>
    );
}

function PromotionArtwork() {
    return (
        <>
            <ellipse cx="88" cy="99" rx="62" ry="6" fill="#e5cd86" opacity=".45" />
            <circle cx="94" cy="53" r="43" fill="#f7e9b5" />
            <path d="m111 12 5 12 13-4-1 14 14 2-8 11 10 9-13 6 4 13-14-1-5 13-10-10-11 8-3-14-14-1 6-12-10-9 12-6-3-13 14 1Z" fill="#f1d47c" opacity=".7" />
            <g transform="rotate(13 106 51)" stroke="#bf9b49" strokeWidth="1.5" strokeLinejoin="round">
                <path d="M88 24h30l20 20v36a4 4 0 0 1-4 4H88a4 4 0 0 1-4-4V28a4 4 0 0 1 4-4Z" fill="#fff6d8" />
                <path d="M118 24v20h20" fill="#eed58c" />
                <path d="M94 55h31m-31 7h21m-21 7h27" strokeLinecap="round" />
            </g>
            <g transform="rotate(-13 65 61)" stroke="#9d7a30" strokeWidth="1.6" strokeLinejoin="round">
                <path d="M22 49 47 31h48a4 4 0 0 1 4 4v47a4 4 0 0 1-4 4H47L22 68a4 4 0 0 1 0-19Z" fill="#f8d86d" />
                <circle cx="36" cy="59" r="4.5" fill="#fff8e1" />
                <path d="M49 38h42v40H49" fill="none" stroke="#e1b94c" strokeDasharray="3 3" />
                <circle cx="62" cy="50" r="6" fill="#fff5d0" />
                <circle cx="81" cy="68" r="6" fill="#fff5d0" />
                <path d="m61 70 21-22" strokeWidth="2.6" strokeLinecap="round" />
            </g>
            <path d="M32 66C6 78 6 29 33 26c19-3 16-13 10-17" fill="none" stroke="#b48b3c" strokeWidth="2" strokeLinecap="round" />
            <path d="M38 10q4-7 9-2" fill="none" stroke="#b48b3c" strokeWidth="2" strokeLinecap="round" />
            <g fill="none" stroke="#c5a04c" strokeWidth="2" strokeLinecap="round">
                <path d="M13 15v10m-5-5h10M145 12v12m-6-6h12M148 80l7 4M10 90l6-3" />
                <path d="m73 10 3 8m-9-1 5 3" />
            </g>
            <circle cx="145" cy="65" r="2.5" fill="#dbb858" />
        </>
    );
}

export default function DashboardCatalogIllustration({ kind }: { kind: IllustrationKind }) {
    return (
        <svg
            viewBox="0 0 160 110"
            className="pointer-events-none absolute bottom-2 right-2 h-auto w-[96px] opacity-90 sm:w-[82px] xl:bottom-3 xl:right-3 xl:w-[128px] 2xl:w-[146px]"
            aria-hidden="true"
            focusable="false"
        >
            {kind === 'published' ? <PublishedArtwork /> : kind === 'draft' ? <DraftArtwork /> : <PromotionArtwork />}
        </svg>
    );
}
