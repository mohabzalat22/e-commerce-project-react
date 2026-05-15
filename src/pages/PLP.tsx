import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import FilterSection from "../components/sections/plp/FilterSection";
import ColorSwatches from "../components/sections/plp/ColorSwatches";
import FilterOptionChips from "../components/sections/plp/FilterOptionChips";
import ProductGrid from "../components/sections/plp/ProductGrid";
import { useTaxSettings } from "../context/TaxSettingsContext";
import type { ApiProduct, FilterableAttribute } from "../types/catalog";
import { mapApiProductToPlp } from "../types/catalog";
import {
  fetchCategoryFilters,
  fetchFilterableAttributes,
  fetchProducts,
} from "../services/api";
import {
  attributeSelectionFromSearchParams,
  attributeSelectionToRecord,
  buildProductListSearchParams,
  cloneAttributeSelection,
} from "../utils/urlAttributes";

function categoryProductsPath(categoryId: number | undefined): string {
  const sp = buildProductListSearchParams(categoryId, new Map());
  const q = sp.toString();
  return q ? `/products?${q}` : "/products";
}

export default function PLP() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryIdParam = searchParams.get("category_id");
  const categoryId =
    categoryIdParam && !Number.isNaN(Number(categoryIdParam))
      ? Number(categoryIdParam)
      : undefined;

  const queryString = searchParams.toString();
  const selection = useMemo(
    () => attributeSelectionFromSearchParams(new URLSearchParams(queryString)),
    [queryString],
  );

  const { taxEnabled, taxRatePercent } = useTaxSettings();
  const [rawProducts, setRawProducts] = useState<ApiProduct[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<
    { id: number; name: string }[]
  >([]);
  const [filterableAttributes, setFilterableAttributes] = useState<
    FilterableAttribute[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCategoryFilters()
      .then((data) => {
        if (!cancelled) {
          setCategoryFilters(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load categories");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const attrsRecord = attributeSelectionToRecord(selection);
        const hasAttrs = Object.keys(attrsRecord).length > 0;
        const [productsData, attrsData] = await Promise.all([
          fetchProducts({
            category_id: categoryId,
            is_active: true,
            attributes: hasAttrs ? attrsRecord : undefined,
          }),
          fetchFilterableAttributes(categoryId),
        ]);
        if (!cancelled) {
          setRawProducts(productsData);
          setFilterableAttributes(attrsData);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load data");
          console.error("Error loading PLP data:", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [categoryId, selection]);

  const products = useMemo(
    () => rawProducts.map((product) => mapApiProductToPlp(product, taxEnabled, taxRatePercent)),
    [rawProducts, taxEnabled, taxRatePercent],
  );

  const heading = useMemo(() => {
    if (categoryId && categoryFilters.length) {
      const cat = categoryFilters.find((c) => c.id === categoryId);
      if (cat) {
        return `${cat.name.toUpperCase()} — NEW ARRIVALS`;
      }
    }
    return "MEN'S CLOTHING & APPAREL — NEW ARRIVALS";
  }, [categoryId, categoryFilters]);

  const handleToggleAttribute = useCallback(
    (code: string, optionId: string) => {
      const nextSel = cloneAttributeSelection(selection);
      const set = nextSel.get(code) ?? new Set();
      if (set.has(optionId)) {
        set.delete(optionId);
      } else {
        set.add(optionId);
      }
      if (set.size === 0) {
        nextSel.delete(code);
      } else {
        nextSel.set(code, set);
      }
      setSearchParams(
        buildProductListSearchParams(categoryId, nextSel),
        { replace: true },
      );
    },
    [categoryId, selection, setSearchParams],
  );

  const clearAttributeFilters = useCallback(() => {
    setSearchParams(buildProductListSearchParams(categoryId, new Map()), {
      replace: true,
    });
  }, [categoryId, setSearchParams]);

  const hasAttributeFilters = selection.size > 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10 text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-shell bg-white px-6 py-8 sm:px-8 lg:px-10">
        <header className="mb-8">
          <h1 className="text-sm tracking-widest text-gray-700">{heading}</h1>
        </header>

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          <aside className="w-full text-sm lg:w-60 lg:shrink-0">
            <FilterSection title="Category">
              <div className="mb-2 space-y-1">
                <Link
                  to="/products"
                  className={`block py-1 text-xs ${!categoryId ? "font-semibold text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
                >
                  All
                </Link>
                {categoryFilters.map((c) => (
                  <Link
                    key={c.id}
                    to={categoryProductsPath(c.id)}
                    className={`block py-1 text-xs ${categoryId === c.id ? "font-semibold text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </FilterSection>

            {hasAttributeFilters ? (
              <button
                type="button"
                className="mb-4 text-xs text-gray-700 underline decoration-gray-400 underline-offset-2 hover:text-gray-900"
                onClick={clearAttributeFilters}
              >
                Clear attribute filters
              </button>
            ) : null}

            {filterableAttributes.map((attr) =>
              attr.options.length === 0 ? null : (
                <FilterSection key={attr.code} title={attr.name}>
                  {attr.code === "color" ? (
                    <ColorSwatches
                      options={attr.options}
                      selectedIds={selection.get(attr.code) ?? new Set()}
                      onToggle={(id) => handleToggleAttribute(attr.code, id)}
                    />
                  ) : (
                    <FilterOptionChips
                      options={attr.options}
                      selectedIds={selection.get(attr.code) ?? new Set()}
                      onToggle={(id) => handleToggleAttribute(attr.code, id)}
                    />
                  )}
                </FilterSection>
              ),
            )}
          </aside>

          <section className="flex-1">
            <ProductGrid products={products} />
          </section>
        </div>
      </div>
    </div>
  );
}
