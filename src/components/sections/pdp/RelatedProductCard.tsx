interface RelatedProductCardProps {
  title: string;
  price: string;
  img: string;
}

export default function RelatedProductCard({
  title,
  price,
  img,
}: RelatedProductCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="overflow-hidden">
        <img
          src={img}
          className="h-72 w-full object-cover group-hover:scale-105 transition"
          alt={title}
        />
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-gray-500">{price}</p>
      </div>
    </div>
  );
}
