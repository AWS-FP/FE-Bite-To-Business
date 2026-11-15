import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StorefrontLayout from '../layouts/StorefrontLayout';
import CoverflowSlider from '../components/customer/CoverflowSlider';
import { HomeModelProvider } from '../components/customer/home/HomeModel';
import PartnerStrip from '../components/customer/home/PartnerStrip';
import CategorySection from '../components/customer/home/CategorySection';
import ProductsSection from '../components/customer/home/ProductsSection';
import CombosSection from '../components/customer/home/CombosSection';
import CommitmentSection from '../components/customer/home/CommitmentSection';
import NewsletterSection from '../components/customer/home/NewsletterSection';

export default function HomePage() {
    const { hash } = useLocation();
    useEffect(() => {
        if (!hash) return;
        const id = decodeURIComponent(hash.slice(1));
        const frame = window.requestAnimationFrame(() =>
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        );
        return () => window.cancelAnimationFrame(frame);
    }, [hash]);
    return (
        <HomeModelProvider>
            <StorefrontLayout rootClassName="flex min-h-screen flex-col bg-store-green text-white">
                <CoverflowSlider />
                <PartnerStrip />
                <CategorySection />
                <ProductsSection />
                <CombosSection />
                <CommitmentSection />
                <NewsletterSection />
            </StorefrontLayout>
        </HomeModelProvider>
    );
}
