export default function ProductImages() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Model Image */}
      <div className="space-y-3">
        <img
          src="https://images.unsplash.com/photo-1520975958225-6d9b5b1f0c39"
          className="w-full h-[520px] object-cover"
          alt="Product main view"
        />
        <img
          src="https://images.unsplash.com/photo-1520975682031-a9b2f0c3f0c1"
          className="w-full h-[260px] object-cover"
          alt="Product detail view"
        />
      </div>

      {/* Product Flat Image */}
      <div>
        <img
          src="https://images.unsplash.com/photo-1520975918312-7b7d4f3a5c3d"
          className="w-full h-[800px] object-cover"
          alt="Product flat lay"
        />
      </div>
    </div>
  );
}
