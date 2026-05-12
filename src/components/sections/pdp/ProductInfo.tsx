import ColorSelector from "./ColorSelector";
import SizeSelector from "./SizeSelector";
import AddToCartButton from "./AddToCartButton";
import InfoBlocks from "./InfoBlocks";
import ProductDescription from "./ProductDescription";

interface ProductInfoProps {
  selectedSize: string;
  onSizeChange: (size: string) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  onAddToCart?: () => void;
}

export default function ProductInfo({
  selectedSize,
  onSizeChange,
  selectedColor,
  onColorChange,
  onAddToCart,
}: ProductInfoProps) {
  return (
    <div className="lg:sticky top-10 h-fit space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-medium tracking-wide">CHECK OVERSHIRT</h1>
        <p className="text-sm text-gray-500 mt-1">
          Relaxed fit cotton blend overshirt
        </p>
      </div>

      {/* Price */}
      <p className="text-lg font-medium">$129.00</p>

      {/* Color Selector */}
      <ColorSelector
        selectedColor={selectedColor}
        onColorChange={onColorChange}
      />

      {/* Size Selector */}
      <SizeSelector selectedSize={selectedSize} onSizeChange={onSizeChange} />

      {/* Add to Cart Button */}
      <AddToCartButton onClick={onAddToCart} />

      {/* Info Blocks */}
      <InfoBlocks />

      {/* Description */}
      <ProductDescription />
    </div>
  );
}
