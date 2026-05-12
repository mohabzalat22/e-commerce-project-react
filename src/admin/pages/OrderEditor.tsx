import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import type { AdminOrder, AdminProduct } from "../../types/admin";
import {
  adminCreateOrder,
  adminDeleteOrder,
  adminFetchOrder,
  adminFetchProduct,
  adminUpdateOrder,
} from "../../services/adminApi";
import { formatMoney } from "../../components/checkout/formatMoney";

const STATUSES = ["pending", "processing", "shipped", "cancelled"] as const;

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm";

type DraftLine = {
  key: string;
  product_id: string;
  quantity: string;
  size_label: string;
  color_label: string;
  name: string;
  image_url: string;
  unit_price_cents: string;
};

function newLine(): DraftLine {
  return {
    key: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    product_id: "",
    quantity: "1",
    size_label: "",
    color_label: "",
    name: "",
    image_url: "",
    unit_price_cents: "",
  };
}

function priceToCents(p: string | number | null | undefined): number {
  if (p == null || p === "") {
    return 0;
  }
  const n = typeof p === "number" ? p : parseFloat(String(p));
  if (Number.isNaN(n)) {
    return 0;
  }
  return Math.round(n * 100);
}

function primaryImageUrl(product: AdminProduct): string {
  const imgs = (product as { images?: { image_url: string; is_primary?: boolean }[] })
    .images;
  if (!imgs?.length) {
    return "";
  }
  const primary = imgs.find((i) => i.is_primary);
  return (primary ?? imgs[0]).image_url;
}

