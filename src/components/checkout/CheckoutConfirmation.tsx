import React from "react";
import { Link } from "react-router-dom";

type CheckoutConfirmationProps = {
  orderId: string;
};

export default function CheckoutConfirmation({
  orderId,
}: CheckoutConfirmationProps) {
  return (
    <div className="mx-auto max-w-lg rounded-lg bg-white p-8 text-center shadow">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-gray-900">
        Order placed
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Thank you. Your confirmation number is{" "}
        <span className="font-mono font-semibold text-gray-900">{orderId}</span>
        .
      </p>
      <p className="mt-4 text-sm text-gray-500">
        You will receive a confirmation email shortly (demo — no email is sent).
      </p>
      <Link
        to="/products"
        className="mt-8 inline-flex w-full items-center justify-center rounded bg-gray-900 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
      >
        Continue shopping
      </Link>
    </div>
  );
}
