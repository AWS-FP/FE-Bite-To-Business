import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Landing Header riêng
import LandingHeader from '@/components/landing/LandingHeader';

// Footer dùng chung toàn website
import Footer from '@/layouts/Footer';

// Landing Sections
import LandingHero from '@/components/landing/LandingHero';
import LandingPersonalization from '@/components/landing/LandingPersonalization';
import LandingPainPoints from '@/components/landing/LandingPainPoints';
import LandingCatalog from '@/components/landing/LandingCatalog';
import LandingBusinessSolution from '@/components/landing/LandingBusinessSolution';
import LandingImpact from '@/components/landing/LandingImpact';
import LandingSegments from '@/components/landing/LandingSegments';
import LandingCTA from '@/components/landing/LandingCTA';

// Landing styles
import '@/components/landing/landing.css';
import '@/components/landing/landingInfo.css';

export default function LandingPage() {
    const { t } = useTranslation('storefront');

    const [category, setCategory] = useState('all');
    const [view, setView] = useState<'grid' | 'table'>('grid');

    return (
        <div className="flex min-h-dvh flex-col bg-store-cream">
            {/* Landing Page riêng */}
            <div className="btb-landing flex-1">
                {/* Header của Landing Page */}
                <LandingHeader />

                {/* Nội dung Landing Page */}
                <main id="main-content" tabIndex={-1} aria-label={t('main')}>
                    <LandingHero />
                    <LandingPersonalization />

                    <LandingPainPoints />

                    <LandingCatalog
                        category={category}
                        view={view}
                        setCategory={setCategory}
                        setView={setView}
                    />

                    <LandingBusinessSolution />

                    <LandingImpact />

                    <LandingSegments />

                    <LandingCTA />
                </main>
            </div>

            {/* Footer global - nằm ngoài CSS Landing */}
            <Footer />
        </div>
    );
}