import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CheckoutAddressForm, {
  type ShippingFields,
} from "../components/checkout/CheckoutAddressForm";
import CheckoutConfirmation from "../components/checkout/CheckoutConfirmation";
import CheckoutOrderSummary, {
  SHIPPING_CENTS,
} from "../components/checkout/CheckoutOrderSummary";
import { formatMoney } from "../components/checkout/formatMoney";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/api";

const initialShipping: ShippingFields = {
  email: "",
  fullName: "",
  addressLine1: "",
  city: "",
  postalCode: "",
};

function validateShipping(values: ShippingFields): Partial<
  Record<keyof ShippingFields, string>
> {
  const next: Partial<Record<keyof ShippingFields, string>> = {};
  if (!values.email.trim()) next.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    next.email = "Enter a valid email.";
  }
  if (!values.fullName.trim()) next.fullName = "Full name is required.";
  if (!values.addressLine1.trim()) {
    next.addressLine1 = "Address is required.";
  }
  if (!values.city.trim()) next.city = "City is required.";
  if (!values.postalCode.trim()) next.postalCode = "Postal code is required.";
  return next;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { lines, subtotalCents, clear } = useCart();
  const [shipping, setShipping] = useState<ShippingFields>(initialShipping);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ShippingFields, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (lines.length === 0 && !orderId) {
      navigate("/cart", { replace: true });
    }
  }, [lines.length, navigate, orderId]);

  const handleFieldChange = useCallback(
    <K extends keyof ShippingFields>(field: K, value: ShippingFields[K]) => {
      setShipping((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    },
    [],
  );

  const totalCents = useMemo(
    () => subtotalCents + SHIPPING_CENTS,
    [subtotalCents],
  );

  const handlePlaceOrder = useCallback(async () => {
    const v = validateShipping(shipping);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const placed = await placeOrder({
        shipping: {
          email: shipping.email.trim(),
          full_name: shipping.fullName.trim(),
          address_line1: shipping.addressLine1.trim(),
          city: shipping.city.trim(),
          postal_code: shipping.postalCode.trim(),
        },
        lines: lines.map((line) => ({
          product_id: line.productId,
          name: line.name,
          image_url: line.imageUrl,
          unit_price_cents: line.unitPriceCents,
          quantity: line.quantity,
          size_label: line.sizeLabel,
          color_label: line.colorLabel,
        })),
      });
      clear();
      setOrderId(placed.id);
      toast.success(`Order ${placed.id} confirmed.`);
    } catch (e) {
      let message = "Could not place order. Try again.";
      if (axios.isAxiosError(e)) {
        const body = e.response?.data as
          | { message?: string; errors?: Record<string, string> }
          | undefined;
        if (body?.message) {
          message = body.message;
        }
        if (body?.errors && typeof body.errors === "object") {
          const first = Object.values(body.errors)[0];
          if (typeof first === "string") {
            message = first;
          }
        }
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [clear, lines, shipping]);

  if (orderId) {
    return (
      <div className="mx-auto max-w-shell py-10">
        <CheckoutConfirmation orderId={orderId} />
      </div>
    );
  }

  if (lines.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-shell py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
          <p className="mt-1 text-sm text-gray-600">
            Review your cart and enter shipping details to place your order.
          </p>
        </div>
        <Link
          to="/cart"
          className="text-sm font-medium text-gray-700 underline decoration-gray-400 underline-offset-4 hover:text-gray-900"
        >
          Back to cart
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <CheckoutAddressForm
          values={shipping}
          onChange={handleFieldChange}
          errors={errors}
        />
        <CheckoutOrderSummary
          lines={lines}
          subtotalCents={subtotalCents}
          onPlaceOrder={handlePlaceOrder}
          isSubmitting={isSubmitting}
        />
      </div>

      <p className="mt-8 text-center text-xs text-gray-500">
        Total due on this demo order:{" "}
        <span className="font-medium text-gray-700">
          {formatMoney(totalCents)}
        </span>
      </p>
    </div>
  );
}
