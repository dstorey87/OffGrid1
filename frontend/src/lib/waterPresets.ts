// Water usage presets for household sizing
// All values in liters per day unless specified

export interface WaterUsageCategory {
  drinking: number;
  cooking: number;
  bathing: number;
  laundry: number;
  dishes: number;
  toilet: number;
  irrigation: number;
  other: number;
}

export interface WaterPreset {
  name: string;
  description: string;
  dailyUsage: WaterUsageCategory;
  totalDaily: number;
  people: number;
}

export const waterPresets: Record<string, WaterPreset> = {
  single: {
    name: 'Single Person',
    description: '1 person, minimal water usage',
    people: 1,
    dailyUsage: {
      drinking: 2,
      cooking: 5,
      bathing: 50,
      laundry: 15,
      dishes: 10,
      toilet: 30,
      irrigation: 10,
      other: 8,
    },
    totalDaily: 130,
  },
  couple: {
    name: 'Couple (2 Adults)',
    description: '2 adults, standard water usage',
    people: 2,
    dailyUsage: {
      drinking: 4,
      cooking: 10,
      bathing: 100,
      laundry: 30,
      dishes: 20,
      toilet: 60,
      irrigation: 20,
      other: 16,
    },
    totalDaily: 260,
  },
  familySmall: {
    name: 'Small Family (2 Adults + 2 Kids)',
    description: '4 people, typical family usage',
    people: 4,
    dailyUsage: {
      drinking: 8,
      cooking: 20,
      bathing: 180,
      laundry: 60,
      dishes: 35,
      toilet: 120,
      irrigation: 40,
      other: 37,
    },
    totalDaily: 500,
  },
  familyLarge: {
    name: 'Large Family (2 Adults + 3+ Kids)',
    description: '5+ people, higher water needs',
    people: 6,
    dailyUsage: {
      drinking: 12,
      cooking: 30,
      bathing: 270,
      laundry: 90,
      dishes: 50,
      toilet: 180,
      irrigation: 60,
      other: 58,
    },
    totalDaily: 750,
  },
  offgridMinimal: {
    name: 'Off-Grid Minimal',
    description: 'Essential water use only, conservation-focused',
    people: 2,
    dailyUsage: {
      drinking: 4,
      cooking: 8,
      bathing: 40,
      laundry: 20,
      dishes: 12,
      toilet: 20,
      irrigation: 15,
      other: 6,
    },
    totalDaily: 125,
  },
  offgridComfort: {
    name: 'Off-Grid Comfort',
    description: 'Balanced off-grid living with reasonable comfort',
    people: 3,
    dailyUsage: {
      drinking: 6,
      cooking: 15,
      bathing: 120,
      laundry: 40,
      dishes: 25,
      toilet: 80,
      irrigation: 30,
      other: 24,
    },
    totalDaily: 340,
  },
};

export function getWaterPresetNames(): string[] {
  return Object.keys(waterPresets);
}

export function getWaterPreset(key: string): WaterPreset | null {
  return waterPresets[key] || null;
}
