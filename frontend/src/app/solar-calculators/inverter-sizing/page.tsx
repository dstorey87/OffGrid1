'use client';

import { useState } from 'react';
import Link from 'next/link';

interface InverterResults {
  continuousWatts: number;
  surgeWatts: number;
  recommendedInverterSize: number;
  efficiency: number;
  dcAmps: number;
  batteryVoltageRequired: number;
  wireRecommendations: {
    dcWireGauge: string;
    acWireGauge: string;
    fuseSize: string;
  };
}

interface ApplianceLoad {
  name: string;
  watts: number;
  startupMultiplier: number;
  quantity: number;
  runtime: number; // hours per day
}

export default function InverterSizingCalculator() {
  const [inputs, setInputs] = useState({
    systemVoltage: '24',
    inverterType: 'pure-sine',
    safetyMargin: '25',
    budgetTier: 'mid',
    installation: 'rv', // rv, marine, residential, commercial
    maxRuntime: '8',
  });

  const [appliances, setAppliances] = useState<ApplianceLoad[]>([
    { name: 'Refrigerator', watts: 150, startupMultiplier: 3, quantity: 1, runtime: 24 },
    { name: 'LED Lights', watts: 60, startupMultiplier: 1, quantity: 1, runtime: 6 },
    { name: 'Laptop Charger', watts: 90, startupMultiplier: 1, quantity: 1, runtime: 4 },
    { name: 'Water Pump', watts: 300, startupMultiplier: 4, quantity: 1, runtime: 2 },
  ]);

  const [results, setResults] = useState<InverterResults | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const commonAppliances = [
    { name: 'Microwave 700W', watts: 700, startupMultiplier: 1.2, defaultRuntime: 0.5 },
    { name: 'Coffee Maker', watts: 1000, startupMultiplier: 1.1, defaultRuntime: 0.5 },
    { name: 'Hair Dryer', watts: 1500, startupMultiplier: 1.1, defaultRuntime: 0.2 },
    { name: 'Space Heater', watts: 1500, startupMultiplier: 1.1, defaultRuntime: 4 },
    { name: 'TV (LED 32")', watts: 80, startupMultiplier: 1.5, defaultRuntime: 4 },
    { name: 'Desktop Computer', watts: 300, startupMultiplier: 2, defaultRuntime: 8 },
    { name: 'Washing Machine', watts: 500, startupMultiplier: 3, defaultRuntime: 1 },
    { name: 'Power Tools', watts: 800, startupMultiplier: 2.5, defaultRuntime: 2 },
    { name: 'Well Pump 1/2 HP', watts: 750, startupMultiplier: 5, defaultRuntime: 2 },
    { name: 'Air Conditioner 5000 BTU', watts: 600, startupMultiplier: 3.5, defaultRuntime: 8 },
  ];

  const addAppliance = (appliance: (typeof commonAppliances)[0]) => {
    const newAppliance: ApplianceLoad = {
      name: appliance.name,
      watts: appliance.watts,
      startupMultiplier: appliance.startupMultiplier,
      quantity: 1,
      runtime: appliance.defaultRuntime,
    };
    setAppliances([...appliances, newAppliance]);
  };

  const removeAppliance = (index: number) => {
    setAppliances(appliances.filter((_, i) => i !== index));
  };

  const updateAppliance = (index: number, field: keyof ApplianceLoad, value: number) => {
    const updated = [...appliances];
    updated[index] = { ...updated[index], [field]: value };
    setAppliances(updated);
  };

  const calculateInverterNeeds = () => {
    if (appliances.length === 0) return;

    const systemVoltage = parseInt(inputs.systemVoltage);
    const safetyMargin = parseFloat(inputs.safetyMargin) / 100;

    // Calculate continuous power requirements
    const continuousWatts = appliances.reduce(
      (total, appliance) => total + appliance.watts * appliance.quantity,
      0
    );

    // Calculate surge requirements (largest single appliance surge + other continuous loads)
    const surgeLoads = appliances.map((appliance) => ({
      surge: appliance.watts * appliance.startupMultiplier * appliance.quantity,
      continuous: appliance.watts * appliance.quantity,
    }));

    const largestSurge = Math.max(...surgeLoads.map((load) => load.surge));
    const otherContinuous = surgeLoads.reduce((total, load, index) => {
      const isLargestSurge = load.surge === largestSurge;
      return total + (isLargestSurge ? 0 : load.continuous);
    }, 0);

    const totalSurgeWatts = largestSurge + otherContinuous;

    // Apply safety margins
    const adjustedContinuous = continuousWatts * (1 + safetyMargin);
    const adjustedSurge = totalSurgeWatts * (1 + safetyMargin);

    // Determine recommended inverter size (standard sizes)
    const standardSizes = [300, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000, 6000];
    const minRequiredSize = Math.max(adjustedContinuous, adjustedSurge * 0.6); // Surge typically needs 60% continuous rating
    const recommendedSize = standardSizes.find((size) => size >= minRequiredSize) || 6000;

    // Efficiency calculations
    const efficiency =
      inputs.inverterType === 'pure-sine'
        ? 0.92
        : inputs.inverterType === 'modified-sine'
          ? 0.88
          : 0.85;

    // DC current calculations
    const dcAmps = adjustedContinuous / (systemVoltage * efficiency);

    // Wire recommendations
    const wireGauges = {
      '0-50A': { dc: '4 AWG', ac: '12 AWG', fuse: '60A' },
      '50-100A': { dc: '2 AWG', ac: '10 AWG', fuse: '125A' },
      '100-150A': { dc: '1/0 AWG', ac: '8 AWG', fuse: '200A' },
      '150-200A': { dc: '2/0 AWG', ac: '6 AWG', fuse: '250A' },
      '200A+': { dc: '4/0 AWG', ac: '4 AWG', fuse: '300A+' },
    };

    const getWireRecommendation = (amps: number) => {
      if (amps <= 50) return wireGauges['0-50A'];
      if (amps <= 100) return wireGauges['50-100A'];
      if (amps <= 150) return wireGauges['100-150A'];
      if (amps <= 200) return wireGauges['150-200A'];
      return wireGauges['200A+'];
    };

    const wireRec = getWireRecommendation(dcAmps);

    const inverterResults: InverterResults = {
      continuousWatts: Math.round(adjustedContinuous),
      surgeWatts: Math.round(adjustedSurge),
      recommendedInverterSize: recommendedSize,
      efficiency: efficiency,
      dcAmps: dcAmps,
      batteryVoltageRequired: systemVoltage,
      wireRecommendations: {
        dcWireGauge: wireRec.dc,
        acWireGauge: wireRec.ac,
        fuseSize: wireRec.fuse,
      },
    };

    setResults(inverterResults);
    setShowRecommendations(true);
  };

  const generateInverterRecommendations = () => {
    if (!results) return [];

    const recommendations = [];
    const requiredWatts = results.recommendedInverterSize;

    // Budget recommendations
    recommendations.push({
      tier: 'Budget',
      brand: 'AIMS Power',
      model: `${requiredWatts}W Pure Sine Wave Inverter`,
      watts: requiredWatts,
      price: requiredWatts * 0.4, // ~$0.40 per watt
      efficiency: '90%',
      warranty: '1 year',
      affiliate: 'https://amzn.to/aims-inverter',
      features: ['Pure sine wave', 'LCD display', 'Remote control', 'Multiple protection'],
    });

    // Mid-range recommendation
    recommendations.push({
      tier: 'Mid-Range',
      brand: 'Renogy',
      model: `${requiredWatts}W Pure Sine Wave Inverter`,
      watts: requiredWatts,
      price: requiredWatts * 0.6, // ~$0.60 per watt
      efficiency: '92%',
      warranty: '2 years',
      affiliate: 'https://amzn.to/renogy-inverter',
      features: ['Pure sine wave', 'Advanced LCD', 'Bluetooth monitoring', 'Low noise fans'],
    });

    // Premium recommendation
    recommendations.push({
      tier: 'Premium',
      brand: 'Victron Energy',
      model: `Phoenix ${requiredWatts}W Inverter`,
      watts: requiredWatts,
      price: requiredWatts * 1.0, // ~$1.00 per watt
      efficiency: '94%',
      warranty: '5 years',
      affiliate: 'https://amzn.to/victron-inverter',
      features: ['Pure sine wave', 'VictronConnect app', 'Programmable relay', 'Marine certified'],
    });

    return recommendations.filter(
      (rec) => rec.tier === inputs.budgetTier || inputs.budgetTier === 'all'
    );
  };

  const inverterRecommendations = results ? generateInverterRecommendations() : [];

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
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Inverter Sizing Calculator</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Size your inverter for continuous and surge power requirements. Calculate the exact
            capacity needed for reliable AC power conversion.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            {/* System Configuration */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">System Configuration</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Battery System Voltage</label>
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
                    <label className="mb-2 block text-sm font-medium">Inverter Type</label>
                    <select
                      value={inputs.inverterType}
                      onChange={(e) => setInputs({ ...inputs, inverterType: e.target.value })}
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="pure-sine">Pure Sine Wave (Recommended)</option>
                      <option value="modified-sine">Modified Sine Wave (Budget)</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Safety Margin</label>
                    <select
                      value={inputs.safetyMargin}
                      onChange={(e) => setInputs({ ...inputs, safetyMargin: e.target.value })}
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="20">20% (Minimal)</option>
                      <option value="25">25% (Recommended)</option>
                      <option value="30">30% (Conservative)</option>
                      <option value="40">40% (Future expansion)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Installation Type</label>
                    <select
                      value={inputs.installation}
                      onChange={(e) => setInputs({ ...inputs, installation: e.target.value })}
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="rv">RV/Mobile</option>
                      <option value="marine">Marine/Boat</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Appliance Loads */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">AC Appliance Loads</h2>

              {/* Current Appliances */}
              <div className="mb-6 space-y-3">
                {appliances.map((appliance, index) => (
                  <div key={index} className="rounded border bg-background p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">{appliance.name}</span>
                      <button
                        onClick={() => removeAppliance(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="grid gap-2 text-sm sm:grid-cols-4">
                      <div>
                        <label className="block text-xs text-muted-foreground">Watts</label>
                        <input
                          type="number"
                          value={appliance.watts}
                          onChange={(e) =>
                            updateAppliance(index, 'watts', parseInt(e.target.value) || 0)
                          }
                          className="w-full rounded border px-2 py-1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground">Startup×</label>
                        <input
                          type="number"
                          step="0.1"
                          value={appliance.startupMultiplier}
                          onChange={(e) =>
                            updateAppliance(
                              index,
                              'startupMultiplier',
                              parseFloat(e.target.value) || 1
                            )
                          }
                          className="w-full rounded border px-2 py-1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground">Qty</label>
                        <input
                          type="number"
                          value={appliance.quantity}
                          onChange={(e) =>
                            updateAppliance(index, 'quantity', parseInt(e.target.value) || 1)
                          }
                          className="w-full rounded border px-2 py-1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground">Runtime/day</label>
                        <input
                          type="number"
                          step="0.5"
                          value={appliance.runtime}
                          onChange={(e) =>
                            updateAppliance(index, 'runtime', parseFloat(e.target.value) || 0)
                          }
                          className="w-full rounded border px-2 py-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Common Appliances */}
              <div>
                <h3 className="mb-2 text-sm font-medium">Quick Add Common Appliances:</h3>
                <div className="mb-4 flex flex-wrap gap-2">
                  {commonAppliances.slice(0, 6).map((appliance, index) => (
                    <button
                      key={index}
                      onClick={() => addAppliance(appliance)}
                      className="rounded bg-accent px-3 py-1 text-xs hover:bg-accent/80"
                    >
                      + {appliance.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={calculateInverterNeeds}
                disabled={appliances.length === 0}
                className="w-full rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Calculate Inverter Requirements
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Inverter Requirements</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Continuous Power Needed:</span>
                    <span className="font-semibold">{results.continuousWatts}W</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Surge Power Needed:</span>
                    <span className="font-semibold text-orange-600">{results.surgeWatts}W</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recommended Inverter Size:</span>
                    <span className="font-semibold text-primary">
                      {results.recommendedInverterSize}W
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>System Efficiency:</span>
                    <span className="font-semibold">{results.efficiency * 100}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DC Current Draw:</span>
                    <span className="font-semibold">{results.dcAmps.toFixed(1)}A</span>
                  </div>

                  <div className="border-t pt-3">
                    <h3 className="mb-2 font-semibold">Wiring Requirements:</h3>
                    <div className="space-y-1 text-sm">
                      <div>DC Wire: {results.wireRecommendations.dcWireGauge}</div>
                      <div>AC Wire: {results.wireRecommendations.acWireGauge}</div>
                      <div>Fuse Size: {results.wireRecommendations.fuseSize}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showRecommendations && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">⚙️ Recommended Inverters</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Curated pure sine wave inverters for reliable AC power conversion:
                </p>

                <div className="space-y-4">
                  {inverterRecommendations.map((rec, index) => (
                    <div key={index} className="rounded border bg-background p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <div className="font-semibold">{rec.tier} Choice</div>
                          <div className="text-sm text-muted-foreground">
                            {rec.brand} - {rec.model}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${rec.price.toFixed(0)}</div>
                          <div className="text-sm text-muted-foreground">
                            ${(rec.price / rec.watts).toFixed(2)}/watt
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 text-sm">
                        <div>
                          Capacity: {rec.watts}W | Efficiency: {rec.efficiency}
                        </div>
                        <div>Warranty: {rec.warranty}</div>
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
                        View {rec.tier} Inverter →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showRecommendations && (
              <div className="rounded-lg border bg-gradient-to-br from-accent/10 to-primary/10 p-6">
                <h3 className="mb-2 text-lg font-semibold">Complete Your Solar System</h3>
                <div className="space-y-2 text-sm">
                  <div>✅ Calculated inverter power requirements</div>
                  <div>⚡ Size electrical components and wiring</div>
                  <div>🎯 Create complete system with all components</div>
                  <div>🛒 Generate final shopping basket with installation guide</div>
                </div>
                <div className="mt-4 space-y-2">
                  <Link
                    href="/solar-calculators/electrical"
                    className="block rounded bg-primary px-4 py-2 text-center text-primary-foreground hover:bg-primary/90"
                  >
                    Continue to Electrical Calculator →
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
