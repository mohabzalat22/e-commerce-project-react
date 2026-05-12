import { useState } from "react";
import ProductDetails from "../components/sections/pdp/ProductDetails";
import RelatedProducts from "../components/sections/pdp/RelatedProducts";
import { colors } from "../data/pdp";

export default function PDP() {
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(colors[0].name);

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      product: "Check Overshirt",
      size: selectedSize,
      color: selectedColor,
      price: "$129.00",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-gray-900">
      {/* TOP GRID - PRODUCT DETAILS */}
      <ProductDetails
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        onAddToCart={handleAddToCart}
      />

      {/* RELATED PRODUCTS */}
      <RelatedProducts />
    </div>
  );
}