export default function OrderEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  /** Edit mode: loaded order id */
  const [order, setOrder] = useState<AdminOrder | null>(null);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [status, setStatus] = useState<string>("pending");

  const [lines, setLines] = useState<DraftLine[]>(() => [newLine()]);

  const totalsPreview = useMemo(() => {
    const subtotal = lines.reduce((sum, line) => {
      const unit = parseInt(line.unit_price_cents, 10);
      const qty = parseInt(line.quantity, 10) || 0;
      if (Number.isNaN(unit) || unit < 0 || qty < 1) {
        return sum;
      }
      return sum + unit * qty;
    }, 0);
    const shipping = 599;
    return { subtotal, shipping, total: subtotal + shipping };
  }, [lines]);

  const loadProductIntoLine = useCallback(async (index: number) => {
    const line = lines[index];
    const pid = parseInt(line.product_id, 10);
    if (!pid || Number.isNaN(pid)) {
      toast.error("Enter a numeric product id first.");
      return;
    }
    try {
      const product = await adminFetchProduct(pid);
      const cents = priceToCents(
        product.sale_price != null && String(product.sale_price) !== ""
          ? product.sale_price
          : product.base_price,
      );
      setLines((prev) => {
        const next = [...prev];
        const cur = next[index];
        if (!cur) {
          return prev;
        }
        next[index] = {
          ...cur,
          name: product.name,
          image_url: primaryImageUrl(product),
          unit_price_cents: String(cents),
        };
        return next;
      });
      toast.success(`Loaded catalog data for product #${pid}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Product not found");
    }
  }, [lines]);

  useEffect(() => {
    if (isNew || !id) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const o = await adminFetchOrder(id);
        if (cancelled) {
          return;
        }
        setOrder(o);
        setEmail(o.email);
        setFullName(o.full_name);
        setAddressLine1(o.address_line1);
        setCity(o.city);
        setPostalCode(o.postal_code);
        setStatus(o.status ?? "pending");
      } catch (e) {
        if (!cancelled) {
          toast.error(e instanceof Error ? e.message : "Failed to load order");
          navigate("/admin/orders", { replace: true });
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
  }, [id, isNew, navigate]);

  const handleSaveEdit = async () => {
    if (!id || isNew) {
      return;
    }
    setSaving(true);
    try {
      const updated = await adminUpdateOrder(id, {
        email: email.trim(),
        full_name: fullName.trim(),
        address_line1: addressLine1.trim(),
        city: city.trim(),
        postal_code: postalCode.trim(),
        status,
      });
      setOrder(updated);
      toast.success("Order updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isNew) {
      return;
    }
    if (
      !window.confirm(
        "Delete this order and all its line items? This cannot be undone.",
      )
    ) {
      return;
    }
    setSaving(true);
    try {
      await adminDeleteOrder(id);
      toast.success("Order deleted");
      navigate("/admin/orders");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    const ship = {
      email: email.trim(),
      full_name: fullName.trim(),
      address_line1: addressLine1.trim(),
      city: city.trim(),
      postal_code: postalCode.trim(),
    };
    if (
      !ship.email ||
      !ship.full_name ||
      !ship.address_line1 ||
      !ship.city ||
      !ship.postal_code
    ) {
      toast.error("Fill in all shipping fields.");
      return;
    }

    const payloadLines = [];
    for (const line of lines) {
      const pid = parseInt(line.product_id, 10);
      const qty = parseInt(line.quantity, 10);
      const unit = parseInt(line.unit_price_cents, 10);
      if (!pid || Number.isNaN(pid) || qty < 1 || Number.isNaN(unit) || unit < 0) {
        toast.error("Each line needs product id, quantity ≥ 1, and unit price (cents).");
        return;
      }
      if (!line.name.trim() || !line.image_url.trim()) {
        toast.error("Each line needs name and image URL (use “Load from catalog”).");
        return;
      }
      if (!line.size_label.trim() || !line.color_label.trim()) {
        toast.error("Each line needs size and color labels.");
        return;
      }
      payloadLines.push({
        product_id: pid,
        name: line.name.trim(),
        image_url: line.image_url.trim(),
        unit_price_cents: unit,
        quantity: qty,
        size_label: line.size_label.trim(),
        color_label: line.color_label.trim(),
      });
    }

    if (payloadLines.length === 0) {
      toast.error("Add at least one valid line.");
      return;
    }

    setSaving(true);
    try {
      const placed = await adminCreateOrder({
        shipping: ship,
        lines: payloadLines,
      });
      toast.success("Order created");
      navigate(`/admin/orders/${encodeURIComponent(placed.id)}`, {
        replace: true,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Create failed");
    } finally {
      setSaving(false);
    }
  };

  if (!isNew && loading) {
    return <p className="text-gray-500 text-sm">Loading…</p>;
  }

  if (!isNew && !order) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-6">
        <Link
          to="/admin/orders"
          className="text-sky-700 font-medium hover:underline"
        >
          ← Orders
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">
          {isNew ? "New order" : "Order detail"}
        </span>
      </div>

      <h1 className="text-2xl font-semibold text-gray-800">
        {isNew ? "Create order" : "Edit order"}
      </h1>
      {!isNew && order ? (
        <p className="mt-1 font-mono text-xs text-gray-500 break-all">
          {order.id}
        </p>
      ) : (
        <p className="mt-1 text-gray-600 text-sm">
          Same payload as checkout: shipping plus catalog lines (UUID assigned by
          API).
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Shipping
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="sm:col-span-2 block text-xs font-medium text-gray-600">
              Email
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={saving}
              />
            </label>
            <label className="sm:col-span-2 block text-xs font-medium text-gray-600">
              Full name
              <input
                type="text"
                className={inputClass}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={saving}
              />
            </label>
            <label className="sm:col-span-2 block text-xs font-medium text-gray-600">
              Address
              <input
                type="text"
                className={inputClass}
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                disabled={saving}
              />
            </label>
            <label className="block text-xs font-medium text-gray-600">
              City
              <input
                type="text"
                className={inputClass}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={saving}
              />
            </label>
            <label className="block text-xs font-medium text-gray-600">
              Postal code
              <input
                type="text"
                className={inputClass}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                disabled={saving}
              />
            </label>
            {!isNew ? (
              <label className="sm:col-span-2 block text-xs font-medium text-gray-600">
                Status
                <select
                  className={inputClass}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={saving}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            {isNew ? "Lines" : "Line items"}
          </h2>

          {isNew ? (
            <div className="mt-4 space-y-4">
              {lines.map((line, index) => (
                <div
                  key={line.key}
                  className="rounded-lg border border-gray-200 p-3 space-y-2 bg-gray-50/80"
                >
                  <div className="flex flex-wrap gap-2 items-end">
                    <label className="text-xs font-medium text-gray-600 w-24">
                      Product #
                      <input
                        type="number"
                        min={1}
                        className={inputClass}
                        value={line.product_id}
                        onChange={(e) =>
                          setLines((prev) => {
                            const n = [...prev];
                            const row = n[index];
                            if (row) {
                              n[index] = { ...row, product_id: e.target.value };
                            }
                            return n;
                          })
                        }
                        disabled={saving}
                      />
                    </label>
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 hover:bg-gray-50"
                      onClick={() => void loadProductIntoLine(index)}
                      disabled={saving}
                    >
                      Load from catalog
                    </button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="text-xs font-medium text-gray-600">
                      Qty
                      <input
                        type="number"
                        min={1}
                        className={inputClass}
                        value={line.quantity}
                        onChange={(e) =>
                          setLines((prev) => {
                            const n = [...prev];
                            const row = n[index];
                            if (row) {
                              n[index] = { ...row, quantity: e.target.value };
                            }
                            return n;
                          })
                        }
                        disabled={saving}
                      />
                    </label>
                    <label className="text-xs font-medium text-gray-600">
                      Unit (¢)
                      <input
                        type="number"
                        min={0}
                        className={inputClass}
                        value={line.unit_price_cents}
                        onChange={(e) =>
                          setLines((prev) => {
                            const n = [...prev];
                            const row = n[index];
                            if (row) {
                              n[index] = {
                                ...row,
                                unit_price_cents: e.target.value,
                              };
                            }
                            return n;
                          })
                        }
                        disabled={saving}
                      />
                    </label>
                    <label className="text-xs font-medium text-gray-600">
                      Size
                      <input
                        type="text"
                        className={inputClass}
                        value={line.size_label}
                        onChange={(e) =>
                          setLines((prev) => {
                            const n = [...prev];
                            const row = n[index];
                            if (row) {
                              n[index] = { ...row, size_label: e.target.value };
                            }
                            return n;
                          })
                        }
                        disabled={saving}
                      />
                    </label>
                    <label className="text-xs font-medium text-gray-600">
                      Color
                      <input
                        type="text"
                        className={inputClass}
                        value={line.color_label}
                        onChange={(e) =>
                          setLines((prev) => {
                            const n = [...prev];
                            const row = n[index];
                            if (row) {
                              n[index] = {
                                ...row,
                                color_label: e.target.value,
                              };
                            }
                            return n;
                          })
                        }
                        disabled={saving}
                      />
                    </label>
                    <label className="sm:col-span-2 text-xs font-medium text-gray-600">
                      Name
                      <input
                        type="text"
                        className={inputClass}
                        value={line.name}
                        onChange={(e) =>
                          setLines((prev) => {
                            const n = [...prev];
                            const row = n[index];
                            if (row) {
                              n[index] = { ...row, name: e.target.value };
                            }
                            return n;
                          })
                        }
                        disabled={saving}
                      />
                    </label>
                    <label className="sm:col-span-2 text-xs font-medium text-gray-600">
                      Image URL
                      <input
                        type="text"
                        className={inputClass}
                        value={line.image_url}
                        onChange={(e) =>
                          setLines((prev) => {
                            const n = [...prev];
                            const row = n[index];
                            if (row) {
                              n[index] = { ...row, image_url: e.target.value };
                            }
                            return n;
                          })
                        }
                        disabled={saving}
                      />
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:underline disabled:opacity-50"
                      disabled={saving || lines.length <= 1}
                      onClick={() =>
                        setLines((prev) => prev.filter((_, i) => i !== index))
                      }
                    >
                      Remove line
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="text-sm font-medium text-sky-700 hover:underline"
                onClick={() => setLines((prev) => [...prev, newLine()])}
                disabled={saving}
              >
                + Add line
              </button>
              <div className="border-t border-gray-200 pt-3 text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums">
                    {formatMoney(totalsPreview.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping (fixed)</span>
                  <span className="tabular-nums">
                    {formatMoney(totalsPreview.shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span className="tabular-nums">
                    {formatMoney(totalsPreview.total)}
                  </span>
                </div>
              </div>
            </div>
          ) : order?.items?.length ? (
            <ul className="mt-4 divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 p-3 text-sm bg-white"
                >
                  <img
                    src={item.image_url}
                    alt=""
                    className="h-14 w-14 rounded object-cover shrink-0 bg-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      #{item.product_id} · {item.size_label} / {item.color_label}{" "}
                      · Qty {item.quantity}
                    </div>
                    <div className="text-xs text-gray-700 mt-1 tabular-nums">
                      {formatMoney(item.unit_price_cents)} each · Line{" "}
                      {formatMoney(item.line_total_cents)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">No line items.</p>
          )}

          {!isNew && order ? (
            <dl className="mt-6 space-y-1 text-sm border-t border-gray-200 pt-4 text-gray-700">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">
                  {formatMoney(order.subtotal_cents)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="tabular-nums">
                  {formatMoney(order.shipping_cents)}
                </dd>
              </div>
              <div className="flex justify-between font-semibold text-gray-900">
                <dt>Total</dt>
                <dd className="tabular-nums">
                  {formatMoney(order.total_cents)}
                </dd>
              </div>
            </dl>
          ) : null}
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {isNew ? (
          <button
            type="button"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-60"
            onClick={() => void handleCreate()}
            disabled={saving}
          >
            {saving ? "Creating…" : "Create order"}
          </button>
        ) : (
          <>
            <button
              type="button"
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-60"
              onClick={() => void handleSaveEdit()}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              className="rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-50 disabled:opacity-60"
              onClick={() => void handleDelete()}
              disabled={saving}
            >
              Delete order
            </button>
          </>
        )}
      </div>
    </div>
  );
}
