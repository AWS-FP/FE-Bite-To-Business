import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LandingHeader from '@/components/LandingHeader';
import LandingHero from '@/components/LandingHero';
import LandingPersonalization from '@/components/LandingPersonalization';
import LandingPainPoints from '@/components/LandingPainPoints';
import LandingCatalog from '@/components/LandingCatalog';
import LandingBusinessSolution from '@/components/LandingBusinessSolution';
import LandingImpact from '@/components/LandingImpact';
import LandingSegments from '@/components/LandingSegments';
import LandingCTA from '@/components/LandingCTA';
import Footer from '@/layouts/Footer';
import LandingAIAssistant from '@/components/LandingAIAssistant';
import '@/components/landing.css';
import '@/components/landingInfo.css';

/** Public landing page. Product/quote details here are a visual demo, not connected to the API. */
export default function LandingPage() {
  const { t } = useTranslation('storefront');
  const [quoteCount, setQuoteCount] = useState(2);
  const [category, setCategory] = useState('all');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [toast, setToast] = useState('');
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);
  const showToast = (message: string) => setToast(message);
  const onAddToQuote = (item: string) => {
    setQuoteCount((count) => count + 1);
    setToast(`Đã thêm “${item}” vào báo giá mẫu. Chưa lưu lên máy chủ.`);
  };
  return (
    <div className="flex min-h-dvh flex-col bg-store-cream">
      <div className="btb-landing flex-1">
        <LandingHeader quoteCount={quoteCount} showToast={showToast} />
        <main id="main-content" tabIndex={-1} aria-label={t('main')}>
          <LandingHero />
          <LandingPersonalization />
          <LandingPainPoints />
          <LandingCatalog category={category} view={view} setCategory={setCategory} setView={setView} onAddToQuote={onAddToQuote} showToast={showToast} />
          <LandingBusinessSolution showToast={showToast} />
          <LandingImpact />
          <LandingSegments />
          <LandingCTA />
        </main>
        <LandingAIAssistant setCategory={setCategory} setView={setView} />
        <div id="appToast" className={`toast-notification${toast ? ' show' : ''}`} role="status" aria-live="polite">{toast}</div>
      </div>
      <Footer />
    </div>
  );
}