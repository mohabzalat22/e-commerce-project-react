import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CartOverlay() {
  const location = useLocation();
  const navigate = useNavigate();

  const open = location.pathname === "/cart";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <button
        aria-label="Close cart"
        onClick={() => navigate(-1)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
      />

      <aside className="ml-auto w-full max-w-md h-full bg-white shadow-xl overflow-auto relative z-50">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <button
              onClick={() => navigate(-1)}
              aria-label="Close"
              className="text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <div className="flex gap-4 items-start">
              <img
                src="/static/images/product-placeholder.png"
                alt="product"
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">
                  The Organic Cotton Long-Sleeve
                </div>
                <div className="text-xs text-gray-500">Medium | Black</div>
                <div className="text-sm font-semibold mt-2">$95</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 border rounded">-</button>
                <div>1</div>
                <button className="w-7 h-7 border rounded">+</button>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <img
                src="/static/images/product-placeholder.png"
                alt="product"
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">
                  The Rewool® Oversized Shirt Jacket
                </div>
                <div className="text-xs text-gray-500">Small | Black</div>
                <div className="text-sm font-semibold mt-2">$107</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 border rounded">-</button>
                <div>1</div>
                <button className="w-7 h-7 border rounded">+</button>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">Subtotal (2 items)</div>
              <div className="text-lg font-semibold">$202</div>
            </div>

            <button className="mt-6 w-full bg-gray-900 text-white py-3 rounded">
              Continue to Checkout
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
