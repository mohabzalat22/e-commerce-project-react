import { optionLabelToHex } from "../../../types/catalog";

export type ColorFilterOption = { id: number; label: string };

type FilterMode = {
  options: ColorFilterOption[];
  selectedIds: Set<string>;
  onToggle: (optionId: string) => void;
};

type LabelsMode = {
  labels: string[];
};

export type ColorSwatchesProps = FilterMode | LabelsMode;

function isFilterMode(p: ColorSwatchesProps): p is FilterMode {
  return "options" in p && Array.isArray(p.options);
}

export default function ColorSwatches(props: ColorSwatchesProps) {
  if (isFilterMode(props)) {
    const { options, selectedIds, onToggle } = props;
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const id = String(opt.id);
          const selected = selectedIds.has(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => onToggle(id)}
              className={`h-5 w-5 rounded-full border-2 transition hover:scale-110 ${
                selected
                  ? "border-gray-900 ring-2 ring-gray-900 ring-offset-1"
                  : "border-gray-200"
              }`}
              style={{ backgroundColor: optionLabelToHex(opt.label) }}
              aria-pressed={selected}
              aria-label={`Filter by color ${opt.label}`}
            />
          );
        })}
      </div>
    );
  }

  const { labels } = props;
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label) => (
        <span
          key={label}
          className="h-5 w-5 rounded-full border border-gray-200"
          style={{ backgroundColor: optionLabelToHex(label) }}
          aria-hidden
        />
      ))}
    </div>
  );
}
