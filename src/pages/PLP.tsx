import FilterItem from "../components/sections/plp/FilterItem";
import FilterSection from "../components/sections/plp/FilterSection";
import ColorSwatches from "../components/sections/plp/ColorSwatches";
import ProductGrid from "../components/sections/plp/ProductGrid";
import SizeSelector from "../components/sections/plp/SizeSelector";
import {
  categoryFilters,
  colorFilters,
  plpProducts,
  sizeFilters,
} from "../data/plp";

export default function PLP() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-7xl bg-white px-6 py-8 sm:px-8 lg:px-10">
        <header className="mb-8">
          <h1 className="text-sm tracking-widest text-gray-700">
            MEN&apos;S CLOTHING & APPAREL - NEW ARRIVALS
          </h1>
        </header>

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          <aside className="w-full text-sm lg:w-60 lg:shrink-0">
            <FilterSection title="Category">
              {categoryFilters.map((label) => (
                <FilterItem key={label} label={label} />
              ))}
            </FilterSection>

            <FilterSection title="Color">
              <ColorSwatches colors={colorFilters} />
            </FilterSection>

            <FilterSection title="Size">
              <SizeSelector sizes={sizeFilters} />
            </FilterSection>
          </aside>

          <section className="flex-1">
            <ProductGrid products={plpProducts} />
          </section>
        </div>
      </div>
    </div>
  );
}
