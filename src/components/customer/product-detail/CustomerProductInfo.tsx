import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
    ChevronDown,
    FileText,
    ImageOff,
    Leaf,
    Package,
    Ruler,
    Scale,
    ShieldCheck,
    Warehouse,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CustomerProductDetail } from '@/services/customer/productDetailService';
import CustomerFavoriteButton from '@/components/customer/CustomerFavoriteButton';

type Fact = { label: string; value: string };
type Section = { key: string; icon: typeof Ruler; text: string | null; facts: Fact[] };

export default function CustomerProductInfo({
    product,
    name,
    description,
    category,
    packageSpec,
    english,
}: {
    product: CustomerProductDetail;
    name: string;
    description: string;
    category: string;
    packageSpec: string;
    english: boolean;
}) {
    const { t } = useTranslation('storefront');
    const tr = (key: string) => t(`productDetail.${key}`);
    const reducedMotion = useReducedMotion();
    const [expanded, setExpanded] = useState<string[]>(['technical']);
    const details = product.details;
    const translatedText = (en: string | null | undefined, vi: string | null | undefined) =>
        (english ? en || vi : vi || en)?.trim() || null;
    const valueWithUnit = (value: number | null | undefined, unit: string) =>
        value == null
            ? null
            : `${Number(value).toLocaleString(english ? 'en-US' : 'vi-VN')} ${unit}`;

    const facts: Fact[] = [
        { label: tr('netWeight'), value: valueWithUnit(details?.netWeightKg, 'kg') },
        { label: tr('tareWeight'), value: valueWithUnit(details?.tareWeightKg, 'kg') },
        {
            label: tr('dimensions'),
            value:
                details?.lengthCm != null && details.widthCm != null && details.heightCm != null
                    ? `${details.lengthCm} × ${details.widthCm} × ${details.heightCm} cm`
                    : null,
        },
        ...(!(details?.lengthCm != null && details.widthCm != null && details.heightCm != null)
            ? [
                  { label: tr('length'), value: valueWithUnit(details?.lengthCm, 'cm') },
                  { label: tr('width'), value: valueWithUnit(details?.widthCm, 'cm') },
                  { label: tr('height'), value: valueWithUnit(details?.heightCm, 'cm') },
              ]
            : []),
        { label: tr('volume'), value: valueWithUnit(details?.volumeM3, 'm³') },
    ].filter((fact): fact is Fact => fact.value != null);

    // Prefer typed values returned by BE. Some imported technicalContent strings
    // contain pipe-separated key/value pairs rather than free-form paragraphs.
    // Render those as table rows, never as one long, duplicated sentence.
    const technicalContent = translatedText(
        details?.technicalContentEn,
        details?.technicalContentVi,
    );
    const rawParts = technicalContent?.split(/\s*\|\s*/).filter(Boolean) ?? [];
    const rawPairs = rawParts.map((part) => {
        const match = part.trim().match(/^([^:：]{1,85})[:：]\s*(.+)$/u);
        return match ? { label: match[1].trim(), value: match[2].trim() } : null;
    });
    const isTabularContent = rawParts.length > 0 && rawPairs.every(Boolean);
    const normalizeKey = (label: string) =>
        label
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');
    // These are schema labels, not hardcoded product information.
    const knownTechnicalLabels = [
        tr('netWeight'),
        'Net weight',
        'Khối lượng tịnh',
        tr('tareWeight'),
        'Tare weight',
        'Packaging weight',
        'Khối lượng bao bì',
        tr('dimensions'),
        'Dimensions',
        'Dimensions (L×W×H)',
        'Kích thước',
        tr('volume'),
        'Volume',
        'Thể tích',
        tr('sellingUnit'),
        'Selling unit',
        'Đơn vị bán',
        tr('moq'),
        'MOQ',
        'Minimum order',
        'Số lượng đặt tối thiểu',
    ].map(normalizeKey);
    const extraFacts = isTabularContent
        ? rawPairs.filter(
              (pair): pair is Fact =>
                  pair != null &&
                  !knownTechnicalLabels.some((label) => normalizeKey(pair.label).startsWith(label)),
          )
        : [];
    const technicalFacts = [
        ...facts,
        ...(product.unitCode ? [{ label: tr('sellingUnit'), value: product.unitCode }] : []),
        ...(product.minOrderQuantity != null
            ? [{ label: tr('moq'), value: String(product.minOrderQuantity) }]
            : []),
        ...extraFacts,
    ];

    const sections: Section[] = [
        {
            key: 'technical',
            icon: Ruler,
            text: isTabularContent ? null : technicalContent,
            facts: technicalFacts,
        },
        {
            key: 'storage',
            icon: Warehouse,
            text: translatedText(
                details?.kitchenStorageContentEn,
                details?.kitchenStorageContentVi,
            ),
            facts: [],
        },
        {
            key: 'safety',
            icon: ShieldCheck,
            text: translatedText(details?.complianceVatContentEn, details?.complianceVatContentVi),
            facts: [],
        },
        {
            key: 'origin',
            icon: Leaf,
            text:
                translatedText(details?.originContentEn, details?.originContentVi) ||
                product.origin,
            facts: [],
        },
    ];

    const toggle = (key: string) =>
        setExpanded((open) =>
            open.includes(key) ? open.filter((item) => item !== key) : [...open, key],
        );

    return (
        <div className="min-w-0 space-y-5">
            <article className="overflow-hidden rounded-[28px] border border-[#dfebdc] bg-[#fffdf7] text-[#14382c] shadow-[0_14px_34px_rgba(4,32,22,0.12)]">
                <div className="p-5 sm:p-7">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                        {category && (
                            <span className="rounded-full bg-[#e6f0e7] px-3 py-1.5 text-[#245e45]">
                                {category}
                            </span>
                        )}
                        {product.brandName && (
                            <span className="rounded-full bg-[#ffe26b] px-3 py-1.5 text-[#173d2b]">
                                {product.brandName}
                            </span>
                        )}
                    </div>
                    <h1 className="mb-0 mt-4 max-w-3xl break-words font-subheading text-[clamp(30px,3.4vw,48px)] font-extrabold leading-[1.12] tracking-[-0.045em]">
                        {name}
                    </h1>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#597367]">
                        <span>
                            SKU: <strong className="font-mono text-[#173d2b]">{product.sku}</strong>
                        </span>
                        {packageSpec && (
                            <span>
                                {tr('package')}:{' '}
                                <strong className="text-[#173d2b]">{packageSpec}</strong>
                            </span>
                        )}
                        {product.origin && (
                            <span>
                                {tr('origin')}:{' '}
                                <strong className="text-[#173d2b]">{product.origin}</strong>
                            </span>
                        )}
                    </div>
                    <div className="group relative isolate mt-6 flex h-[300px] items-center justify-center overflow-hidden rounded-[22px] border border-[#e6eadc] bg-[radial-gradient(ellipse_at_center,#fff_10%,#f2f4e9_75%)] sm:h-[430px] before:pointer-events-none before:absolute before:z-0 before:h-[260px] before:w-[260px] before:rounded-full before:border before:border-[#dce4d3] before:shadow-[0_0_0_34px_#e5eada55,0_0_0_68px_#e5eada33] sm:before:h-[330px] sm:before:w-[330px]">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={name}
                                className="relative z-10 h-full w-full max-h-[280px] object-contain p-6 mix-blend-multiply drop-shadow-[0_22px_16px_#234e3018] transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:-rotate-2 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none sm:max-h-[380px] sm:p-8"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-3 text-sm text-[#789084]">
                                <ImageOff size={40} />
                                {tr('noImage')}
                            </div>
                        )}
                        <CustomerFavoriteButton productId={product.id} />
                    </div>
                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                        <div className="flex items-center gap-2 rounded-lg bg-[#edf5ed] px-4 py-3 text-sm font-semibold text-[#214d39]">
                            <Package size={18} /> {product.unitCode}
                        </div>
                        {product.minOrderQuantity != null && (
                            <div className="flex items-center gap-2 rounded-lg bg-[#edf5ed] px-4 py-3 text-sm font-semibold text-[#214d39]">
                                <Scale size={18} /> {tr('moq')}: {product.minOrderQuantity}
                            </div>
                        )}
                    </div>
                    <div className="mt-6 border-t border-[#e1ebe0] pt-5">
                        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                            <FileText size={19} />
                            {tr('description')}
                        </h2>
                        <p className="m-0 whitespace-pre-line text-sm leading-7 text-[#526d60]">
                            {description || tr('noDescription')}
                        </p>
                    </div>
                </div>
            </article>

            <div className="space-y-3">
                {sections.map((section) => {
                    const open = expanded.includes(section.key);
                    const Icon = section.icon;
                    return (
                        <section
                            key={section.key}
                            className="overflow-hidden rounded-xl border border-[#dce9dc] bg-[#fffdf7] shadow-[0_5px_18px_rgba(4,32,22,0.07)]"
                        >
                            <button
                                type="button"
                                aria-expanded={open}
                                aria-controls={`customer-product-${section.key}`}
                                onClick={() => toggle(section.key)}
                                className="flex w-full items-center justify-between gap-4 border-0 bg-transparent px-5 py-4 text-left text-[15px] font-bold text-[#163d2d] transition-colors hover:bg-[#f1f7ee] focus:!border-0 focus:!outline-none focus-visible:!ring-2 focus-visible:!ring-inset focus-visible:!ring-[#dcae32] sm:px-6"
                            >
                                <span className="flex items-center gap-3">
                                    <Icon size={19} className="text-[#28734e]" />
                                    {tr(section.key)}
                                </span>
                                <ChevronDown
                                    size={19}
                                    className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <AnimatePresence initial={false}>
                                {open && (
                                    <motion.div
                                        key="content"
                                        id={`customer-product-${section.key}`}
                                        initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={
                                            reducedMotion
                                                ? { opacity: 0 }
                                                : { height: 0, opacity: 0 }
                                        }
                                        transition={{
                                            duration: reducedMotion ? 0 : 0.24,
                                            ease: 'easeOut',
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-t border-[#e4ece2] px-5 py-5 sm:px-6">
                                            {section.facts.length > 0 && (
                                                <div className="overflow-x-auto rounded-xl border border-[#d7e2d2]">
                                                    <table className="w-full table-fixed border-collapse text-left text-sm">
                                                        <thead className="bg-[#e6eee1] text-[#173d2b]">
                                                            <tr>
                                                                <th
                                                                    scope="col"
                                                                    className="w-[48%] px-4 py-3 font-bold"
                                                                >
                                                                    {tr('specification')}
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="px-4 py-3 font-bold"
                                                                >
                                                                    {tr('specValue')}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {section.facts.map((fact, index) => (
                                                                <tr
                                                                    key={`${fact.label}-${index}`}
                                                                    className="border-t border-[#e4ebdf] odd:bg-[#fffdf7] even:bg-[#f3f6ed]"
                                                                >
                                                                    <th
                                                                        scope="row"
                                                                        className="break-words px-4 py-3 align-top font-medium text-[#587362]"
                                                                    >
                                                                        {fact.label}
                                                                    </th>
                                                                    <td className="break-words px-4 py-3 align-top font-bold tabular-nums text-[#173d2b]">
                                                                        {fact.value}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                            {section.text && (
                                                <p
                                                    className={`${section.facts.length ? 'mt-4' : 'mt-0'} mb-0 whitespace-pre-line text-sm leading-7 text-[#476456]`}
                                                >
                                                    {section.text}
                                                </p>
                                            )}
                                            {!section.text && section.facts.length === 0 && (
                                                <p className="m-0 text-sm text-[#7b8f82]">
                                                    {tr('notProvided')}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
