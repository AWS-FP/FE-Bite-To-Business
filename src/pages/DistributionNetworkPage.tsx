import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';
import DistributionHero from '@/components/distribution/DistributionHero';
import DistributionExplorer from '@/components/distribution/DistributionExplorer';

export default function DistributionNetworkPage() {
    return (
        <div className="min-h-screen bg-store-cream">
            <Header />
            <main className="bg-store-cream pt-[18px] pb-[clamp(64px,6vw,100px)] font-body text-store-ink">
                <div className="mx-auto w-[min(1240px,calc(100%-56px))]">
                    <DistributionHero />
                    <DistributionExplorer />
                </div>
            </main>
            <Footer />
        </div>
    );
}
