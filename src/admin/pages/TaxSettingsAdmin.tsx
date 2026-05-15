import React from "react";
import { toast } from "sonner";
import { useTaxSettings } from "../../context/TaxSettingsContext";
import { formatPrice } from "../../types/catalog";

export default function TaxSettingsAdmin() {
  const { taxEnabled, taxRatePercent, loading, saving, setTaxEnabled } =
    useTaxSettings();

  const handleToggle = async () => {
    try {
      await setTaxEnabled(!taxEnabled);
      toast.success(
        `Tax is now ${!taxEnabled ? "enabled" : "disabled"} for displayed prices.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update tax settings",
      );
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading tax settings…</p>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Tax Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Turn tax on or off for catalog prices across the storefront.
          </p>
        </div>
        <span
          className={[
            "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            taxEnabled
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-gray-200 bg-gray-50 text-gray-700",
          ].join(" ")}
        >
          {taxEnabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-gray-900">
              Apply tax to displayed prices
            </div>
            <p className="mt-1 text-sm text-gray-600">
              When enabled, prices are shown with a {taxRatePercent}% markup.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggle}
            disabled={saving}
            className={[
              "inline-flex min-w-28 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition",
              taxEnabled
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-gray-900 text-white hover:bg-gray-800",
              saving ? "cursor-not-allowed opacity-60" : "",
            ].join(" ")}
          >
            {saving ? "Saving…" : taxEnabled ? "Disable tax" : "Enable tax"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Example base price
            </div>
            <div className="mt-2 text-lg font-semibold text-gray-900">
              {formatPrice(100, null, false, taxRatePercent)}
            </div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Example displayed price
            </div>
            <div className="mt-2 text-lg font-semibold text-gray-900">
              {formatPrice(100, null, taxEnabled, taxRatePercent)}
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs leading-6 text-gray-500">
          This setting is stored through the API and mirrored in the browser so
          the storefront can render the same tax state.
        </p>
      </div>
    </div>
  );
}
