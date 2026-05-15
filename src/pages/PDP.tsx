import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetails from "../components/sections/pdp/ProductDetails";
import RelatedProducts from "../components/sections/pdp/RelatedProducts";
import { useCart } from "../context/CartContext";
import { useTaxSettings } from "../context/TaxSettingsContext";
import {
  fetchProduct,
  fetchRelatedProducts,
  fetchSizeFilters,
} from "../services/api";
import type { ApiProduct } from "../types/catalog";
import {
  careText,
  colorsForPdp,
  descriptionText,
  formatPrice,
  galleryImages,
  materialText,
  primaryImageUrlFromApi,
  sizesForPdp,
  unitPriceCents,
} from "../types/catalog";

export default function PDP() {
  const { id: idParam } = useParams<{ id: string }>();
  const productId = idParam ? Number(idParam) : NaN;

  const { addLine } = useCart();
  const { taxEnabled, taxRatePercent } = useTaxSettings();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const [sizeFallback, setSizeFallback] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (!idParam || Number.isNaN(productId)) {
      setError("Invalid product");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const [p, rel, sizes] = await Promise.all([
          fetchProduct(productId),
          fetchRelatedProducts(productId),
          fetchSizeFilters(),
        ]);
        setProduct(p);
        setRelatedProducts(rel);
        setSizeFallback(sizes);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [idParam, productId]);

  const related = useMemo(
    () =>
      relatedProducts.map((p) => ({
        id: p.id,
        title: p.name,
        price:
          p.price_after_tax !== undefined
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Number(p.price_after_tax))
            : formatPrice(p.base_price, p.sale_price ?? null, taxEnabled, taxRatePercent),
        img: primaryImageUrlFromApi(p),
      })),
    [relatedProducts, taxEnabled, taxRatePercent],
  );

  useEffect(() => {
    if (!product) return;
    const cols = colorsForPdp(product);
    setSelectedColor(cols[0]?.name ?? "");
    const own = sizesForPdp(product);
    const list = own.length ? own : sizeFallback;
    setSelectedSize(list[0] ?? "");
  }, [product, sizeFallback]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      window.alert("Please select a size.");
      return;
    }
    const imgs = galleryImages(product);
    addLine({
      productId: product.id,
      name: product.name,
      imageUrl: imgs[0]?.url ?? primaryImageUrlFromApi(product),
      unitPriceCents: unitPriceCents(product, taxEnabled, taxRatePercent),
      sizeLabel: selectedSize,
      colorLabel: selectedColor || "—",
      quantity: 1,
    });
  };

  if (loading)
    return (
      <div className="mx-auto flex max-w-shell items-center justify-center px-6 py-10 text-gray-900">
        Loading...
      </div>
    );
  if (error || !product)
    return (
      <div className="mx-auto max-w-shell px-6 py-10 text-red-600">
        Error: {error ?? "Product not found"}
      </div>
    );

  const colors = colorsForPdp(product);
  const ownSizes = sizesForPdp(product);
  const sizes = ownSizes.length ? ownSizes : sizeFallback;

  return (
    <div className="mx-auto max-w-shell px-6 py-10 text-gray-900">
      <ProductDetails
        images={galleryImages(product)}
        title={product.name}
        subtitle={materialText(product)}
        priceFormatted={
          product.price_after_tax !== undefined
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Number(product.price_after_tax))
            : formatPrice(
                product.base_price,
                product.sale_price ?? null,
                taxEnabled,
                taxRatePercent,
              )
        }
        colors={colors}
        sizes={sizes}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        onAddToCart={handleAddToCart}
        description={descriptionText(product)}
        careText={careText(product)}
      />

      <RelatedProducts items={related} />
    </div>
  );
}
