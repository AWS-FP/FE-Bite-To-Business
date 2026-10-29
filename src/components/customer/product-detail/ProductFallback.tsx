import { Link } from 'react-router-dom';
import { ROUTES } from '../../../router/routes';
import { STANDARD_B2B_PRODUCTS, formatCurrencyVnd } from '../../../constants/customer/homeData';
import { useCartStore } from '../../../store/customer/cartStore';
import StorefrontLayout from '../../../layouts/StorefrontLayout';
export default function ProductFallback({ id }: { id: string }) {
    const product = STANDARD_B2B_PRODUCTS.find((x) => x.id === id);
    const add = useCartStore((x) => x.addItem);
    return (
        <StorefrontLayout rootClassName="flex min-h-screen flex-col bg-[#0F291E] text-white">
            <div className="mx-auto w-full max-w-[1120px] px-5 py-16">
                <Link to={ROUTES.HOME} className="text-[#FACC15]">
                    ← Back to home
                </Link>
                <article className="mt-6 rounded-3xl bg-white p-8 text-[#14132b]">
                    <h1 className="font-serif text-3xl font-bold">
                        {product?.name ?? 'Product not found'}
                    </h1>
                    {product && (
                        <div className="mt-6 grid gap-8 md:grid-cols-2">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full rounded-2xl object-cover"
                                />
                            ) : (
                                <div className="flex min-h-64 items-center justify-center rounded-2xl bg-slate-100">
                                    Image coming soon
                                </div>
                            )}
                            <div className="space-y-4">
                                <p>{product.spec}</p>
                                <p className="text-3xl font-black text-[#133425]">
                                    {formatCurrencyVnd(product.salePrice ?? product.listPrice)} /{' '}
                                    {product.unit}
                                </p>
                                <button
                                    type="button"
                                    className="rounded-xl bg-[#133425] px-6 py-3 font-bold text-white"
                                    onClick={() =>
                                        add(
                                            {
                                                id: product.id,
                                                name: product.name,
                                                spec: product.spec,
                                                unitPrice: product.salePrice ?? product.listPrice,
                                                imageUrl: product.imageUrl,
                                            },
                                            1,
                                        )
                                    }
                                >
                                    Add to Cart
                                </button>
                                <p className="text-sm text-slate-500">
                                    Further technical details are not yet available.
                                </p>
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </StorefrontLayout>
    );
}
