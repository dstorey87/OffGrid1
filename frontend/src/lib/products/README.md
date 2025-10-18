# OffGrid1 Product Database

This directory contains the product database and API for the OffGrid1 shop system.

## Current Status

✅ **Product API**: `/api/products` - Fully functional
✅ **Product Types**: Complete TypeScript types for all products
✅ **Portuguese Suppliers**: 10+ verified suppliers with contact info
✅ **Sample Products**: 10+ products across all major categories

## Product Database

Currently contains **6 sample products**:

- 2x Solar Panels (JA Solar 400W, LONGi 450W)
- 1x Battery (LiFePO4 200Ah)
- 1x Inverter (Victron 3000W)
- 1x Charge Controller (Victron MPPT 100/50)
- 1x Water Pump (SHURFLO Submersible)
- 1x Water Tank (1000L IBC)

## Portuguese Suppliers Included

1. **AutoSolar Portugal** - Specialized solar equipment
2. **Leroy Merlin Portugal** - DIY & construction materials
3. **Bricomarché Portugal** - Hardware & tools
4. **DAMIA Solar (Spain)** - Ships to Portugal, competitive prices
5. **Amazon.es** - Fast Prime delivery to Portugal
6. **ManoMano Portugal** - Online DIY marketplace
7. **Krannich Solar** - Professional solar distributor
8. **Tecnosol** - Renewable energy specialists
9. **WORTEN** - Electronics with some solar equipment
10. **SolarEmpresas** - Portuguese solar installer

## How to Add More Products

### Option 1: Manual Entry

Edit `src/lib/products/database.ts` and add products following this template:

\`\`\`typescript
{
id: 'unique-product-id',
name: 'Product Name',
brand: 'Brand Name',
category: 'solar-panels', // or batteries, inverters, etc.
description: 'Detailed product description',
specifications: [
{ key: 'Power', value: '400', unit: 'W' },
// Add more specs...
],
images: ['/images/products/product-name.jpg'],
affiliateLinks: [
{
provider: 'Supplier Name',
url: 'https://supplier.com/product',
price: { amount: 199, currency: 'EUR', lastUpdated: '2025-10-18' },
availability: 'in-stock',
shipping: { portugal: true, eu: true, worldwide: false, estimatedDays: 5 },
},
],
rating: 4.5,
reviewCount: 89,
tags: ['tag1', 'tag2'],
compatibility: ['12V systems', '24V systems'],
installation: {
difficulty: 'moderate',
timeEstimate: '2-3 hours',
toolsRequired: ['drill', 'wrench'],
},
warranty: '5 years',
certifications: ['CE', 'IEC'],
}
\`\`\`

### Option 2: Web Scraping (TODO)

We can implement automated scrapers for:

- **AutoSolar.pt** - Good structure, easy to scrape
- **Amazon Product Advertising API** - Official API available
- **Leroy Merlin** - Would need scraping
- **ManoMano** - Marketplace API might be available

### Option 3: Supplier API Integration (TODO)

Priority suppliers for API integration:

1. **Amazon Product Advertising API** ✅ Has official API
2. **Krannich Solar** - Check if they have API
3. **DAMIA Solar** - Check if they have API

## Price Updates

Prices should be updated regularly. Implement:

- [ ] Automated price checking (weekly)
- [ ] Price alert system for significant changes
- [ ] Historical price tracking
- [ ] Best price recommendation algorithm

## Next Steps

1. **Expand Product Database**
   - Add 20+ more solar panels
   - Add 15+ more batteries
   - Add 10+ more inverters
   - Add complete water system products

2. **Implement Web Scraping**
   - Create scrapers for AutoSolar.pt
   - Integrate Amazon Product Advertising API
   - Add ManoMano scraper

3. **Add Product Images**
   - Source high-quality product images
   - Store in `/public/images/products/`
   - Optimize for web performance

4. **Price Monitoring**
   - Set up automated price checks
   - Alert on stock availability changes
   - Track price history

5. **Review System**
   - Add user reviews
   - Import reviews from suppliers
   - Verified purchase reviews

## API Usage

\`\`\`typescript
// Get all solar panels
fetch('/api/products?category=solar-panels')

// Get batteries under 500 EUR
fetch('/api/products?category=batteries&maxPrice=500&currency=EUR')

// Get products that ship to Portugal and are in stock
fetch('/api/products?shipsToPortugal=true&inStockOnly=true')

// Get highly-rated inverters
fetch('/api/products?category=inverters&minRating=4.5')
\`\`\`

## Files Structure

\`\`\`
src/lib/products/
├── types.ts # TypeScript types and interfaces
├── database.ts # Product database (expandable)
├── portuguese-suppliers.ts # Supplier information
└── README.md # This file

src/app/api/products/
└── route.ts # API endpoint handler
\`\`\`
