import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import type {
  AdminCategory,
  AdminEavAttribute,
  AdminProductEavRow,
  AdminProductImage,
} from "../../types/admin";
import {
  adminCreateProduct,
  adminCreateProductImage,
  adminDeleteProductImage,
  adminFetchCategories,
  adminFetchCategoryAttributes,
  adminFetchProduct,
  adminFetchProductEavValues,
  adminFetchProductImages,
  adminSyncProductEavValues,
  adminUpdateProduct,
  adminUpdateProductImage,
} from "../../services/adminApi";

type EavDraft = Record<
  number,
  { kind: string; raw: string } // raw: option id for select, text for others
>;

function rowToDraft(row: AdminProductEavRow): { kind: string; raw: string } {
  const t = row.attribute?.type ?? "varchar";
  if (t === "select") {
    return { kind: t, raw: row.option_id ? String(row.option_id) : "" };
  }
  if (t === "text") {
    return { kind: t, raw: row.value_text ?? "" };
  }
  if (t === "int") {
    return { kind: t, raw: row.value_int != null ? String(row.value_int) : "" };
  }
  if (t === "decimal") {
    return {
      kind: t,
      raw: row.value_decimal != null ? String(row.value_decimal) : "",
    };
  }
  if (t === "datetime") {
    return { kind: t, raw: row.value_datetime ?? "" };
  }
  return { kind: t, raw: row.value_varchar ?? "" };
}

function rowToSyncPayload(row: AdminProductEavRow): Record<string, unknown> {
  const t = row.attribute?.type ?? "varchar";
  const base: Record<string, unknown> = { attribute_id: row.attribute_id };
  if (t === "select") {
    base.option_id = row.option_id;
    return base;
  }
  if (t === "text") {
    base.value_text = row.value_text;
    return base;
  }
  if (t === "int") {
    base.value_int = row.value_int;
    return base;
  }
  if (t === "decimal") {
    base.value_decimal = row.value_decimal;
    return base;
  }
  if (t === "datetime") {
    base.value_datetime = row.value_datetime;
    return base;
  }
  base.value_varchar = row.value_varchar;
  return base;
}

function draftToPayload(
  a: AdminEavAttribute,
  d: { kind: string; raw: string },
): Record<string, unknown> | null {
  if (d.raw === "") {
    return null;
  }
  const base: Record<string, unknown> = { attribute_id: a.id };
  if (a.type === "select") {
    base.option_id = Number(d.raw);
    return base;
  }
  if (a.type === "text") {
    base.value_text = d.raw;
    return base;
  }
  if (a.type === "int") {
    base.value_int = Number(d.raw);
    return base;
  }
  if (a.type === "decimal") {
    base.value_decimal = d.raw;
    return base;
  }
  if (a.type === "datetime") {
    base.value_datetime = d.raw;
    return base;
  }
  base.value_varchar = d.raw;
  return base;
}

function buildMergedSyncPayload(
  linked: AdminEavAttribute[],
  draft: EavDraft,
  baseline: AdminProductEavRow[],
): Array<Record<string, unknown>> {
  const linkedIds = new Set(linked.map((l) => l.id));
  const baselineByAttr = new Map(
    baseline
      .filter((r) => linkedIds.has(r.attribute_id))
      .map((r) => [r.attribute_id, r]),
  );
  const values: Array<Record<string, unknown>> = [];
  for (const a of linked) {
    if (Object.prototype.hasOwnProperty.call(draft, a.id)) {
      const d = draft[a.id];
      const p = draftToPayload(a, d);
      if (p) {
        values.push(p);
      }
      continue;
    }
    const row = baselineByAttr.get(a.id);
    if (row) {
      values.push(rowToSyncPayload(row));
    }
  }
  return values;
}

const field =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm";

const fieldInteractive =
  `${field} transition-[box-shadow,border-color] focus:border-sky-400 focus:ring-2 focus:ring-sky-100/90 focus:outline-none`;

function attributeTypeLabel(type: string): string {
  switch (type) {
    case "select":
      return "Choice list";
    case "varchar":
      return "Short text";
    case "text":
      return "Long text";
    case "int":
      return "Whole number";
    case "decimal":
      return "Decimal";
    case "datetime":
      return "Date & time";
    default:
      return type;
  }
}

function attributePlaceholder(type: string): string {
  switch (type) {
    case "varchar":
      return "e.g. Brand name, short label…";
    case "decimal":
      return "e.g. 12.99";
    case "datetime":
      return "ISO or YYYY-MM-DD HH:mm";
    case "int":
      return "e.g. 42";
    default:
      return "";
  }
}

function isAttributeValueFilled(raw: string): boolean {
  return raw.trim() !== "";
}

