'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface HydroponicsResults {
  systemVolume: number;
  plantCapacity: number;
  dailyWaterUsage: number;
  reservoirSize: number;
  nutrientSolution: {
    nitrogenPPM: number;
    phosphorusPPM: number;
    potassiumPPM: number;
    weeklyNutrientCost: number;
  };
  pumpRequirements: {
    flowRate: number;
    operatingHours: number;
    powerConsumption: number;
  };
  lightingRequirements: {
    totalWatts: number;
    dailyHours: number;
    monthlyPowerCost: number;
  };
  costAnalysis: {
    setupCost: number;
    monthlyOperating: number;
    annualYield: number;
    valueOfProduce: number;
    paybackMonths: number;
  };
  products: Array<{
    name: string;
    price: string;
    link: string;
    category: string;
    specs: string;
  }>;
}

export default function HydroponicsCalculator() {
  const [systemType, setSystemType] = useState<string>('nft');
  const [growingArea, setGrowingArea] = useState<string>('');
  const [plantType, setPlantType] = useState<string>('leafy-greens');
  const [plantSpacing, setPlantSpacing] = useState<string>('');
  const [growCycles, setGrowCycles] = useState<string>('');
  const [electricityRate, setElectricityRate] = useState<string>('0.12');
  const [location, setLocation] = useState<string>('indoor');
  const [results, setResults] = useState<HydroponicsResults | null>(null);
  const [showProducts, setShowProducts] = useState(false);

  const calculateHydroponics = () => {
    const area = parseFloat(growingArea);
    const spacing = parseFloat(plantSpacing);
    const cycles = parseFloat(growCycles);
    const rate = parseFloat(electricityRate);

    if (!area || !spacing || !cycles) {
      alert('Please fill in all required fields');
      return;
    }

    // Calculate plant capacity based on spacing
    const plantsPerSqFt = 1 / ((spacing * spacing) / 144); // Convert inches to sq ft
    const totalPlants = Math.floor(area * plantsPerSqFt);

    // System volume calculations based on type
    const systemVolumeFactors = {
      nft: 0.5, // NFT systems use minimal water
      dwc: 2.0, // Deep Water Culture needs more volume
      'ebb-flow': 1.0, // Ebb and Flow moderate volume
      drip: 0.8, // Drip systems moderate volume
      aeroponics: 0.3, // Aeroponics minimal water
      kratky: 1.5, // Kratky method static volume
    };
    const volumeFactor = systemVolumeFactors[systemType as keyof typeof systemVolumeFactors] || 1.0;
    const systemVolume = totalPlants * volumeFactor; // Gallons

    // Reservoir sizing (typically 2-4x system volume)
    const reservoirSize = systemVolume * 3;

    // Daily water usage (varies by plant type and system)
    const plantWaterFactors = {
      'leafy-greens': 0.1, // Low water needs
      herbs: 0.15, // Moderate water needs
      tomatoes: 0.3, // High water needs
      peppers: 0.25, // High water needs
      cucumbers: 0.35, // Very high water needs
      strawberries: 0.2, // Moderate water needs
    };
    const waterFactor = plantWaterFactors[plantType as keyof typeof plantWaterFactors] || 0.15;
    const dailyWater = totalPlants * waterFactor; // Gallons per day

    // Nutrient solution calculations (NPK requirements)
    const nutrientProfiles = {
      'leafy-greens': { n: 150, p: 50, k: 150 },
      herbs: { n: 120, p: 40, k: 120 },
      tomatoes: { n: 200, p: 60, k: 250 },
      peppers: { n: 180, p: 55, k: 200 },
      cucumbers: { n: 220, p: 65, k: 280 },
      strawberries: { n: 100, p: 40, k: 150 },
    };
    const nutrients = nutrientProfiles[plantType as keyof typeof nutrientProfiles] || {
      n: 150,
      p: 50,
      k: 150,
    };

    // Weekly nutrient cost (approximate $0.02 per gallon of solution)
    const weeklyNutrientCost = reservoirSize * 0.02;

    // Pump requirements
    const flowRates = {
      nft: totalPlants * 0.5, // GPH - continuous flow
      dwc: totalPlants * 0.1, // GPH - air pump equivalent
      'ebb-flow': reservoirSize * 2, // GPH - flood/drain cycles
      drip: totalPlants * 0.25, // GPH - slow drip
      aeroponics: totalPlants * 1.0, // GPH - high pressure
      kratky: 0, // No pump needed
    };
    const pumpFlowRate = flowRates[systemType as keyof typeof flowRates] || totalPlants * 0.5;

    const operatingHours =
      systemType === 'nft' || systemType === 'aeroponics' ? 24 : systemType === 'ebb-flow' ? 4 : 12;

    // Pump power consumption (watts) - estimate based on flow rate
    const pumpPower = pumpFlowRate > 0 ? Math.max(15, pumpFlowRate * 0.1) : 0;

    // Lighting requirements (for indoor systems)
    const lightingNeeded = location === 'indoor' || location === 'greenhouse';
    const wattsPerSqFt = plantType === 'leafy-greens' ? 25 : 35; // LED watts per sq ft
    const totalWatts = lightingNeeded ? area * wattsPerSqFt : 0;
    const dailyLightHours = lightingNeeded ? (plantType === 'leafy-greens' ? 14 : 16) : 0;
    const monthlyLightCost = (totalWatts * dailyLightHours * 30 * rate) / 1000;

    // Yield calculations
    const yieldFactors = {
      'leafy-greens': 0.5, // lbs per plant per cycle
      herbs: 0.3,
      tomatoes: 3.0,
      peppers: 2.0,
      cucumbers: 4.0,
      strawberries: 1.0,
    };
    const yieldPerPlant = yieldFactors[plantType as keyof typeof yieldFactors] || 0.5;
    const annualYield = totalPlants * yieldPerPlant * cycles;

    // Value of produce ($ per lb)
    const produceValues = {
      'leafy-greens': 4,
      herbs: 8,
      tomatoes: 3,
      peppers: 4,
      cucumbers: 2,
      strawberries: 6,
    };
    const valuePerLb = produceValues[plantType as keyof typeof produceValues] || 4;
    const annualValue = annualYield * valuePerLb;

    // Cost analysis
    const systemCosts = {
      nft: area * 15,
      dwc: area * 12,
      'ebb-flow': area * 18,
      drip: area * 20,
      aeroponics: area * 35,
      kratky: area * 8,
    };
    const baseCost = systemCosts[systemType as keyof typeof systemCosts] || area * 15;
    const lightingCost = totalWatts * 1.5; // $1.50 per watt for LED fixtures
    const setupCost = baseCost + lightingCost + (pumpPower > 0 ? 150 : 0); // Add pump cost

    const monthlyOperating =
      weeklyNutrientCost * 4.33 +
      monthlyLightCost +
      (pumpPower * operatingHours * 30 * rate) / 1000;
    const paybackMonths = setupCost / (annualValue / 12 - monthlyOperating);

    // Product recommendations
    const products = [
      {
        name: `${systemType.toUpperCase()} Hydroponic System Kit`,
        price: `$${Math.round(baseCost)}`,
        link: `https://amzn.to/hydroponic-${systemType}-kit`,
        category: 'System',
        specs: `${Math.round(area)} sq ft capacity, ${totalPlants} plants`,
      },
      {
        name: `LED Grow Light ${Math.round(totalWatts)}W Full Spectrum`,
        price: `$${Math.round(lightingCost)}`,
        link: `https://amzn.to/led-grow-light-${Math.round(totalWatts)}w`,
        category: 'Lighting',
        specs: `Samsung LM301B chips, dimmable driver`,
      },
      {
        name: 'General Hydroponics Flora Series Nutrients',
        price: '$35',
        link: 'https://amzn.to/flora-series-nutrients',
        category: 'Nutrients',
        specs: 'FloraGrow, FloraBloom, FloraMicro 3-part',
      },
      {
        name: 'pH/EC/TDS Meter Digital Tester',
        price: '$45',
        link: 'https://amzn.to/ph-ec-tds-meter',
        category: 'Testing',
        specs: 'Automatic calibration, waterproof',
      },
      {
        name: `Water Pump ${Math.round(pumpFlowRate)}GPH`,
        price: `$${Math.round(pumpPower > 0 ? 80 + pumpPower : 0)}`,
        link: `https://amzn.to/water-pump-${Math.round(pumpFlowRate)}gph`,
        category: 'Pumping',
        specs: `Submersible, adjustable flow rate`,
      },
    ].filter((product) => product.price !== '$0'); // Remove items not needed (like pump for Kratky)

    const newResults: HydroponicsResults = {
      systemVolume: Math.round(systemVolume * 10) / 10,
      plantCapacity: totalPlants,
      dailyWaterUsage: Math.round(dailyWater * 10) / 10,
      reservoirSize: Math.round(reservoirSize),
      nutrientSolution: {
        nitrogenPPM: nutrients.n,
        phosphorusPPM: nutrients.p,
        potassiumPPM: nutrients.k,
        weeklyNutrientCost: Math.round(weeklyNutrientCost * 100) / 100,
      },
      pumpRequirements: {
        flowRate: Math.round(pumpFlowRate),
        operatingHours: operatingHours,
        powerConsumption: Math.round(pumpPower),
      },
      lightingRequirements: {
        totalWatts: Math.round(totalWatts),
        dailyHours: dailyLightHours,
        monthlyPowerCost: Math.round(monthlyLightCost * 100) / 100,
      },
      costAnalysis: {
        setupCost: Math.round(setupCost),
        monthlyOperating: Math.round(monthlyOperating * 100) / 100,
        annualYield: Math.round(annualYield * 10) / 10,
        valueOfProduce: Math.round(annualValue),
        paybackMonths: Math.round(paybackMonths * 10) / 10,
      },
      products,
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
            Hydroponics System
            <span className="block text-primary">Calculator</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Design complete <strong>hydroponic growing systems</strong> with precise calculations
            for nutrients, lighting, pumps, and yields. Calculate costs and expected harvests for
            <em>soilless growing</em> operations.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Badge variant="outline">🌱 Soilless Growing</Badge>
            <Badge variant="outline">💡 LED Lighting</Badge>
            <Badge variant="outline">📊 Yield Optimization</Badge>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Design your hydroponic system based on space, crops, and growing requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">Hydroponic System Type</label>
                <select
                  className="w-full rounded border px-3 py-2"
                  value={systemType}
                  onChange={(e) => setSystemType(e.target.value)}
                >
                  <option value="nft">NFT (Nutrient Film Technique)</option>
                  <option value="dwc">DWC (Deep Water Culture)</option>
                  <option value="ebb-flow">Ebb & Flow (Flood & Drain)</option>
                  <option value="drip">Drip System</option>
                  <option value="aeroponics">Aeroponics</option>
                  <option value="kratky">Kratky Method (Passive)</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Growing Area (sq ft)</label>
                  <Input
                    type="number"
                    placeholder="32"
                    value={growingArea}
                    onChange={(e) => setGrowingArea(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Plant Spacing (inches)</label>
                  <Input
                    type="number"
                    placeholder="6"
                    value={plantSpacing}
                    onChange={(e) => setPlantSpacing(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Crop Type</label>
                <select
                  className="w-full rounded border px-3 py-2"
                  value={plantType}
                  onChange={(e) => setPlantType(e.target.value)}
                >
                  <option value="leafy-greens">Leafy Greens (lettuce, spinach, kale)</option>
                  <option value="herbs">Herbs (basil, cilantro, parsley)</option>
                  <option value="tomatoes">Tomatoes</option>
                  <option value="peppers">Peppers</option>
                  <option value="cucumbers">Cucumbers</option>
                  <option value="strawberries">Strawberries</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Growing Cycles per Year</label>
                  <Input
                    type="number"
                    placeholder="6"
                    value={growCycles}
                    onChange={(e) => setGrowCycles(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Leafy greens: 6-12 cycles, Tomatoes: 2-3 cycles
                  </p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Electricity Rate ($/kWh)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.12"
                    value={electricityRate}
                    onChange={(e) => setElectricityRate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Growing Location</label>
                <select
                  className="w-full rounded border px-3 py-2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="indoor">Indoor (requires LED lighting)</option>
                  <option value="greenhouse">Greenhouse (supplemental lighting)</option>
                  <option value="outdoor">Outdoor (natural light)</option>
                </select>
              </div>

              <Button onClick={calculateHydroponics} className="w-full" size="lg">
                🌱 Calculate Hydroponic System
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Hydroponic System Design</CardTitle>
                <CardDescription>
                  Complete system specifications and yield projections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* System Capacity */}
                <div className="rounded bg-green-50 p-4">
                  <h3 className="mb-3 font-semibold text-green-900">🌱 System Capacity</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Plant Capacity:</span>
                      <span className="font-medium">{results.plantCapacity} plants</span>
                    </div>
                    <div className="flex justify-between">
                      <span>System Volume:</span>
                      <span className="font-medium">{results.systemVolume} gallons</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reservoir Size:</span>
                      <span className="font-medium">{results.reservoirSize} gallons</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Water Usage:</span>
                      <span className="font-medium">{results.dailyWaterUsage} gallons</span>
                    </div>
                  </div>
                </div>

                {/* Nutrient Solution */}
                <div className="rounded bg-blue-50 p-4">
                  <h3 className="mb-3 font-semibold text-blue-900">💧 Nutrient Solution (NPK)</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Nitrogen (N):</span>
                      <span className="font-medium">
                        {results.nutrientSolution.nitrogenPPM} PPM
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phosphorus (P):</span>
                      <span className="font-medium">
                        {results.nutrientSolution.phosphorusPPM} PPM
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Potassium (K):</span>
                      <span className="font-medium">
                        {results.nutrientSolution.potassiumPPM} PPM
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Weekly Nutrient Cost:</span>
                      <span className="text-blue-900">
                        ${results.nutrientSolution.weeklyNutrientCost}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pump Requirements */}
                {results.pumpRequirements.flowRate > 0 && (
                  <div className="rounded bg-orange-50 p-4">
                    <h3 className="mb-3 font-semibold text-orange-900">🔄 Pump Requirements</h3>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Flow Rate:</span>
                        <span className="font-medium">{results.pumpRequirements.flowRate} GPH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Operating Hours/Day:</span>
                        <span className="font-medium">
                          {results.pumpRequirements.operatingHours} hrs
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Power Consumption:</span>
                        <span className="font-medium">
                          {results.pumpRequirements.powerConsumption}W
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lighting Requirements */}
                {results.lightingRequirements.totalWatts > 0 && (
                  <div className="rounded bg-purple-50 p-4">
                    <h3 className="mb-3 font-semibold text-purple-900">💡 LED Lighting</h3>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total LED Power:</span>
                        <span className="font-medium">
                          {results.lightingRequirements.totalWatts}W
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily Light Hours:</span>
                        <span className="font-medium">
                          {results.lightingRequirements.dailyHours} hrs
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Power Cost:</span>
                        <span className="font-medium">
                          ${results.lightingRequirements.monthlyPowerCost}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cost Analysis & ROI */}
                <div className="rounded bg-yellow-50 p-4">
                  <h3 className="mb-3 font-semibold text-yellow-900">💰 Economic Analysis</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Setup Cost:</span>
                      <span className="font-medium">${results.costAnalysis.setupCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Operating:</span>
                      <span className="font-medium">${results.costAnalysis.monthlyOperating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Yield:</span>
                      <span className="font-medium">{results.costAnalysis.annualYield} lbs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Value of Produce:</span>
                      <span className="font-medium text-green-700">
                        ${results.costAnalysis.valueOfProduce}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Payback Period:</span>
                      <span className="text-yellow-900">
                        {results.costAnalysis.paybackMonths} months
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowProducts(!showProducts)}
                  className="w-full"
                  variant="outline"
                >
                  🛒 {showProducts ? 'Hide' : 'View'} Complete System
                </Button>

                {showProducts && (
                  <div className="space-y-4 rounded border p-4">
                    <h3 className="font-semibold">🛍️ Hydroponic System Components</h3>
                    {results.products.map((product, index) => (
                      <div key={index} className="rounded bg-gray-50 p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                            <p className="text-xs text-gray-600">{product.specs}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{product.price}</p>
                            <a
                              href={product.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              View Details →
                            </a>
                          </div>
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
          <h2 className="mb-4 text-2xl font-bold">🔧 Complete Your Growing System</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Combine hydroponics with renewable energy and water systems for sustainable food
            production
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/green-calculators/greenhouse"
              className="rounded bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Greenhouse Calculator
            </Link>
            <Link
              href="/green-calculators/rainwater-harvesting"
              className="rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Water System
            </Link>
            <Link
              href="/solar-calculators/load-analysis"
              className="rounded bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Solar for Grow Lights
            </Link>
          </div>
        </div>

        {/* SEO Content */}
        <div className="prose prose-lg mx-auto mt-16 max-w-4xl">
          <h2>Hydroponic System Design Guide</h2>
          <p>
            <strong>Hydroponic systems</strong> allow you to grow plants without soil using
            nutrient-rich water solutions. Our calculator helps you design complete systems
            including nutrient formulations, lighting requirements, and economic projections for
            maximum yield and profitability.
          </p>

          <h3>System Types Explained</h3>
          <ul>
            <li>
              <strong>NFT (Nutrient Film Technique):</strong> Continuous thin film of nutrients
            </li>
            <li>
              <strong>Deep Water Culture (DWC):</strong> Roots suspended in oxygenated nutrient
              solution
            </li>
            <li>
              <strong>Ebb & Flow:</strong> Periodic flooding and draining of grow beds
            </li>
            <li>
              <strong>Drip Systems:</strong> Precise nutrient delivery to each plant
            </li>
            <li>
              <strong>Aeroponics:</strong> Nutrients delivered as mist to exposed roots
            </li>
          </ul>

          <p>
            Hydroponic systems can produce 30-50% higher yields than soil growing while using 90%
            less water. Combined with our{' '}
            <Link href="/green-calculators/rainwater-harvesting">rainwater harvesting</Link> and{' '}
            <Link href="/solar-calculators">solar power systems</Link>, you can create a completely
            sustainable food production operation.
          </p>
        </div>
      </div>
    </main>
  );
}
