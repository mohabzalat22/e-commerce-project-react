import React from "react";
import { Link } from "react-router-dom";
import type { CartLine } from "../../context/CartContext";
import { formatMoney } from "./formatMoney";

const SHIPPING_CENTS = 599;

type CheckoutOrderSummaryProps = {
  lines: CartLine[];
  subtotalCents: number;
  onPlaceOrder: () => void;
  isSubmitting: boolean;
};

export default function CheckoutOrderSummary({
  lines,
  subtotalCents,
  onPlaceOrder,
  isSubmitting,
}: CheckoutOrderSummaryProps) {
  const totalCents = subtotalCents + SHIPPING_CENTS;

  return (
    <aside className="h-fit rounded-lg bg-white p-6 shadow lg:sticky lg:top-6">
      <h2 className="text-lg font-semibold text-gray-900">Order summary</h2>

      <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
        {lines.map((line) => (
          <li key={line.key} className="flex gap-3 text-sm">
            <img
              src={line.imageUrl}
              alt=""
              className="h-14 w-14 shrink-0 rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <Link
                to={`/product/${line.productId}`}
                className="font-medium text-gray-900 hover:underline"
              >
                {line.name}
              </Link>
              <div className="text-xs text-gray-500">
                {line.sizeLabel} · {line.colorLabel} · Qty {line.quantity}
              </div>
              <div className="mt-0.5 font-medium text-gray-900">
                {formatMoney(line.unitPriceCents * line.quantity)}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-2 border-t border-gray-200 pt-4 text-sm">
        <div className="flex justify-between text-gray-600">
          <dt>Subtotal</dt>
          <dd className="font-medium text-gray-900">
            {formatMoney(subtotalCents)}
          </dd>
        </div>
        <div className="flex justify-between text-gray-600">
          <dt>Shipping</dt>
          <dd className="font-medium text-gray-900">
            {formatMoney(SHIPPING_CENTS)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
          <dt>Total</dt>
          <dd>{formatMoney(totalCents)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={isSubmitting}
        className="mt-6 w-full rounded bg-gray-900 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Placing order…" : "Place order"}
      </button>

      <p className="mt-3 text-center text-xs text-gray-500">
        Demo checkout — no payment is collected.
      </p>
    </aside>
  );
}

export { SHIPPING_CENTS };
