'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

// SEO metadata for load analysis calculator
export const metadata: Metadata = {
  title: 'Free Load Analysis Calculator - Calculate Your Solar Power Needs',
  description:
    'Calculate your exact power consumption for off-grid solar systems. FREE load analysis calculator determines appliance energy usage, seasonal variations, and equipment requirements.',
  keywords:
    'load analysis calculator, solar power calculator, energy consumption calculator, off grid power needs, appliance power usage, solar system sizing',
  openGraph: {
    title: 'Free Solar Load Analysis Calculator',
    description: 'Calculate your power needs for off-grid solar systems',
    url: 'https://offgrid1.com/solar-calculators/load-analysis',
  },
};

interface Appliance {
  id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
  category: string;
  critical: boolean;
}

interface LoadResults {
  dailyKwh: number;
  peakWatts: number;
  criticalKwh: number;
  seasonalVariation: number;
  recommendedSystemSize: number;
}

export default function LoadAnalysisCalculator() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [customAppliance, setCustomAppliance] = useState({
    name: '',
    watts: '',
    hoursPerDay: '',
    category: 'lighting',
    critical: false,
  });
  const [results, setResults] = useState<LoadResults | null>(null);
  const [showShoppingBasket, setShowShoppingBasket] = useState(false);

  // Common appliances database for quick adding
  const commonAppliances = [
    { name: 'LED Light Bulb (9W)', watts: 9, category: 'lighting', critical: true },
    { name: 'LED Light Bulb (15W)', watts: 15, category: 'lighting', critical: true },
    { name: 'Refrigerator (Energy Star)', watts: 150, category: 'appliances', critical: true },
    { name: 'Chest Freezer', watts: 100, category: 'appliances', critical: true },
    { name: 'Laptop', watts: 65, category: 'electronics', critical: false },
    { name: 'Desktop Computer', watts: 200, category: 'electronics', critical: false },
    { name: 'TV (32" LED)', watts: 30, category: 'entertainment', critical: false },
    { name: 'TV (55" LED)', watts: 60, category: 'entertainment', critical: false },
    { name: 'Microwave', watts: 1000, category: 'appliances', critical: false },
    { name: 'Coffee Maker', watts: 900, category: 'appliances', critical: false },
    { name: 'Water Pump (Well)', watts: 800, category: 'water', critical: true },
    { name: 'Washing Machine', watts: 500, category: 'appliances', critical: false },
    { name: 'Electric Heater (Space)', watts: 1500, category: 'heating', critical: false },
    { name: 'Air Conditioner (Window)', watts: 1200, category: 'cooling', critical: false },
    { name: 'Internet Router', watts: 12, category: 'electronics', critical: true },
    { name: 'Phone Charger', watts: 5, category: 'electronics', critical: false },
  ];

  const addAppliance = (appliance: (typeof commonAppliances)[0], hours: number = 8) => {
    const newAppliance: Appliance = {
      id: Date.now().toString(),
      name: appliance.name,
      watts: appliance.watts,
      hoursPerDay: hours,
      category: appliance.category,
      critical: appliance.critical,
    };
    setAppliances([...appliances, newAppliance]);
  };

  const addCustomAppliance = () => {
    if (customAppliance.name && customAppliance.watts && customAppliance.hoursPerDay) {
      const newAppliance: Appliance = {
        id: Date.now().toString(),
        name: customAppliance.name,
        watts: parseInt(customAppliance.watts),
        hoursPerDay: parseFloat(customAppliance.hoursPerDay),
        category: customAppliance.category,
        critical: customAppliance.critical,
      };
      setAppliances([...appliances, newAppliance]);
      setCustomAppliance({
        name: '',
        watts: '',
        hoursPerDay: '',
        category: 'lighting',
        critical: false,
      });
    }
  };

  const removeAppliance = (id: string) => {
    setAppliances(appliances.filter((app) => app.id !== id));
  };

  const calculateLoad = () => {
    // Daily energy consumption
    const dailyWattHours = appliances.reduce(
      (total, app) => total + app.watts * app.hoursPerDay,
      0
    );
    const dailyKwh = dailyWattHours / 1000;

    // Peak power demand (assume 70% of appliances could run simultaneously)
    const totalWatts = appliances.reduce((total, app) => total + app.watts, 0);
    const peakWatts = totalWatts * 0.7;

    // Critical loads only
    const criticalAppliances = appliances.filter((app) => app.critical);
    const criticalWattHours = criticalAppliances.reduce(
      (total, app) => total + app.watts * app.hoursPerDay,
      0
    );
    const criticalKwh = criticalWattHours / 1000;

    // Seasonal variation (heating/cooling can double usage)
    const hasHeatingCooling = appliances.some(
      (app) => app.category === 'heating' || app.category === 'cooling'
    );
    const seasonalVariation = hasHeatingCooling ? 2.0 : 1.3;

    // Recommended system size (daily kWh * 1.3 for inefficiencies * seasonal factor)
    const recommendedSystemSize = dailyKwh * 1.3 * seasonalVariation;

    const loadResults: LoadResults = {
      dailyKwh,
      peakWatts,
      criticalKwh,
      seasonalVariation,
      recommendedSystemSize,
    };

    setResults(loadResults);
    setShowShoppingBasket(true);
  };

  const generateShoppingBasket = () => {
    if (!results) return [];

    const basket = [];

    // Solar panels (assume 4 peak sun hours, 20% system losses)
    const panelsNeeded = Math.ceil(results.recommendedSystemSize / (0.4 * 0.8)); // 400W panels
    basket.push({
      category: 'Solar Panels',
      item: `${panelsNeeded}x 400W Monocrystalline Solar Panels`,
      affiliate: 'https://amzn.to/solar-panels-400w', // Example affiliate link
      price: panelsNeeded * 200,
      priority: 'essential',
    });

    // Battery storage (3 days backup for critical loads)
    const batteryCapacityNeeded = results.criticalKwh * 3 * 1.2; // 20% depth of discharge buffer
    const batteriesNeeded = Math.ceil(batteryCapacityNeeded / 2.56); // 100Ah LiFePO4 = 2.56kWh at 25.6V
    basket.push({
      category: 'Battery Storage',
      item: `${batteriesNeeded}x 100Ah LiFePO4 Battery`,
      affiliate: 'https://amzn.to/lifepo4-100ah',
      price: batteriesNeeded * 400,
      priority: 'essential',
    });

    // Inverter (125% of peak load for safety margin)
    const inverterSize = Math.ceil((results.peakWatts * 1.25) / 500) * 500; // Round to nearest 500W
    basket.push({
      category: 'Inverter',
      item: `${inverterSize}W Pure Sine Wave Inverter`,
      affiliate: 'https://amzn.to/pure-sine-inverter',
      price: inverterSize * 0.8, // ~$0.80 per watt
      priority: 'essential',
    });

    // Charge controller
    const chargeControllerAmps = Math.ceil((panelsNeeded * 400 * 1.25) / 24); // 25% safety margin, 24V system
    basket.push({
      category: 'Charge Controller',
      item: `${chargeControllerAmps}A MPPT Charge Controller`,
      affiliate: 'https://amzn.to/mppt-controller',
      price: chargeControllerAmps * 8, // ~$8 per amp
      priority: 'essential',
    });

    // Monitoring system
    basket.push({
      category: 'Monitoring',
      item: 'Battery Monitor with Bluetooth',
      affiliate: 'https://amzn.to/battery-monitor',
      price: 150,
      priority: 'recommended',
    });

    return basket;
  };

  const shoppingBasket = results ? generateShoppingBasket() : [];
  const totalCost = shoppingBasket.reduce((total, item) => total + item.price, 0);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            href="/solar-calculators"
            className="mb-4 inline-block text-primary hover:underline"
          >
            ← Back to Solar Calculators
          </Link>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Free Load Analysis Calculator - Solar Power Needs
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            <strong>Calculate your exact power consumption</strong> for accurate off-grid solar
            system sizing. The foundation of solar design - analyze appliances, seasonal usage, and
            get personalized
            <em>solar equipment recommendations</em> with instant shopping baskets.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Quick Add Common Appliances */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Quick Add Common Appliances</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {commonAppliances.slice(0, 8).map((appliance, index) => (
                  <button
                    key={index}
                    onClick={() => addAppliance(appliance)}
                    className="rounded border bg-background p-3 text-left text-sm hover:bg-accent"
                  >
                    <div className="font-medium">{appliance.name}</div>
                    <div className="text-muted-foreground">{appliance.watts}W</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Appliance Entry */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Add Custom Appliance</h2>
              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder="Appliance name"
                  value={customAppliance.name}
                  onChange={(e) => setCustomAppliance({ ...customAppliance, name: e.target.value })}
                  className="rounded border px-3 py-2"
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  <input
                    type="number"
                    placeholder="Watts"
                    value={customAppliance.watts}
                    onChange={(e) =>
                      setCustomAppliance({ ...customAppliance, watts: e.target.value })
                    }
                    className="rounded border px-3 py-2"
                  />
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Hours/day"
                    value={customAppliance.hoursPerDay}
                    onChange={(e) =>
                      setCustomAppliance({ ...customAppliance, hoursPerDay: e.target.value })
                    }
                    className="rounded border px-3 py-2"
                  />
                  <select
                    value={customAppliance.category}
                    onChange={(e) =>
                      setCustomAppliance({ ...customAppliance, category: e.target.value })
                    }
                    className="rounded border px-3 py-2"
                  >
                    <option value="lighting">Lighting</option>
                    <option value="appliances">Appliances</option>
                    <option value="electronics">Electronics</option>
                    <option value="heating">Heating</option>
                    <option value="cooling">Cooling</option>
                    <option value="water">Water</option>
                  </select>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={customAppliance.critical}
                    onChange={(e) =>
                      setCustomAppliance({ ...customAppliance, critical: e.target.checked })
                    }
                  />
                  Critical load (essential during power outage)
                </label>
                <button
                  onClick={addCustomAppliance}
                  className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                >
                  Add Appliance
                </button>
              </div>
            </div>

            {/* Current Appliances List */}
            {appliances.length > 0 && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Your Appliances</h2>
                <div className="space-y-2">
                  {appliances.map((appliance) => (
                    <div
                      key={appliance.id}
                      className="flex items-center justify-between rounded border bg-background p-3"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{appliance.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {appliance.watts}W × {appliance.hoursPerDay}h ={' '}
                          {(appliance.watts * appliance.hoursPerDay).toFixed(0)}Wh/day
                          {appliance.critical && (
                            <span className="ml-2 text-red-500">Critical</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeAppliance(appliance.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={calculateLoad}
                  className="mt-4 w-full rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                >
                  Calculate Load Requirements
                </button>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Load Analysis Results</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Daily Energy Usage:</span>
                    <span className="font-semibold">{results.dailyKwh.toFixed(2)} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peak Power Demand:</span>
                    <span className="font-semibold">{results.peakWatts.toFixed(0)} W</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Critical Loads Only:</span>
                    <span className="font-semibold">{results.criticalKwh.toFixed(2)} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seasonal Peak Usage:</span>
                    <span className="font-semibold">
                      {(results.dailyKwh * results.seasonalVariation).toFixed(2)} kWh
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Recommended System Size:</span>
                      <span className="text-primary">
                        {results.recommendedSystemSize.toFixed(2)} kWh/day
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showShoppingBasket && shoppingBasket.length > 0 && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">🛒 Recommended Shopping Basket</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Curated products based on your load analysis. Click affiliate links to purchase
                  and support our site.
                </p>
                <div className="space-y-3">
                  {shoppingBasket.map((item, index) => (
                    <div key={index} className="rounded border bg-background p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{item.item}</div>
                          <div className="text-sm text-muted-foreground">{item.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${item.price.toFixed(0)}</div>
                          <a
                            href={item.affiliate}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            View Product →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Estimated Total Cost:</span>
                    <span className="text-primary">${totalCost.toFixed(0)}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    *Prices are estimates. Click affiliate links for current pricing and
                    availability.
                  </p>
                </div>
              </div>
            )}

            {showShoppingBasket && (
              <div className="rounded-lg border bg-gradient-to-br from-accent/10 to-primary/10 p-6">
                <h3 className="mb-2 text-lg font-semibold">Next Steps</h3>
                <div className="space-y-2 text-sm">
                  <div>✅ Complete your load analysis</div>
                  <div>🔄 Use Panel Sizing Calculator for location-specific solar production</div>
                  <div>🔋 Refine battery requirements with Battery Calculator</div>
                  <div>⚡ Verify electrical components with Wire & Safety Calculator</div>
                  <div>🎯 Create complete system design with System Designer</div>
                </div>
                <div className="mt-4 space-y-2">
                  <Link
                    href="/solar-calculators/panel-sizing"
                    className="block rounded bg-primary px-4 py-2 text-center text-primary-foreground hover:bg-primary/90"
                  >
                    Continue to Panel Sizing Calculator →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
