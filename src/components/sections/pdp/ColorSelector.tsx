interface Color {
  name: string;
  value: string;
}

interface ColorSelectorProps {
  colors: Color[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorSelector({
  colors,
  selectedColor,
  onColorChange,
}: ColorSelectorProps) {
  return (
    <div>
      <p className="mb-2 text-sm">Color: {selectedColor}</p>
      <div className="flex gap-3">
        {colors.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => onColorChange(c.name)}
            className={`h-6 w-6 rounded-full border border-gray-300 ${
              selectedColor === c.name ? "ring-2 ring-black ring-offset-2" : ""
            }`}
            style={{ backgroundColor: c.value }}
            aria-label={`Select ${c.name} color`}
          />
        ))}
      </div>
    </div>
  );
}
