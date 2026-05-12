import React from "react";

export default function Navbar() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
      <nav className="flex items-center gap-6 text-xs tracking-widest text-gray-600 uppercase">
        {["Womens", "Mens", "About", "Footwear & Extras"].map((item) => (
          <a
            key={item}
            href="/"
            className="hover:text-gray-900 transition-colors duration-200"
          >
            {item}
          </a>
        ))}
      </nav>

      <a
        href="/"
        className="text-2xl font-bold tracking-[0.35em] text-gray-900 uppercase absolute left-1/2 -translate-x-1/2"
      >
        Everlane
      </a>

      <div className="flex items-center gap-4 text-gray-700">
        <button className="hover:text-gray-900 transition" aria-label="Search">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
        </button>
        <button className="hover:text-gray-900 transition" aria-label="Account">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </button>
        <button
          className="hover:text-gray-900 transition relative"
          aria-label="Cart"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}
