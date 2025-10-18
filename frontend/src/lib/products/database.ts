/**
 * Product Database Seeder
 * Comprehensive database of solar and water system products available in Portugal
 */

import type { Product } from './types';

export const PRODUCT_DATABASE: Product[] = [
  // SOLAR PANELS
  {
    id: 'solar-panel-ja-solar-400w',
    name: 'JA Solar 400W Monocrystalline Panel',
    brand: 'JA Solar',
    category: 'solar-panels',
    description:
      'High-efficiency 400W monocrystalline solar panel with 25-year warranty. Perfect for off-grid installations.',
    specifications: [
      { key: 'Power Output', value: '400', unit: 'W' },
      { key: 'Efficiency', value: '20.9', unit: '%' },
      { key: 'Voltage (Vmp)', value: '38.5', unit: 'V' },
      { key: 'Current (Imp)', value: '10.4', unit: 'A' },
      { key: 'Dimensions', value: '1722 x 1134 x 30', unit: 'mm' },
      { key: 'Weight', value: '22', unit: 'kg' },
    ],
    images: ['/images/products/ja-solar-400w.jpg'],
    affiliateLinks: [
      {
        provider: 'AutoSolar Portugal',
        url: 'https://autosolar.pt/paineis-solares-24v/painel-solar-400w-ja-solar',
        price: { amount: 169, currency: 'EUR', lastUpdated: '2025-10-18' },
        availability: 'in-stock',
        shipping: { portugal: true, eu: true, worldwide: false, estimatedDays: 3 },
      },
      {
        provider: 'Amazon.es',
        url: 'https://amazon.es/dp/B09XXX',
        price: { amount: 185, currency: 'EUR', lastUpdated: '2025-10-18' },
        availability: 'in-stock',
        shipping: { portugal: true, eu: true, worldwide: true, estimatedDays: 2 },
      },
    ],
    rating: 4.7,
    reviewCount: 156,
    tags: ['monocrystalline', 'high-efficiency', '24v-compatible'],
    compatibility: ['12V systems', '24V systems', '48V systems'],
    installation: {
      difficulty: 'moderate',
      timeEstimate: '2-3 hours per panel',
      toolsRequired: ['drill', 'wrench set', 'wire strippers', 'multimeter'],
    },
    warranty: '25 year performance, 12 year product',
    certifications: ['IEC 61215', 'IEC 61730', 'CE'],
  },
  {
    id: 'solar-panel-longi-450w',
    name: 'LONGi 450W Hi-MO 5 Monocrystalline',
    brand: 'LONGi',
    category: 'solar-panels',
    description: 'Premium 450W monocrystalline panel with excellent low-light performance.',
    specifications: [
      { key: 'Power Output', value: '450', unit: 'W' },
      { key: 'Efficiency', value: '21.3', unit: '%' },
      { key: 'Voltage (Vmp)', value: '41.2', unit: 'V' },
      { key: 'Current (Imp)', value: '10.9', unit: 'A' },
      { key: 'Dimensions', value: '1909 x 1134 x 30', unit: 'mm' },
      { key: 'Weight', value: '24', unit: 'kg' },
    ],
    images: ['/images/products/longi-450w.jpg'],
    affiliateLinks: [
      {
        provider: 'DAMIA Solar',
        url: 'https://damiasolar.com/longi-450w',
        price: { amount: 195, currency: 'EUR', lastUpdated: '2025-10-18' },
        availability: 'in-stock',
        shipping: { portugal: true, eu: true, worldwide: false, estimatedDays: 5 },
      },
    ],
    rating: 4.8,
    reviewCount: 203,
    tags: ['monocrystalline', 'premium', 'low-light'],
    compatibility: ['24V systems', '48V systems'],
    installation: {
      difficulty: 'moderate',
      timeEstimate: '2-3 hours per panel',
      toolsRequired: ['drill', 'wrench set', 'wire strippers', 'multimeter'],
    },
    warranty: '25 year performance, 12 year product',
    certifications: ['IEC 61215', 'IEC 61730', 'CE', 'TUV'],
  },

  // BATTERIES
  {
    id: 'battery-lifepo4-200ah',
    name: 'LiFePO4 12V 200Ah Lithium Battery',
    brand: 'EcoWatt',
    category: 'batteries',
    description:
      'High-capacity LiFePO4 battery with BMS, perfect for off-grid solar systems. 6000+ cycle life.',
    specifications: [
      { key: 'Capacity', value: '200', unit: 'Ah' },
      { key: 'Voltage', value: '12.8', unit: 'V' },
      { key: 'Energy', value: '2.56', unit: 'kWh' },
      { key: 'Cycle Life', value: '6000', unit: 'cycles @ 80% DOD' },
      { key: 'Weight', value: '20', unit: 'kg' },
      { key: 'Dimensions', value: '520 x 240 x 220', unit: 'mm' },
    ],
    images: ['/images/products/lifepo4-200ah.jpg'],
    affiliateLinks: [
      {
        provider: 'AutoSolar Portugal',
        url: 'https://autosolar.pt/baterias-litio/bateria-litio-12v-200ah',
        price: { amount: 749, currency: 'EUR', lastUpdated: '2025-10-18' },
        availability: 'in-stock',
        shipping: { portugal: true, eu: true, worldwide: false, estimatedDays: 5 },
      },
      {
        provider: 'Amazon.es',
        url: 'https://amazon.es/dp/B08XXX',
        price: { amount: 799, currency: 'EUR', lastUpdated: '2025-10-18' },
        availability: 'in-stock',
        shipping: { portugal: true, eu: true, worldwide: true, estimatedDays: 3 },
      },
    ],
    rating: 4.6,
    reviewCount: 89,
    tags: ['lithium', 'lifepo4', 'bms-included', 'long-life'],
    compatibility: ['12V systems'],
    installation: {
      difficulty: 'easy',
      timeEstimate: '30 minutes',
      toolsRequired: ['wrench set', 'wire strippers'],
    },
    warranty: '5 years',
    certifications: ['CE', 'UN38.3'],
  },

  // INVERTERS
  {
    id: 'inverter-victron-3000w',
    name: 'Victron MultiPlus 3000VA 12V Inverter/Charger',
    brand: 'Victron Energy',
    category: 'inverters',
    description:
      'Premium pure sine wave inverter/charger with PowerAssist technology. Industry-leading reliability.',
    specifications: [
      { key: 'Continuous Power', value: '3000', unit: 'VA' },
      { key: 'Peak Power', value: '6000', unit: 'W' },
      { key: 'Input Voltage', value: '12', unit: 'V DC' },
      { key: 'Output Voltage', value: '230', unit: 'V AC' },
      { key: 'Efficiency', value: '94', unit: '%' },
      { key: 'Weight', value: '25', unit: 'kg' },
    ],
    images: ['/images/products/victron-3000.jpg'],
    affiliateLinks: [
      {
        provider: 'AutoSolar Portugal',
        url: 'https://autosolar.pt/inversores-cargadores/victron-multiplus-3000',
        price: { amount: 1295, currency: 'EUR', lastUpdated: '2025-10-18' },
        availability: 'in-stock',
        shipping: { portugal: true, eu: true, worldwide: false, estimatedDays: 3 },
      },
      {
        provider: 'Krannich Solar',
        url: 'https://krannich-solar.com/pt/victron-3000',
        price: { amount: 1250, currency: 'EUR', lastUpdated: '2025-10-18' },
        availability: 'in-stock',
        shipping: { portugal: true, eu: true, worldwide: false, estimatedDays: 7 },
      },
    ],
    rating: 4.9,
    reviewCount: 312,
    tags: ['pure-sine-wave', 'inverter-charger', 'premium', 'victron'],
    compatibility: ['12V systems'],
    installation: {
      difficulty: 'advanced',
      timeEstimate: '4-6 hours',
      toolsRequired: ['drill', 'crimping tool', 'multimeter', 'torque wrench'],
    },
    warranty: '5 years',
    certifications: ['CE', 'E-Mark'],
  },

  // CHARGE CONTROLLERS
  {
    id: 'mppt-victron-100-50',
    name: 'Victron SmartSolar MPPT 100/50',
    brand: 'Victron Energy',
    category: 'charge-controllers',
    description: 'Advanced MPPT charge controller with Bluetooth monitoring. 100V/50A capacity.',
    specifications: [
      { key: 'Max PV Voltage', value: '100', unit: 'V' },
      { key: 'Max Charge Current', value: '50', unit: 'A' },
      { key: 'Efficiency', value: '98', unit: '%' },
      { key: 'System Voltage', value: '12/24', unit: 'V auto' },
      { key: 'Weight', value: '1.3', unit: 'kg' },
    ],
    images: ['/images/products/victron-mppt-100-50.jpg'],
    affiliateLinks: [
      {
        provider: 'AutoSolar Portugal',
        url: 'https://autosolar.pt/reguladores-mppt/victron-mppt-100-50',
        price: { amount: 279, currency: 'EUR', lastUpdated: '2025-10-18' },
        availability: 'in-stock',
        shipping: { portugal: true, eu: true, worldwide: false, estimatedDays: 3 },
      },
    ],
    rating: 4.8,
    reviewCount: 198,
    tags: ['mppt', 'bluetooth', 'victron', 'smart'],
    compatibility: ['12V systems', '24V systems'],
    installation: {
      difficulty: 'moderate',
      timeEstimate: '2-3 hours',
      toolsRequired: ['screwdriver', 'wire strippers', 'multimeter'],
    },
    warranty: '5 years',
    certifications: ['CE'],
  },

  // WATER PUMPS
  {
    id: 'water-pump-solar-submersible',
    name: 'Solar Submersible Water Pump 12V DC',
    brand: 'SHURFLO',
    category: 'water-pumps',
    description:
      'Efficient 12V DC submersible pump for wells up to 70m deep. Perfect for solar systems.',
    specifications: [
      { key: 'Voltage', value: '12', unit: 'V DC' },
      { key: 'Max Flow', value: '20', unit: 'L/min' },
      { key: 'Max Head', value: '70', unit: 'm' },
      { key: 'Power', value: '150', unit: 'W' },
      { key: 'Weight', value: '8', unit: 'kg' },
    ],
    images: ['/images/products/shurflo-pump.jpg'],
    affiliateLinks: [
      {
        provider: 'Leroy Merlin',
        url: 'https://leroymerlin.pt/bomba-submersivel-solar',
        price: { amount: 245, currency: 'EUR', lastUpdated: '2025-10-18' },
        availability: 'in-stock',
        shipping: { portugal: true, eu: true, worldwide: false, estimatedDays: 5 },
      },
      {
        provider: 'ManoMano',
        url: 'https://manomano.pt/shurflo-pump',
        price: { amount: 239, currency: 'EUR', lastUpdated: '2025-10-18' },
        availability: 'in-stock',
        shipping: { portugal: true, eu: true, worldwide: false, estimatedDays: 7 },
      },
    ],
    rating: 4.5,
    reviewCount: 76,
    tags: ['12v', 'solar-ready', 'submersible', 'well-pump'],
    compatibility: ['12V solar systems'],
    installation: {
      difficulty: 'advanced',
      timeEstimate: '6-8 hours',
      toolsRequired: ['pipe wrench', 'electrical tools', 'safety rope'],
    },
    warranty: '2 years',
    certifications: ['CE', 'IP68'],
  },

  // WATER STORAGE
  {
    id: 'water-tank-1000l-ibc',
    name: '1000L IBC Water Storage Tank',
    brand: 'Generic',
    category: 'water-storage',
    description:
      'Food-grade 1000L IBC container for rainwater and greywater storage. UV resistant.',
    specifications: [
      { key: 'Capacity', value: '1000', unit: 'L' },
      { key: 'Material', value: 'HDPE', unit: '' },
      { key: 'Dimensions', value: '120 x 100 x 116', unit: 'cm' },
      { key: 'Weight Empty', value: '55', unit: 'kg' },
      { key: 'Weight Full', value: '1055', unit: 'kg' },
    ],
    images: ['/images/products/ibc-1000l.jpg'],
    affiliateLinks: [
      {
        provider: 'Leroy Merlin',
        url: 'https://leroymerlin.pt/deposito-agua-1000l',
        price: { amount: 89, currency: 'EUR', lastUpdated: '2025-10-18' },
        availability: 'in-stock',
        shipping: { portugal: true, eu: false, worldwide: false, estimatedDays: 10 },
      },
      {
        provider: 'ManoMano',
        url: 'https://manomano.pt/ibc-1000l',
        price: { amount: 95, currency: 'EUR', lastUpdated: '2025-10-18' },
        availability: 'in-stock',
        shipping: { portugal: true, eu: true, worldwide: false, estimatedDays: 14 },
      },
    ],
    rating: 4.3,
    reviewCount: 45,
    tags: ['food-grade', 'uv-resistant', 'rainwater', 'greywater'],
    compatibility: ['rainwater systems', 'greywater systems'],
    installation: {
      difficulty: 'easy',
      timeEstimate: '1 hour',
      toolsRequired: ['level', 'concrete blocks'],
    },
    warranty: '1 year',
    certifications: ['Food grade certified'],
  },
];
