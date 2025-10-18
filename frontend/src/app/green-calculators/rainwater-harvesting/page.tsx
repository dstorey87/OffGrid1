'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useUnits } from '@/contexts/UnitsContext';
import UnitsSelector from '@/components/UnitsSelector';
import { ValueWithUnits } from '@/components/ValueWithUnits';
import { WaterIcon, MoneyIcon, ToolsIcon, BookIcon } from '@/components/icons';
import { waterPresets } from '@/lib/waterPresets';

interface RainwaterResults {
  annualCollection: number; // Always stored in liters
  recommendedTankSize: number; // Liters
  monthlyAverage: number; // Liters
  firstFlushVolume: number; // Liters
  roofArea: number; // Square meters
  gutterSize: number;
  downspoutSize: number;
  filterRecommendations: string[];
  costEstimate: {
    tank: number;
    gutters: number;
    filters: number;
    total: number;
  };
  products: Array<{
    name: string;
    price: string;
    link: string;
    category: string;
  }>;
}

export default function RainwaterHarvestingCalculator() {
  const { isMetric, convertVolume } = useUnits();
  const [roofLength, setRoofLength] = useState<string>('');
  const [roofWidth, setRoofWidth] = useState<string>('');
  const [annualRainfall, setAnnualRainfall] = useState<string>('');
  const [roofMaterial, setRoofMaterial] = useState<string>('asphalt');
  const [waterUsage, setWaterUsage] = useState<string>('');
  const [results, setResults] = useState<RainwaterResults | null>(null);
  const [showProducts, setShowProducts] = useState(false);

  const calculateRainwater = () => {
    const length = parseFloat(roofLength);
    const width = parseFloat(roofWidth);
    const rainfall = parseFloat(annualRainfall);
    const usage = parseFloat(waterUsage);

    if (!length || !width || !rainfall || !usage) {
      alert('Please fill in all required fields');
      return;
    }

    // Convert inputs to metric if user entered imperial
    // Inputs are assumed to be in user's preferred units
    const lengthMeters = isMetric ? length : length / 3.28084;
    const widthMeters = isMetric ? width : width / 3.28084;
    const rainfallMM = isMetric ? rainfall : rainfall * 25.4; // inches to mm
    const usageLiters = isMetric ? usage : usage / 0.264172; // gallons to liters

    // Roof area in square meters (always calculate in metric)
    const roofAreaM2 = lengthMeters * widthMeters;

    // Collection efficiency based on roof material
    const efficiencyFactors: { [key: string]: number } = {
      metal: 0.95,
      tile: 0.9,
      asphalt: 0.85,
      flat: 0.8,
    };
    const efficiency = efficiencyFactors[roofMaterial] || 0.85;

    // Calculate annual collection in liters
    // Formula: 1mm of rain on 1m² = 1 liter
    const annualLiters = roofAreaM2 * rainfallMM * efficiency;

    // Recommended tank size (store 2-3 months of usage or 50% of annual collection, whichever is smaller)
    const monthlyUsage = usageLiters * 30.44; // Convert daily to monthly
    const storageBasedOnUsage = monthlyUsage * 2.5;
    const storageBasedOnCollection = annualLiters * 0.5;
    const recommendedTank = Math.min(storageBasedOnUsage, storageBasedOnCollection);

    // First flush diverter size (approximately 10 liters per 10m² of roof, minimum 75L)
    const firstFlush = Math.max(roofAreaM2, 75);

    // Gutter sizing (1 sq inch per 100 sq ft for moderate rainfall - convert to metric)
    const roofAreaFt2 = roofAreaM2 * 10.7639;
    const gutterSize = Math.ceil((roofAreaFt2 / 100) * 1);
    const downspoutSize = Math.ceil(roofAreaFt2 / 600); // Number of downspouts needed

    // Filter recommendations
    const filters = [];
    if (roofAreaM2 > 93) filters.push('Leaf eater diverter'); // > 1000 sq ft
    filters.push('First flush diverter');
    filters.push('Pre-tank screen filter');
    if (usageLiters > 189) filters.push('UV sterilization system'); // > 50 gallons

    // Cost estimates (convert to gallons for pricing: $1.20 per gallon capacity)
    const tankGallons = recommendedTank * 0.264172;
    const tankCost = tankGallons * 1.2;
    const perimeterMeters = (lengthMeters + widthMeters) * 2;
    const perimeterFeet = perimeterMeters * 3.28084;
    const gutterCost = perimeterFeet * 8; // $8 per linear foot
    const filterCost = filters.length * 150; // Average $150 per filter component
    const totalCost = tankCost + gutterCost + filterCost;

    // Product recommendations with affiliate links
    const tankSize = Math.round(convertVolume(recommendedTank));
    const tankLabel = isMetric ? 'L' : 'G';
    const products = [
      {
        name: `${tankSize}${tankLabel} Polyethylene Water Tank`,
        price: `$${Math.round(tankCost)}`,
        link: 'https://amzn.to/rainwater-tank-' + tankSize,
        category: 'Storage Tank',
      },
      {
        name: 'First Flush Water Diverter Kit',
        price: '$89',
        link: 'https://amzn.to/first-flush-diverter',
        category: 'Pre-filtration',
      },
      {
        name: '6" Aluminum Gutters (per 10ft)',
        price: '$25',
        link: 'https://amzn.to/aluminum-gutters-6inch',
        category: 'Collection',
      },
      {
        name: 'Leaf Eater Advanced Gutter Filter',
        price: '$45',
        link: 'https://amzn.to/leaf-eater-filter',
        category: 'Pre-filtration',
      },
      {
        name: 'UV Water Sterilization System',
        price: '$185',
        link: 'https://amzn.to/uv-water-sterilizer',
        category: 'Treatment',
      },
    ];

    const newResults: RainwaterResults = {
      annualCollection: Math.round(annualLiters),
      recommendedTankSize: Math.round(recommendedTank),
      monthlyAverage: Math.round(annualLiters / 12),
      firstFlushVolume: Math.round(firstFlush),
      roofArea: roofAreaM2,
      gutterSize,
      downspoutSize,
      filterRecommendations: filters,
      costEstimate: {
        tank: Math.round(tankCost),
        gutters: Math.round(gutterCost),
        filters: Math.round(filterCost),
        total: Math.round(totalCost),
      },
      products,
    };

    setResults(newResults);
    setShowProducts(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Controls Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <UnitsSelector />
        </div>

        {/* Auto-Fill Water Usage Presets */}
        <div className="mb-6 rounded-lg border bg-gradient-to-r from-primary/10 to-accent/10 p-6">
          <h2 className="mb-4 text-xl font-semibold flex items-center gap-2"><WaterIcon size="sm" /> Quick Start: Household Water Usage</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Estimate daily water needs based on household size
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(waterPresets).map(([key, preset]) => {
              const dailyUsage = isMetric
                ? preset.totalDaily
                : (preset.totalDaily * 0.264172).toFixed(0);
              const unit = isMetric ? 'L' : 'gal';
              return (
                <button
                  key={key}
                  onClick={() => setWaterUsage(dailyUsage.toString())}
                  className="rounded-lg border-2 border-primary/20 bg-background p-4 text-left transition-all hover:border-primary hover:bg-accent"
                >
                  <div className="font-semibold text-primary">{preset.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{preset.people} people</div>
                  <div className="mt-2 text-sm font-medium text-foreground">
                    ~{dailyUsage} {unit}/day
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-6xl">
            Rainwater Harvesting
            <span className="block text-primary">Calculator</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Calculate optimal <strong>cistern size</strong>, annual water collection potential, and
            complete system requirements for <em>rainwater harvesting</em>. Get instant shopping
            lists with affiliate pricing.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Badge variant="outline">✅ Free Calculator</Badge>
            <Badge variant="outline">�️ Instant Shopping List</Badge>
            <Badge variant="outline" className="inline-flex items-center gap-1"><WaterIcon size="sm" /> Professional Results</Badge>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>System Requirements</CardTitle>
              <CardDescription>
                Enter your roof dimensions and local rainfall data to calculate collection potential
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Roof Length ({isMetric ? 'meters' : 'feet'})
                  </label>
                  <Input
                    type="number"
                    placeholder={isMetric ? '12' : '40'}
                    value={roofLength}
                    onChange={(e) => setRoofLength(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Roof Width ({isMetric ? 'meters' : 'feet'})
                  </label>
                  <Input
                    type="number"
                    placeholder={isMetric ? '9' : '30'}
                    value={roofWidth}
                    onChange={(e) => setRoofWidth(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Annual Rainfall ({isMetric ? 'millimeters' : 'inches'}) *
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder={isMetric ? '650' : '25.5'}
                  value={annualRainfall}
                  onChange={(e) => setAnnualRainfall(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  * Check NOAA or local weather data for your area&apos;s average annual rainfall
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Roof Material</label>
                <select
                  className="w-full rounded border px-3 py-2"
                  value={roofMaterial}
                  onChange={(e) => setRoofMaterial(e.target.value)}
                >
                  <option value="metal">Metal (95% efficiency)</option>
                  <option value="tile">Tile (90% efficiency)</option>
                  <option value="asphalt">Asphalt Shingle (85% efficiency)</option>
                  <option value="flat">Flat Roof (80% efficiency)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Daily Water Usage ({isMetric ? 'liters' : 'gallons'})
                </label>
                <Input
                  type="number"
                  placeholder={isMetric ? '380' : '100'}
                  value={waterUsage}
                  onChange={(e) => setWaterUsage(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {isMetric
                    ? 'Typical household: 300-450 L/day. Irrigation only: 75-190 L/day'
                    : 'Typical household: 80-120 gallons/day. Irrigation only: 20-50 gallons/day'}
                </p>
              </div>

              <Button onClick={calculateRainwater} className="w-full inline-flex items-center justify-center gap-2" size="lg">
                <WaterIcon size="sm" /> Calculate Rainwater System
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Your Rainwater Harvesting System</CardTitle>
                <CardDescription>Complete system sizing and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Collection Potential */}
                <div className="rounded bg-primary/10 p-4">
                  <h3 className="mb-3 font-semibold text-primary">📊 Collection Potential</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Annual Collection:</span>
                      <span className="font-medium">
                        <ValueWithUnits
                          value={results.annualCollection}
                          type="volume"
                          decimals={0}
                        />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Average:</span>
                      <span className="font-medium">
                        <ValueWithUnits value={results.monthlyAverage} type="volume" decimals={0} />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Roof Collection Area:</span>
                      <span className="font-medium">
                        <ValueWithUnits value={results.roofArea} type="area" decimals={1} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* System Sizing */}
                <div className="rounded bg-blue-50 p-4 dark:bg-blue-950/30">
                  <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-300">
                    🏗️ System Components
                  </h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Recommended Tank Size:</span>
                      <span className="font-medium text-blue-900 dark:text-blue-300">
                        <ValueWithUnits
                          value={results.recommendedTankSize}
                          type="volume"
                          decimals={0}
                        />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gutter Size Needed:</span>
                      <span className="font-medium">{results.gutterSize}&quot; wide</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Downspouts Required:</span>
                      <span className="font-medium">{results.downspoutSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>First Flush Diverter:</span>
                      <span className="font-medium">
                        <ValueWithUnits
                          value={results.firstFlushVolume}
                          type="volume"
                          decimals={0}
                        />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filtration */}
                <div className="rounded bg-green-50 p-4 dark:bg-green-950/30">
                  <h3 className="mb-3 font-semibold text-green-900 dark:text-green-300">
                    🌿 Filtration System
                  </h3>
                  <div className="space-y-1">
                    {results.filterRecommendations.map((filter, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span>{filter}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Estimate */}
                <div className="rounded bg-orange-50 p-4 dark:bg-orange-950/30">
                  <h3 className="mb-3 font-semibold text-orange-900 dark:text-orange-300 flex items-center gap-2">
                    <MoneyIcon size="sm" /> Cost Estimate
                  </h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Storage Tank:</span>
                      <span className="font-medium">${results.costEstimate.tank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gutters & Downspouts:</span>
                      <span className="font-medium">${results.costEstimate.gutters}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Filtration System:</span>
                      <span className="font-medium">${results.costEstimate.filters}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Total System Cost:</span>
                      <span className="text-orange-900 dark:text-orange-300">
                        ${results.costEstimate.total}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowProducts(!showProducts)}
                  className="w-full"
                  variant="outline"
                >
                  🛒 {showProducts ? 'Hide' : 'View'} Shopping List
                </Button>

                {showProducts && (
                  <div className="space-y-4 rounded border p-4">
                    <h3 className="font-semibold">🛍️ Recommended Products</h3>
                    {results.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded bg-gray-50 p-3 dark:bg-gray-800"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{product.price}</p>
                          <a
                            href={product.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                          >
                            View on Amazon →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Data Sources & References */}
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-3 text-lg font-semibold text-foreground flex items-center gap-2">
                    <BookIcon size="sm" /> Data Sources & References
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium text-foreground">Rainfall Collection Formula:</p>
                      <p>
                        Based on the principle that 1mm of rainfall on 1m² of roof area = 1 liter of
                        water. Imperial conversion: 0.623 gallons per sq ft per inch of rain.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Collection Efficiency Factors:</p>
                      <p>
                        Metal roofs (95%), tile roofs (90%), asphalt shingles (85%), flat roofs
                        (80%) - based on Texas A&M AgriLife Extension and EPA WaterSense guidelines.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Tank Sizing Standards:</p>
                      <p>
                        Recommended storage: 2-3 months of usage or 50% of annual collection
                        (whichever is smaller). Based on American Rainwater Catchment Systems
                        Association (ARCSA) guidelines.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Filtration Recommendations:</p>
                      <p>
                        First flush diverters (10L per 10m² minimum), pre-tank screening, UV
                        sterilization for potable use. Standards from NSF/ANSI 350 and local health
                        departments.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Product Pricing:</p>
                      <p>
                        Tank costs: $1.20/gallon capacity average. Gutters: $8/linear foot. Filters:
                        $150 per component average. Pricing sourced from Amazon, Home Depot,
                        specialist retailers (2024).
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Gutter & Downspout Sizing:</p>
                      <p>
                        1 square inch of gutter per 100 sq ft of roof for moderate rainfall. 1
                        downspout per 600 sq ft. Based on International Plumbing Code (IPC)
                        standards.
                      </p>
                    </div>
                    <div className="rounded bg-yellow-50 p-3 dark:bg-yellow-950/30">
                      <p className="font-medium text-yellow-900 dark:text-yellow-300">
                        ⚠️ Disclaimer:
                      </p>
                      <p className="text-yellow-800 dark:text-yellow-400">
                        These calculations are estimates for planning purposes. Local building
                        codes, rainfall patterns, and site-specific conditions may require
                        adjustments. Consult with a licensed plumber or rainwater harvesting
                        specialist before installation. Check local regulations regarding rainwater
                        collection and use.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Related Tools */}
        <div className="mt-16 rounded-lg border-2 border-primary bg-gradient-to-r from-primary/10 to-accent/10 p-8">
          <h2 className="mb-4 text-2xl font-bold flex items-center gap-2"><ToolsIcon size="md" /> Complete Your Water System</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Combine rainwater harvesting with other sustainable water solutions for complete
            independence
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/green-calculators/greywater-systems"
              className="rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Greywater Recycling
            </Link>
            <Link
              href="/green-calculators/water-storage"
              className="rounded border border-primary px-6 py-3 font-semibold hover:bg-accent"
            >
              Water Storage Calculator
            </Link>
            <Link
              href="/solar-calculators/load-analysis"
              className="rounded bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Size Water Pump Solar
            </Link>
          </div>
        </div>

        {/* SEO Content */}
        <div className="prose prose-lg mx-auto mt-16 max-w-4xl">
          <h2>How Rainwater Harvesting Works</h2>
          <p>
            <strong>Rainwater harvesting</strong> systems collect, filter, and store rainwater from
            your roof for later use. Our calculator helps you determine the optimal{' '}
            <em>cistern size</em> based on your roof area, local rainfall patterns, and water usage
            needs.
          </p>

          <h3>System Components</h3>
          <ul>
            <li>
              <strong>Collection Surface:</strong> Your roof acts as the catchment area
            </li>
            <li>
              <strong>Gutters & Downspouts:</strong> Channel water from roof to storage
            </li>
            <li>
              <strong>First Flush Diverter:</strong> Removes initial dirty water from each rain
              event
            </li>
            <li>
              <strong>Storage Tank:</strong> Holds filtered rainwater for use
            </li>
            <li>
              <strong>Filtration:</strong> Screens, UV sterilization, and carbon filters
            </li>
          </ul>

          <p>
            The calculator accounts for roof material efficiency, local rainfall data, and your
            daily water usage to size each component correctly. Combined with our{' '}
            <Link href="/solar-calculators">solar calculators</Link>, you can design a completely
            sustainable water and energy system.
          </p>
        </div>
      </div>
    </main>
  );
}
