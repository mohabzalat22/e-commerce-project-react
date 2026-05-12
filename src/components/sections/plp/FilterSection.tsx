import React from "react";

type FilterSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section className="mb-6 border-b border-gray-200 pb-5 last:border-b-0 last:pb-0">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-800">
        {title}
      </h3>
      {children}
    </section>
  );
}
