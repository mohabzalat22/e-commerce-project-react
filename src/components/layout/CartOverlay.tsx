import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function CartOverlay() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lines, subtotalCents, setQuantity } = useCart();

  const open = location.pathname === "/cart";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <button
        aria-label="Close cart"
        type="button"
        onClick={() => navigate(-1)}
        className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      <aside className="relative z-50 ml-auto h-full w-full max-w-md overflow-auto bg-white shadow-xl">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Close"
              className="text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>

          {lines.length === 0 ? (
            <p className="mt-8 text-sm text-gray-600">
              Your cart is empty.{" "}
              <Link to="/products" className="underline" onClick={() => navigate(-1)}>
                Shop products
              </Link>
            </p>
          ) : (
            <>
              <div className="mt-6 space-y-6">
                {lines.map((line) => (
                  <div key={line.key} className="flex gap-4 items-start">
                    <img
                      src={line.imageUrl}
                      alt=""
                      className="h-16 w-16 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{line.name}</div>
                      <div className="text-xs text-gray-500">
                        {line.sizeLabel} | {line.colorLabel}
                      </div>
                      <div className="text-sm font-semibold mt-2">
                        {formatMoney(line.unitPriceCents)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        className="w-7 h-7 border rounded"
                        onClick={() =>
                          setQuantity(line.key, line.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <div>{line.quantity}</div>
                      <button
                        type="button"
                        className="w-7 h-7 border rounded"
                        onClick={() =>
                          setQuantity(line.key, line.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t pt-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Subtotal ({lines.reduce((n, l) => n + l.quantity, 0)} items)
                  </div>
                  <div className="text-lg font-semibold">
                    {formatMoney(subtotalCents)}
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 w-full rounded bg-gray-900 py-3 text-white"
                  disabled
                >
                  Continue to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
