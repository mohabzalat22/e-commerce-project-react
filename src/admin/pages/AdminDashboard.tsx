import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTaxSettings } from "../../context/TaxSettingsContext";
import {
  adminFetchCategories,
  adminFetchEavAttributes,
  adminFetchOrders,
  adminFetchProducts,
  adminFetchUsers,
} from "../../services/adminApi";

export default function AdminDashboard() {
  const [counts, setCounts] = useState<{
    categories: number;
    products: number;
    attributes: number;
    users: number;
    orders: number;
  } | null>(null);
  const { taxEnabled, taxRatePercent } = useTaxSettings();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cats, products, attrs, usersPayload, ordersPayload] =
          await Promise.all([
            adminFetchCategories(true),
            adminFetchProducts(),
            adminFetchEavAttributes(),
            adminFetchUsers(),
            adminFetchOrders(),
          ]);
        if (cancelled) {
          return;
        }
        setCounts({
          categories: cats.count,
          products: products.length,
          attributes: attrs.length,
          users: usersPayload.count,
          orders: ordersPayload.count,
        });
      } catch (e) {
        if (!cancelled) {
          toast.error(
            e instanceof Error ? e.message : "Failed to load dashboard",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!counts) {
    return <p className="text-gray-500 text-sm">Loading…</p>;
  }

  const cards = [
    { label: "Categories", value: counts.categories, to: "/admin/categories" },
    { label: "Products", value: counts.products, to: "/admin/products" },
    { label: "EAV attributes", value: counts.attributes, to: "/admin/attributes" },
    { label: "Users", value: counts.users, to: "/admin/users" },
    { label: "Orders", value: counts.orders, to: "/admin/orders" },
    {
      label: "Tax settings",
      value: taxEnabled ? "On" : "Off",
      to: "/admin/tax-settings",
      hint: `${taxRatePercent}% markup`,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
        Dashboard
      </h1>
      <p className="mt-1 text-gray-600 text-sm">
        Overview of catalog entities backed by your ecom API.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-gray-300 hover:shadow transition"
          >
            <div className="text-gray-500 text-xs uppercase tracking-wide">
              {c.label}
            </div>
            <div className="mt-2 text-3xl font-semibold text-gray-800 tabular-nums">
              {c.value}
            </div>
            {"hint" in c ? (
              <div className="mt-1 text-xs text-gray-500">{c.hint}</div>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
