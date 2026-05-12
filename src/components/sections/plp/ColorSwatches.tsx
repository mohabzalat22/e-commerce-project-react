type ColorSwatchesProps = {
  colors: string[];
};

export default function ColorSwatches({ colors }: ColorSwatchesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className="h-5 w-5 rounded-full border border-gray-200 transition hover:scale-110"
          style={{ backgroundColor: color }}
          aria-label={`Filter by color ${color}`}
        />
      ))}
    </div>
  );
}
