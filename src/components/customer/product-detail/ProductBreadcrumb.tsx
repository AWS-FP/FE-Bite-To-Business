import { useProductDetailContext } from './ProductDetailModel.tsx';
import { Link } from 'react-router-dom';
import { CATALOG_PRODUCT_DETAILS } from '../../../constants/customer/homeData';
import { routePaths } from '../../../router/routes';
const getProductDetailPath = routePaths.productDetail;
import { ROUTES } from '../../../router/routes';

export default function ProductBreadcrumb() {
    const { currentProduct, handleSelectSample } = useProductDetailContext();
    return (
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 pt-5 pb-4">
            <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-xs text-white/75"
            >
                <Link to="/" className="text-white/75 no-underline hover:text-white">
                    Home
                </Link>
                <span>›</span>
                <Link to={ROUTES.CATALOG} className="text-white/75 no-underline hover:text-white">
                    {currentProduct.breadcrumbCategory}
                </Link>
                <span>›</span>
                <span className="text-white/75">{currentProduct.breadcrumbSubcategory}</span>
                <span>›</span>
                <span className="font-bold text-[#FACC15]">{currentProduct.name}</span>
            </nav>

            {/* Sample Data Switcher Bar */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-white/80">View sample data from the Catalog:</span>
                {Object.values(CATALOG_PRODUCT_DETAILS).map((sample) => {
                    const isSelected = sample.id === currentProduct.id;
                    return (
                        <Link
                            key={sample.id}
                            to={getProductDetailPath(sample.id)}
                            onClick={() => handleSelectSample(sample.id)}
                            className={`cursor-pointer rounded-lg border-2 border-solid border-[#14132b] px-3.5 py-1 text-xs font-extrabold no-underline transition-all ${
                                isSelected
                                    ? 'bg-[#FACC15] text-[#14132b] shadow-[2px_2px_0_#14132b]'
                                    : 'bg-white text-[#14132b] hover:bg-[#FFF5C0]'
                            }`}
                        >
                            {sample.sampleButtonLabel}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
