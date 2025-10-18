/**
 * Portuguese and EU suppliers for off-grid materials
 */

export interface Supplier {
  name: string;
  website: string;
  locations: string[];
  categories: string[];
  shipsPortugal: boolean;
  shipsEU: boolean;
  hasAPI: boolean;
  notes: string;
}

export const PORTUGUESE_SUPPLIERS: Supplier[] = [
  {
    name: 'Leroy Merlin Portugal',
    website: 'https://www.leroymerlin.pt',
    locations: ['Lisboa', 'Porto', 'Faro', 'Coimbra', 'Braga'],
    categories: [
      'solar-panels',
      'batteries',
      'wiring',
      'tools',
      'water-pumps',
      'water-storage',
      'irrigation',
    ],
    shipsPortugal: true,
    shipsEU: true,
    hasAPI: false,
    notes: 'Major DIY retailer with good solar and water equipment selection',
  },
  {
    name: 'Bricomarché Portugal',
    website: 'https://www.bricomarche.pt',
    locations: ['Multiple locations across Portugal'],
    categories: ['tools', 'wiring', 'water-pumps', 'irrigation', 'mounting'],
    shipsPortugal: true,
    shipsEU: false,
    hasAPI: false,
    notes: 'Good for general hardware and tools',
  },
  {
    name: 'AutoSolar',
    website: 'https://autosolar.pt',
    locations: ['Online only'],
    categories: [
      'solar-panels',
      'batteries',
      'inverters',
      'charge-controllers',
      'monitoring',
      'mounting',
    ],
    shipsPortugal: true,
    shipsEU: true,
    hasAPI: false,
    notes: 'Specialized solar equipment supplier - excellent selection',
  },
  {
    name: 'WORTEN',
    website: 'https://www.worten.pt',
    locations: ['Nationwide stores'],
    categories: ['batteries', 'tools', 'monitoring'],
    shipsPortugal: true,
    shipsEU: false,
    hasAPI: false,
    notes: 'Electronics retailer with some solar equipment',
  },
  {
    name: 'DAMIA Solar',
    website: 'https://www.damiasolar.com',
    locations: ['Spain - ships to Portugal'],
    categories: [
      'solar-panels',
      'batteries',
      'inverters',
      'charge-controllers',
      'monitoring',
      'mounting',
    ],
    shipsPortugal: true,
    shipsEU: true,
    hasAPI: false,
    notes: 'Major Spanish solar wholesaler - competitive prices',
  },
  {
    name: 'SolarEmpresas',
    website: 'https://www.solarempresas.pt',
    locations: ['Portugal'],
    categories: ['solar-panels', 'inverters', 'mounting'],
    shipsPortugal: true,
    shipsEU: false,
    hasAPI: false,
    notes: 'Portuguese solar installer with equipment sales',
  },
  {
    name: 'Amazon.es (Spain)',
    website: 'https://www.amazon.es',
    locations: ['Online - fast shipping to Portugal'],
    categories: [
      'solar-panels',
      'batteries',
      'inverters',
      'charge-controllers',
      'monitoring',
      'wiring',
      'tools',
      'water-filtration',
      'water-pumps',
      'water-storage',
      'irrigation',
    ],
    shipsPortugal: true,
    shipsEU: true,
    hasAPI: true,
    notes: 'Amazon Product Advertising API available - huge selection, fast Prime delivery',
  },
  {
    name: 'ManoMano Portugal',
    website: 'https://www.manomano.pt',
    locations: ['Online'],
    categories: ['solar-panels', 'water-pumps', 'water-storage', 'irrigation', 'tools', 'mounting'],
    shipsPortugal: true,
    shipsEU: true,
    hasAPI: false,
    notes: 'DIY marketplace with good equipment selection',
  },
  {
    name: 'Krannich Solar',
    website: 'https://www.krannich-solar.com/pt',
    locations: ['Portugal'],
    categories: ['solar-panels', 'inverters', 'batteries', 'monitoring', 'mounting'],
    shipsPortugal: true,
    shipsEU: true,
    hasAPI: false,
    notes: 'Professional solar distributor - wholesale prices available',
  },
  {
    name: 'Tecnosol',
    website: 'https://www.tecnosol.pt',
    locations: ['Lisboa', 'Porto'],
    categories: ['solar-panels', 'inverters', 'batteries', 'charge-controllers'],
    shipsPortugal: true,
    shipsEU: false,
    hasAPI: false,
    notes: 'Renewable energy specialists in Portugal',
  },
];

export const SUPPLIER_CATEGORIES = {
  'solar-panels': ['AutoSolar', 'DAMIA Solar', 'Krannich Solar', 'Amazon.es', 'Leroy Merlin'],
  batteries: ['AutoSolar', 'DAMIA Solar', 'Amazon.es', 'Tecnosol', 'Leroy Merlin'],
  inverters: ['AutoSolar', 'DAMIA Solar', 'Krannich Solar', 'Tecnosol', 'Amazon.es'],
  'charge-controllers': ['AutoSolar', 'DAMIA Solar', 'Krannich Solar', 'Amazon.es'],
  monitoring: ['AutoSolar', 'DAMIA Solar', 'Krannich Solar', 'Amazon.es', 'WORTEN'],
  wiring: ['Leroy Merlin', 'Bricomarché', 'Amazon.es'],
  mounting: ['AutoSolar', 'DAMIA Solar', 'Krannich Solar', 'ManoMano', 'Leroy Merlin'],
  tools: ['Leroy Merlin', 'Bricomarché', 'Amazon.es', 'WORTEN', 'ManoMano'],
  'water-filtration': ['Amazon.es', 'ManoMano'],
  'water-pumps': ['Leroy Merlin', 'ManoMano', 'Amazon.es', 'Bricomarché'],
  'water-storage': ['Leroy Merlin', 'ManoMano', 'Amazon.es'],
  irrigation: ['Leroy Merlin', 'ManoMano', 'Amazon.es', 'Bricomarché'],
};
