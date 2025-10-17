'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ElectricalResults {
  dcWiring: {
    panelToController: { distance: number; wireGauge: string; voltageDrop: number };
    controllerToBattery: { distance: number; wireGauge: string; voltageDrop: number };
    batteryToInverter: { distance: number; wireGauge: string; voltageDrop: number };
  };
  acWiring: {
    inverterToPanel: { distance: number; wireGauge: string; voltageDrop: number };
  };
  protection: {
    dcFuses: { panelFuse: string; batteryFuse: string; inverterFuse: string };
    acBreakers: { mainBreaker: string; branchBreakers: string[] };
  };
  grounding: {
    groundingElectrode: string;
    equipmentGround: string;
    dcGrounding: string;
  };
  conduit: {
    dcConduit: string;
    acConduit: string;
  };
  totalWireCost: number;
  safetyCompliance: string[];
}

export default function ElectricalCalculator() {
  const [inputs, setInputs] = useState({
    // System specifications
    solarPanelWatts: '',
    systemVoltage: '24',
    inverterWatts: '',
    batteryAh: '',

    // Installation distances
    panelToControllerDistance: '25',
    controllerToBatteryDistance: '5',
    batteryToInverterDistance: '3',
    inverterToPanelDistance: '50',

    // Installation type
    installationType: 'residential', // residential, rv, marine, commercial
    conduitType: 'pvc', // pvc, metal, none
    ambientTemperature: '86', // Fahrenheit

    // Code requirements
    codeCompliance: 'nec2023', // nec2023, nec2020, local
    inspectionRequired: true,

    // Advanced options
    voltageDropLimit: '3', // percentage
    temperatureRating: '90', // Celsius wire rating
    wiringMethod: 'conduit', // conduit, cable, tray
  });

  const [results, setResults] = useState<ElectricalResults | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Wire specifications (AWG, amp capacity, resistance per 1000ft)
  const wireSpecs = {
    '14': { amps75C: 20, amps90C: 25, resistance: 2.525, costPerFoot: 0.25 },
    '12': { amps75C: 25, amps90C: 30, resistance: 1.588, costPerFoot: 0.35 },
    '10': { amps75C: 35, amps90C: 40, resistance: 0.999, costPerFoot: 0.55 },
    '8': { amps75C: 50, amps90C: 55, resistance: 0.628, costPerFoot: 0.85 },
    '6': { amps75C: 65, amps90C: 75, resistance: 0.395, costPerFoot: 1.25 },
    '4': { amps75C: 85, amps90C: 95, resistance: 0.249, costPerFoot: 1.85 },
    '2': { amps75C: 115, amps90C: 130, resistance: 0.156, costPerFoot: 2.85 },
    '1': { amps75C: 130, amps90C: 150, resistance: 0.124, costPerFoot: 3.5 },
    '1/0': { amps75C: 150, amps90C: 170, resistance: 0.098, costPerFoot: 4.25 },
    '2/0': { amps75C: 175, amps90C: 195, resistance: 0.078, costPerFoot: 5.25 },
    '4/0': { amps75C: 230, amps90C: 260, resistance: 0.049, costPerFoot: 8.5 },
  };

  const temperatureDerating = {
    '86': 1.0, // 30°C
    '95': 0.91, // 35°C
    '104': 0.82, // 40°C
    '113': 0.71, // 45°C
    '122': 0.58, // 50°C
  };

  const calculateWireGauge = (
    current: number,
    distance: number,
    voltage: number,
    maxVoltageDrop: number
  ) => {
    // Calculate minimum wire gauge based on ampacity and voltage drop
    const tempDerating =
      temperatureDerating[inputs.ambientTemperature as keyof typeof temperatureDerating] || 1.0;

    for (const [gauge, specs] of Object.entries(wireSpecs)) {
      const adjustedAmpacity =
        (parseInt(inputs.temperatureRating) >= 90 ? specs.amps90C : specs.amps75C) * tempDerating;

      // Check ampacity
      if (adjustedAmpacity >= current * 1.25) {
        // 125% safety factor per NEC
        // Check voltage drop
        const voltageDrop = ((2 * current * distance * specs.resistance) / (1000 * voltage)) * 100;

        if (voltageDrop <= maxVoltageDrop) {
          return { gauge, voltageDrop, ampacity: adjustedAmpacity };
        }
      }
    }

    return { gauge: '4/0', voltageDrop: 0, ampacity: 0 }; // Fallback to largest wire
  };

  const calculateElectricalRequirements = () => {
    const solarWatts = parseFloat(inputs.solarPanelWatts);
    const systemVoltage = parseInt(inputs.systemVoltage);
    const inverterWatts = parseFloat(inputs.inverterWatts);
    const voltageDropLimit = parseFloat(inputs.voltageDropLimit);

    if (!solarWatts || !inverterWatts) return;

    // Calculate currents
    const solarCurrent = solarWatts / systemVoltage;
    const chargeCurrent = solarCurrent * 1.25; // Maximum charge current
    const dischargeCurrent = inverterWatts / (systemVoltage * 0.85); // Account for inverter inefficiency

    // Wire sizing calculations
    const panelToController = calculateWireGauge(
      chargeCurrent,
      parseFloat(inputs.panelToControllerDistance),
      systemVoltage,
      voltageDropLimit
    );

    const controllerToBattery = calculateWireGauge(
      chargeCurrent,
      parseFloat(inputs.controllerToBatteryDistance),
      systemVoltage,
      voltageDropLimit
    );

    const batteryToInverter = calculateWireGauge(
      dischargeCurrent,
      parseFloat(inputs.batteryToInverterDistance),
      systemVoltage,
      voltageDropLimit
    );

    const inverterToPanel = calculateWireGauge(
      inverterWatts / 240, // Assuming 240V AC
      parseFloat(inputs.inverterToPanelDistance),
      240,
      voltageDropLimit
    );

    // Fuse and breaker sizing
    const panelFuseSize = Math.ceil(solarCurrent * 1.56); // 156% per NEC 690.8
    const batteryFuseSize = Math.ceil(dischargeCurrent * 1.25);
    const inverterFuseSize = Math.ceil(dischargeCurrent * 1.25);
    const mainBreakerSize = Math.ceil((inverterWatts / 240) * 1.25);

    // Calculate costs
    const totalWireLength =
      parseFloat(inputs.panelToControllerDistance) * 2 + // DC+/DC-
      parseFloat(inputs.controllerToBatteryDistance) * 2 +
      parseFloat(inputs.batteryToInverterDistance) * 2 +
      parseFloat(inputs.inverterToPanelDistance) * 3; // Hot/Neutral/Ground

    const avgWireCost =
      (wireSpecs[panelToController.gauge as keyof typeof wireSpecs]?.costPerFoot || 1) +
      (wireSpecs[controllerToBattery.gauge as keyof typeof wireSpecs]?.costPerFoot || 1) +
      (wireSpecs[batteryToInverter.gauge as keyof typeof wireSpecs]?.costPerFoot || 1) +
      (wireSpecs[inverterToPanel.gauge as keyof typeof wireSpecs]?.costPerFoot || 1);

    // Safety compliance checklist
    const safetyCompliance = [
      'NEC 690 - Solar Photovoltaic Systems',
      'NEC 705 - Interconnected Electric Power Production Sources',
      'Rapid shutdown requirements (NEC 690.12)',
      'Arc-fault circuit protection (NEC 690.11)',
      'Ground-fault protection (NEC 690.5)',
      'Equipment grounding (NEC 690.43)',
      'System grounding (NEC 690.41)',
      'Disconnecting means (NEC 690.13-690.17)',
      'Overcurrent protection (NEC 690.9)',
    ];

    const electricalResults: ElectricalResults = {
      dcWiring: {
        panelToController: {
          distance: parseFloat(inputs.panelToControllerDistance),
          wireGauge: panelToController.gauge + ' AWG',
          voltageDrop: panelToController.voltageDrop,
        },
        controllerToBattery: {
          distance: parseFloat(inputs.controllerToBatteryDistance),
          wireGauge: controllerToBattery.gauge + ' AWG',
          voltageDrop: controllerToBattery.voltageDrop,
        },
        batteryToInverter: {
          distance: parseFloat(inputs.batteryToInverterDistance),
          wireGauge: batteryToInverter.gauge + ' AWG',
          voltageDrop: batteryToInverter.voltageDrop,
        },
      },
      acWiring: {
        inverterToPanel: {
          distance: parseFloat(inputs.inverterToPanelDistance),
          wireGauge: inverterToPanel.gauge + ' AWG',
          voltageDrop: inverterToPanel.voltageDrop,
        },
      },
      protection: {
        dcFuses: {
          panelFuse: panelFuseSize + 'A',
          batteryFuse: batteryFuseSize + 'A',
          inverterFuse: inverterFuseSize + 'A',
        },
        acBreakers: {
          mainBreaker: mainBreakerSize + 'A',
          branchBreakers: ['20A GFCI', '20A AFCI'],
        },
      },
      grounding: {
        groundingElectrode: '#6 AWG copper to ground rod',
        equipmentGround: '#12 AWG equipment grounding conductor',
        dcGrounding: systemVoltage > 48 ? 'Required' : 'Optional',
      },
      conduit: {
        dcConduit: systemVoltage > 30 ? 'Required in wet locations' : 'Recommended',
        acConduit: 'Required per NEC',
      },
      totalWireCost: totalWireLength * (avgWireCost / 4),
      safetyCompliance,
    };

    setResults(electricalResults);
    setShowRecommendations(true);
  };

  const generateElectricalRecommendations = () => {
    if (!results) return [];

    const recommendations = [];

    // Wire and electrical components
    recommendations.push({
      category: 'DC Wiring Kit',
      items: [
        {
          name: 'Solar Panel DC Wire Kit',
          description: `${results.dcWiring.panelToController.wireGauge} THWN-2 wire, MC4 connectors`,
          price: 85,
          affiliate: 'https://amzn.to/solar-dc-wire-kit',
        },
        {
          name: 'Battery Interconnect Cables',
          description: `${results.dcWiring.batteryToInverter.wireGauge} welding cable with lugs`,
          price: 65,
          affiliate: 'https://amzn.to/battery-cables',
        },
      ],
    });

    recommendations.push({
      category: 'Overcurrent Protection',
      items: [
        {
          name: 'DC Fuse Kit',
          description: `${results.protection.dcFuses.panelFuse} and ${results.protection.dcFuses.batteryFuse} fuses with holders`,
          price: 45,
          affiliate: 'https://amzn.to/dc-fuse-kit',
        },
        {
          name: 'AC Disconnect Box',
          description: `${results.protection.acBreakers.mainBreaker} main breaker with GFCI`,
          price: 125,
          affiliate: 'https://amzn.to/ac-disconnect',
        },
      ],
    });

    recommendations.push({
      category: 'Safety & Monitoring',
      items: [
        {
          name: 'Grounding Kit',
          description: 'Equipment grounding conductors, ground rods, clamps',
          price: 75,
          affiliate: 'https://amzn.to/grounding-kit',
        },
        {
          name: 'System Monitor',
          description: 'DC current/voltage display with shunt',
          price: 95,
          affiliate: 'https://amzn.to/system-monitor',
        },
      ],
    });

    return recommendations;
  };

  const electricalRecommendations = results ? generateElectricalRecommendations() : [];
  const totalEstimatedCost = electricalRecommendations.reduce(
    (total, category) =>
      total + category.items.reduce((catTotal, item) => catTotal + item.price, 0),
    0
  );

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
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Electrical & Wire Calculator</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Critical safety calculations for wire sizing, overcurrent protection, and NEC
            compliance. Ensure your solar installation meets electrical code requirements.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            {/* System Specifications */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">System Specifications</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Solar Panel Watts</label>
                    <input
                      type="number"
                      placeholder="e.g., 800"
                      value={inputs.solarPanelWatts}
                      onChange={(e) => setInputs({ ...inputs, solarPanelWatts: e.target.value })}
                      className="w-full rounded border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">System Voltage</label>
                    <select
                      value={inputs.systemVoltage}
                      onChange={(e) => setInputs({ ...inputs, systemVoltage: e.target.value })}
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="12">12V DC</option>
                      <option value="24">24V DC</option>
                      <option value="48">48V DC</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Inverter Watts</label>
                    <input
                      type="number"
                      placeholder="e.g., 2000"
                      value={inputs.inverterWatts}
                      onChange={(e) => setInputs({ ...inputs, inverterWatts: e.target.value })}
                      className="w-full rounded border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Battery Capacity (Ah)</label>
                    <input
                      type="number"
                      placeholder="e.g., 400"
                      value={inputs.batteryAh}
                      onChange={(e) => setInputs({ ...inputs, batteryAh: e.target.value })}
                      className="w-full rounded border px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Installation Distances */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Wire Run Distances</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Panels to Charge Controller (ft)
                    </label>
                    <input
                      type="number"
                      value={inputs.panelToControllerDistance}
                      onChange={(e) =>
                        setInputs({ ...inputs, panelToControllerDistance: e.target.value })
                      }
                      className="w-full rounded border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Controller to Battery (ft)
                    </label>
                    <input
                      type="number"
                      value={inputs.controllerToBatteryDistance}
                      onChange={(e) =>
                        setInputs({ ...inputs, controllerToBatteryDistance: e.target.value })
                      }
                      className="w-full rounded border px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Battery to Inverter (ft)
                    </label>
                    <input
                      type="number"
                      value={inputs.batteryToInverterDistance}
                      onChange={(e) =>
                        setInputs({ ...inputs, batteryToInverterDistance: e.target.value })
                      }
                      className="w-full rounded border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Inverter to AC Panel (ft)
                    </label>
                    <input
                      type="number"
                      value={inputs.inverterToPanelDistance}
                      onChange={(e) =>
                        setInputs({ ...inputs, inverterToPanelDistance: e.target.value })
                      }
                      className="w-full rounded border px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Installation Parameters */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Installation Parameters</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Installation Type</label>
                    <select
                      value={inputs.installationType}
                      onChange={(e) => setInputs({ ...inputs, installationType: e.target.value })}
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="residential">Residential</option>
                      <option value="rv">RV/Mobile</option>
                      <option value="marine">Marine/Boat</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Ambient Temperature (°F)
                    </label>
                    <select
                      value={inputs.ambientTemperature}
                      onChange={(e) => setInputs({ ...inputs, ambientTemperature: e.target.value })}
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="86">86°F (30°C) - Normal</option>
                      <option value="95">95°F (35°C) - Warm</option>
                      <option value="104">104°F (40°C) - Hot</option>
                      <option value="113">113°F (45°C) - Very Hot</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Voltage Drop Limit (%)</label>
                    <select
                      value={inputs.voltageDropLimit}
                      onChange={(e) => setInputs({ ...inputs, voltageDropLimit: e.target.value })}
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="2">2% (Optimal)</option>
                      <option value="3">3% (Good)</option>
                      <option value="5">5% (Acceptable)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Code Compliance</label>
                    <select
                      value={inputs.codeCompliance}
                      onChange={(e) => setInputs({ ...inputs, codeCompliance: e.target.value })}
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="nec2023">NEC 2023</option>
                      <option value="nec2020">NEC 2020</option>
                      <option value="local">Local Codes</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={calculateElectricalRequirements}
                disabled={!inputs.solarPanelWatts || !inputs.inverterWatts}
                className="mt-4 w-full rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Calculate Electrical Requirements
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results && (
              <>
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-xl font-semibold">Wire Sizing Results</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 text-sm font-semibold">DC Wiring</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Panel to Controller:</span>
                          <span>
                            {results.dcWiring.panelToController.wireGauge} (
                            {results.dcWiring.panelToController.voltageDrop.toFixed(1)}% drop)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Controller to Battery:</span>
                          <span>
                            {results.dcWiring.controllerToBattery.wireGauge} (
                            {results.dcWiring.controllerToBattery.voltageDrop.toFixed(1)}% drop)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Battery to Inverter:</span>
                          <span className="font-semibold text-primary">
                            {results.dcWiring.batteryToInverter.wireGauge} (
                            {results.dcWiring.batteryToInverter.voltageDrop.toFixed(1)}% drop)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-sm font-semibold">AC Wiring</h3>
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Inverter to Panel:</span>
                          <span>
                            {results.acWiring.inverterToPanel.wireGauge} (
                            {results.acWiring.inverterToPanel.voltageDrop.toFixed(1)}% drop)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-xl font-semibold">Overcurrent Protection</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Solar Panel Fuse:</span>
                      <span className="font-semibold">{results.protection.dcFuses.panelFuse}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Battery Fuse:</span>
                      <span className="font-semibold">
                        {results.protection.dcFuses.batteryFuse}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inverter Fuse:</span>
                      <span className="font-semibold">
                        {results.protection.dcFuses.inverterFuse}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Main AC Breaker:</span>
                      <span className="font-semibold">
                        {results.protection.acBreakers.mainBreaker}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-xl font-semibold">Safety Compliance</h2>
                  <div className="space-y-2 text-xs">
                    {results.safetyCompliance.slice(0, 6).map((requirement, index) => (
                      <div key={index} className="flex items-start">
                        <span className="mr-2 text-green-600">✅</span>
                        <span>{requirement}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-orange-600">
                    ⚠️ Professional installation and inspection recommended
                  </p>
                </div>
              </>
            )}

            {showRecommendations && electricalRecommendations.length > 0 && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">⚡ Electrical Components</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Code-compliant electrical components for safe installation:
                </p>

                <div className="space-y-4">
                  {electricalRecommendations.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h3 className="mb-2 font-semibold">{category.category}</h3>
                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="rounded border bg-background p-3">
                            <div className="mb-1 flex items-start justify-between">
                              <div className="text-sm font-medium">{item.name}</div>
                              <div className="text-sm font-semibold">${item.price}</div>
                            </div>
                            <div className="mb-2 text-xs text-muted-foreground">
                              {item.description}
                            </div>
                            <a
                              href={item.affiliate}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block rounded bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90"
                            >
                              View Product →
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total Electrical Components:</span>
                    <span>${totalEstimatedCost}</span>
                  </div>
                </div>
              </div>
            )}

            {showRecommendations && (
              <div className="rounded-lg border bg-gradient-to-br from-green-100 to-primary/10 p-6">
                <h3 className="mb-2 text-lg font-semibold">🎯 System Complete!</h3>
                <div className="space-y-2 text-sm">
                  <div>✅ Load analysis and power requirements</div>
                  <div>✅ Solar panel sizing and configuration</div>
                  <div>✅ Battery storage and backup duration</div>
                  <div>✅ Inverter sizing for AC conversion</div>
                  <div>✅ Electrical safety and code compliance</div>
                </div>
                <div className="mt-4 space-y-2">
                  <Link
                    href="/solar-calculators/system-designer"
                    className="block rounded bg-primary px-4 py-2 text-center text-primary-foreground hover:bg-primary/90"
                  >
                    Create Complete System Design →
                  </Link>
                  <p className="text-center text-xs text-muted-foreground">
                    Generate comprehensive shopping basket with installation guide
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
