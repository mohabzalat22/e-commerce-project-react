import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AdminEavAttribute, AdminEavOption } from "../../types/admin";
import {
  adminCreateEavAttribute,
  adminCreateEavOption,
  adminDeleteEavAttribute,
  adminDeleteEavOption,
  adminFetchEavAttributes,
  adminUpdateEavAttribute,
  adminUpdateEavOption,
} from "../../services/adminApi";

export default function AttributesAdmin() {
  const [items, setItems] = useState<AdminEavAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [form, setForm] = useState({
    id: 0,
    name: "",
    code: "",
    type: "varchar",
    is_required: false,
    is_filterable: false,
    is_searchable: false,
    sort_order: "0",
  });
  const [optForm, setOptForm] = useState<Record<number, { label: string; value: string }>>({});

  const load = async () => {
    try {
      const list = await adminFetchEavAttributes();
      setItems(list);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const resetForm = () => {
    setForm({
      id: 0,
      name: "",
      code: "",
      type: "varchar",
      is_required: false,
      is_filterable: false,
      is_searchable: false,
      sort_order: "0",
    });
  };

  const saveAttr = async (ev: React.FormEvent) => {
    ev.preventDefault();
    try {
      const body = {
        name: form.name.trim(),
        code: form.code.trim(),
        type: form.type,
        is_required: form.is_required,
        is_filterable: form.is_filterable,
        is_searchable: form.is_searchable,
        sort_order: Number(form.sort_order) || 0,
      };
      if (form.id) {
        await adminUpdateEavAttribute(form.id, body);
        toast.success("Attribute updated");
      } else {
        await adminCreateEavAttribute(body);
        toast.success("Attribute created");
      }
      resetForm();
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  const editAttr = (a: AdminEavAttribute) => {
    setForm({
      id: a.id,
      name: a.name,
      code: a.code,
      type: a.type,
      is_required: !!a.is_required,
      is_filterable: !!a.is_filterable,
      is_searchable: !!a.is_searchable,
      sort_order: String(a.sort_order ?? 0),
    });
  };

  const delAttr = async (id: number) => {
    if (!window.confirm("Delete attribute and its options?")) {
      return;
    }
    try {
      await adminDeleteEavAttribute(id);
      if (expanded === id) {
        setExpanded(null);
      }
      await load();
      toast.success("Attribute deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const addOption = async (attributeId: number) => {
    const raw = optForm[attributeId] ?? { label: "", value: "" };
    if (!raw.label.trim() || !raw.value.trim()) {
      return;
    }
    try {
      await adminCreateEavOption(attributeId, {
        label: raw.label.trim(),
        value: raw.value.trim(),
      });
      setOptForm((o) => ({ ...o, [attributeId]: { label: "", value: "" } }));
      await load();
      toast.success("Option added");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Option add failed");
    }
  };

  const saveOption = async (attributeId: number, o: AdminEavOption) => {
    const label = window.prompt("Label", o.label);
    if (label === null) {
      return;
    }
    const value = window.prompt("Value", o.value);
    if (value === null) {
      return;
    }
    try {
      await adminUpdateEavOption(attributeId, o.id, {
        label: label.trim(),
        value: value.trim(),
        sort_order: o.sort_order,
      });
      await load();
      toast.success("Option updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  const delOption = async (attributeId: number, o: AdminEavOption) => {
    if (!window.confirm("Delete this option?")) {
      return;
    }
    try {
      await adminDeleteEavOption(attributeId, o.id);
      await load();
      toast.success("Option deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">EAV attributes</h1>
      <p className="mt-1 text-gray-600 text-sm">
        Catalog facets and product fields (options for{" "}
        <code className="text-gray-500 bg-gray-100 px-1 rounded text-xs">select</code>{" "}
        type).
      </p>

      <form
        onSubmit={(e) => void saveAttr(e)}
        className="mt-8 max-w-xl rounded-xl border border-gray-200 bg-white p-5 space-y-3 shadow-sm"
      >
        <h2 className="text-sm font-semibold text-gray-800">
          {form.id ? `Edit #${form.id}` : "New attribute"}
        </h2>
        <input
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-xs shadow-sm"
          placeholder="code_snake_case"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
        <select
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="varchar">varchar</option>
          <option value="text">text</option>
          <option value="int">int</option>
          <option value="decimal">decimal</option>
          <option value="datetime">datetime</option>
          <option value="select">select</option>
        </select>
        <input
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm"
          placeholder="Sort order"
          value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
        />
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_required}
              onChange={(e) =>
                setForm({ ...form, is_required: e.target.checked })
              }
            />
            Required
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_filterable}
              onChange={(e) =>
                setForm({ ...form, is_filterable: e.target.checked })
              }
            />
            Filterable
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_searchable}
              onChange={(e) =>
                setForm({ ...form, is_searchable: e.target.checked })
              }
            />
            Searchable
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-md bg-sky-600 text-white px-4 py-2 text-sm font-medium hover:bg-sky-700"
          >
            Save attribute
          </button>
          {form.id !== 0 && (
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={resetForm}
            >
              New instead
            </button>
          )}
        </div>
      </form>

      <div className="mt-10 rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-200">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2 w-44">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((a) => (
              <React.Fragment key={a.id}>
                <tr className="hover:bg-gray-50/80">
                  <td className="px-3 py-2 text-gray-500">{a.id}</td>
                  <td className="px-3 py-2 text-gray-800 font-medium">{a.name}</td>
                  <td className="px-3 py-2 text-gray-600 font-mono text-xs">
                    {a.code}
                  </td>
                  <td className="px-3 py-2 text-gray-600">{a.type}</td>
                  <td className="px-3 py-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="text-sky-600 text-xs hover:underline"
                      onClick={() =>
                        setExpanded((e) => (e === a.id ? null : a.id))
                      }
                    >
                      {expanded === a.id ? "Hide options" : "Options"}
                    </button>
                    <button
                      type="button"
                      className="text-sky-600 text-xs hover:underline"
                      onClick={() => editAttr(a)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-rose-600 text-xs hover:underline"
                      onClick={() => void delAttr(a.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {expanded === a.id && (
                  <tr className="bg-gray-50/80">
                    <td colSpan={5} className="px-4 py-3 space-y-2">
                      <div className="text-xs text-gray-500 uppercase">
                        Options ({a.options?.length ?? 0})
                      </div>
                      <ul className="space-y-1 text-xs">
                        {(a.options ?? []).map((o) => (
                          <li
                            key={o.id}
                            className="flex flex-wrap items-center gap-2 text-gray-700"
                          >
                            <span className="font-mono text-gray-500">
                              #{o.id}
                            </span>
                            <span>{o.label}</span>
                            <span className="text-gray-500">({o.value})</span>
                            <button
                              type="button"
                              className="text-sky-600 hover:underline"
                              onClick={() => void saveOption(a.id, o)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="text-rose-600 hover:underline"
                              onClick={() => void delOption(a.id, o)}
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                      {a.type === "select" && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          <input
                            className="rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                            placeholder="Label"
                            value={optForm[a.id]?.label ?? ""}
                            onChange={(e) =>
                              setOptForm((o) => ({
                                ...o,
                                [a.id]: {
                                  label: e.target.value,
                                  value: o[a.id]?.value ?? "",
                                },
                              }))
                            }
                          />
                          <input
                            className="rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                            placeholder="Value"
                            value={optForm[a.id]?.value ?? ""}
                            onChange={(e) =>
                              setOptForm((o) => ({
                                ...o,
                                [a.id]: {
                                  label: o[a.id]?.label ?? "",
                                  value: e.target.value,
                                },
                              }))
                            }
                          />
                          <button
                            type="button"
                            className="rounded bg-sky-600 text-white px-2 py-1 text-xs hover:bg-sky-700"
                            onClick={() => void addOption(a.id)}
                          >
                            Add option
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
