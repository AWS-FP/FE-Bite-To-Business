
import BTBInfoLayout from '@/components/landing/BTBInfoLayout';
import BTBWhyChoose from '@/components/landing/BTBWhyChoose';
import { useTranslation } from 'react-i18next';

export default function WhyBTBPage() {
    const { t } = useTranslation('storefront');

    return (
        <BTBInfoLayout
            variant="why"
            eyebrow={t('introPages.aboutV2.why.eyebrow')}
            title={t('introPages.aboutV2.why.title')}
            description={t('introPages.aboutV2.why.description')}
        >
            <BTBWhyChoose />
        </BTBInfoLayout>
    );
}
