/**
 * Household Presets for Calculator Auto-Fill
 * Provides realistic appliance configurations for different household sizes
 */

export interface HouseholdPreset {
  name: string;
  description: string;
  appliances: Array<{
    name: string;
    watts: number;
    hoursPerDay: number;
    category: string;
    critical: boolean;
  }>;
}

export const householdPresets: Record<string, HouseholdPreset> = {
  single: {
    name: 'Single Person',
    description: '1 person, minimal appliances',
    appliances: [
      {
        name: 'LED Light Bulbs (6x9W)',
        watts: 54,
        hoursPerDay: 5,
        category: 'lighting',
        critical: true,
      },
      {
        name: 'Refrigerator (Small)',
        watts: 100,
        hoursPerDay: 24,
        category: 'appliances',
        critical: true,
      },
      { name: 'Laptop', watts: 65, hoursPerDay: 6, category: 'electronics', critical: false },
      {
        name: 'TV (32" LED)',
        watts: 30,
        hoursPerDay: 3,
        category: 'entertainment',
        critical: false,
      },
      {
        name: 'Microwave',
        watts: 1000,
        hoursPerDay: 0.25,
        category: 'appliances',
        critical: false,
      },
      {
        name: 'Coffee Maker',
        watts: 900,
        hoursPerDay: 0.5,
        category: 'appliances',
        critical: false,
      },
      {
        name: 'Internet Router',
        watts: 12,
        hoursPerDay: 24,
        category: 'electronics',
        critical: true,
      },
      { name: 'Phone Charger', watts: 5, hoursPerDay: 2, category: 'electronics', critical: false },
      {
        name: 'Washing Machine',
        watts: 500,
        hoursPerDay: 0.5,
        category: 'appliances',
        critical: false,
      },
    ],
  },
  couple: {
    name: 'Couple (2 People)',
    description: '2 adults, standard appliances',
    appliances: [
      {
        name: 'LED Light Bulbs (10x9W)',
        watts: 90,
        hoursPerDay: 6,
        category: 'lighting',
        critical: true,
      },
      {
        name: 'Refrigerator (Medium)',
        watts: 150,
        hoursPerDay: 24,
        category: 'appliances',
        critical: true,
      },
      {
        name: 'Chest Freezer',
        watts: 100,
        hoursPerDay: 24,
        category: 'appliances',
        critical: true,
      },
      { name: 'Laptop (2x)', watts: 130, hoursPerDay: 8, category: 'electronics', critical: false },
      {
        name: 'TV (55" LED)',
        watts: 60,
        hoursPerDay: 4,
        category: 'entertainment',
        critical: false,
      },
      { name: 'Microwave', watts: 1000, hoursPerDay: 0.5, category: 'appliances', critical: false },
      { name: 'Coffee Maker', watts: 900, hoursPerDay: 1, category: 'appliances', critical: false },
      { name: 'Water Pump (Well)', watts: 800, hoursPerDay: 1, category: 'water', critical: true },
      {
        name: 'Washing Machine',
        watts: 500,
        hoursPerDay: 1,
        category: 'appliances',
        critical: false,
      },
      {
        name: 'Internet Router',
        watts: 12,
        hoursPerDay: 24,
        category: 'electronics',
        critical: true,
      },
      {
        name: 'Phone Charger (2x)',
        watts: 10,
        hoursPerDay: 3,
        category: 'electronics',
        critical: false,
      },
    ],
  },
  familySmall: {
    name: 'Small Family (2 Adults + 2 Kids)',
    description: '2 adults, 2 children, typical family home',
    appliances: [
      {
        name: 'LED Light Bulbs (15x9W)',
        watts: 135,
        hoursPerDay: 7,
        category: 'lighting',
        critical: true,
      },
      {
        name: 'Refrigerator (Large)',
        watts: 200,
        hoursPerDay: 24,
        category: 'appliances',
        critical: true,
      },
      {
        name: 'Chest Freezer',
        watts: 100,
        hoursPerDay: 24,
        category: 'appliances',
        critical: true,
      },
      { name: 'Laptop (2x)', watts: 130, hoursPerDay: 6, category: 'electronics', critical: false },
      {
        name: 'Desktop Computer',
        watts: 200,
        hoursPerDay: 4,
        category: 'electronics',
        critical: false,
      },
      {
        name: 'TV (55" LED)',
        watts: 60,
        hoursPerDay: 5,
        category: 'entertainment',
        critical: false,
      },
      {
        name: 'Gaming Console',
        watts: 150,
        hoursPerDay: 3,
        category: 'entertainment',
        critical: false,
      },
      {
        name: 'Microwave',
        watts: 1000,
        hoursPerDay: 0.75,
        category: 'appliances',
        critical: false,
      },
      { name: 'Coffee Maker', watts: 900, hoursPerDay: 1, category: 'appliances', critical: false },
      {
        name: 'Water Pump (Well)',
        watts: 800,
        hoursPerDay: 1.5,
        category: 'water',
        critical: true,
      },
      {
        name: 'Washing Machine',
        watts: 500,
        hoursPerDay: 1.5,
        category: 'appliances',
        critical: false,
      },
      { name: 'Dishwasher', watts: 1800, hoursPerDay: 1, category: 'appliances', critical: false },
      {
        name: 'Internet Router',
        watts: 12,
        hoursPerDay: 24,
        category: 'electronics',
        critical: true,
      },
      {
        name: 'Phone/Tablet Chargers (4x)',
        watts: 20,
        hoursPerDay: 4,
        category: 'electronics',
        critical: false,
      },
      {
        name: 'Electric Heater (Winter)',
        watts: 1500,
        hoursPerDay: 3,
        category: 'heating',
        critical: false,
      },
    ],
  },
  familyLarge: {
    name: 'Large Family (2 Adults + 3+ Kids)',
    description: '2 adults, 3+ children, larger home',
    appliances: [
      {
        name: 'LED Light Bulbs (20x9W)',
        watts: 180,
        hoursPerDay: 8,
        category: 'lighting',
        critical: true,
      },
      {
        name: 'Refrigerator (Large)',
        watts: 200,
        hoursPerDay: 24,
        category: 'appliances',
        critical: true,
      },
      {
        name: 'Chest Freezer (Large)',
        watts: 150,
        hoursPerDay: 24,
        category: 'appliances',
        critical: true,
      },
      { name: 'Laptop (3x)', watts: 195, hoursPerDay: 8, category: 'electronics', critical: false },
      {
        name: 'Desktop Computer (2x)',
        watts: 400,
        hoursPerDay: 6,
        category: 'electronics',
        critical: false,
      },
      {
        name: 'TV (55" LED - 2x)',
        watts: 120,
        hoursPerDay: 6,
        category: 'entertainment',
        critical: false,
      },
      {
        name: 'Gaming Console (2x)',
        watts: 300,
        hoursPerDay: 4,
        category: 'entertainment',
        critical: false,
      },
      { name: 'Microwave', watts: 1000, hoursPerDay: 1, category: 'appliances', critical: false },
      {
        name: 'Coffee Maker',
        watts: 900,
        hoursPerDay: 1.5,
        category: 'appliances',
        critical: false,
      },
      { name: 'Water Pump (Well)', watts: 800, hoursPerDay: 2, category: 'water', critical: true },
      {
        name: 'Washing Machine',
        watts: 500,
        hoursPerDay: 2,
        category: 'appliances',
        critical: false,
      },
      {
        name: 'Dryer (Electric)',
        watts: 3000,
        hoursPerDay: 1,
        category: 'appliances',
        critical: false,
      },
      {
        name: 'Dishwasher',
        watts: 1800,
        hoursPerDay: 1.5,
        category: 'appliances',
        critical: false,
      },
      {
        name: 'Internet Router',
        watts: 12,
        hoursPerDay: 24,
        category: 'electronics',
        critical: true,
      },
      {
        name: 'Phone/Tablet Chargers (6x)',
        watts: 30,
        hoursPerDay: 5,
        category: 'electronics',
        critical: false,
      },
      {
        name: 'Electric Heater (2x Winter)',
        watts: 3000,
        hoursPerDay: 4,
        category: 'heating',
        critical: false,
      },
      {
        name: 'Air Conditioner (Summer)',
        watts: 1200,
        hoursPerDay: 6,
        category: 'cooling',
        critical: false,
      },
    ],
  },
  offgridMinimal: {
    name: 'Off-Grid Minimal',
    description: 'Essential appliances only, energy-conscious',
    appliances: [
      {
        name: 'LED Light Bulbs (8x9W)',
        watts: 72,
        hoursPerDay: 5,
        category: 'lighting',
        critical: true,
      },
      {
        name: 'Refrigerator (Efficient)',
        watts: 120,
        hoursPerDay: 24,
        category: 'appliances',
        critical: true,
      },
      { name: 'Laptop', watts: 65, hoursPerDay: 6, category: 'electronics', critical: false },
      {
        name: 'Water Pump (Well)',
        watts: 800,
        hoursPerDay: 0.75,
        category: 'water',
        critical: true,
      },
      {
        name: 'Internet Router',
        watts: 12,
        hoursPerDay: 24,
        category: 'electronics',
        critical: true,
      },
      { name: 'Phone Charger', watts: 5, hoursPerDay: 2, category: 'electronics', critical: false },
      {
        name: 'Washing Machine (Manual)',
        watts: 200,
        hoursPerDay: 0.5,
        category: 'appliances',
        critical: false,
      },
    ],
  },
  offgridComfort: {
    name: 'Off-Grid Comfort',
    description: 'Balanced off-grid lifestyle with modern conveniences',
    appliances: [
      {
        name: 'LED Light Bulbs (12x9W)',
        watts: 108,
        hoursPerDay: 6,
        category: 'lighting',
        critical: true,
      },
      {
        name: 'Refrigerator (Efficient)',
        watts: 150,
        hoursPerDay: 24,
        category: 'appliances',
        critical: true,
      },
      {
        name: 'Chest Freezer (Efficient)',
        watts: 80,
        hoursPerDay: 24,
        category: 'appliances',
        critical: true,
      },
      { name: 'Laptop (2x)', watts: 130, hoursPerDay: 6, category: 'electronics', critical: false },
      {
        name: 'TV (32" LED)',
        watts: 30,
        hoursPerDay: 3,
        category: 'entertainment',
        critical: false,
      },
      { name: 'Water Pump (Well)', watts: 800, hoursPerDay: 1, category: 'water', critical: true },
      {
        name: 'Washing Machine',
        watts: 500,
        hoursPerDay: 1,
        category: 'appliances',
        critical: false,
      },
      { name: 'Microwave', watts: 1000, hoursPerDay: 0.5, category: 'appliances', critical: false },
      {
        name: 'Internet Router',
        watts: 12,
        hoursPerDay: 24,
        category: 'electronics',
        critical: true,
      },
      {
        name: 'Phone Chargers (2x)',
        watts: 10,
        hoursPerDay: 3,
        category: 'electronics',
        critical: false,
      },
      {
        name: 'Electric Heater (Winter)',
        watts: 1500,
        hoursPerDay: 2,
        category: 'heating',
        critical: false,
      },
    ],
  },
};

export const getPresetNames = (): string[] => {
  return Object.keys(householdPresets);
};

export const getPreset = (presetKey: string): HouseholdPreset | null => {
  return householdPresets[presetKey] || null;
};
