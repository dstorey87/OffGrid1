'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type VolumeUnit = 'liters' | 'gallons';
export type AreaUnit = 'sqm' | 'sqft';
export type LengthUnit = 'meters' | 'feet';
export type WeightUnit = 'kg' | 'lbs';

interface UnitsContextType {
  volumeUnit: VolumeUnit;
  areaUnit: AreaUnit;
  lengthUnit: LengthUnit;
  weightUnit: WeightUnit;
  setVolumeUnit: (unit: VolumeUnit) => void;
  setAreaUnit: (unit: AreaUnit) => void;
  setLengthUnit: (unit: LengthUnit) => void;
  setWeightUnit: (unit: WeightUnit) => void;
  convertVolume: (liters: number) => number;
  formatVolume: (liters: number, decimals?: number) => string;
  convertArea: (sqm: number) => number;
  formatArea: (sqm: number, decimals?: number) => string;
  convertLength: (meters: number) => number;
  formatLength: (meters: number, decimals?: number) => string;
  convertWeight: (kg: number) => number;
  formatWeight: (kg: number, decimals?: number) => string;
  isMetric: boolean;
}

const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

export function UnitsProvider({ children }: { children: React.ReactNode }) {
  const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>('liters');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('sqm');
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>('meters');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem('preferred_volume_unit') as VolumeUnit;
    const savedArea = localStorage.getItem('preferred_area_unit') as AreaUnit;
    const savedLength = localStorage.getItem('preferred_length_unit') as LengthUnit;
    const savedWeight = localStorage.getItem('preferred_weight_unit') as WeightUnit;

    if (savedVolume && ['liters', 'gallons'].includes(savedVolume)) {
      setVolumeUnit(savedVolume);
    }
    if (savedArea && ['sqm', 'sqft'].includes(savedArea)) {
      setAreaUnit(savedArea);
    }
    if (savedLength && ['meters', 'feet'].includes(savedLength)) {
      setLengthUnit(savedLength);
    }
    if (savedWeight && ['kg', 'lbs'].includes(savedWeight)) {
      setWeightUnit(savedWeight);
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('preferred_volume_unit', volumeUnit);
  }, [volumeUnit]);

  useEffect(() => {
    localStorage.setItem('preferred_area_unit', areaUnit);
  }, [areaUnit]);

  useEffect(() => {
    localStorage.setItem('preferred_length_unit', lengthUnit);
  }, [lengthUnit]);

  useEffect(() => {
    localStorage.setItem('preferred_weight_unit', weightUnit);
  }, [weightUnit]);

  // Conversion functions (always store in metric, convert for display)
  const convertVolume = (liters: number): number => {
    return volumeUnit === 'gallons' ? liters * 0.264172 : liters;
  };

  const formatVolume = (liters: number, decimals: number = 0): string => {
    const converted = convertVolume(liters);
    const unit = volumeUnit === 'gallons' ? 'gal' : 'L';
    return `${converted.toFixed(decimals)} ${unit}`;
  };

  const convertArea = (sqm: number): number => {
    return areaUnit === 'sqft' ? sqm * 10.7639 : sqm;
  };

  const formatArea = (sqm: number, decimals: number = 0): string => {
    const converted = convertArea(sqm);
    const unit = areaUnit === 'sqft' ? 'ft²' : 'm²';
    return `${converted.toFixed(decimals)} ${unit}`;
  };

  const convertLength = (meters: number): number => {
    return lengthUnit === 'feet' ? meters * 3.28084 : meters;
  };

  const formatLength = (meters: number, decimals: number = 1): string => {
    const converted = convertLength(meters);
    const unit = lengthUnit === 'feet' ? 'ft' : 'm';
    return `${converted.toFixed(decimals)} ${unit}`;
  };

  const convertWeight = (kg: number): number => {
    return weightUnit === 'lbs' ? kg * 2.20462 : kg;
  };

  const formatWeight = (kg: number, decimals: number = 1): string => {
    const converted = convertWeight(kg);
    const unit = weightUnit === 'lbs' ? 'lbs' : 'kg';
    return `${converted.toFixed(decimals)} ${unit}`;
  };

  const isMetric =
    volumeUnit === 'liters' && areaUnit === 'sqm' && lengthUnit === 'meters' && weightUnit === 'kg';

  return (
    <UnitsContext.Provider
      value={{
        volumeUnit,
        areaUnit,
        lengthUnit,
        weightUnit,
        setVolumeUnit,
        setAreaUnit,
        setLengthUnit,
        setWeightUnit,
        convertVolume,
        formatVolume,
        convertArea,
        formatArea,
        convertLength,
        formatLength,
        convertWeight,
        formatWeight,
        isMetric,
      }}
    >
      {children}
    </UnitsContext.Provider>
  );
}

export function useUnits() {
  const context = useContext(UnitsContext);
  if (context === undefined) {
    throw new Error('useUnits must be used within a UnitsProvider');
  }
  return context;
}
