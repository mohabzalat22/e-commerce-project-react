import ColorSelector from "./ColorSelector";
import SizeSelector from "./SizeSelector";
import AddToCartButton from "./AddToCartButton";
import InfoBlocks from "./InfoBlocks";
import ProductDescription from "./ProductDescription";

interface Color {
  name: string;
  value: string;
}

interface ProductInfoProps {
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

export default function ProductInfo({
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
}: ProductInfoProps) {
  return (
    <div className="lg:sticky top-10 h-fit space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-wide uppercase">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        ) : null}
      </div>

      <p className="text-lg font-medium">{priceFormatted}</p>

      <ColorSelector
        colors={colors}
        selectedColor={selectedColor}
        onColorChange={onColorChange}
      />

      <SizeSelector
        sizes={sizes}
        selectedSize={selectedSize}
        onSizeChange={onSizeChange}
      />

      <AddToCartButton onClick={onAddToCart} />

      <InfoBlocks />

      <ProductDescription description={description} careText={careText} />
    </div>
  );
}
