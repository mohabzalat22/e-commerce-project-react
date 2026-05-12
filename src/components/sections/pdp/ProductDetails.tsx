import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";

interface Color {
  name: string;
  value: string;
}

type GalleryImage = { url: string; alt: string };

interface ProductDetailsProps {
  images: GalleryImage[];
  title: string;
  subtitle: string;
  priceFormatted: string;
  colors: Color[];
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  onAddToCart?: () => void;
  description: string;
  careText: string;
}

export default function ProductDetails({
  images,
  title,
  subtitle,
  priceFormatted,
  colors,
  sizes,
  selectedSize,
  onSizeChange,
  selectedColor,
  onColorChange,
  onAddToCart,
  description,
  careText,
}: ProductDetailsProps) {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <ProductImages images={images} />

      <ProductInfo
        title={title}
        subtitle={subtitle}
        priceFormatted={priceFormatted}
        colors={colors}
        sizes={sizes}
        selectedSize={selectedSize}
        onSizeChange={onSizeChange}
        selectedColor={selectedColor}
        onColorChange={onColorChange}
        onAddToCart={onAddToCart}
        description={description}
        careText={careText}
      />
    </div>
  );
}
