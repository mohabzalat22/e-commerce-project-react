import RelatedProductCard from "./RelatedProductCard";

export type RelatedProductItem = {
  id: number;
  title: string;
  price: string;
  img: string;
};

interface RelatedProductsProps {
  items: RelatedProductItem[];
}

export default function RelatedProducts({ items }: RelatedProductsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-20">
      <h2 className="mb-6 text-lg font-medium">YOU MAY ALSO LIKE</h2>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {items.map((item) => (
          <RelatedProductCard
            key={item.id}
            id={item.id}
            title={item.title}
            price={item.price}
            img={item.img}
          />
        ))}
      </div>
    </div>
  );
}
