import React, { useState } from "react";

const DEFAULT_IMG =
  "https://via.placeholder.com/800x1000?text=Image+Unavailable";

const categories = [
  {
    label: "SHIRTS",
    img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&q=80",
  },
  {
    label: "DENIM",
    img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&q=80",
  },
  {
    label: "TEES",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80",
  },
  {
    label: "PANTS",
    img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&q=80",
  },
  {
    label: "SWEATSHIRTS",
    img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=200&q=80",
  },
  {
    label: "OUTERWEAR",
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80",
  },
];

const favorites = [
  {
    title: "The Athletic Zip Hoodie",
    price: "$98",
    img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80",
  },
  {
    title: "The Slim-Cut Uniform Trouser",
    price: "$88",
    img: "https://images.unsplash.com/photo-1617952385804-7df45fddfc57?w=400&q=80",
  },
  {
    title: "The 2-Way Stretch Striped Sport Shirt",
    price: "$98",
    img: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400&q=80",
  },
  {
    title: "The Cashmere Crew",
    price: "$75",
    img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80",
  },
  {
    title: "The Heavyweight Tee",
    price: "$35",
    img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80",
  },
];

export default function Home() {
  const [favIndex, setFavIndex] = useState(0);
  const visibleCount = 4;

  const handlePrev = () => setFavIndex((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setFavIndex((i) => Math.min(favorites.length - visibleCount, i + 1));

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_IMG;
  };

  return (
    <div className="text-gray-900 bg-white">
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-center text-sm tracking-[0.25em] uppercase text-gray-800 mb-8 font-medium">
          Shop by Category
        </h2>
        <div className="grid grid-cols-6 gap-4">
          {categories.map(({ label, img }) => (
            <a
              key={label}
              href="/"
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-full aspect-[3/4] overflow-hidden bg-gray-100 rounded-sm">
                <img
                  src={img}
                  alt={label}
                  onError={handleImgError}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] tracking-widest text-gray-600 uppercase group-hover:text-gray-900 transition">
                {label}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section
        className="relative w-full h-64 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative text-center text-white px-6 max-w-xl">
          <h2 className="text-2xl font-semibold mb-2 leading-snug tracking-wide">
            We're on a Mission To Clean Up the Industry
          </h2>
          <p className="text-sm mb-5 text-gray-200 tracking-wide">
            Shop our products made with clean materials, made well.
          </p>
          <button className="bg-white text-gray-900 text-xs font-semibold tracking-widest uppercase px-8 py-2.5 hover:bg-gray-100 transition-colors duration-200">
            Learn More
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-8">
          <h2 className="text-sm tracking-[0.25em] uppercase font-semibold text-gray-800 mb-1">
            Everlane Favorites
          </h2>
          <p className="text-xs text-gray-500 tracking-wide">
            Beautifully Functional. Exceptionally Thoughtful. Uncompromisingly
            Crafted.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={handlePrev}
            disabled={favIndex === 0}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 hover:border-gray-400 shadow-sm disabled:opacity-20 transition"
            aria-label="Previous"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="overflow-hidden">
            <div
              className="flex gap-5 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${favIndex * (100 / visibleCount)}%)`,
              }}
            >
              {favorites.map((product) => (
                <a
                  key={product.title}
                  href="/"
                  className="group flex-none w-1/4 flex flex-col"
                >
                  <div className="w-full aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                      src={product.img}
                      alt={product.title}
                      onError={handleImgError}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-3 px-0.5">
                    <p className="text-xs text-gray-700 leading-snug line-clamp-2 group-hover:text-gray-900 transition">
                      {product.title}
                    </p>
                    <p className="text-xs font-semibold text-gray-900 mt-1">
                      {product.price}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={favIndex >= favorites.length - visibleCount}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 hover:border-gray-400 shadow-sm disabled:opacity-20 transition"
            aria-label="Next"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: favorites.length - visibleCount + 1 }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => setFavIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${i === favIndex ? "bg-gray-900" : "bg-gray-300"}`}
              />
            ),
          )}
        </div>
      </section>
    </div>
  );
}
