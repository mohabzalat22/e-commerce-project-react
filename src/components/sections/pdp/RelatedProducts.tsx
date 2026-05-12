import { relatedProducts } from "../../../data/pdp";
import RelatedProductCard from "./RelatedProductCard";

export default function RelatedProducts() {
  return (
    <div className="mt-20">
      <h2 className="text-lg font-medium mb-6">YOU MAY ALSO LIKE</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map((item, i) => (
          <RelatedProductCard
            key={i}
            title={item.title}
            price={item.price}
            img={item.img}
          />
        ))}
      </div>
    </div>
  );
}
