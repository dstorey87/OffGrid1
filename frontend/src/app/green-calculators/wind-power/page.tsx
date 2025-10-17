'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface WindPowerResults {
  averageWindSpeed: number;
  annualEnergyProduction: number;
  monthlyProduction: number;
  recommendedTurbineSize: number;
  towerHeight: number;
  rotorDiameter: number;
  cutInSpeed: number;
  ratedSpeed: number;
  batteryRequirements: {
    capacity: number;
    voltage: string;
    cyclesPerMonth: number;
  };
  economics: {
    systemCost: number;
    paybackYears: number;
    annualSavings: number;
    lifetimeSavings: number;
  };
  products: Array<{
    name: string;
    price: string;
    link: string;
    category: string;
    specs: string;
  }>;
  solarComparison: {
    equivalentSolarPanels: number;
    hybridRecommended: boolean;
    reason: string;
  };
}

export default function WindPowerCalculator() {
  const [averageWindSpeed, setAverageWindSpeed] = useState<string>('');
  const [towerHeight, setTowerHeight] = useState<string>('');
  const [dailyEnergyNeed, setDailyEnergyNeed] = useState<string>('');
  const [windResource, setWindResource] = useState<string>('good');
  const [obstacleDistance, setObstacleDistance] = useState<string>('');
  const [electricityRate, setElectricityRate] = useState<string>('0.12');
  const [zoning, setZoning] = useState<string>('rural');
  const [results, setResults] = useState<WindPowerResults | null>(null);
  const [showProducts, setShowProducts] = useState(false);

  const calculateWindPower = () => {
    const windSpeed = parseFloat(averageWindSpeed);
    const height = parseFloat(towerHeight);
    const energyNeed = parseFloat(dailyEnergyNeed);
    const obstacles = parseFloat(obstacleDistance);
    const rate = parseFloat(electricityRate);

    if (!windSpeed || !height || !energyNeed) {
      alert('Please fill in all required fields');
      return;
    }

    // Wind power increases with height (1/7 power law)
    const referenceHeight = 33; // Standard measurement height
    const adjustedWindSpeed = windSpeed * Math.pow(height / referenceHeight, 1 / 7);

    // Wind resource quality factors
    const resourceFactors = {
      excellent: 1.2, // Constant strong winds
      good: 1.0, // Steady winds with some variation
      moderate: 0.8, // Variable winds
      poor: 0.6, // Inconsistent winds
    };
    const resourceFactor = resourceFactors[windResource as keyof typeof resourceFactors] || 1.0;
    const effectiveWindSpeed = adjustedWindSpeed * resourceFactor;

    // Power calculation using wind power formula: P = 0.5 * ρ * A * V³ * Cp
    // Simplified for residential turbines with typical efficiency
    const airDensity = 1.225; // kg/m³ at sea level
    const efficiency = 0.35; // Typical small wind turbine efficiency

    // Determine turbine size based on energy needs and wind resource
    let turbineSize, rotorDiameter, ratedPower;

    if (energyNeed <= 5) {
      turbineSize = 1; // 1kW turbine
      rotorDiameter = 2.3; // meters
      ratedPower = 1000; // watts
    } else if (energyNeed <= 15) {
      turbineSize = 2.5; // 2.5kW turbine
      rotorDiameter = 3.7; // meters
      ratedPower = 2500; // watts
    } else if (energyNeed <= 30) {
      turbineSize = 5; // 5kW turbine
      rotorDiameter = 5.6; // meters
      ratedPower = 5000; // watts
    } else {
      turbineSize = 10; // 10kW turbine
      rotorDiameter = 7.0; // meters
      ratedPower = 10000; // watts
    }

    // Calculate actual power production
    const sweptArea = Math.PI * Math.pow(rotorDiameter / 2, 2); // m²

    // Power curve calculation (simplified)
    let powerOutput;
    if (effectiveWindSpeed < 3) {
      powerOutput = 0; // Below cut-in speed
    } else if (effectiveWindSpeed < 12) {
      // Power increases cubically with wind speed up to rated speed
      powerOutput = Math.min(
        0.5 * airDensity * sweptArea * Math.pow(effectiveWindSpeed, 3) * efficiency * 0.001,
        ratedPower
      );
    } else if (effectiveWindSpeed < 25) {
      powerOutput = ratedPower; // Rated power region
    } else {
      powerOutput = 0; // Above cut-out speed
    }

    // Annual energy production (accounting for wind variability)
    const capacityFactor = Math.min(0.4, (effectiveWindSpeed / 12) * 0.3); // Realistic capacity factor
    const annualProduction = (ratedPower * 8760 * capacityFactor) / 1000; // kWh per year
    const monthlyProduction = annualProduction / 12;

    // Battery sizing for wind systems (more critical due to variability)
    const batteryCapacity = energyNeed * 3; // 3 days backup for wind systems
    const batteryVoltage = turbineSize >= 5 ? '48V' : turbineSize >= 2.5 ? '24V' : '12V';
    const cyclesPerMonth = 30; // Wind systems cycle batteries more frequently

    // Economic analysis
    const turbineCosts = {
      1: 3000,
      2.5: 8000,
      5: 15000,
      10: 25000,
    };
    const turbineCost = turbineCosts[turbineSize as keyof typeof turbineCosts] || 8000;
    const towerCost = height * 150; // $150 per foot of tower
    const installationCost = turbineCost * 0.3; // 30% installation
    const systemCost = turbineCost + towerCost + installationCost;

    const annualSavings = annualProduction * rate;
    const paybackYears = systemCost / annualSavings;
    const lifetimeSavings = annualSavings * 20 - systemCost; // 20-year turbine life

    // Solar comparison
    const solarEquivalent = annualProduction / 1500; // kW of solar panels (1500 kWh/kW/year)
    const hybridRecommended = effectiveWindSpeed < 10 || capacityFactor < 0.25;
    const hybridReason = hybridRecommended
      ? 'Wind resource insufficient - hybrid wind/solar system recommended'
      : 'Excellent wind resource - wind-primary system viable';

    // Product recommendations
    const products = [
      {
        name: `${turbineSize}kW Horizontal Axis Wind Turbine`,
        price: `$${turbineCost.toLocaleString()}`,
        link: `https://amzn.to/wind-turbine-${turbineSize}kw`,
        category: 'Turbine',
        specs: `${rotorDiameter}m rotor, ${ratedPower}W rated`,
      },
      {
        name: `${height}ft Monopole Wind Tower`,
        price: `$${Math.round(towerCost).toLocaleString()}`,
        link: `https://amzn.to/wind-tower-${height}ft`,
        category: 'Tower',
        specs: `Galvanized steel, guy wire supported`,
      },
      {
        name: 'Wind Turbine Charge Controller MPPT',
        price: '$350',
        link: 'https://amzn.to/wind-charge-controller',
        category: 'Controller',
        specs: 'Maximum power point tracking',
      },
      {
        name: `${batteryCapacity}Ah LiFePO4 Battery Bank`,
        price: `$${Math.round(batteryCapacity * 2.5)}`,
        link: `https://amzn.to/lifepo4-${batteryCapacity}ah`,
        category: 'Storage',
        specs: `${batteryVoltage} system, 6000+ cycles`,
      },
      {
        name: '3000W Pure Sine Wave Inverter',
        price: '$280',
        link: 'https://amzn.to/pure-sine-inverter-3000w',
        category: 'Inverter',
        specs: 'Grid-tie capability, surge protection',
      },
    ];

    const newResults: WindPowerResults = {
      averageWindSpeed: Math.round(effectiveWindSpeed * 10) / 10,
      annualEnergyProduction: Math.round(annualProduction),
      monthlyProduction: Math.round(monthlyProduction),
      recommendedTurbineSize: turbineSize,
      towerHeight: height,
      rotorDiameter: rotorDiameter,
      cutInSpeed: 3,
      ratedSpeed: 12,
      batteryRequirements: {
        capacity: Math.round(batteryCapacity),
        voltage: batteryVoltage,
        cyclesPerMonth: cyclesPerMonth,
      },
      economics: {
        systemCost: Math.round(systemCost),
        paybackYears: Math.round(paybackYears * 10) / 10,
        annualSavings: Math.round(annualSavings),
        lifetimeSavings: Math.round(lifetimeSavings),
      },
      products,
      solarComparison: {
        equivalentSolarPanels: Math.round(solarEquivalent * 10) / 10,
        hybridRecommended,
        reason: hybridReason,
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
            Wind Power
            <span className="block text-primary">Calculator</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Calculate <strong>wind turbine sizing</strong>, energy production, and system
            requirements for <em>residential wind power</em>. Compare with solar options and get
            complete system specifications.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Badge variant="outline">🌪️ Wind Assessment</Badge>
            <Badge variant="outline">⚡ Energy Production</Badge>
            <Badge variant="outline">📊 Economic Analysis</Badge>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Wind Resource Assessment</CardTitle>
              <CardDescription>
                Enter your location's wind data and energy requirements for optimal turbine sizing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">Average Wind Speed (mph) *</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="8.5"
                  value={averageWindSpeed}
                  onChange={(e) => setAverageWindSpeed(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  * Check NREL Wind Resource Maps or local weather data. Minimum 7 mph recommended.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Tower Height (feet)</label>
                <Input
                  type="number"
                  placeholder="80"
                  value={towerHeight}
                  onChange={(e) => setTowerHeight(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Higher towers access stronger, steadier winds. 80-120 feet typical.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Daily Energy Need (kWh)</label>
                <Input
                  type="number"
                  placeholder="25"
                  value={dailyEnergyNeed}
                  onChange={(e) => setDailyEnergyNeed(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Check your electric bill or use our{' '}
                  <Link
                    href="/solar-calculators/load-analysis"
                    className="text-primary hover:underline"
                  >
                    load analysis calculator
                  </Link>
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Wind Resource Quality</label>
                <select
                  className="w-full rounded border px-3 py-2"
                  value={windResource}
                  onChange={(e) => setWindResource(e.target.value)}
                >
                  <option value="excellent">Excellent (coastal, ridge tops)</option>
                  <option value="good">Good (open plains, hills)</option>
                  <option value="moderate">Moderate (suburban, light trees)</option>
                  <option value="poor">Poor (urban, heavy forests)</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Distance from Obstacles (feet)
                  </label>
                  <Input
                    type="number"
                    placeholder="300"
                    value={obstacleDistance}
                    onChange={(e) => setObstacleDistance(e.target.value)}
                  />
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
                <label className="mb-2 block text-sm font-medium">Zoning/Location</label>
                <select
                  className="w-full rounded border px-3 py-2"
                  value={zoning}
                  onChange={(e) => setZoning(e.target.value)}
                >
                  <option value="rural">Rural (minimal restrictions)</option>
                  <option value="suburban">Suburban (height/noise limits)</option>
                  <option value="urban">Urban (strict regulations)</option>
                </select>
              </div>

              <Button onClick={calculateWindPower} className="w-full" size="lg">
                🌪️ Calculate Wind Power System
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Wind Power System Design</CardTitle>
                <CardDescription>Complete turbine and system specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Wind Assessment */}
                <div className="rounded bg-blue-50 p-4">
                  <h3 className="mb-3 font-semibold text-blue-900">🌪️ Wind Resource Analysis</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Effective Wind Speed:</span>
                      <span className="font-medium">{results.averageWindSpeed} mph</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Energy Production:</span>
                      <span className="font-medium">
                        {results.annualEnergyProduction.toLocaleString()} kWh
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Average:</span>
                      <span className="font-medium">
                        {results.monthlyProduction.toLocaleString()} kWh
                      </span>
                    </div>
                  </div>
                </div>

                {/* Turbine Specifications */}
                <div className="rounded bg-green-50 p-4">
                  <h3 className="mb-3 font-semibold text-green-900">⚡ Turbine Specifications</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Recommended Size:</span>
                      <span className="font-medium text-green-900">
                        {results.recommendedTurbineSize} kW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rotor Diameter:</span>
                      <span className="font-medium">{results.rotorDiameter}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tower Height:</span>
                      <span className="font-medium">{results.towerHeight} feet</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cut-in Speed:</span>
                      <span className="font-medium">{results.cutInSpeed} mph</span>
                    </div>
                  </div>
                </div>

                {/* Battery Requirements */}
                <div className="rounded bg-orange-50 p-4">
                  <h3 className="mb-3 font-semibold text-orange-900">🔋 Energy Storage</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Battery Capacity:</span>
                      <span className="font-medium">{results.batteryRequirements.capacity} Ah</span>
                    </div>
                    <div className="flex justify-between">
                      <span>System Voltage:</span>
                      <span className="font-medium">{results.batteryRequirements.voltage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Cycles/Month:</span>
                      <span className="font-medium">
                        {results.batteryRequirements.cyclesPerMonth}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Solar Comparison */}
                <div
                  className={`rounded p-4 ${results.solarComparison.hybridRecommended ? 'bg-yellow-50' : 'bg-green-50'}`}
                >
                  <h3
                    className={`mb-3 font-semibold ${results.solarComparison.hybridRecommended ? 'text-yellow-900' : 'text-green-900'}`}
                  >
                    ☀️ Solar Comparison
                  </h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Equivalent Solar Panels:</span>
                      <span className="font-medium">
                        {results.solarComparison.equivalentSolarPanels} kW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hybrid System:</span>
                      <span
                        className={`font-medium ${results.solarComparison.hybridRecommended ? 'text-yellow-900' : 'text-green-900'}`}
                      >
                        {results.solarComparison.hybridRecommended ? 'Recommended' : 'Optional'}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs">{results.solarComparison.reason}</p>
                </div>

                {/* Economics */}
                <div className="rounded bg-purple-50 p-4">
                  <h3 className="mb-3 font-semibold text-purple-900">💰 Economic Analysis</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total System Cost:</span>
                      <span className="font-medium">
                        ${results.economics.systemCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Savings:</span>
                      <span className="font-medium">${results.economics.annualSavings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payback Period:</span>
                      <span className="font-medium">{results.economics.paybackYears} years</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>20-Year Savings:</span>
                      <span className="text-purple-900">
                        ${results.economics.lifetimeSavings.toLocaleString()}
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
                    <h3 className="font-semibold">🛍️ Wind Power System Components</h3>
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
          <h2 className="mb-4 text-2xl font-bold">🔧 Complete Your Renewable Energy System</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Combine wind power with solar and other green technologies for maximum energy
            independence
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/solar-calculators/load-analysis"
              className="rounded bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Solar Calculators
            </Link>
            <Link
              href="/green-calculators/micro-hydro"
              className="rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Micro Hydro Power
            </Link>
            <Link
              href="/green-calculators/energy-efficiency"
              className="rounded border border-primary px-6 py-3 font-semibold hover:bg-accent"
            >
              Energy Efficiency
            </Link>
          </div>
        </div>

        {/* SEO Content */}
        <div className="prose prose-lg mx-auto mt-16 max-w-4xl">
          <h2>Residential Wind Power Guide</h2>
          <p>
            <strong>Small wind turbines</strong> can be an excellent complement to solar power
            systems, especially in areas with consistent wind resources. Our calculator evaluates
            your site's wind potential and recommends optimal turbine sizing for maximum energy
            production.
          </p>

          <h3>Wind Power Basics</h3>
          <ul>
            <li>
              <strong>Wind Speed:</strong> Power increases with the cube of wind speed
            </li>
            <li>
              <strong>Tower Height:</strong> Higher towers access stronger, steadier winds
            </li>
            <li>
              <strong>Turbine Sizing:</strong> Match turbine to local wind resource and energy needs
            </li>
            <li>
              <strong>Zoning:</strong> Check local regulations for height and noise restrictions
            </li>
          </ul>

          <p>
            Wind and solar are complementary technologies - wind often produces power when solar
            doesn't (at night, during storms). A hybrid system using our{' '}
            <Link href="/solar-calculators">solar calculators</Link> and wind power calculator can
            provide more consistent renewable energy production than either technology alone.
          </p>
        </div>
      </div>
    </main>
  );
}
