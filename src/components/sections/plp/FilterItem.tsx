type FilterItemProps = {
  label: string;
};

export default function FilterItem({ label }: FilterItemProps) {
  return (
    <label className="mb-2 flex cursor-pointer items-center gap-2 last:mb-0">
      <input type="checkbox" className="accent-black" />
      <span className="text-xs text-gray-600">{label}</span>
    </label>
  );
}
