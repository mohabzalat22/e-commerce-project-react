import { Link } from "react-router-dom";

interface RelatedProductCardProps {
  id: number;
  title: string;
  price: string;
  img: string;
}

export default function RelatedProductCard({
  id,
  title,
  price,
  img,
}: RelatedProductCardProps) {
  return (
    <Link
      to={`/product/${id}`}
      className="group block cursor-pointer"
    >
      <div className="overflow-hidden">
        <img
          src={img}
          className="h-72 w-full object-cover transition group-hover:scale-105"
          alt={title}
        />
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-gray-500">{price}</p>
      </div>
    </Link>
  );
}
