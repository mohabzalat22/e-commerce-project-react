import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function Cart() {
  const { lines, subtotalCents, setQuantity, removeLine } = useCart();

  return (
    <div className="mx-auto max-w-shell p-6">
      <h1 className="text-2xl font-semibold">Shopping Cart</h1>

      {lines.length === 0 ? (
        <p className="mt-6 text-sm text-gray-600">
          Your cart is empty.{" "}
          <Link to="/products" className="text-gray-900 underline">
            Browse products
          </Link>
        </p>
      ) : (
        <>
          <ul className="mt-8 space-y-6">
            {lines.map((line) => (
              <li
                key={line.key}
                className="flex flex-wrap items-start gap-4 rounded bg-white p-4 shadow"
              >
                <img
                  src={line.imageUrl}
                  alt=""
                  className="h-24 w-24 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/product/${line.productId}`}
                    className="font-medium hover:underline"
                  >
                    {line.name}
                  </Link>
                  <div className="text-sm text-gray-500">
                    {line.sizeLabel} | {line.colorLabel}
                  </div>
                  <div className="mt-2 text-sm font-semibold">
                    {formatMoney(line.unitPriceCents)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="h-7 w-7 rounded border"
                    onClick={() =>
                      setQuantity(line.key, line.quantity - 1)
                    }
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="min-w-[2ch] text-center">{line.quantity}</span>
                  <button
                    type="button"
                    className="h-7 w-7 rounded border"
                    onClick={() =>
                      setQuantity(line.key, line.quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="ml-2 text-xs text-red-600 hover:underline"
                    onClick={() => removeLine(line.key)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Subtotal ({lines.reduce((n, l) => n + l.quantity, 0)} items)
              </span>
              <span className="text-lg font-semibold">
                {formatMoney(subtotalCents)}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Checkout is not connected yet — this cart is stored in your
              browser only.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
