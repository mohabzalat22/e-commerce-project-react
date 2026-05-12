import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { AdminProduct } from "../../types/admin";
import { adminDeleteProduct, adminFetchProducts } from "../../services/adminApi";

const inputClass =
  "flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm";

export default function ProductsAdmin() {
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const list = await adminFetchProducts({
        search: search.trim() || undefined,
      });
      setItems(list);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- search applied on button
  }, []);

  const onSearch = (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    void load();
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }
    try {
      await adminDeleteProduct(id);
      await load();
      toast.success("Product deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
          <p className="mt-1 text-gray-600 text-sm">
            Edit catalog items, images, and attribute values.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex justify-center rounded-md bg-sky-600 text-white px-4 py-2 text-sm font-medium hover:bg-sky-700"
        >
          New product
        </Link>
      </div>

      <form onSubmit={onSearch} className="mt-6 flex gap-2 max-w-md">
        <input
          className={inputClass}
          placeholder="Search name or SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 shrink-0"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="mt-6 text-gray-500 text-sm">Loading…</p>
      ) : (
        <div className="mt-6 rounded-xl border border-gray-200 overflow-x-auto bg-white shadow-sm">
          <table className="w-full text-sm text-left min-w-[640px]">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-200">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80">
                  <td className="px-3 py-2 text-gray-500">{p.id}</td>
                  <td className="px-3 py-2 text-gray-800 font-medium">{p.name}</td>
                  <td className="px-3 py-2 text-gray-600 font-mono text-xs">
                    {p.sku ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-gray-600">
                    {p.category?.name ?? p.category_id}
                  </td>
                  <td className="px-3 py-2 text-gray-800">
                    {String(p.base_price)}
                    {p.sale_price != null && p.sale_price !== "" && (
                      <span className="text-emerald-700 ml-1">
                        → {String(p.sale_price)}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      to={`/admin/products/${p.id}`}
                      className="text-sky-600 text-xs hover:underline mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="text-rose-600 text-xs hover:underline"
                      onClick={() => void remove(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
