import { colors } from "../../../data/pdp";

interface ColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorSelector({
  selectedColor,
  onColorChange,
}: ColorSelectorProps) {
  return (
    <div>
      <p className="text-sm mb-2">Color: {selectedColor}</p>
      <div className="flex gap-3">
        {colors.map((c) => (
          <button
            key={c.name}
            onClick={() => onColorChange(c.name)}
            className={`w-6 h-6 rounded-full border ${
              selectedColor === c.name ? "ring-2 ring-black" : ""
            } ${c.value}`}
            aria-label={`Select ${c.name} color`}
          />
        ))}
      </div>
    </div>
  );
}
