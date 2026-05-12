import React from "react";

export default function EagleMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M20 4L6 18h5l-3 14 12-9 12 9-3-14h5L20 4zm0 6.5l6.2 8.2h-3.8L20 22l-2.4-3.3h-3.8L20 10.5z" />
    </svg>
  );
}
