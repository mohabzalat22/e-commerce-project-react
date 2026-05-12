import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AdminUser } from "../../types/admin";
import { adminFetchUsers } from "../../services/adminApi";

export default function UsersAdmin() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminFetchUsers();
        if (!cancelled) {
          setItems(res.items);
        }
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
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
      <p className="mt-1 text-gray-600 text-sm">
        Read-only list (passwords are never returned by the API).
      </p>
      <div className="mt-8 rounded-xl border border-gray-200 overflow-x-auto bg-white shadow-sm">
        <table className="w-full text-sm text-left min-w-[400px]">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-200">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/80">
                <td className="px-3 py-2 text-gray-500">{u.id}</td>
                <td className="px-3 py-2 text-gray-800 font-medium">{u.name}</td>
                <td className="px-3 py-2 text-gray-600">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
