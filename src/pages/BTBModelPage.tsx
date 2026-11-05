import BTBInfoLayout from '@/components/landing/BTBInfoLayout';
import BTBModelOverview from '@/components/landing/BTBModelOverview';
import { useTranslation } from 'react-i18next';

export default function BTBModelPage() {
  const { t } = useTranslation('storefront');
  return (
    <BTBInfoLayout
      eyebrow={t('introPages.modelEyebrow')}
      title={t('introPages.modelTitle')}
      description={t('introPages.modelDescription')}
    >
      <BTBModelOverview />
    </BTBInfoLayout>
  );
}
