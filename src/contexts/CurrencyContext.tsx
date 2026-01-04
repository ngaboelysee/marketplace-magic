import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Currency = {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD
};

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 149.50 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.36 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.53 },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", rate: 1550 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.12 },
  { code: "ZAR", symbol: "R", name: "South African Rand", rate: 18.50 },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", rate: 3.67 },
];

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInUSD: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(currencies[0]);

  // Auto-detect currency based on user's locale/timezone
  useEffect(() => {
    const detectCurrency = () => {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const locale = navigator.language;

        // Map common timezones/locales to currencies
        const currencyMap: Record<string, string> = {
          "Europe/London": "GBP",
          "Europe/Paris": "EUR",
          "Europe/Berlin": "EUR",
          "Europe/Rome": "EUR",
          "Europe/Madrid": "EUR",
          "America/New_York": "USD",
          "America/Los_Angeles": "USD",
          "America/Chicago": "USD",
          "America/Toronto": "CAD",
          "America/Vancouver": "CAD",
          "Asia/Tokyo": "JPY",
          "Asia/Dubai": "AED",
          "Asia/Kolkata": "INR",
          "Africa/Lagos": "NGN",
          "Africa/Johannesburg": "ZAR",
          "Australia/Sydney": "AUD",
          "Australia/Melbourne": "AUD",
        };

        const detectedCode = currencyMap[timezone];
        if (detectedCode) {
          const found = currencies.find(c => c.code === detectedCode);
          if (found) setCurrency(found);
        }
      } catch (error) {
        console.log("Could not detect currency, using default USD");
      }
    };

    // Check localStorage first for user preference
    const saved = localStorage.getItem("luxe-currency");
    if (saved) {
      const found = currencies.find(c => c.code === saved);
      if (found) {
        setCurrency(found);
        return;
      }
    }

    detectCurrency();
  }, []);

  // Save preference to localStorage
  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem("luxe-currency", newCurrency.code);
  };

  const formatPrice = (priceInUSD: number): string => {
    const convertedPrice = priceInUSD * currency.rate;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: currency.code === "JPY" ? 0 : 2,
      maximumFractionDigits: currency.code === "JPY" ? 0 : 2,
    }).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
