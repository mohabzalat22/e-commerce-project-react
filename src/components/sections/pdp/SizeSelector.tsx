interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSizeChange,
}: SizeSelectorProps) {
  if (sizes.length === 0) {
    return (
      <div>
        <p className="mb-2 text-sm">Size</p>
        <p className="text-xs text-gray-500">No size options for this item.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 text-sm">Size</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSizeChange(s)}
            className={`border px-4 py-2 text-sm transition ${
              selectedSize === s
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            }`}
            aria-pressed={selectedSize === s}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
