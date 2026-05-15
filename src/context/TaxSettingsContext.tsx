import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isAdminRole, sessionRequest } from "../services/authApi";
import {
  adminFetchTaxSettings,
  adminUpdateTaxSettings,
} from "../services/adminApi";

const STORAGE_KEY = "ecom.tax-settings";

export type TaxSettingsState = {
  taxEnabled: boolean;
  taxRatePercent: number;
  loading: boolean;
  saving: boolean;
  refresh: () => Promise<void>;
  setTaxEnabled: (enabled: boolean) => Promise<void>;
};

type StoredTaxSettings = {
  taxEnabled: boolean;
  taxRatePercent: number;
};

const DEFAULT_SETTINGS: StoredTaxSettings = {
  taxEnabled: false,
  taxRatePercent: 14,
};

const TaxSettingsContext = createContext<TaxSettingsState | null>(null);

function loadStoredSettings(): StoredTaxSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw) as Partial<StoredTaxSettings>;
    return {
      taxEnabled: Boolean(parsed.taxEnabled),
      taxRatePercent:
        typeof parsed.taxRatePercent === "number" && parsed.taxRatePercent > 0
          ? parsed.taxRatePercent
          : DEFAULT_SETTINGS.taxRatePercent,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function persistSettings(next: StoredTaxSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function TaxSettingsProvider({ children }: { children: ReactNode }) {
  const [taxEnabled, setTaxEnabledState] = useState(() => loadStoredSettings().taxEnabled);
  const [taxRatePercent, setTaxRatePercent] = useState(
    () => loadStoredSettings().taxRatePercent,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const session = await sessionRequest();
      if (session.authenticated && isAdminRole(session.user)) {
        const settings = await adminFetchTaxSettings();
        const next = {
          taxEnabled: settings.tax_enabled,
          taxRatePercent: settings.tax_rate_percent,
        };
        setTaxEnabledState(next.taxEnabled);
        setTaxRatePercent(next.taxRatePercent);
        persistSettings(next);
        return;
      }

      const stored = loadStoredSettings();
      setTaxEnabledState(stored.taxEnabled);
      setTaxRatePercent(stored.taxRatePercent);
    } catch {
      const stored = loadStoredSettings();
      setTaxEnabledState(stored.taxEnabled);
      setTaxRatePercent(stored.taxRatePercent);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setTaxEnabled = useCallback(async (enabled: boolean) => {
    setSaving(true);
    try {
      const settings = await adminUpdateTaxSettings({ tax_enabled: enabled });
      const next = {
        taxEnabled: settings.tax_enabled,
        taxRatePercent: settings.tax_rate_percent,
      };
      setTaxEnabledState(next.taxEnabled);
      setTaxRatePercent(next.taxRatePercent);
      persistSettings(next);
    } finally {
      setSaving(false);
    }
  }, []);

  const value = useMemo(
    (): TaxSettingsState => ({
      taxEnabled,
      taxRatePercent,
      loading,
      saving,
      refresh,
      setTaxEnabled,
    }),
    [taxEnabled, taxRatePercent, loading, saving, refresh, setTaxEnabled],
  );

  return (
    <TaxSettingsContext.Provider value={value}>
      {children}
    </TaxSettingsContext.Provider>
  );
}

export function useTaxSettings(): TaxSettingsState {
  const ctx = useContext(TaxSettingsContext);
  if (!ctx) {
    throw new Error("useTaxSettings must be used within TaxSettingsProvider");
  }
  return ctx;
}
