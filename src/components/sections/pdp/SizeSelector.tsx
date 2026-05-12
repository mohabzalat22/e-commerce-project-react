import { sizes } from "../../../data/pdp";

interface SizeSelectorProps {
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export default function SizeSelector({
  selectedSize,
  onSizeChange,
}: SizeSelectorProps) {
  return (
    <div>
      <p className="text-sm mb-2">Size</p>
      <div className="flex gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() => onSizeChange(s)}
            className={`px-4 py-2 border text-sm transition ${
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
