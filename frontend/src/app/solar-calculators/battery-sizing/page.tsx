'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BatteryResults {
  batteryCapacityAh: number;
  batteryCapacityKwh: number;
  batteriesNeeded: number;
  backupDuration: number;
  cycleLife: number;
  replacementCost: number;
  configuration: {
    series: number;
    parallel: number;
    totalBatteries: number;
  };
}

interface BatterySpecs {
  chemistry: string;
  voltagePerCell: number;
  dod: number; // Depth of discharge
  efficiency: number;
  cycleLife: number;
  costPerAh: number;
  temperatureDerating: number;
}

export default function BatterySizingCalculator() {
  const [inputs, setInputs] = useState({
    dailyCriticalLoad: '',
    backupDays: '3',
    batteryChemistry: 'lifepo4',
    systemVoltage: '24',
    temperatureRange: 'moderate',
    budgetTier: 'mid',
    safetyMargin: '20',
    cyclingFrequency: 'daily',
  });

  const [results, setResults] = useState<BatteryResults | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Battery chemistry specifications
  const batterySpecs: Record<string, BatterySpecs> = {
    lifepo4: {
      chemistry: 'LiFePO4 (Lithium Iron Phosphate)',
      voltagePerCell: 3.2,
      dod: 0.9, // 90% depth of discharge
      efficiency: 0.95,
      cycleLife: 6000,
      costPerAh: 4.0, // Cost per Ah for 12V equivalent
      temperatureDerating: 0.95,
    },
    agm: {
      chemistry: 'AGM (Absorbed Glass Mat)',
      voltagePerCell: 2.0,
      dod: 0.5, // 50% depth of discharge
      efficiency: 0.85,
      cycleLife: 1200,
      costPerAh: 1.5,
      temperatureDerating: 0.9,
    },
    gel: {
      chemistry: 'Gel Cell',
      voltagePerCell: 2.0,
      dod: 0.6, // 60% depth of discharge
      efficiency: 0.88,
      cycleLife: 1500,
      costPerAh: 2.0,
      temperatureDerating: 0.92,
    },
    flooded: {
      chemistry: 'Flooded Lead Acid',
      voltagePerCell: 2.0,
      dod: 0.5, // 50% depth of discharge
      efficiency: 0.8,
      cycleLife: 800,
      costPerAh: 1.0,
      temperatureDerating: 0.85,
    },
  };

  const temperatureFactors = {
    cold: 0.8, // -10°C to 10°C
    moderate: 1.0, // 10°C to 30°C
    hot: 0.9, // 30°C to 50°C
  };

  const calculateBatteryNeeds = () => {
    const dailyLoad = parseFloat(inputs.dailyCriticalLoad);
    const backupDays = parseInt(inputs.backupDays);
    const systemVoltage = parseInt(inputs.systemVoltage);
    const safetyMargin = parseFloat(inputs.safetyMargin) / 100;

    if (!dailyLoad) return;

    const batterySpec = batterySpecs[inputs.batteryChemistry];
    const tempFactor =
      temperatureFactors[inputs.temperatureRange as keyof typeof temperatureFactors];

    // Calculate total energy needed
    const totalEnergyNeeded = dailyLoad * backupDays; // kWh

    // Apply safety margin and efficiency losses
    const adjustedEnergyNeeded = (totalEnergyNeeded * (1 + safetyMargin)) / batterySpec.efficiency;

    // Calculate usable capacity per battery (accounting for DOD)
    const batteryVoltage = systemVoltage; // Assuming 12V batteries for simplicity
    const batteryCapacityAh =
      (adjustedEnergyNeeded * 1000) / (batteryVoltage * batterySpec.dod * tempFactor);

    // Standard battery sizes (most common capacities)
    const standardSizes = [100, 200, 300, 400, 500]; // Ah
    const bestFitSize =
      standardSizes.find(
        (size) => size >= batteryCapacityAh / Math.ceil(batteryCapacityAh / 400)
      ) || 500;

    // Calculate number of batteries needed
    const batteriesNeeded = Math.ceil(batteryCapacityAh / bestFitSize);

    // Battery configuration (series/parallel)
    const cellsInSeries = systemVoltage / (batterySpec.voltagePerCell * 4); // 4 cells per 12V battery typically
    const batteriesInSeries = cellsInSeries <= 1 ? 1 : Math.ceil(cellsInSeries);
    const batteriesInParallel = Math.ceil(batteriesNeeded / batteriesInSeries);
    const totalBatteries = batteriesInSeries * batteriesInParallel;

    // Calculate actual capacity
    const actualCapacityKwh =
      (totalBatteries * bestFitSize * batteryVoltage * batterySpec.dod) / 1000;
    const actualBackupDuration = (actualCapacityKwh * batterySpec.efficiency) / dailyLoad;

    // Cost calculations
    const batteryCost = totalBatteries * bestFitSize * batterySpec.costPerAh;

    // Cycle life and replacement
    const cyclesPerYear =
      inputs.cyclingFrequency === 'daily' ? 365 : inputs.cyclingFrequency === 'weekly' ? 52 : 12;
    const yearsToReplacement = batterySpec.cycleLife / cyclesPerYear;
    const annualReplacementCost = batteryCost / yearsToReplacement;

    const batteryResults: BatteryResults = {
      batteryCapacityAh: bestFitSize,
      batteryCapacityKwh: actualCapacityKwh,
      batteriesNeeded: totalBatteries,
      backupDuration: actualBackupDuration,
      cycleLife: batterySpec.cycleLife,
      replacementCost: annualReplacementCost,
      configuration: {
        series: batteriesInSeries,
        parallel: batteriesInParallel,
        totalBatteries,
      },
    };

    setResults(batteryResults);
    setShowRecommendations(true);
  };

  const generateBatteryRecommendations = () => {
    if (!results) return [];

    const recommendations = [];
    const batterySpec = batterySpecs[inputs.batteryChemistry];
    const capacity = results.batteryCapacityAh;

    // Budget recommendation
    if (inputs.batteryChemistry === 'lifepo4') {
      recommendations.push({
        tier: 'Budget',
        brand: 'LiTime',
        model: `${capacity}Ah LiFePO4 Battery`,
        quantity: results.batteriesNeeded,
        pricePerBattery: capacity * 3.5,
        capacity: `${capacity}Ah`,
        voltage: '12V',
        warranty: '5 years',
        cycleLife: '4000+ cycles',
        affiliate: 'https://amzn.to/litime-battery',
        features: ['Built-in BMS', 'Bluetooth monitoring', 'Fast charging', 'Lightweight'],
      });

      recommendations.push({
        tier: 'Mid-Range',
        brand: 'Battle Born',
        model: `${capacity}Ah LiFePO4 Battery`,
        quantity: results.batteriesNeeded,
        pricePerBattery: capacity * 4.5,
        capacity: `${capacity}Ah`,
        voltage: '12V',
        warranty: '8 years',
        cycleLife: '5000+ cycles',
        affiliate: 'https://amzn.to/battleborn-battery',
        features: ['Advanced BMS', 'Drop-in replacement', 'US-based support', 'Proven reliability'],
      });

      recommendations.push({
        tier: 'Premium',
        brand: 'Victron Energy',
        model: `${capacity}Ah LiFePO4 Smart Battery`,
        quantity: results.batteriesNeeded,
        pricePerBattery: capacity * 6.0,
        capacity: `${capacity}Ah`,
        voltage: '12V',
        warranty: '8 years',
        cycleLife: '6000+ cycles',
        affiliate: 'https://amzn.to/victron-battery',
        features: ['Smart BMS', 'VictronConnect app', 'Parallel capability', 'Marine certified'],
      });
    } else if (inputs.batteryChemistry === 'agm') {
      recommendations.push({
        tier: 'Budget',
        brand: 'Universal Power',
        model: `${capacity}Ah AGM Battery`,
        quantity: results.batteriesNeeded,
        pricePerBattery: capacity * 1.2,
        capacity: `${capacity}Ah`,
        voltage: '12V',
        warranty: '1 year',
        cycleLife: '800+ cycles',
        affiliate: 'https://amzn.to/universal-agm',
        features: ['Maintenance-free', 'Spillproof', 'Good value', 'Widely available'],
      });

      recommendations.push({
        tier: 'Premium',
        brand: 'Lifeline',
        model: `${capacity}Ah AGM Battery`,
        quantity: results.batteriesNeeded,
        pricePerBattery: capacity * 2.0,
        capacity: `${capacity}Ah`,
        voltage: '12V',
        warranty: '2 years',
        cycleLife: '1200+ cycles',
        affiliate: 'https://amzn.to/lifeline-agm',
        features: ['Deep cycle design', 'Fast recharge', 'Temperature tolerant', 'Military spec'],
      });
    }

    return recommendations;
  };

  const batteryRecommendations = results ? generateBatteryRecommendations() : [];

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
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Battery Storage Calculator</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Size your battery bank for reliable backup power. Calculate capacity, configuration, and
            get recommendations for the best battery deals.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Energy Requirements */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Backup Power Requirements</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Daily Critical Load (kWh)
                    <span className="text-muted-foreground">- essential appliances only</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 5.2"
                    value={inputs.dailyCriticalLoad}
                    onChange={(e) => setInputs({ ...inputs, dailyCriticalLoad: e.target.value })}
                    className="w-full rounded border px-3 py-2"
                  />
                  <div className="mt-2 text-sm text-muted-foreground">
                    💡 From Load Analysis: lights, refrigerator, communication, water pump
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Backup Duration Needed</label>
                  <select
                    value={inputs.backupDays}
                    onChange={(e) => setInputs({ ...inputs, backupDays: e.target.value })}
                    className="w-full rounded border px-3 py-2"
                  >
                    <option value="1">1 day (basic backup)</option>
                    <option value="2">2 days (standard backup)</option>
                    <option value="3">3 days (recommended)</option>
                    <option value="5">5 days (extended backup)</option>
                    <option value="7">1 week (off-grid living)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Cycling Frequency</label>
                  <select
                    value={inputs.cyclingFrequency}
                    onChange={(e) => setInputs({ ...inputs, cyclingFrequency: e.target.value })}
                    className="w-full rounded border px-3 py-2"
                  >
                    <option value="daily">Daily cycling (off-grid)</option>
                    <option value="weekly">Weekly cycling (backup system)</option>
                    <option value="monthly">Monthly cycling (emergency backup)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Battery Type Selection */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Battery Technology</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Battery Chemistry</label>
                  <select
                    value={inputs.batteryChemistry}
                    onChange={(e) => setInputs({ ...inputs, batteryChemistry: e.target.value })}
                    className="w-full rounded border px-3 py-2"
                  >
                    <option value="lifepo4">LiFePO4 - Lithium (Recommended)</option>
                    <option value="agm">AGM - Lead Acid (Budget)</option>
                    <option value="gel">Gel - Lead Acid (Mid-range)</option>
                    <option value="flooded">Flooded - Lead Acid (Maintenance)</option>
                  </select>
                </div>

                {inputs.batteryChemistry && (
                  <div className="rounded border bg-background p-3 text-sm">
                    <div className="mb-2 font-medium">
                      {batterySpecs[inputs.batteryChemistry].chemistry}
                    </div>
                    <div className="space-y-1 text-muted-foreground">
                      <div>
                        • Depth of Discharge: {batterySpecs[inputs.batteryChemistry].dod * 100}%
                      </div>
                      <div>
                        • Cycle Life: ~
                        {batterySpecs[inputs.batteryChemistry].cycleLife.toLocaleString()} cycles
                      </div>
                      <div>
                        • Efficiency: {batterySpecs[inputs.batteryChemistry].efficiency * 100}%
                      </div>
                      <div>• Cost: ~${batterySpecs[inputs.batteryChemistry].costPerAh}/Ah</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* System Configuration */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">System Configuration</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">System Voltage</label>
                    <select
                      value={inputs.systemVoltage}
                      onChange={(e) => setInputs({ ...inputs, systemVoltage: e.target.value })}
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="12">12V (Small systems)</option>
                      <option value="24">24V (Medium systems)</option>
                      <option value="48">48V (Large systems)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Temperature Range</label>
                    <select
                      value={inputs.temperatureRange}
                      onChange={(e) => setInputs({ ...inputs, temperatureRange: e.target.value })}
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="cold">Cold (-10°C to 10°C)</option>
                      <option value="moderate">Moderate (10°C to 30°C)</option>
                      <option value="hot">Hot (30°C to 50°C)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Safety Margin</label>
                  <select
                    value={inputs.safetyMargin}
                    onChange={(e) => setInputs({ ...inputs, safetyMargin: e.target.value })}
                    className="w-full rounded border px-3 py-2"
                  >
                    <option value="10">10% (Minimal)</option>
                    <option value="20">20% (Recommended)</option>
                    <option value="30">30% (Conservative)</option>
                    <option value="50">50% (Maximum safety)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={calculateBatteryNeeds}
                disabled={!inputs.dailyCriticalLoad}
                className="mt-4 w-full rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Calculate Battery Requirements
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Battery Sizing Results</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Battery Capacity:</span>
                    <span className="font-semibold text-primary">
                      {results.batteryCapacityAh}Ah per battery
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Batteries:</span>
                    <span className="font-semibold">{results.batteriesNeeded} batteries</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total System Capacity:</span>
                    <span className="font-semibold">
                      {results.batteryCapacityKwh.toFixed(1)} kWh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actual Backup Duration:</span>
                    <span className="font-semibold">{results.backupDuration.toFixed(1)} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Cycle Life:</span>
                    <span className="font-semibold">
                      {results.cycleLife.toLocaleString()} cycles
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Replacement Cost:</span>
                    <span className="font-semibold">
                      ${results.replacementCost.toFixed(0)}/year
                    </span>
                  </div>

                  <div className="border-t pt-3">
                    <h3 className="mb-2 font-semibold">Battery Configuration:</h3>
                    <div className="space-y-1 text-sm">
                      <div>Series: {results.configuration.series} batteries</div>
                      <div>Parallel: {results.configuration.parallel} strings</div>
                      <div>Total: {results.configuration.totalBatteries} batteries</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showRecommendations && batteryRecommendations.length > 0 && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">🔋 Recommended Battery Products</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Curated {batterySpecs[inputs.batteryChemistry].chemistry} batteries with affiliate
                  pricing:
                </p>

                <div className="space-y-4">
                  {batteryRecommendations.map((rec, index) => (
                    <div key={index} className="rounded border bg-background p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <div className="font-semibold">{rec.tier} Choice</div>
                          <div className="text-sm text-muted-foreground">
                            {rec.brand} - {rec.model}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${rec.pricePerBattery.toFixed(0)}/battery
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total: ${(rec.pricePerBattery * rec.quantity).toFixed(0)}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 text-sm">
                        <div>
                          Quantity: {rec.quantity} × {rec.capacity} {rec.voltage}
                        </div>
                        <div>
                          Warranty: {rec.warranty} | Cycles: {rec.cycleLife}
                        </div>
                      </div>

                      <div className="mb-3 text-xs text-muted-foreground">
                        ✅ {rec.features.join(' • ')}
                      </div>

                      <a
                        href={rec.affiliate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                      >
                        View {rec.tier} Batteries →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showRecommendations && (
              <div className="rounded-lg border bg-gradient-to-br from-accent/10 to-primary/10 p-6">
                <h3 className="mb-2 text-lg font-semibold">Complete Your System</h3>
                <div className="space-y-2 text-sm">
                  <div>✅ Calculated battery storage requirements</div>
                  <div>⚙️ Size inverter for power conversion</div>
                  <div>⚡ Calculate electrical components and wiring</div>
                  <div>🎯 Create complete system design with all components</div>
                </div>
                <div className="mt-4 space-y-2">
                  <Link
                    href="/solar-calculators/inverter-sizing"
                    className="block rounded bg-primary px-4 py-2 text-center text-primary-foreground hover:bg-primary/90"
                  >
                    Continue to Inverter Calculator →
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
