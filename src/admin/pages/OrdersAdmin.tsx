import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { AdminOrder } from "../../types/admin";
import { adminFetchOrders } from "../../services/adminApi";
import { formatMoney } from "../../components/checkout/formatMoney";

const statusTone: Record<string, string> = {
  pending: "bg-amber-50 text-amber-900 border-amber-200",
  processing: "bg-sky-50 text-sky-900 border-sky-200",
  shipped: "bg-emerald-50 text-emerald-900 border-emerald-200",
  cancelled: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function OrdersAdmin() {
  const [items, setItems] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await adminFetchOrders();
    setItems(data.items);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await reload();
      } catch (e) {
        if (!cancelled) {
          toast.error(e instanceof Error ? e.message : "Load failed");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reload]);

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading…</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
          <p className="mt-1 text-gray-600 text-sm">
            View and manage orders stored in the database.
          </p>
        </div>
        <Link
          to="/admin/orders/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition"
        >
          New order
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 overflow-x-auto bg-white shadow-sm">
        <table className="w-full text-sm text-left min-w-[720px]">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-200">
            <tr>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Items</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2 w-24" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-8 text-center text-gray-500 text-sm"
                >
                  No orders yet.{" "}
                  <Link
                    to="/admin/orders/new"
                    className="text-sky-700 underline font-medium"
                  >
                    Create one
                  </Link>{" "}
                  or place an order from the storefront checkout.
                </td>
              </tr>
            ) : (
              items.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/80">
                  <td className="px-3 py-2">
                    <span className="font-mono text-xs text-gray-800">
                      {o.id.slice(0, 8)}…
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-medium text-gray-800">{o.full_name}</div>
                    <div className="text-gray-500 text-xs">{o.email}</div>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={[
                        "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
                        statusTone[o.status ?? "pending"] ??
                          "bg-gray-50 text-gray-800 border-gray-200",
                      ].join(" ")}
                    >
                      {o.status ?? "pending"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-gray-700">
                    {o.items_count ?? o.items?.length ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-gray-900 tabular-nums">
                    {formatMoney(o.total_cents)}
                  </td>
                  <td className="px-3 py-2 text-gray-600 text-xs whitespace-nowrap">
                    {o.created_at
                      ? new Date(o.created_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      to={`/admin/orders/${encodeURIComponent(o.id)}`}
                      className="text-sky-700 font-medium text-xs hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
