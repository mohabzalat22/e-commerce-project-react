import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { AdminCategory, AdminEavAttribute } from "../../types/admin";
import {
  adminCreateCategory,
  adminDeleteCategory,
  adminFetchCategories,
  adminFetchCategoryAttributes,
  adminFetchEavAttributes,
  adminSyncCategoryAttributes,
  adminUpdateCategory,
} from "../../services/adminApi";

type FormState = {
  id?: number;
  name: string;
  slug: string;
  parent_id: string;
  image_url: string;
  description: string;
  is_active: boolean;
  sort_order: string;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  parent_id: "",
  image_url: "",
  description: "",
  is_active: true,
  sort_order: "0",
};

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm";

export default function CategoriesAdmin() {
  const [items, setItems] = useState<AdminCategory[]>([]);
  const [allAttrs, setAllAttrs] = useState<AdminEavAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [attrCategoryId, setAttrCategoryId] = useState<number | null>(null);
  const [linkedIds, setLinkedIds] = useState<Set<number>>(new Set());
  const [attrSort, setAttrSort] = useState<Record<number, string>>({});

  const reload = useCallback(async () => {
    const data = await adminFetchCategories(true);
    setItems(data.items);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cats, attrs] = await Promise.all([
          adminFetchCategories(true),
          adminFetchEavAttributes(),
        ]);
        if (cancelled) {
          return;
        }
        setItems(cats.items);
        setAllAttrs(attrs);
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

  const openAttrs = async (cat: AdminCategory) => {
    setAttrCategoryId(cat.id);
    try {
      const linked = await adminFetchCategoryAttributes(cat.id);
      const next = new Set<number>();
      const sort: Record<number, string> = {};
      for (const a of linked) {
        next.add(a.id);
        const pivot = (a as { pivot?: { sort_order?: number } }).pivot;
        sort[a.id] = String(pivot?.sort_order ?? 0);
      }
      setLinkedIds(next);
      setAttrSort(sort);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to load attributes",
      );
    }
  };

  const saveAttrs = async () => {
    if (attrCategoryId === null) {
      return;
    }
    const attributes = Array.from(linkedIds).map((attribute_id) => ({
      attribute_id,
      sort_order: Number(attrSort[attribute_id] ?? 0) || 0,
    }));
    try {
      await adminSyncCategoryAttributes(attrCategoryId, attributes);
      setAttrCategoryId(null);
      toast.success("Category attributes updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sync failed");
    }
  };

  const toggleAttr = (id: number) => {
    setLinkedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
        setAttrSort((s) => ({ ...s, [id]: s[id] ?? "0" }));
      }
      return n;
    });
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    try {
      const body = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        parent_id: form.parent_id ? Number(form.parent_id) : null,
        image_url: form.image_url.trim() || null,
        description: form.description.trim() || null,
        is_active: form.is_active,
        sort_order: Number(form.sort_order) || 0,
      };
      if (form.id) {
        await adminUpdateCategory(form.id, body);
        toast.success("Category updated");
      } else {
        await adminCreateCategory(body as { name: string });
        toast.success("Category created");
      }
      setForm(emptyForm);
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  const edit = (c: AdminCategory) => {
    setForm({
      id: c.id,
      name: c.name,
      slug: c.slug,
      parent_id: c.parent_id != null ? String(c.parent_id) : "",
      image_url: c.image_url ?? "",
      description: c.description ?? "",
      is_active: c.is_active !== false,
      sort_order: String(c.sort_order ?? 0),
    });
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete this category?")) {
      return;
    }
    try {
      await adminDeleteCategory(id);
      await reload();
      toast.success("Category deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
      <p className="mt-1 text-gray-600 text-sm">
        Manage category tree and which EAV attributes apply per category.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={submit}
          className="rounded-xl border border-gray-200 bg-white p-5 space-y-3 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-gray-800">
            {form.id ? `Edit #${form.id}` : "New category"}
          </h2>
          <label className="block text-xs text-gray-500">Name</label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <label className="block text-xs text-gray-500">Slug</label>
          <input
            className={inputClass}
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="auto from name if empty"
          />
          <label className="block text-xs text-gray-500">Parent ID</label>
          <input
            className={inputClass}
            value={form.parent_id}
            onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
            placeholder="optional"
          />
          <label className="block text-xs text-gray-500">Image URL</label>
          <input
            className={inputClass}
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />
          <label className="block text-xs text-gray-500">Description</label>
          <textarea
            className={`${inputClass} min-h-[72px]`}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <label className="block text-xs text-gray-500">Sort order</label>
          <input
            className={inputClass}
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Active
          </label>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="rounded-md bg-sky-600 text-white px-4 py-2 text-sm font-medium hover:bg-sky-700"
            >
              Save
            </button>
            {form.id && (
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setForm(emptyForm)}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>

        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-200">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Parent</th>
                <th className="px-3 py-2 w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/80">
                  <td className="px-3 py-2 text-gray-500">{c.id}</td>
                  <td className="px-3 py-2 text-gray-800 font-medium">{c.name}</td>
                  <td className="px-3 py-2 text-gray-600">
                    {c.parent_id ?? "—"}
                  </td>
                  <td className="px-3 py-2 flex flex-wrap gap-1">
                    <button
                      type="button"
                      className="text-xs text-sky-600 hover:underline"
                      onClick={() => edit(c)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-xs text-sky-600 hover:underline"
                      onClick={() => void openAttrs(c)}
                    >
                      Attributes
                    </button>
                    <button
                      type="button"
                      className="text-xs text-rose-600 hover:underline"
                      onClick={() => void remove(c.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {attrCategoryId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/50 backdrop-blur-[1px] p-4">
          <div className="max-w-lg w-full rounded-xl border border-gray-200 bg-white p-5 max-h-[85vh] overflow-auto shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Category #{attrCategoryId} — linked attributes
            </h3>
            <ul className="mt-4 space-y-2">
              {allAttrs.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-3 text-sm border border-gray-200 rounded-md px-3 py-2 bg-gray-50/50"
                >
                  <input
                    type="checkbox"
                    checked={linkedIds.has(a.id)}
                    onChange={() => toggleAttr(a.id)}
                  />
                  <span className="flex-1 text-gray-800">
                    {a.name}{" "}
                    <span className="text-gray-500">({a.code})</span>
                  </span>
                  {linkedIds.has(a.id) && (
                    <input
                      className="w-16 rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                      value={attrSort[a.id] ?? "0"}
                      onChange={(e) =>
                        setAttrSort((s) => ({ ...s, [a.id]: e.target.value }))
                      }
                      title="Pivot sort order"
                    />
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2 justify-end">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setAttrCategoryId(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="rounded-md bg-sky-600 text-white px-4 py-2 text-sm font-medium hover:bg-sky-700"
                onClick={() => void saveAttrs()}
              >
                Save links
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
