
import BTBInfoLayout from '@/components/landing/BTBInfoLayout';
import BTBModelOverview from '@/components/landing/BTBModelOverview';
import { useTranslation } from 'react-i18next';

export default function BTBModelPage() {
  const { t } = useTranslation('storefront');

  return (
    <BTBInfoLayout
      variant="model"
      eyebrow={t('introPages.aboutV2.model.eyebrow')}
      title={t('introPages.aboutV2.model.title')}
      description={t('introPages.aboutV2.model.description')}
    >
      <BTBModelOverview />
    </BTBInfoLayout>
  );
}
