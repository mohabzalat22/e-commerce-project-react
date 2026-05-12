import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStorefrontHome } from "../services/api";
import type { ApiProduct } from "../types/catalog";
import { formatPrice, primaryImageUrlFromApi } from "../types/catalog";

const DEFAULT_IMG = "https://placehold.co/800x1000?text=Image+Unavailable";

export default function Home() {
  const [categories, setCategories] = useState<
    Array<{
      id: number;
      name: string;
      slug?: string;
      image_url?: string | null;
    }>
  >([]);
  const [favorites, setFavorites] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favIndex, setFavIndex] = useState(0);
  const visibleCount = 4;
  const maxFavIndex = Math.max(0, favorites.length - visibleCount);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchStorefrontHome();
        setCategories(data.categories ?? []);
        setFavorites(data.featured_products ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load home");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePrev = () => setFavIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setFavIndex((i) => Math.min(maxFavIndex, i + 1));

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_IMG;
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-white text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-white text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900">
      <section className="mx-auto max-w-shell px-6 py-12">
        <h2 className="mb-8 text-center text-sm font-medium uppercase tracking-[0.25em] text-gray-800">
          Shop by Category
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category_id=${cat.id}`}
              className="group flex w-[calc(50%-0.5rem)] flex-col items-center gap-2 sm:w-[calc((100%-2rem)/3)] md:w-[calc((100%-5rem)/6)]"
            >
              <div className="aspect-[3/4] w-full overflow-hidden rounded-sm bg-gray-100">
                <img
                  src={cat.image_url || DEFAULT_IMG}
                  alt={cat.name}
                  onError={handleImgError}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-gray-600 transition group-hover:text-gray-900">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="relative flex h-64 w-full items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-xl px-6 text-center text-white">
          <h2 className="mb-2 text-2xl font-semibold leading-snug tracking-wide">
            We&apos;re on a Mission To Clean Up the Industry
          </h2>
          <p className="mb-5 text-sm tracking-wide text-gray-200">
            Shop our products made with clean materials, made well.
          </p>
          <Link
            to="/products"
            className="inline-block bg-white px-8 py-2.5 text-xs font-semibold uppercase tracking-widest text-gray-900 transition-colors duration-200 hover:bg-gray-100"
          >
            Shop now
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-shell px-6 py-14">
        <div className="mb-8 text-center">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-[0.25em] text-gray-800">
            Featured
          </h2>
          <p className="text-xs tracking-wide text-gray-500">
            Beautifully Functional. Exceptionally Thoughtful. Uncompromisingly
            Crafted.
          </p>
        </div>

        {favorites.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No featured items yet.
          </p>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={handlePrev}
              disabled={favIndex === 0}
              className="absolute -left-6 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-gray-200 bg-white shadow-sm transition hover:border-gray-400 disabled:opacity-20"
              aria-label="Previous"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="overflow-hidden">
              <div
                className="flex gap-5 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${favIndex * (100 / visibleCount)}%)`,
                }}
              >
                {favorites.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group flex w-1/4 flex-none flex-col"
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100">
                      <img
                        src={primaryImageUrlFromApi(product)}
                        alt={product.name}
                        onError={handleImgError}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-3 px-0.5">
                      <p className="line-clamp-2 text-xs leading-snug text-gray-700 transition group-hover:text-gray-900">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-gray-900">
                        {formatPrice(
                          product.base_price,
                          product.sale_price ?? null,
                        )}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={favIndex >= maxFavIndex}
              className="absolute -right-6 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-gray-200 bg-white shadow-sm transition hover:border-gray-400 disabled:opacity-20"
              aria-label="Next"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}

        {favorites.length > visibleCount ? (
          <div className="mt-6 flex justify-center gap-1.5">
            {Array.from({
              length: maxFavIndex + 1,
            }).map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setFavIndex(i)}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${i === favIndex ? "bg-gray-900" : "bg-gray-300"}`}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
