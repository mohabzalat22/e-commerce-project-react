import type { PlProduct } from "../../../types/catalog";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: PlProduct[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
