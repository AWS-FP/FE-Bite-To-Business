import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, PackageOpen } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import { getHomeProducts } from "@/services/customer/homeService";
import type { HomeResponse } from "@/services/customer/homeService";
import ProductShowcaseCard from "@/components/customer/home/ProductShowcaseCard";
import { toCard } from "@/components/customer/home/homeProductMapper";
import SectionPaginationBar from "@/components/customer/home/SectionPaginationBar";
import { formatCurrencyVnd } from "@/constants/customer/homeData";
import { ROUTES } from "@/router/routes";

type Collection =
  "deals" | "best-selling" | "deep-discount" | "top-rated" | "combos";
const GROUPS: Collection[] = [
  "deals",
  "best-selling",
  "deep-discount",
  "top-rated",
  "combos",
];

export default function CustomerCollectionPage() {
  const { kind } = useParams();
  const { t, i18n } = useTranslation("storefront");
  const group: Collection = GROUPS.includes(kind as Collection)
    ? (kind as Collection)
    : "deals";
  const [data, setData] = useState<HomeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  useEffect(() => {
    const controller = new AbortController();
    getHomeProducts(controller.signal)
      .then(setData)
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);
  const products = useMemo(() => {
    if (!data) return [];
    const source =
      group === "deals"
        ? data.flashSaleProducts
        : group === "best-selling"
          ? data.bestSellingProducts
          : group === "deep-discount"
            ? data.deepDiscountProducts
            : data.topRatedProducts;
    return source
      .map(toCard)
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [data, group]);
  const total =
    group === "combos" ? (data?.combos.length ?? 0) : products.length;
  const pages = Math.ceil(total / pageSize);
  const heading = t(`customerUI.collection.${group}`);
  return (
    <StorefrontLayout rootClassName="min-h-screen bg-store-cream text-store-ink">
      <main className="mx-auto max-w-[1320px] px-4 py-9 sm:px-6">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-sm font-bold text-store-green no-underline"
        >
          <ArrowLeft size={17} />
          {t("home")}
        </Link>
        <div className="mt-5 rounded-[24px] bg-store-green p-7 text-white">
          <h1 className="m-0 font-subheading text-3xl font-bold">{heading}</h1>
        </div>
        {loading && (
          <p role="status" className="mt-6">
            {t("homePage.productsLoading")}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-6">
            {t("homePage.productsError")}
          </p>
        )}
        {!loading && !error && total === 0 && (
          <div className="mt-6 flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl bg-white p-8 text-center">
            <PackageOpen size={30} className="text-store-sage" />
            <p className="m-0 text-sm text-store-muted">
              {t("customerUI.groupEmpty")}
            </p>
          </div>
        )}
        {!loading && !error && group !== "combos" && products.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products
              .slice((page - 1) * pageSize, page * pageSize)
              .map((product) => (
                <ProductShowcaseCard
                  key={product.id}
                  product={product}
                  section="standard"
                />
              ))}
          </div>
        )}
        {!loading && !error && group === "combos" && data && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.combos
              .slice((page - 1) * pageSize, page * pageSize)
              .map((combo) => (
                <article
                  key={combo.productId}
                  className="overflow-hidden rounded-xl bg-white shadow-sm"
                >
                  {combo.imageUrl && (
                    <img
                      src={combo.imageUrl}
                      alt=""
                      className="h-44 w-full object-contain p-3"
                    />
                  )}
                  <div className="p-4">
                    <h2 className="font-subheading text-base font-bold">
                      {i18n.resolvedLanguage?.startsWith("en")
                        ? combo.nameEn
                        : combo.nameVi}
                    </h2>
                    <p className="text-sm text-store-muted">
                      {combo.listPrice != null
                        ? formatCurrencyVnd(combo.salePrice ?? combo.listPrice)
                        : t("customerUI.priceUnavailable")}
                    </p>
                    <Link
                      to={`/products/${encodeURIComponent(combo.productId)}`}
                      className="text-sm font-bold text-store-green"
                    >
                      {t("customerUI.comboDetails")}
                    </Link>
                  </div>
                </article>
              ))}
          </div>
        )}
        {total > 0 && (
          <SectionPaginationBar
            currentPage={page}
            totalPages={pages}
            totalItems={total}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        )}
      </main>
    </StorefrontLayout>
  );
}
