'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrency } from '@/contexts/CurrencyContext';

import CurrencySelector from '@/components/CurrencySelector';
import UnitsSelector from '@/components/UnitsSelector';
import { BuildingIcon } from '@/components/icons';
import { householdPresets } from '@/lib/householdPresets';

// Note: Metadata exports removed - client components cannot export metadata
// SEO will be handled by parent layout or server component wrapper if needed

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

interface ProductOverrides {
  solarPanelPrice: string;
  batteryPrice: string;
  inverterPricePerWatt: string;
  controllerPricePerAmp: string;
  monitorPrice: string;
  useCustomPricing: boolean;
}

export default function LoadAnalysisCalculator() {
  const { formatPrice } = useCurrency();
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
  const [productOverrides, setProductOverrides] = useState<ProductOverrides>({
    solarPanelPrice: '200',
    batteryPrice: '400',
    inverterPricePerWatt: '0.8',
    controllerPricePerAmp: '8',
    monitorPrice: '150',
    useCustomPricing: false,
  });

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

  const autoFillPreset = (presetKey: string) => {
    const preset = householdPresets[presetKey];
    if (preset) {
      const newAppliances: Appliance[] = preset.appliances.map((app, index) => ({
        id: `${Date.now()}_${index}`,
        ...app,
      }));
      setAppliances(newAppliances);
      // calculateLoad will be called automatically via the useEffect or user can click Calculate
    }
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

    // Get pricing (use overrides if enabled, otherwise defaults)
    const pricing = productOverrides.useCustomPricing
      ? {
          solarPanel: parseFloat(productOverrides.solarPanelPrice) || 200,
          battery: parseFloat(productOverrides.batteryPrice) || 400,
          inverterPerWatt: parseFloat(productOverrides.inverterPricePerWatt) || 0.8,
          controllerPerAmp: parseFloat(productOverrides.controllerPricePerAmp) || 8,
          monitor: parseFloat(productOverrides.monitorPrice) || 150,
        }
      : {
          solarPanel: 200,
          battery: 400,
          inverterPerWatt: 0.8,
          controllerPerAmp: 8,
          monitor: 150,
        };

    // Solar panels (assume 4 peak sun hours, 20% system losses)
    const panelsNeeded = Math.ceil(results.recommendedSystemSize / (0.4 * 0.8)); // 400W panels
    basket.push({
      category: 'Solar Panels',
      item: `${panelsNeeded}x 400W Monocrystalline Solar Panels`,
      affiliates: [
        { source: 'Amazon', url: 'https://amzn.to/solar-panels-400w' },
        { source: 'eBay', url: 'https://ebay.us/solar-panel-400w' },
        { source: 'Signature Solar', url: 'https://signaturesolar.com/solar-panels' },
        { source: 'Current Connected', url: 'https://currentconnected.com/solar-panels' },
      ],
      price: panelsNeeded * pricing.solarPanel,
      priority: 'essential',
    });

    // Battery storage (3 days backup for critical loads)
    const batteryCapacityNeeded = results.criticalKwh * 3 * 1.2; // 20% depth of discharge buffer
    const batteriesNeeded = Math.ceil(batteryCapacityNeeded / 2.56); // 100Ah LiFePO4 = 2.56kWh at 25.6V
    basket.push({
      category: 'Battery Storage',
      item: `${batteriesNeeded}x 100Ah LiFePO4 Battery`,
      affiliates: [
        { source: 'Amazon', url: 'https://amzn.to/lifepo4-100ah' },
        { source: 'eBay', url: 'https://ebay.us/lifepo4-battery' },
        { source: 'AliExpress', url: 'https://s.click.aliexpress.com/lifepo4-100ah' },
        { source: 'SOK Battery', url: 'https://sokbattery.com/lifepo4' },
      ],
      price: batteriesNeeded * pricing.battery,
      priority: 'essential',
    });

    // Inverter (125% of peak load for safety margin)
    const inverterSize = Math.ceil((results.peakWatts * 1.25) / 500) * 500; // Round to nearest 500W
    basket.push({
      category: 'Inverter',
      item: `${inverterSize}W Pure Sine Wave Inverter`,
      affiliates: [
        { source: 'Amazon', url: 'https://amzn.to/pure-sine-inverter' },
        { source: 'eBay', url: 'https://ebay.us/inverter-pure-sine' },
        { source: 'Victron Energy', url: 'https://www.victronenergy.com/inverters' },
        { source: 'Aims Power', url: 'https://aimscorp.net/inverters' },
      ],
      price: inverterSize * pricing.inverterPerWatt,
      priority: 'essential',
    });

    // Charge controller
    const chargeControllerAmps = Math.ceil((panelsNeeded * 400 * 1.25) / 24); // 25% safety margin, 24V system
    basket.push({
      category: 'Charge Controller',
      item: `${chargeControllerAmps}A MPPT Charge Controller`,
      affiliates: [
        { source: 'Amazon', url: 'https://amzn.to/mppt-controller' },
        { source: 'eBay', url: 'https://ebay.us/mppt-charge-controller' },
        { source: 'Renogy', url: 'https://www.renogy.com/charge-controllers' },
        { source: 'Victron Energy', url: 'https://www.victronenergy.com/solar-charge-controllers' },
      ],
      price: chargeControllerAmps * pricing.controllerPerAmp,
      priority: 'essential',
    });

    // Monitoring system
    basket.push({
      category: 'Monitoring',
      item: 'Battery Monitor with Bluetooth',
      affiliates: [
        { source: 'Amazon', url: 'https://amzn.to/battery-monitor' },
        { source: 'eBay', url: 'https://ebay.us/battery-monitor' },
        { source: 'Victron Energy', url: 'https://www.victronenergy.com/battery-monitors' },
      ],
      price: pricing.monitor,
      priority: 'recommended',
    });

    return basket;
  };

  const shoppingBasket = results ? generateShoppingBasket() : [];
  const totalCost = shoppingBasket.reduce((total, item) => total + item.price, 0);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Header with Image */}
        <div className="relative mb-8 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80"
              alt="Power meter and energy monitoring for load analysis"
              fill
              className="object-cover opacity-15"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
          </div>

          <div className="relative z-10 px-4 py-12 md:px-8">
            {/* Back Button */}
            <Link
              href="/solar-calculators"
              className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to Solar Calculators
            </Link>

            <h1 className="mb-4 text-3xl font-bold tracking-tight lg:text-5xl">
              Free Load Analysis Calculator - Solar Power Needs
            </h1>
            <p className="max-w-3xl text-lg text-muted-foreground">
              <strong>Calculate your exact power consumption</strong> for accurate off-grid solar
              system sizing. The foundation of solar design - analyze appliances, seasonal usage,
              and get personalized <strong>solar equipment recommendations</strong> with instant
              shopping baskets.
            </p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card p-4">
          <div className="flex flex-wrap items-center gap-4">
            <CurrencySelector />
            <UnitsSelector />
          </div>
        </div>

        {/* Auto-Fill Household Presets */}
        <div className="mb-6 rounded-lg border bg-gradient-to-r from-primary/10 to-accent/10 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <BuildingIcon size="sm" /> Auto-Fill for Your Household
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Quick start with pre-configured appliances for different household sizes
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(householdPresets).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => autoFillPreset(key)}
                className="rounded-lg border-2 border-primary/20 bg-background p-4 text-left transition-all hover:border-primary hover:bg-accent"
              >
                <div className="font-semibold text-primary">{preset.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{preset.description}</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {preset.appliances.length} appliances
                </div>
              </button>
            ))}
          </div>
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
              <>
                {/* Pricing Controls */}
                <div className="rounded-lg border bg-card p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Custom Pricing</h3>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={productOverrides.useCustomPricing}
                        onChange={(e) =>
                          setProductOverrides({
                            ...productOverrides,
                            useCustomPricing: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="font-medium">Use Custom Pricing</span>
                    </label>

                    {productOverrides.useCustomPricing && (
                      <div className="grid gap-3 border-t pt-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm text-muted-foreground">
                            Solar Panel Price (per panel)
                          </label>
                          <input
                            type="number"
                            value={productOverrides.solarPanelPrice}
                            onChange={(e) =>
                              setProductOverrides({
                                ...productOverrides,
                                solarPanelPrice: e.target.value,
                              })
                            }
                            className="w-full rounded border px-3 py-2 text-sm"
                            placeholder="200"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm text-muted-foreground">
                            Battery Price (per 100Ah)
                          </label>
                          <input
                            type="number"
                            value={productOverrides.batteryPrice}
                            onChange={(e) =>
                              setProductOverrides({
                                ...productOverrides,
                                batteryPrice: e.target.value,
                              })
                            }
                            className="w-full rounded border px-3 py-2 text-sm"
                            placeholder="400"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm text-muted-foreground">
                            Inverter Price (per watt)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={productOverrides.inverterPricePerWatt}
                            onChange={(e) =>
                              setProductOverrides({
                                ...productOverrides,
                                inverterPricePerWatt: e.target.value,
                              })
                            }
                            className="w-full rounded border px-3 py-2 text-sm"
                            placeholder="0.8"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm text-muted-foreground">
                            Controller Price (per amp)
                          </label>
                          <input
                            type="number"
                            value={productOverrides.controllerPricePerAmp}
                            onChange={(e) =>
                              setProductOverrides({
                                ...productOverrides,
                                controllerPricePerAmp: e.target.value,
                              })
                            }
                            className="w-full rounded border px-3 py-2 text-sm"
                            placeholder="8"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm text-muted-foreground">
                            Monitor Price
                          </label>
                          <input
                            type="number"
                            value={productOverrides.monitorPrice}
                            onChange={(e) =>
                              setProductOverrides({
                                ...productOverrides,
                                monitorPrice: e.target.value,
                              })
                            }
                            className="w-full rounded border px-3 py-2 text-sm"
                            placeholder="150"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shopping Basket */}
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-xl font-semibold">🛒 Recommended Shopping Basket</h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Curated products based on your load analysis. Multiple affiliate sources
                    available - prices may vary by retailer.
                  </p>
                  <div className="space-y-4">
                    {shoppingBasket.map((item, index) => (
                      <div key={index} className="rounded border bg-background p-4">
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{item.item}</div>
                            <div className="text-sm text-muted-foreground">{item.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">{formatPrice(item.price)}</div>
                            {productOverrides.useCustomPricing && (
                              <div className="text-xs text-muted-foreground">Custom pricing</div>
                            )}
                          </div>
                        </div>
                        <div className="border-t pt-3">
                          <div className="mb-2 text-sm font-medium text-muted-foreground">
                            Buy from:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.affiliates.map((affiliate, idx) => (
                              <a
                                key={idx}
                                href={affiliate.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:border-primary/40 hover:bg-primary/10"
                              >
                                {affiliate.source} →
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Estimated Total Cost:</span>
                      <span className="text-primary">{formatPrice(totalCost)}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      *Prices are estimates. Click affiliate links for current pricing and
                      availability. Prices shown in selected currency.
                    </p>
                  </div>
                </div>
              </>
            )}

            {showShoppingBasket && (
              <div className="rounded-lg border bg-gradient-to-br from-accent/10 to-primary/10 p-6">
                <h3 className="mb-2 text-lg font-semibold">Next Steps</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Complete your load analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">→</span>
                    <span>Use Panel Sizing Calculator for location-specific solar production</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">→</span>
                    <span>Refine battery requirements with Battery Calculator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600">→</span>
                    <span>Verify electrical components with Wire & Safety Calculator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">→</span>
                    <span>Create complete system design with System Designer</span>
                  </div>
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

            {/* Sources & References */}
            {showShoppingBasket && (
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-3 text-lg font-semibold">Data Sources & References</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Equipment Specifications:</strong> Based on
                    industry-standard solar components from manufacturers including Renogy, Victron
                    Energy, Battle Born Batteries, and Aims Power.
                  </p>
                  <p>
                    <strong className="text-foreground">Pricing Data:</strong> Average retail
                    pricing from Amazon, eBay, specialist solar retailers (Signature Solar, SOK
                    Battery, Current Connected), and manufacturer MSRPs as of{' '}
                    {new Date().getFullYear()}.
                  </p>
                  <p>
                    <strong className="text-foreground">Calculation Methods:</strong> Load analysis
                    formulas follow NREL (National Renewable Energy Laboratory) guidelines and IEEE
                    standards for off-grid system design.
                  </p>
                  <p>
                    <strong className="text-foreground">Efficiency Factors:</strong> System losses
                    (20%), depth of discharge (DOD), and safety margins based on Solar Energy
                    International (SEI) best practices.
                  </p>
                  <p className="pt-2 text-xs">
                    *Prices and specifications are estimates for planning purposes. Always verify
                    current specifications and compatibility with manufacturers before purchase.
                    This calculator is for educational purposes and should not replace professional
                    solar system design consultation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
