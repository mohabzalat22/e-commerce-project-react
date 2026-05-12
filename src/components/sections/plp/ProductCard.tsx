import { Link } from "react-router-dom";
import type { PlProduct } from "../../../types/catalog";

type ProductCardProps = {
  product: PlProduct;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {product.isNew && (
            <span className="absolute left-2 top-2 z-10 border border-gray-200 bg-white px-2 py-1 text-[10px]">
              NEW
            </span>
          )}

          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-xs tracking-wide text-gray-800">{product.name}</p>
          <p className="text-xs text-gray-500">{product.price}</p>

          <div className="flex gap-1 pt-1">
            {product.colors.map((color) => (
              <span
                key={color}
                className="h-3 w-3 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
