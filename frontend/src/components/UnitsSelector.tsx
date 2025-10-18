'use client';

import React from 'react';
import { useUnits } from '@/contexts/UnitsContext';

export default function UnitsSelector() {
  const { setVolumeUnit, isMetric, setAreaUnit, setLengthUnit, setWeightUnit } = useUnits();

  const handleSystemChange = (system: 'metric' | 'imperial') => {
    if (system === 'metric') {
      setVolumeUnit('liters');
      setAreaUnit('sqm');
      setLengthUnit('meters');
      setWeightUnit('kg');
    } else {
      setVolumeUnit('gallons');
      setAreaUnit('sqft');
      setLengthUnit('feet');
      setWeightUnit('lbs');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="units" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Units:
      </label>
      <select
        id="units"
        value={isMetric ? 'metric' : 'imperial'}
        onChange={(e) => handleSystemChange(e.target.value as 'metric' | 'imperial')}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      >
        <option value="metric">Metric (L, m², kg)</option>
        <option value="imperial">Imperial (gal, ft², lbs)</option>
      </select>
    </div>
  );
}
