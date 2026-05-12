export type FilterChipOption = { id: number; label: string };

type FilterOptionChipsProps = {
  options: FilterChipOption[];
  selectedIds: Set<string>;
  onToggle: (optionId: string) => void;
};

export default function FilterOptionChips({
  options,
  selectedIds,
  onToggle,
}: FilterOptionChipsProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {options.map((opt) => {
        const id = String(opt.id);
        const on = selectedIds.has(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onToggle(id)}
            className={`border py-1 text-xs transition ${
              on
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 text-gray-800 hover:bg-gray-100"
            }`}
            aria-pressed={on}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
