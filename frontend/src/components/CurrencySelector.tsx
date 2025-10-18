'use client';

import React from 'react';
import { useCurrency, Currency } from '@/contexts/CurrencyContext';

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="currency" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Currency:
      </label>
      <select
        id="currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800"
      >
        <option value="USD">USD ($)</option>
        <option value="GBP">GBP (£)</option>
        <option value="EUR">EUR (€)</option>
      </select>
    </div>
  );
}
