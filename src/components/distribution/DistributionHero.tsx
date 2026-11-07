import { useTranslation } from 'react-i18next';

export default function DistributionHero() {
    const { t } = useTranslation('storefront');
    return (
        <header className="mb-[34px]">
            <h1 className="font-heading text-[clamp(36px,4.2vw,62px)] font-normal leading-[1.14] tracking-[-0.035em] text-store-ink">
                {t('distribution.title')} <em className="font-normal text-store-coral">BTB.</em>
            </h1>
        </header>
    );
}
