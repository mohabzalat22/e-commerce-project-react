import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";

interface ProductDetailsProps {
  selectedSize: string;
  onSizeChange: (size: string) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  onAddToCart?: () => void;
}

export default function ProductDetails({
  selectedSize,
  onSizeChange,
  selectedColor,
  onColorChange,
  onAddToCart,
}: ProductDetailsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* LEFT - IMAGES */}
      <ProductImages />

      {/* RIGHT - STICKY INFO */}
      <ProductInfo
        selectedSize={selectedSize}
        onSizeChange={onSizeChange}
        selectedColor={selectedColor}
        onColorChange={onColorChange}
        onAddToCart={onAddToCart}
      />
    </div>
  );
}
