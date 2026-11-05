import BTBInfoLayout from '@/components/landing/BTBInfoLayout';
import BTBWhyChoose from '@/components/landing/BTBWhyChoose';
import { useTranslation } from 'react-i18next';

export default function WhyBTBPage() {
    const { t } = useTranslation('storefront');
    return (
        <BTBInfoLayout
            eyebrow={t('introPages.whyEyebrow')}
            title={t('introPages.whyTitle')}
            description={t('introPages.whyDescription')}
        >
            <BTBWhyChoose />
        </BTBInfoLayout>
    );
}
