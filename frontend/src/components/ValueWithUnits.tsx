'use client';

import React from 'react';
import { useUnits } from '@/contexts/UnitsContext';

interface ValueWithUnitsProps {
  value: number;
  type: 'volume' | 'area' | 'length' | 'weight';
  decimals?: number;
  className?: string;
}

export function ValueWithUnits({ value, type, decimals = 0, className = '' }: ValueWithUnitsProps) {
  const { formatVolume, formatArea, formatLength, formatWeight } = useUnits();

  let formatted: string;
  switch (type) {
    case 'volume':
      formatted = formatVolume(value, decimals);
      break;
    case 'area':
      formatted = formatArea(value, decimals);
      break;
    case 'length':
      formatted = formatLength(value, decimals);
      break;
    case 'weight':
      formatted = formatWeight(value, decimals);
      break;
    default:
      formatted = value.toString();
  }

  return <span className={className}>{formatted}</span>;
}
