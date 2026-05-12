import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type CartLine = {
  key: string;
  productId: number;
  name: string;
  imageUrl: string;
  unitPriceCents: number;
  sizeLabel: string;
  colorLabel: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotalCents: number;
  addLine: (input: Omit<CartLine, "key" | "quantity"> & { quantity?: number }) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeLine: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cart";

function loadInitial(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function makeKey(productId: number, sizeLabel: string, colorLabel: string): string {
  return `${productId}:${sizeLabel}:${colorLabel}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadInitial);

  const persist = useCallback((next: CartLine[]) => {
    setLines(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const addLine = useCallback(
    (input: Omit<CartLine, "key" | "quantity"> & { quantity?: number }) => {
      const qty = input.quantity ?? 1;
      const key = makeKey(input.productId, input.sizeLabel, input.colorLabel);
      setLines((prev) => {
        const existing = prev.find((l) => l.key === key);
        let next: CartLine[];
        if (existing) {
          next = prev.map((l) =>
            l.key === key ? { ...l, quantity: l.quantity + qty } : l,
          );
        } else {
          next = [
            ...prev,
            {
              key,
              productId: input.productId,
              name: input.name,
              imageUrl: input.imageUrl,
              unitPriceCents: input.unitPriceCents,
              sizeLabel: input.sizeLabel,
              colorLabel: input.colorLabel,
              quantity: qty,
            },
          ];
        }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((prev) => {
      const next =
        quantity <= 0
          ? prev.filter((l) => l.key !== key)
          : prev.map((l) => (l.key === key ? { ...l, quantity } : l));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const removeLine = useCallback((key: string) => {
    setLines((prev) => {
      const next = prev.filter((l) => l.key !== key);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  const itemCount = useMemo(
    () => lines.reduce((n, l) => n + l.quantity, 0),
    [lines],
  );

  const subtotalCents = useMemo(
    () => lines.reduce((n, l) => n + l.unitPriceCents * l.quantity, 0),
    [lines],
  );

  const value = useMemo(
    (): CartContextValue => ({
      lines,
      itemCount,
      subtotalCents,
      addLine,
      setQuantity,
      removeLine,
      clear,
    }),
    [lines, itemCount, subtotalCents, addLine, setQuantity, removeLine, clear],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
