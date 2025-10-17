'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface WaterIndependenceResults {
  annualNeeds: {
    household: number;
    irrigation: number;
    total: number;
    dailyAverage: number;
  };
  rainCollection: {
    annualRainfall: number;
    collectableWater: number;
    roofAreaNeeded: number;
    efficiency: number;
    surplusDeficit: number;
  };
  storageSystem: {
    minStorageNeeded: number;
    recommendedStorage: number;
    drySeasonMonths: number;
    drySeasonNeeds: number;
    ibcTotesNeeded: number;
    undergroundTankSize: number;
  };
  systemDesign: {
    collectionMethod: string;
    primaryStorage: string;
    secondaryStorage: string;
    pumpingNeeded: boolean;
    filtrationLevel: string;
  };
  costAnalysis: {
    ibcToteSystem: number;
    undergroundCistern: number;
    hybridSystem: number;
    plumbingAndFittings: number;
    filtrationSystem: number;
    totalInvestment: number;
    municipalWaterCost: number;
    annualSavings: number;
    paybackYears: number;
  };
  products: Array<{
    name: string;
    price: string;
    quantity: number;
    total: string;
    category: string;
    specs: string;
    link: string;
  }>;
}

export default function TotalWaterIndependenceCalculator() {
  const [occupants, setOccupants] = useState<string>('4');
  const [farmAcres, setFarmAcres] = useState<string>('3');
  const [roofArea, setRoofArea] = useState<string>('200');
  const [region, setRegion] = useState<string>('lisbon');
  const [waterConservation, setWaterConservation] = useState<string>('moderate');
  const [irrigationType, setIrrigationType] = useState<string>('drip');
  const [storagePreference, setStoragePreference] = useState<string>('hybrid');
  const [municipalWaterRate, setMunicipalWaterRate] = useState<string>('2.0');
  const [results, setResults] = useState<WaterIndependenceResults | null>(null);
  const [showProducts, setShowProducts] = useState(false);

  const calculateWaterIndependence = () => {
    const people = parseFloat(occupants);
    const acres = parseFloat(farmAcres);
    const roof = parseFloat(roofArea);
    const waterRate = parseFloat(municipalWaterRate);

    if (!people || !acres || !roof) {
      alert('Please fill in all required fields');
      return;
    }

    // Conservation factors
    const conservationFactors = {
      basic: 1.0, // Standard usage
      moderate: 0.75, // Low-flow fixtures, conscious usage
      aggressive: 0.55, // Composting toilet, navy showers, greywater reuse
    };
    const conservationFactor =
      conservationFactors[waterConservation as keyof typeof conservationFactors] || 0.75;

    // Household water calculation (liters/year)
    const baseHouseholdDaily = 150; // Base liters per person per day (all uses)
    const householdDaily = people * baseHouseholdDaily * conservationFactor;
    const householdAnnual = Math.round(householdDaily * 365);

    // Irrigation efficiency factors
    const irrigationEfficiency = {
      flood: 0.5, // 50% efficiency
      sprinkler: 0.7, // 70% efficiency
      drip: 0.9, // 90% efficiency
      subsurface: 0.95, // 95% efficiency
    };
    const irrEfficiency =
      irrigationEfficiency[irrigationType as keyof typeof irrigationEfficiency] || 0.9;

    // Farm irrigation calculation (liters/year)
    // Base: 30,000L/acre/week in peak season (20 weeks), 15,000L/acre/week shoulder (12 weeks)
    const peakSeasonWater = (acres * 30000 * 20) / irrEfficiency;
    const shoulderSeasonWater = (acres * 15000 * 12) / irrEfficiency;
    const farmAnnual = Math.round(peakSeasonWater + shoulderSeasonWater);

    const totalAnnual = householdAnnual + farmAnnual;
    const dailyAverage = Math.round(totalAnnual / 365);

    // Rainfall by region (mm/year) and seasonal distribution
    const rainfallData = {
      porto: { annual: 1200, drySeasonPercent: 0.1 }, // 10% in dry season
      lisbon: { annual: 750, drySeasonPercent: 0.13 }, // 13% in dry season
      algarve: { annual: 500, drySeasonPercent: 0.08 }, // 8% in dry season
      interior: { annual: 900, drySeasonPercent: 0.12 }, // 12% in dry season
    };
    const regionData = rainfallData[region as keyof typeof rainfallData] || rainfallData['lisbon'];
    const annualRainfall = regionData.annual;

    // Collection efficiency (accounting for losses)
    const collectionEfficiency = 0.8; // 80% collection efficiency

    // Calculate collectable water from roof (liters/year)
    const collectableWater = Math.round(roof * annualRainfall * collectionEfficiency);
    const roofAreaNeeded = Math.ceil(totalAnnual / (annualRainfall * collectionEfficiency));
    const surplusDeficit = collectableWater - totalAnnual;

    // CORRECT DRY SEASON STORAGE CALCULATION
    // Portugal dry season: June-September (4 months)
    // Key: Storage = (Water Used During Dry Season) - (Rain Collected During Dry Season)
    const drySeasonMonths = 4;
    const drySeasonUsage = Math.round((totalAnnual / 12) * drySeasonMonths);

    // Rain collected during dry season (minimal in Portugal)
    const drySeasonRainfall = annualRainfall * regionData.drySeasonPercent;
    const drySeasonCollection = Math.round(roof * drySeasonRainfall * collectionEfficiency);

    // ACTUAL storage needed = usage minus what's collected during dry months
    const drySeasonDeficit = drySeasonUsage - drySeasonCollection;

    // Add 25% buffer for bad years and evaporation
    const recommendedStorage = Math.round(drySeasonDeficit * 1.25);
    const minStorageNeeded = drySeasonDeficit;

    // IBC totes (1000L each)
    const ibcTotesNeeded = Math.ceil(recommendedStorage / 1000);

    // Underground tank sizing (single large cistern)
    const undergroundTankSize = recommendedStorage;

    // System design recommendations
    const collectionMethod = 'Large roof collection with first-flush diverters';
    let primaryStorage = '';
    let secondaryStorage = '';

    if (storagePreference === 'ibc') {
      primaryStorage = `${ibcTotesNeeded}× IBC Totes (1000L each)`;
      secondaryStorage = 'None - all above ground';
    } else if (storagePreference === 'underground') {
      primaryStorage = `${Math.ceil(undergroundTankSize / 50000)}× Underground cistern (${undergroundTankSize.toLocaleString()}L total)`;
      secondaryStorage = 'Small header tank for pressure';
    } else {
      // Hybrid: underground for main, IBC for secondary
      const undergroundPortion = Math.round(recommendedStorage * 0.6);
      const ibcPortion = recommendedStorage - undergroundPortion;
      const ibcCount = Math.ceil(ibcPortion / 1000);
      primaryStorage = `Underground cistern (${undergroundPortion.toLocaleString()}L)`;
      secondaryStorage = `${ibcCount}× IBC Totes for irrigation (${ibcCount * 1000}L)`;
    }

    const pumpingNeeded = acres > 1 || storagePreference !== 'ibc';
    const filtrationLevel =
      conservationFactor < 0.7 ? 'Advanced (potable grade)' : 'Standard (non-potable)';

    // Cost Analysis
    // IBC Tote System
    const ibcCostPerUnit = 75; // €75 average for used food-grade
    const ibcToteSystemCost = ibcTotesNeeded * ibcCostPerUnit;

    // Underground Cistern (varies by size)
    const cisternCostPerLiter =
      recommendedStorage < 50000 ? 2.5 : recommendedStorage < 100000 ? 2.0 : 1.5;
    const undergroundCisternCost = Math.round(undergroundTankSize * cisternCostPerLiter);

    // Hybrid system cost
    const hybridUndergroundSize = Math.round(recommendedStorage * 0.6);
    const hybridIBCSize = recommendedStorage - hybridUndergroundSize;
    const hybridIBCCount = Math.ceil(hybridIBCSize / 1000);
    const hybridSystemCost = Math.round(
      hybridUndergroundSize * 2.0 + hybridIBCCount * ibcCostPerUnit
    );

    // Additional costs
    const plumbingCost = Math.round(roofAreaNeeded * 5 + acres * 500); // Gutters, pipes, manifolds
    const filtrationCost = conservationFactor < 0.7 ? 2500 : 800; // Potable vs non-potable
    const pumpCost = pumpingNeeded ? 1200 : 0;

    // Total investment based on preference
    let selectedStorageCost = ibcToteSystemCost;
    if (storagePreference === 'underground') selectedStorageCost = undergroundCisternCost;
    if (storagePreference === 'hybrid') selectedStorageCost = hybridSystemCost;

    const totalInvestment = selectedStorageCost + plumbingCost + filtrationCost + pumpCost;

    // Savings calculation
    const municipalWaterCost = Math.round((totalAnnual / 1000) * waterRate); // Cost per m³
    const annualSavings = municipalWaterCost - 200; // Minus ~€200 annual maintenance
    const paybackYears = Math.round((totalInvestment / annualSavings) * 10) / 10;

    // Product recommendations based on system preference
    const products: WaterIndependenceResults['products'] = [];

    if (storagePreference === 'ibc' || storagePreference === 'hybrid') {
      const ibcQty = storagePreference === 'hybrid' ? hybridIBCCount : ibcTotesNeeded;
      products.push({
        name: 'Used Food-Grade IBC Tote 1000L',
        price: '€75',
        quantity: ibcQty,
        total: `€${ibcQty * 75}`,
        category: 'Storage',
        specs: 'UN-certified, reconditioned, food-grade',
        link: 'https://www.olx.pt/ibc-tote-tank',
      });
    }

    if (storagePreference === 'underground' || storagePreference === 'hybrid') {
      const cisternSize =
        storagePreference === 'hybrid' ? hybridUndergroundSize : undergroundTankSize;
      products.push({
        name: `Underground Water Cistern ${cisternSize.toLocaleString()}L`,
        price: `€${Math.round(cisternSize * cisternCostPerLiter)}`,
        quantity: 1,
        total: `€${Math.round(cisternSize * cisternCostPerLiter)}`,
        category: 'Storage',
        specs: 'Concrete or polyethylene, installed',
        link: 'https://mundoriego.es/underground-water-tank',
      });
    }

    products.push(
      {
        name: 'First Flush Diverter System (per downspout)',
        price: '€45',
        quantity: 4,
        total: '€180',
        category: 'Filtration',
        specs: '100L capacity, automatic reset',
        link: 'https://amzn.to/first-flush-diverter',
      },
      {
        name: 'Multi-Stage Water Filtration System',
        price: `€${filtrationCost}`,
        quantity: 1,
        total: `€${filtrationCost}`,
        category: 'Filtration',
        specs: conservationFactor < 0.7 ? 'UV + Carbon + Sediment - Potable' : 'Sediment + Carbon',
        link: 'https://amzn.to/water-filtration-system',
      },
      {
        name: 'PVC Gutter & Downspout System',
        price: `€${Math.round(roofAreaNeeded * 3)}`,
        quantity: 1,
        total: `€${Math.round(roofAreaNeeded * 3)}`,
        category: 'Collection',
        specs: `${Math.round(roofAreaNeeded * 0.5)}m gutters + downspouts`,
        link: 'https://www.leroymerlin.pt/gutter-system',
      }
    );

    if (pumpingNeeded) {
      products.push({
        name: 'Agricultural Water Pump 2HP',
        price: '€850',
        quantity: 1,
        total: '€850',
        category: 'Pumping',
        specs: '100L/min flow rate, pressure switch',
        link: 'https://amzn.to/agricultural-water-pump',
      });
    }

    if (irrigationType === 'drip' || irrigationType === 'subsurface') {
      products.push({
        name: `Drip Irrigation Kit (${acres} acres)`,
        price: `€${Math.round(acres * 400)}`,
        quantity: 1,
        total: `€${Math.round(acres * 400)}`,
        category: 'Irrigation',
        specs: 'Complete system with timers, filters, lines',
        link: 'https://mundoriego.es/drip-irrigation-kit',
      });
    }

    const newResults: WaterIndependenceResults = {
      annualNeeds: {
        household: householdAnnual,
        irrigation: farmAnnual,
        total: totalAnnual,
        dailyAverage: dailyAverage,
      },
      rainCollection: {
        annualRainfall: annualRainfall,
        collectableWater: collectableWater,
        roofAreaNeeded: roofAreaNeeded,
        efficiency: Math.round(collectionEfficiency * 100),
        surplusDeficit: surplusDeficit,
      },
      storageSystem: {
        minStorageNeeded: minStorageNeeded,
        recommendedStorage: recommendedStorage,
        drySeasonMonths: drySeasonMonths,
        drySeasonNeeds: drySeasonUsage,
        ibcTotesNeeded: ibcTotesNeeded,
        undergroundTankSize: undergroundTankSize,
      },
      systemDesign: {
        collectionMethod: collectionMethod,
        primaryStorage: primaryStorage,
        secondaryStorage: secondaryStorage,
        pumpingNeeded: pumpingNeeded,
        filtrationLevel: filtrationLevel,
      },
      costAnalysis: {
        ibcToteSystem: ibcToteSystemCost,
        undergroundCistern: undergroundCisternCost,
        hybridSystem: hybridSystemCost,
        plumbingAndFittings: plumbingCost,
        filtrationSystem: filtrationCost,
        totalInvestment: totalInvestment,
        municipalWaterCost: municipalWaterCost,
        annualSavings: annualSavings,
        paybackYears: paybackYears,
      },
      products: products,
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
            Total Water Independence
            <span className="block text-primary">System Calculator</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Design a <strong>complete rainwater harvesting system</strong> for 100% water
            self-sufficiency. Calculate storage needs for <em>household + farm irrigation</em> with
            zero municipal water dependence. Perfect for Portugal&apos;s Mediterranean climate.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Badge variant="outline">💧 Total Self-Sufficiency</Badge>
            <Badge variant="outline">🏠 Household + Farm</Badge>
            <Badge variant="outline">🇵🇹 Portugal Optimized</Badge>
            <Badge variant="outline">💰 Maximum ROI</Badge>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Complete water independence planning for household and agricultural needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Household Section */}
              <div className="rounded border-2 border-blue-200 bg-blue-50 p-4">
                <h3 className="mb-3 font-semibold text-blue-900">🏠 Household Requirements</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Number of Occupants</label>
                    <Input
                      type="number"
                      placeholder="4"
                      value={occupants}
                      onChange={(e) => setOccupants(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Water Conservation Level
                    </label>
                    <select
                      className="w-full rounded border px-3 py-2"
                      value={waterConservation}
                      onChange={(e) => setWaterConservation(e.target.value)}
                    >
                      <option value="basic">Basic (standard fixtures)</option>
                      <option value="moderate">Moderate (low-flow fixtures)</option>
                      <option value="aggressive">Aggressive (composting toilet + greywater)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Farm Section */}
              <div className="rounded border-2 border-green-200 bg-green-50 p-4">
                <h3 className="mb-3 font-semibold text-green-900">🌾 Farm Irrigation</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Farm Size (acres)</label>
                    <Input
                      type="number"
                      placeholder="3"
                      value={farmAcres}
                      onChange={(e) => setFarmAcres(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Irrigation Type</label>
                    <select
                      className="w-full rounded border px-3 py-2"
                      value={irrigationType}
                      onChange={(e) => setIrrigationType(e.target.value)}
                    >
                      <option value="drip">Drip Irrigation (90% efficient)</option>
                      <option value="subsurface">Subsurface (95% efficient)</option>
                      <option value="sprinkler">Sprinkler (70% efficient)</option>
                      <option value="flood">Flood Irrigation (50% efficient)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Collection Section */}
              <div className="rounded border-2 border-purple-200 bg-purple-50 p-4">
                <h3 className="mb-3 font-semibold text-purple-900">☔ Rain Collection</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Available Roof Area (m²)
                    </label>
                    <Input
                      type="number"
                      placeholder="200"
                      value={roofArea}
                      onChange={(e) => setRoofArea(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Typical house: 100-200m², barn: 150-300m²
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Portugal Region</label>
                    <select
                      className="w-full rounded border px-3 py-2"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    >
                      <option value="porto">Porto/North (1200mm/year)</option>
                      <option value="lisbon">Lisbon/Central (750mm/year)</option>
                      <option value="algarve">Algarve/South (500mm/year)</option>
                      <option value="interior">Interior (900mm/year)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Storage Section */}
              <div>
                <label className="mb-2 block text-sm font-medium">Storage Preference</label>
                <select
                  className="w-full rounded border px-3 py-2"
                  value={storagePreference}
                  onChange={(e) => setStoragePreference(e.target.value)}
                >
                  <option value="ibc">IBC Totes Only (lowest cost)</option>
                  <option value="underground">Underground Cistern (most professional)</option>
                  <option value="hybrid">Hybrid System (balanced approach)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Municipal Water Rate (€/m³)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="2.0"
                  value={municipalWaterRate}
                  onChange={(e) => setMunicipalWaterRate(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Portugal average: €1.50-2.50/m³ (increases with usage)
                </p>
              </div>

              <Button onClick={calculateWaterIndependence} className="w-full" size="lg">
                💧 Calculate Complete Water Independence
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Your Water Independence System</CardTitle>
                <CardDescription>Complete design for 100% water self-sufficiency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Annual Needs */}
                <div className="rounded bg-blue-50 p-4">
                  <h3 className="mb-3 font-semibold text-blue-900">💧 Annual Water Needs</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Household Usage:</span>
                      <span className="font-medium">
                        {results.annualNeeds.household.toLocaleString()}L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Farm Irrigation:</span>
                      <span className="font-medium">
                        {results.annualNeeds.irrigation.toLocaleString()}L
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Total Annual:</span>
                      <span className="text-blue-900">
                        {results.annualNeeds.total.toLocaleString()}L
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Daily Average:</span>
                      <span>{results.annualNeeds.dailyAverage.toLocaleString()}L/day</span>
                    </div>
                  </div>
                </div>

                {/* Rain Collection Capacity */}
                <div
                  className={`rounded p-4 ${
                    results.rainCollection.surplusDeficit >= 0 ? 'bg-green-50' : 'bg-orange-50'
                  }`}
                >
                  <h3
                    className={`mb-3 font-semibold ${
                      results.rainCollection.surplusDeficit >= 0
                        ? 'text-green-900'
                        : 'text-orange-900'
                    }`}
                  >
                    ☔ Rain Collection Analysis
                  </h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Annual Rainfall:</span>
                      <span className="font-medium">{results.rainCollection.annualRainfall}mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Collectable Water:</span>
                      <span className="font-medium">
                        {results.rainCollection.collectableWater.toLocaleString()}L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Collection Efficiency:</span>
                      <span className="font-medium">{results.rainCollection.efficiency}%</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>
                        {results.rainCollection.surplusDeficit >= 0 ? 'Surplus:' : 'Deficit:'}
                      </span>
                      <span
                        className={
                          results.rainCollection.surplusDeficit >= 0
                            ? 'text-green-900'
                            : 'text-orange-900'
                        }
                      >
                        {Math.abs(results.rainCollection.surplusDeficit).toLocaleString()}L
                      </span>
                    </div>
                    {results.rainCollection.surplusDeficit < 0 && (
                      <p className="mt-2 text-xs text-orange-900">
                        ⚠️ Need {results.rainCollection.roofAreaNeeded}m² roof area for full
                        independence
                      </p>
                    )}
                  </div>
                </div>

                {/* Storage Requirements */}
                <div className="rounded bg-purple-50 p-4">
                  <h3 className="mb-3 font-semibold text-purple-900">🏗️ Storage System</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>
                        Dry Season Needs ({results.storageSystem.drySeasonMonths} months):
                      </span>
                      <span className="font-medium">
                        {results.storageSystem.drySeasonNeeds.toLocaleString()}L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Minimum Storage:</span>
                      <span className="font-medium">
                        {results.storageSystem.minStorageNeeded.toLocaleString()}L
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Recommended Storage (with buffer):</span>
                      <span className="text-purple-900">
                        {results.storageSystem.recommendedStorage.toLocaleString()}L
                      </span>
                    </div>
                    <div className="mt-3 space-y-2 border-t pt-3">
                      <p className="font-medium">System Design:</p>
                      <p className="text-xs">
                        <strong>Primary:</strong> {results.systemDesign.primaryStorage}
                      </p>
                      {results.systemDesign.secondaryStorage !== 'None - all above ground' && (
                        <p className="text-xs">
                          <strong>Secondary:</strong> {results.systemDesign.secondaryStorage}
                        </p>
                      )}
                      <p className="text-xs">
                        <strong>Filtration:</strong> {results.systemDesign.filtrationLevel}
                      </p>
                      {results.systemDesign.pumpingNeeded && (
                        <p className="text-xs">
                          <strong>Pumping:</strong> Pressure system required
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cost Analysis */}
                <div className="rounded bg-yellow-50 p-4">
                  <h3 className="mb-3 font-semibold text-yellow-900">💰 Investment & ROI</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="mb-2 space-y-1 border-b pb-2 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>IBC Tote System Option:</span>
                        <span>€{results.costAnalysis.ibcToteSystem.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Underground Cistern Option:</span>
                        <span>€{results.costAnalysis.undergroundCistern.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hybrid System Option:</span>
                        <span>€{results.costAnalysis.hybridSystem.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Plumbing & Fittings:</span>
                      <span className="font-medium">
                        €{results.costAnalysis.plumbingAndFittings.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Filtration System:</span>
                      <span className="font-medium">
                        €{results.costAnalysis.filtrationSystem.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-base font-bold">
                      <span>Total Investment:</span>
                      <span className="text-yellow-900">
                        €{results.costAnalysis.totalInvestment.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1 border-t pt-3">
                      <div className="flex justify-between text-green-700">
                        <span>Municipal Water Cost (annual):</span>
                        <span className="font-medium">
                          €{results.costAnalysis.municipalWaterCost.toLocaleString()}/year
                        </span>
                      </div>
                      <div className="flex justify-between text-green-700">
                        <span>Net Annual Savings:</span>
                        <span className="font-medium">
                          €{results.costAnalysis.annualSavings.toLocaleString()}/year
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-bold text-green-900">
                        <span>Payback Period:</span>
                        <span>{results.costAnalysis.paybackYears} years</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowProducts(!showProducts)}
                  className="w-full"
                  variant="outline"
                >
                  🛒 {showProducts ? 'Hide' : 'View'} Complete System Components
                </Button>

                {showProducts && (
                  <div className="space-y-4 rounded border p-4">
                    <h3 className="font-semibold">🛍️ Complete System Shopping List</h3>
                    {results.products.map((product, index) => (
                      <div key={index} className="rounded bg-gray-50 p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {product.category} • {product.specs}
                            </p>
                            <p className="text-xs text-gray-600">
                              Quantity: {product.quantity} × {product.price} ={' '}
                              <strong>{product.total}</strong>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{product.total}</p>
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
          <h2 className="mb-4 text-2xl font-bold">🌊 Complete Sustainability System</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Combine water independence with energy and food production for complete off-grid living
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/green-calculators/greywater-systems"
              className="rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Greywater Recycling
            </Link>
            <Link
              href="/solar-calculators/off-grid-system"
              className="rounded bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Solar Independence
            </Link>
            <Link
              href="/green-calculators/hydroponics"
              className="rounded bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Food Production
            </Link>
          </div>
        </div>

        {/* SEO Content */}
        <div className="prose prose-lg mx-auto mt-16 max-w-4xl">
          <h2>Complete Water Independence in Portugal</h2>
          <p>
            Achieving <strong>total water self-sufficiency</strong> in Portugal is entirely feasible
            with proper rainwater harvesting system design. This calculator accounts for both
            household needs and agricultural irrigation, providing a complete solution for off-grid
            water independence.
          </p>

          <h3>Portugal&apos;s Rainwater Potential</h3>
          <p>
            Portugal receives between <strong>500-1,200mm of rainfall annually</strong> depending on
            region. While concentrated in winter months (October-March), proper storage systems can
            capture enough water during rainy season to supply a 4-person household and 3-acre farm
            year-round.
          </p>

          <h3>IBC Totes vs Underground Cisterns</h3>
          <ul>
            <li>
              <strong>IBC Totes:</strong> Lowest cost (€50-100 each), modular, easy installation,
              visible maintenance
            </li>
            <li>
              <strong>Underground Cisterns:</strong> Professional appearance, protected from
              temperature fluctuations, long lifespan (50+ years)
            </li>
            <li>
              <strong>Hybrid Systems:</strong> Underground for primary storage, IBC totes for
              irrigation distribution - best of both worlds
            </li>
          </ul>

          <h3>Complete System Components</h3>
          <p>A professional water independence system requires:</p>
          <ul>
            <li>Large collection surface (200-400m² roof area)</li>
            <li>First-flush diverters to remove initial contaminants</li>
            <li>Multi-stage filtration for potable water quality</li>
            <li>Storage capacity for 4+ months dry season (100,000-300,000L depending on usage)</li>
            <li>Pressure pump system for household and irrigation distribution</li>
            <li>Overflow management directing excess to swales or ponds</li>
          </ul>

          <p>
            Combine with our{' '}
            <Link href="/green-calculators/greywater-systems">greywater recycling systems</Link> and{' '}
            <Link href="/solar-calculators">solar power</Link> for complete off-grid sustainability.
            Return on investment typically achieved in 3-7 years depending on municipal water costs.
          </p>
        </div>
      </div>
    </main>
  );
}
