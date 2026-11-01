
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Landing Header riêng
import LandingHeader from '@/components/LandingHeader';

// Footer dùng chung toàn website
import Footer from '@/layouts/Footer';

// Landing Sections
import LandingHero from '@/components/LandingHero';
import LandingPainPoints from '@/components/LandingPainPoints';
import LandingCatalog from '@/components/LandingCatalog';
import LandingBusinessSolution from '@/components/LandingBusinessSolution';
import LandingImpact from '@/components/LandingImpact';
import LandingSegments from '@/components/LandingSegments';
import LandingCTA from '@/components/LandingCTA';
import LandingAIAssistant from '@/components/LandingAIAssistant';

// Landing styles
import '@/components/landing.css';

export default function LandingPage() {
  const { t } = useTranslation('storefront');

  const [quoteCount, setQuoteCount] = useState(2);
  const [category, setCategory] = useState('all');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      setToast('');
    }, 3600);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  const showToast = (message: string) => {
    setToast(message);
  };

  const onAddToQuote = (item: string) => {
    setQuoteCount((count) => count + 1);

    showToast(
      `Đã thêm "${item}" vào báo giá mẫu. Chưa lưu lên máy chủ.`
    );
  };

  return (
    <div className="flex min-h-dvh flex-col bg-store-cream">

      {/* Landing Page riêng */}
      <div className="btb-landing flex-1">

        {/* Header của Landing Page */}
        <LandingHeader
          quoteCount={quoteCount}
          showToast={showToast}
        />

        {/* Nội dung Landing Page */}
        <main
          id="main-content"
          tabIndex={-1}
          aria-label={t('main')}
        >
          <LandingHero />

          <LandingPainPoints />

          <LandingCatalog
            category={category}
            view={view}
            setCategory={setCategory}
            setView={setView}
            onAddToQuote={onAddToQuote}
            showToast={showToast}
          />

          <LandingBusinessSolution
            showToast={showToast}
          />

          <LandingImpact />

          <LandingSegments />

          <LandingCTA />
        </main>

        {/* Trợ lý AI */}
        <LandingAIAssistant
          setCategory={setCategory}
          setView={setView}
        />

        {/* Thông báo */}
        <div
          id="appToast"
          className={`toast-notification${toast ? ' show' : ''}`}
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      </div>

      {/* Footer global - nằm ngoài CSS Landing */}
      <Footer />

    </div>
  );
}
