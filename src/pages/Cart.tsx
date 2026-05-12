import React from "react";

export default function Cart() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Shopping Cart</h1>
      <p className="mt-4 text-sm text-gray-600">
        You're viewing the cart. The overlay will appear on top of the page.
      </p>
      <div className="mt-8">
        <div className="bg-white shadow rounded p-6">
          <div className="flex items-center gap-4">
            <img
              src="/static/images/product-placeholder.png"
              alt="p"
              className="w-24 h-24 object-cover rounded"
            />
            <div>
              <div className="font-medium">
                The Organic Cotton Long-Sleeve Turtleneck
              </div>
              <div className="text-sm text-gray-500">Medium | Black</div>
            </div>
            <div className="ml-auto font-semibold">$95</div>
          </div>
        </div>
      </div>
    </div>
  );
}
