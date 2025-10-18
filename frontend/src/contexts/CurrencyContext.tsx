'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'USD' | 'GBP' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (usdPrice: number) => number;
  formatPrice: (usdPrice: number) => string;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rates (update these periodically or fetch from API)
const EXCHANGE_RATES = {
  USD: 1,
  GBP: 0.79,
  EUR: 0.92,
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  GBP: '£',
  EUR: '€',
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('GBP');

  // Load saved currency preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('preferred_currency') as Currency;
    if (saved && ['USD', 'GBP', 'EUR'].includes(saved)) {
      setCurrency(saved);
    } else {
      // Check admin settings for default currency
      try {
        const adminSettings = localStorage.getItem('admin_settings');
        if (adminSettings) {
          const settings = JSON.parse(adminSettings);
          if (settings.currency?.default) {
            setCurrency(settings.currency.default);
          }
        }
      } catch (e) {
        // Use GBP as fallback
      }
    }
  }, []);

  // Save currency preference to localStorage
  useEffect(() => {
    localStorage.setItem('preferred_currency', currency);
  }, [currency]);

  const convertPrice = (usdPrice: number): number => {
    return usdPrice * EXCHANGE_RATES[currency];
  };

  const formatPrice = (usdPrice: number): string => {
    const converted = convertPrice(usdPrice);
    const symbol = CURRENCY_SYMBOLS[currency];
    return `${symbol}${converted.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertPrice,
        formatPrice,
        symbol: CURRENCY_SYMBOLS[currency],
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
