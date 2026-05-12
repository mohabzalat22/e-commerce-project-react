type SizeSelectorProps = {
  sizes: string[];
};

export default function SizeSelector({ sizes }: SizeSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          className="border border-gray-200 py-1 text-xs transition hover:bg-gray-100"
        >
          {size}
        </button>
      ))}
    </div>
  );
}
