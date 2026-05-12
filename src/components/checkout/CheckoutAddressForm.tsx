import React from "react";

export type ShippingFields = {
  email: string;
  fullName: string;
  addressLine1: string;
  city: string;
  postalCode: string;
};

type CheckoutAddressFormProps = {
  values: ShippingFields;
  onChange: <K extends keyof ShippingFields>(
    field: K,
    value: ShippingFields[K],
  ) => void;
  errors: Partial<Record<keyof ShippingFields, string>>;
};

const inputClass =
  "mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none ring-gray-900/0 transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10";

const labelClass = "block text-xs font-medium uppercase tracking-wide text-gray-600";

export default function CheckoutAddressForm({
  values,
  onChange,
  errors,
}: CheckoutAddressFormProps) {
  return (
    <section className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-gray-900">Shipping details</h2>
      <p className="mt-1 text-sm text-gray-500">
        Enter where we should send your order.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="checkout-email" className={labelClass}>
            Email
          </label>
          <input
            id="checkout-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="checkout-fullName" className={labelClass}>
            Full name
          </label>
          <input
            id="checkout-fullName"
            type="text"
            autoComplete="name"
            className={inputClass}
            value={values.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
          />
          {errors.fullName ? (
            <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="checkout-address" className={labelClass}>
            Address
          </label>
          <input
            id="checkout-address"
            type="text"
            autoComplete="street-address"
            className={inputClass}
            value={values.addressLine1}
            onChange={(e) => onChange("addressLine1", e.target.value)}
          />
          {errors.addressLine1 ? (
            <p className="mt-1 text-xs text-red-600">{errors.addressLine1}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="checkout-city" className={labelClass}>
            City
          </label>
          <input
            id="checkout-city"
            type="text"
            autoComplete="address-level2"
            className={inputClass}
            value={values.city}
            onChange={(e) => onChange("city", e.target.value)}
          />
          {errors.city ? (
            <p className="mt-1 text-xs text-red-600">{errors.city}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="checkout-postal" className={labelClass}>
            Postal code
          </label>
          <input
            id="checkout-postal"
            type="text"
            autoComplete="postal-code"
            className={inputClass}
            value={values.postalCode}
            onChange={(e) => onChange("postalCode", e.target.value)}
          />
          {errors.postalCode ? (
            <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
