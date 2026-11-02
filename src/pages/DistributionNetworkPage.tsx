import { useSearchParams } from 'react-router-dom';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';
import DistributionHero from '@/components/DistributionHero';
import DistributionCitySelector from '@/components/DistributionCitySelector';
import DistributionExplorer from '@/components/DistributionExplorer';
import { getDistributionCity } from '@/components/distributionData';
import type { DistributionCityId } from '@/components/distributionData';
import '@/components/distribution.css';

export default function DistributionNetworkPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const city = getDistributionCity(searchParams.get('city'));

    function handleSelectCity(nextCity: DistributionCityId) {
        const next = new URLSearchParams(searchParams);
        next.set('city', nextCity);
        setSearchParams(next, { replace: true });
    }

    return (
        <div className="btb-dist-page">
            <Header />
            <main className="btb-dist">
                <div className="btb-dist__container">
                    <DistributionHero />
                    <DistributionCitySelector selectedId={city.id} onSelect={handleSelectCity} />
                    <DistributionExplorer city={city} />
                </div>
            </main>
            <Footer />
        </div>
    );
}
