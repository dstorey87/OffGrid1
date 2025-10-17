'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface GreywaterResults {
  dailyGreywaterVolume: number;
  treatmentSystemSize: number;
  irrigationAreaCovered: number;
  pumpRequirements: {
    gpm: number;
    head: number;
    power: number;
  };
  distributionSystem: {
    pipeSize: string;
    valveCount: number;
    emitterCount: number;
  };
  costEstimate: {
    treatment: number;
    distribution: number;
    pump: number;
    installation: number;
    total: number;
  };
  products: Array<{
    name: string;
    price: string;
    link: string;
    category: string;
  }>;
  benefits: {
    waterSavingsGallonsPerYear: number;
    costSavingsPerYear: number;
    environmentalImpact: string;
  };
}

export default function GreywaterSystemsCalculator() {
  const [householdSize, setHouseholdSize] = useState<string>('');
  const [showersPerDay, setShowersPerDay] = useState<string>('');
  const [laundryLoadsPerWeek, setLaundryLoadsPerWeek] = useState<string>('');
  const [sinkUsage, setSinkUsage] = useState<string>('moderate');
  const [irrigationArea, setIrrigationArea] = useState<string>('');
  const [soilType, setSoilType] = useState<string>('sandy-loam');
  const [systemType, setSystemType] = useState<string>('branched-drain');
  const [results, setResults] = useState<GreywaterResults | null>(null);
  const [showProducts, setShowProducts] = useState(false);

  const calculateGreywater = () => {
    const household = parseFloat(householdSize);
    const showers = parseFloat(showersPerDay);
    const laundry = parseFloat(laundryLoadsPerWeek);
    const area = parseFloat(irrigationArea);

    if (!household || !showers || !laundry || !area) {
      alert('Please fill in all required fields');
      return;
    }

    // Calculate daily greywater production
    const showerGallons = showers * 17; // Average 17 gallons per shower
    const laundryGallonsDaily = (laundry * 25) / 7; // 25 gallons per load, convert to daily

    const sinkMultipliers = {
      light: 0.5,
      moderate: 1.0,
      heavy: 1.5,
    };
    const sinkGallons =
      household * 8 * (sinkMultipliers[sinkUsage as keyof typeof sinkMultipliers] || 1);

    const dailyVolume = showerGallons + laundryGallonsDaily + sinkGallons;

    // Treatment system sizing based on type
    const systemSizeFactors = {
      'branched-drain': 1.0, // Simple distribution, no treatment
      'laundry-to-landscape': 1.0, // Direct irrigation
      'simple-sand-filter': 1.2, // Basic filtration
      'constructed-wetland': 1.5, // Biological treatment
      'advanced-treatment': 2.0, // Full treatment with disinfection
    };
    const treatmentSize =
      dailyVolume * (systemSizeFactors[systemType as keyof typeof systemSizeFactors] || 1.2);

    // Irrigation coverage calculation (gallons per sq ft varies by soil and climate)
    const soilFactors = {
      sandy: 0.8, // Drains quickly, needs more water
      'sandy-loam': 0.6, // Ideal soil
      'clay-loam': 0.5, // Holds water well
      clay: 0.4, // Very water retentive
    };
    const irrigationRate = soilFactors[soilType as keyof typeof soilFactors] || 0.6;
    const areaCovered = dailyVolume / irrigationRate;

    // Pump requirements (if needed for distribution)
    const pumpGPM = (treatmentSize / 1440) * 60; // Convert daily volume to GPM for peak flow
    const pumpHead = systemType === 'branched-drain' ? 0 : 15; // Feet of head
    const pumpPower = systemType === 'branched-drain' ? 0 : pumpGPM * pumpHead * 0.000583; // HP

    // Distribution system components
    const pipeSize = dailyVolume > 100 ? '2"' : dailyVolume > 50 ? '1.5"' : '1"';
    const valveCount = Math.ceil(area / 500); // One zone valve per 500 sq ft
    const emitterCount = systemType.includes('drip') ? Math.ceil(area / 4) : 0; // Drip emitters every 4 sq ft

    // Cost estimates
    const treatmentCosts = {
      'branched-drain': 300,
      'laundry-to-landscape': 400,
      'simple-sand-filter': 800,
      'constructed-wetland': 1500,
      'advanced-treatment': 3000,
    };
    const treatmentCost = treatmentCosts[systemType as keyof typeof treatmentCosts] || 800;

    const distributionCost = valveCount * 150 + emitterCount * 2 + area * 0.5; // Valves, emitters, pipe
    const pumpCost = pumpPower > 0 ? 400 + pumpPower * 200 : 0;
    const installationCost = (treatmentCost + distributionCost + pumpCost) * 0.5; // 50% labor
    const totalCost = treatmentCost + distributionCost + pumpCost + installationCost;

    // Environmental benefits
    const annualSavings = dailyVolume * 365;
    const costSavingsPerYear = annualSavings * 0.004; // $0.004 per gallon saved
    const environmentalImpact = `Reduces water demand by ${Math.round(annualSavings)} gallons/year`;

    // Product recommendations
    const products = [
      {
        name: 'Greywater Diverter Valve 3-Way',
        price: '$45',
        link: 'https://amzn.to/greywater-diverter-valve',
        category: 'Diversion',
      },
      {
        name: 'Branched Drain Distribution Box',
        price: '$85',
        link: 'https://amzn.to/branched-drain-box',
        category: 'Distribution',
      },
      {
        name: 'Sand Filter Media (50lb bag)',
        price: '$25',
        link: 'https://amzn.to/sand-filter-media',
        category: 'Filtration',
      },
      {
        name: 'Drip Irrigation Emitters (100 pack)',
        price: '$35',
        link: 'https://amzn.to/drip-emitters-100pack',
        category: 'Irrigation',
      },
      {
        name: 'Zone Control Valve with Timer',
        price: '$120',
        link: 'https://amzn.to/zone-valve-timer',
        category: 'Control',
      },
    ];

    const newResults: GreywaterResults = {
      dailyGreywaterVolume: Math.round(dailyVolume),
      treatmentSystemSize: Math.round(treatmentSize),
      irrigationAreaCovered: Math.round(areaCovered),
      pumpRequirements: {
        gpm: Math.round(pumpGPM * 10) / 10,
        head: pumpHead,
        power: Math.round(pumpPower * 100) / 100,
      },
      distributionSystem: {
        pipeSize,
        valveCount,
        emitterCount,
      },
      costEstimate: {
        treatment: Math.round(treatmentCost),
        distribution: Math.round(distributionCost),
        pump: Math.round(pumpCost),
        installation: Math.round(installationCost),
        total: Math.round(totalCost),
      },
      products,
      benefits: {
        waterSavingsGallonsPerYear: Math.round(annualSavings),
        costSavingsPerYear: Math.round(costSavingsPerYear),
        environmentalImpact,
      },
    };

    setResults(newResults);
    setShowProducts(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-6xl">
            Greywater System
            <span className="block text-primary">Design Calculator</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Design efficient <strong>greywater recycling systems</strong> to reuse water from sinks,
            showers, and laundry for <em>landscape irrigation</em>. Calculate treatment,
            distribution, and cost requirements.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Badge variant="outline">🌊 Water Reuse</Badge>
            <Badge variant="outline">🌱 Eco-Friendly</Badge>
            <Badge variant="outline">💰 Cost Savings</Badge>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>System Requirements</CardTitle>
              <CardDescription>
                Enter your household details and irrigation needs for custom greywater system design
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Household Size</label>
                  <Input
                    type="number"
                    placeholder="4"
                    value={householdSize}
                    onChange={(e) => setHouseholdSize(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Showers per Day</label>
                  <Input
                    type="number"
                    placeholder="6"
                    value={showersPerDay}
                    onChange={(e) => setShowersPerDay(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Laundry Loads per Week</label>
                <Input
                  type="number"
                  placeholder="8"
                  value={laundryLoadsPerWeek}
                  onChange={(e) => setLaundryLoadsPerWeek(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Sink Usage Level</label>
                <select
                  className="w-full rounded border px-3 py-2"
                  value={sinkUsage}
                  onChange={(e) => setSinkUsage(e.target.value)}
                >
                  <option value="light">Light (minimal cooking/cleaning)</option>
                  <option value="moderate">Moderate (normal household)</option>
                  <option value="heavy">Heavy (frequent cooking/cleaning)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Irrigation Area (sq ft)</label>
                <Input
                  type="number"
                  placeholder="1500"
                  value={irrigationArea}
                  onChange={(e) => setIrrigationArea(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Area of landscape to be irrigated with greywater
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Soil Type</label>
                <select
                  className="w-full rounded border px-3 py-2"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                >
                  <option value="sandy">Sandy (fast draining)</option>
                  <option value="sandy-loam">Sandy Loam (ideal)</option>
                  <option value="clay-loam">Clay Loam (moderate drainage)</option>
                  <option value="clay">Clay (slow draining)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">System Type</label>
                <select
                  className="w-full rounded border px-3 py-2"
                  value={systemType}
                  onChange={(e) => setSystemType(e.target.value)}
                >
                  <option value="branched-drain">Branched Drain (gravity flow)</option>
                  <option value="laundry-to-landscape">Laundry-to-Landscape</option>
                  <option value="simple-sand-filter">Simple Sand Filter</option>
                  <option value="constructed-wetland">Constructed Wetland</option>
                  <option value="advanced-treatment">Advanced Treatment</option>
                </select>
              </div>

              <Button onClick={calculateGreywater} className="w-full" size="lg">
                🌊 Design Greywater System
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Your Greywater System Design</CardTitle>
                <CardDescription>Complete system specifications and requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Production & Capacity */}
                <div className="rounded bg-blue-50 p-4">
                  <h3 className="mb-3 font-semibold text-blue-900">💧 System Capacity</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Daily Greywater Production:</span>
                      <span className="font-medium">
                        {results.dailyGreywaterVolume} gallons/day
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Treatment System Size:</span>
                      <span className="font-medium">
                        {results.treatmentSystemSize} gallon capacity
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Irrigation Coverage:</span>
                      <span className="font-medium">
                        {results.irrigationAreaCovered.toLocaleString()} sq ft
                      </span>
                    </div>
                  </div>
                </div>

                {/* Distribution System */}
                <div className="rounded bg-green-50 p-4">
                  <h3 className="mb-3 font-semibold text-green-900">🚰 Distribution System</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Main Pipe Size:</span>
                      <span className="font-medium">{results.distributionSystem.pipeSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zone Valves Needed:</span>
                      <span className="font-medium">{results.distributionSystem.valveCount}</span>
                    </div>
                    {results.distributionSystem.emitterCount > 0 && (
                      <div className="flex justify-between">
                        <span>Drip Emitters:</span>
                        <span className="font-medium">
                          {results.distributionSystem.emitterCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pump Requirements */}
                {results.pumpRequirements.power > 0 && (
                  <div className="rounded bg-orange-50 p-4">
                    <h3 className="mb-3 font-semibold text-orange-900">⚡ Pump Requirements</h3>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Flow Rate:</span>
                        <span className="font-medium">{results.pumpRequirements.gpm} GPM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Head:</span>
                        <span className="font-medium">{results.pumpRequirements.head} feet</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Motor Size:</span>
                        <span className="font-medium">{results.pumpRequirements.power} HP</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Environmental Benefits */}
                <div className="rounded bg-green-100 p-4">
                  <h3 className="mb-3 font-semibold text-green-800">🌱 Environmental Benefits</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Annual Water Savings:</span>
                      <span className="font-medium">
                        {results.benefits.waterSavingsGallonsPerYear.toLocaleString()} gallons
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Cost Savings:</span>
                      <span className="font-medium text-green-800">
                        ${results.benefits.costSavingsPerYear}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-green-700">
                    {results.benefits.environmentalImpact}
                  </p>
                </div>

                {/* Cost Breakdown */}
                <div className="rounded bg-purple-50 p-4">
                  <h3 className="mb-3 font-semibold text-purple-900">💰 Cost Estimate</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Treatment System:</span>
                      <span className="font-medium">${results.costEstimate.treatment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distribution System:</span>
                      <span className="font-medium">${results.costEstimate.distribution}</span>
                    </div>
                    {results.costEstimate.pump > 0 && (
                      <div className="flex justify-between">
                        <span>Pump & Controls:</span>
                        <span className="font-medium">${results.costEstimate.pump}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Installation:</span>
                      <span className="font-medium">${results.costEstimate.installation}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Total System Cost:</span>
                      <span className="text-purple-900">${results.costEstimate.total}</span>
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
                    <h3 className="font-semibold">🛍️ System Components</h3>
                    {results.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded bg-gray-50 p-3"
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
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View on Amazon →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Related Tools */}
        <div className="mt-16 rounded-lg border-2 border-primary bg-gradient-to-r from-primary/10 to-accent/10 p-8">
          <h2 className="mb-4 text-2xl font-bold">🔧 Complete Your Water Independence</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Combine greywater recycling with rainwater harvesting for complete water sustainability
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/green-calculators/rainwater-harvesting"
              className="rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Rainwater Harvesting
            </Link>
            <Link
              href="/green-calculators/composting-toilet"
              className="rounded border border-primary px-6 py-3 font-semibold hover:bg-accent"
            >
              Composting Toilets
            </Link>
            <Link
              href="/solar-calculators/load-analysis"
              className="rounded bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Solar for Pumps
            </Link>
          </div>
        </div>

        {/* SEO Content */}
        <div className="prose prose-lg mx-auto mt-16 max-w-4xl">
          <h2>Greywater System Design Guide</h2>
          <p>
            <strong>Greywater systems</strong> reuse water from bathroom sinks, showers, and laundry
            for landscape irrigation. Our calculator designs complete systems including treatment,
            distribution, and pumping requirements based on your household's specific needs.
          </p>

          <h3>System Types</h3>
          <ul>
            <li>
              <strong>Branched Drain:</strong> Simple gravity-fed distribution system
            </li>
            <li>
              <strong>Laundry-to-Landscape:</strong> Direct connection from washing machine
            </li>
            <li>
              <strong>Sand Filter:</strong> Basic filtration for cleaner water
            </li>
            <li>
              <strong>Constructed Wetland:</strong> Biological treatment using plants
            </li>
            <li>
              <strong>Advanced Treatment:</strong> Full treatment with disinfection
            </li>
          </ul>

          <p>
            Greywater systems can reduce household water consumption by 30-50% while providing free
            irrigation for your landscape. Combined with{' '}
            <Link href="/green-calculators/rainwater-harvesting">rainwater harvesting</Link> and{' '}
            <Link href="/solar-calculators">solar power systems</Link>, you can achieve complete
            water and energy independence.
          </p>
        </div>
      </div>
    </main>
  );
}