export default function ProductEditor() {
  const { id: idParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = idParam === "new" || !idParam;
  const productId = isNew ? null : Number(idParam);

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [linkedAttrs, setLinkedAttrs] = useState<AdminEavAttribute[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("0");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<AdminProductImage[]>([]);
  const [imgForm, setImgForm] = useState({
    image_url: "",
    alt_text: "",
    is_primary: false,
  });
  const [eavDraft, setEavDraft] = useState<EavDraft>({});
  const [baselineEav, setBaselineEav] = useState<AdminProductEavRow[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const selectedCategory = useMemo(
    () => categories.find((c) => String(c.id) === categoryId),
    [categories, categoryId],
  );

  const eavFillSummary = useMemo(() => {
    let filled = 0;
    for (const a of linkedAttrs) {
      const d = eavDraft[a.id] ?? { kind: a.type, raw: "" };
      if (isAttributeValueFilled(d.raw)) {
        filled += 1;
      }
    }
    return { filled, total: linkedAttrs.length };
  }, [linkedAttrs, eavDraft]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { items } = await adminFetchCategories(true);
        if (cancelled) {
          return;
        }
        setCategories(items);
      } catch (e) {
        if (!cancelled) {
          toast.error(e instanceof Error ? e.message : "Failed to load categories");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cid = Number(categoryId);
    if (!Number.isFinite(cid) || cid <= 0) {
      setLinkedAttrs([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list = await adminFetchCategoryAttributes(cid);
        if (!cancelled) {
          setLinkedAttrs(list);
        }
      } catch {
        if (!cancelled) {
          setLinkedAttrs([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  useEffect(() => {
    if (isNew || productId === null || Number.isNaN(productId)) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [p, imgs, eavRows] = await Promise.all([
          adminFetchProduct(productId),
          adminFetchProductImages(productId),
          adminFetchProductEavValues(productId),
        ]);
        if (cancelled) {
          return;
        }
        setName(p.name);
        setSlug(p.slug);
        setSku(p.sku ?? "");
        setCategoryId(String(p.category_id));
        setBasePrice(String(p.base_price));
        setSalePrice(
          p.sale_price != null && p.sale_price !== ""
            ? String(p.sale_price)
            : "",
        );
        setStock(String(p.stock_qty ?? 0));
        setIsActive(p.is_active !== false);
        setImages(imgs);
        setBaselineEav(eavRows);
        const draft: EavDraft = {};
        for (const row of eavRows) {
          if (row.attribute_id) {
            draft[row.attribute_id] = rowToDraft(row);
          }
        }
        setEavDraft(draft);
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
  }, [isNew, productId]);

  const setDraft = (attrId: number, kind: string, raw: string) => {
    setEavDraft((d) => ({ ...d, [attrId]: { kind, raw } }));
  };

  const saveProductCore = async (targetId: number) => {
    const body = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      sku: sku.trim() || undefined,
      category_id: Number(categoryId),
      base_price: Number(basePrice) || 0,
      sale_price: salePrice.trim() === "" ? null : Number(salePrice),
      stock_qty: Number(stock) || 0,
      is_active: isActive,
    };
    if (isNew) {
      const created = await adminCreateProduct(body);
      return created.id;
    }
    await adminUpdateProduct(targetId, body);
    return targetId;
  };

  const saveEav = async (targetId: number) => {
    const cid = Number(categoryId);
    if (!Number.isFinite(cid) || cid <= 0) {
      return;
    }
    const list =
      linkedAttrs.length > 0
        ? linkedAttrs
        : await adminFetchCategoryAttributes(cid);
    const payload = buildMergedSyncPayload(list, eavDraft, baselineEav);
    const updated = await adminSyncProductEavValues(targetId, payload);
    setBaselineEav(updated);
  };

  const onSave = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!name.trim() || !categoryId) {
      toast.error("Name and category are required.");
      return;
    }
    setSaving(true);
    try {
      let id = productId;
      if (isNew || id === null) {
        id = await saveProductCore(0);
        navigate(`/admin/products/${id}`, { replace: true });
      } else {
        await saveProductCore(id);
      }
      if (id != null) {
        await saveEav(id);
      }
      toast.success("Product saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const addImage = async () => {
    if (!imgForm.image_url.trim() || productId === null || isNew) {
      toast.error("Save the product first, then add images.");
      return;
    }
    try {
      const row = await adminCreateProductImage(productId, {
        image_url: imgForm.image_url.trim(),
        alt_text: imgForm.alt_text.trim() || undefined,
        is_primary: imgForm.is_primary,
      });
      setImages((prev) => [...prev, row]);
      setImgForm({ image_url: "", alt_text: "", is_primary: false });
      toast.success("Image added");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Image add failed");
    }
  };

  const togglePrimary = async (img: AdminProductImage) => {
    if (productId === null) {
      return;
    }
    try {
      const updated = await adminUpdateProductImage(productId, img.id, {
        is_primary: !img.is_primary,
      });
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? updated : { ...i, is_primary: false })),
      );
      toast.success("Image updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  const deleteImage = async (img: AdminProductImage) => {
    if (productId === null || !window.confirm("Remove this image?")) {
      return;
    }
    try {
      await adminDeleteProductImage(productId, img.id);
      setImages((prev) => prev.filter((i) => i.id !== img.id));
      toast.success("Image removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading product…</p>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
        <Link to="/admin/products" className="hover:text-sky-600">
          ← Products
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-gray-800">
        {isNew ? "New product" : `Edit product #${productId}`}
      </h1>

      <form
        onSubmit={(e) => void onSave(e)}
        className="mt-6 space-y-8 max-w-3xl"
      >
        <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-3 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800">Core</h2>
          <label className="block text-xs text-gray-500">Name</label>
          <input
            className={field}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label className="block text-xs text-gray-500">Slug</label>
          <input
            className={field}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <label className="block text-xs text-gray-500">SKU</label>
          <input
            className={field}
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Leave blank to auto-generate on create"
          />
          <label className="block text-xs text-gray-500">Category</label>
          <select
            className={field}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (#{c.id})
              </option>
            ))}
          </select>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500">Base price</label>
              <input
                type="number"
                step="0.01"
                className={field}
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Sale price</label>
              <input
                type="number"
                step="0.01"
                className={field}
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="optional"
              />
            </div>
          </div>
          <label className="block text-xs text-gray-500">Stock qty</label>
          <input
            type="number"
            className={`${field} max-w-xs`}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
          </label>
        </section>

        <section className="rounded-xl border border-gray-200 bg-gradient-to-b from-sky-50/40 to-white p-5 sm:p-6 shadow-sm ring-1 ring-gray-100/80">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">
                  Attribute values
                </h2>
                {linkedAttrs.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-sky-800 ring-1 ring-sky-200/80 shadow-sm">
                    {eavFillSummary.filled} of {eavFillSummary.total} filled
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
                These fields come from attributes linked to the product&apos;s
                category. Save the product to persist values. Clearing a field
                removes that value on save.
              </p>
            </div>
            {linkedAttrs.length > 0 && (
              <div className="shrink-0 w-full sm:w-40 h-1.5 rounded-full bg-gray-200 overflow-hidden sm:mt-2">
                <div
                  className="h-full rounded-full bg-sky-500 transition-[width] duration-300 ease-out"
                  style={{
                    width:
                      eavFillSummary.total === 0
                        ? "0%"
                        : `${Math.round(
                            (eavFillSummary.filled / eavFillSummary.total) *
                              100,
                          )}%`,
                  }}
                  role="progressbar"
                  aria-valuenow={eavFillSummary.filled}
                  aria-valuemin={0}
                  aria-valuemax={eavFillSummary.total}
                  aria-label="Attributes filled"
                />
              </div>
            )}
          </div>

          <div className="mt-5">
            {!categoryId ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/60 px-6 py-10 text-center">
                <p className="text-sm font-medium text-gray-800">
                  Pick a category first
                </p>
                <p className="mt-1.5 text-xs text-gray-600 max-w-sm mx-auto">
                  Attribute fields are loaded from the category you select in
                  the Core section above.
                </p>
              </div>
            ) : linkedAttrs.length === 0 ? (
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 px-5 py-8 sm:px-8 sm:py-10">
                <p className="text-sm font-medium text-amber-950">
                  No attributes on{" "}
                  <span className="font-semibold">
                    {selectedCategory?.name ?? "this category"}
                  </span>
                </p>
                <p className="mt-2 text-xs text-amber-900/80 max-w-md leading-relaxed">
                  Link attributes to this category in Categories admin. After
                  that, return here and the fields will appear automatically.
                </p>
                <Link
                  to="/admin/categories"
                  className="mt-4 inline-flex items-center justify-center rounded-md bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                >
                  Open Categories
                </Link>
              </div>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {linkedAttrs.map((a) => {
                  const d = eavDraft[a.id] ?? { kind: a.type, raw: "" };
                  const filled = isAttributeValueFilled(d.raw);
                  const inputId = `eav-attr-${a.id}`;
                  const hintId = `eav-hint-${a.id}`;
                  const opts = a.options ?? [];
                  const selectEmpty = a.type === "select" && opts.length === 0;
                  const gridSpanClass =
                    a.type === "int" ||
                    a.type === "decimal" ||
                    a.type === "varchar"
                      ? "sm:col-span-1"
                      : "sm:col-span-2";

                  return (
                    <li key={a.id} className={gridSpanClass}>
                      <div className="group relative flex h-full flex-col rounded-xl border border-gray-200/90 bg-white p-4 shadow-sm transition-shadow hover:shadow-md hover:border-gray-300/90">
                        <div
                          className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-sky-400/90 opacity-90"
                          aria-hidden
                        />
                        <div className="pl-3 flex flex-col gap-3 min-h-0">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <label
                                  htmlFor={inputId}
                                  className="text-sm font-semibold text-gray-900 truncate max-w-full cursor-pointer"
                                >
                                  {a.name}
                                </label>
                                <span
                                  className={`inline-flex h-2 w-2 shrink-0 rounded-full ring-2 ring-white ${
                                    filled
                                      ? "bg-emerald-500"
                                      : "bg-gray-300"
                                  }`}
                                  title={filled ? "Has a value" : "Empty"}
                                  aria-hidden
                                />
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
                                <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-gray-700">
                                  {a.code}
                                </code>
                                <span className="text-gray-300" aria-hidden>
                                  ·
                                </span>
                                <span className="rounded-full bg-sky-50 px-2 py-0.5 font-medium text-sky-900 ring-1 ring-sky-100">
                                  {attributeTypeLabel(a.type)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {a.type === "select" && (
                            <div className="space-y-1.5">
                              <select
                                id={inputId}
                                className={`w-full ${fieldInteractive}`}
                                value={d.raw}
                                onChange={(e) =>
                                  setDraft(a.id, a.type, e.target.value)
                                }
                                aria-describedby={selectEmpty ? hintId : undefined}
                              >
                                <option value="">Not set</option>
                                {opts.map((o) => (
                                  <option key={o.id} value={o.id}>
                                    {o.label}
                                  </option>
                                ))}
                              </select>
                              {selectEmpty && (
                                <p
                                  id={hintId}
                                  className="text-xs text-amber-800 bg-amber-50/90 border border-amber-100 rounded-md px-2.5 py-2"
                                >
                                  No options yet. Add options in{" "}
                                  <Link
                                    to="/admin/attributes"
                                    className="font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-950"
                                  >
                                    Attributes
                                  </Link>
                                  .
                                </p>
                              )}
                            </div>
                          )}
                          {a.type === "text" && (
                            <textarea
                              id={inputId}
                              className={`w-full min-h-[88px] resize-y ${fieldInteractive}`}
                              value={d.raw}
                              onChange={(e) =>
                                setDraft(a.id, a.type, e.target.value)
                              }
                              placeholder="Long description, specs, HTML…"
                              spellCheck
                            />
                          )}
                          {(a.type === "varchar" ||
                            a.type === "datetime" ||
                            a.type === "decimal") && (
                            <input
                              id={inputId}
                              className={`w-full ${fieldInteractive}`}
                              value={d.raw}
                              onChange={(e) =>
                                setDraft(a.id, a.type, e.target.value)
                              }
                              placeholder={attributePlaceholder(a.type)}
                            />
                          )}
                          {a.type === "int" && (
                            <input
                              id={inputId}
                              type="number"
                              className={`w-full ${fieldInteractive}`}
                              value={d.raw}
                              onChange={(e) =>
                                setDraft(a.id, a.type, e.target.value)
                              }
                              placeholder={attributePlaceholder("int")}
                            />
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-sky-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-sky-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save product & values"}
          </button>
        </div>
      </form>

      {!isNew && productId !== null && (
        <section className="mt-10 max-w-3xl rounded-xl border border-gray-200 bg-white p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800">Images</h2>
          <div className="flex flex-wrap gap-2">
            {images.map((im) => (
              <div
                key={im.id}
                className="relative w-28 border border-gray-200 rounded-md overflow-hidden bg-gray-50"
              >
                <img
                  src={im.image_url}
                  alt={im.alt_text ?? ""}
                  className="h-24 w-full object-cover"
                />
                {im.is_primary && (
                  <span className="absolute top-1 left-1 text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-medium">
                    primary
                  </span>
                )}
                <div className="p-1 flex gap-1 text-[10px]">
                  <button
                    type="button"
                    className="text-sky-600"
                    onClick={() => void togglePrimary(im)}
                  >
                    primary
                  </button>
                  <button
                    type="button"
                    className="text-rose-600"
                    onClick={() => void deleteImage(im)}
                  >
                    del
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <input
              className={`sm:col-span-2 ${field}`}
              placeholder="Image URL"
              value={imgForm.image_url}
              onChange={(e) =>
                setImgForm({ ...imgForm, image_url: e.target.value })
              }
            />
            <input
              className={field}
              placeholder="Alt text"
              value={imgForm.alt_text}
              onChange={(e) =>
                setImgForm({ ...imgForm, alt_text: e.target.value })
              }
            />
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={imgForm.is_primary}
                onChange={(e) =>
                  setImgForm({ ...imgForm, is_primary: e.target.checked })
                }
              />
              Set as primary
            </label>
          </div>
          <button
            type="button"
            onClick={() => void addImage()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Add image
          </button>
        </section>
      )}
    </div>
  );
}
