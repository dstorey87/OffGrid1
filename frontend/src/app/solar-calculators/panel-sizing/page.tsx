'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PanelResults {
  dailySolarProduction: number;
  panelsNeeded: number;
  systemSizeKw: number;
  monthlyProduction: number[];
  roofAreaNeeded: number;
  annualProduction: number;
  panelConfiguration: {
    strings: number;
    panelsPerString: number;
    totalPanels: number;
  };
}

interface SolarData {
  // Average daily solar irradiance by month (kWh/m²/day) - example for mid-latitude
  irradiance: number[];
  peakSunHours: number;
  climateFactor: number;
}

export default function PanelSizingCalculator() {
  const [location, setLocation] = useState({
    zipCode: '',
    latitude: '',
    longitude: '',
    selectedLocation: '',
  });

  const [systemInputs, setSystemInputs] = useState({
    dailyEnergyNeed: '',
    roofOrientation: 'south',
    roofTilt: '30',
    shadingFactor: 'none',
    panelWattage: '400',
    systemVoltage: '24',
    futureExpansion: '0',
  });

  const [results, setResults] = useState<PanelResults | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Solar irradiance data by region (simplified - in real app would use API)
  const solarData: Record<string, SolarData> = {
    southwest: {
      irradiance: [3.2, 4.1, 5.3, 6.4, 7.2, 7.8, 7.5, 6.9, 5.8, 4.6, 3.5, 2.9],
      peakSunHours: 5.5,
      climateFactor: 0.95,
    },
    southeast: {
      irradiance: [2.8, 3.6, 4.8, 5.8, 6.3, 6.8, 6.5, 6.0, 5.1, 4.2, 3.1, 2.6],
      peakSunHours: 4.8,
      climateFactor: 0.9,
    },
    northeast: {
      irradiance: [1.8, 2.6, 3.8, 4.6, 5.4, 5.8, 5.6, 5.0, 4.0, 2.9, 2.0, 1.5],
      peakSunHours: 3.8,
      climateFactor: 0.85,
    },
    northwest: {
      irradiance: [1.2, 2.0, 3.2, 4.4, 5.6, 6.2, 6.8, 5.9, 4.3, 2.8, 1.6, 1.0],
      peakSunHours: 3.5,
      climateFactor: 0.88,
    },
    midwest: {
      irradiance: [2.0, 2.8, 3.9, 4.8, 5.6, 6.1, 5.9, 5.3, 4.2, 3.2, 2.2, 1.7],
      peakSunHours: 4.2,
      climateFactor: 0.87,
    },
    mountain: {
      irradiance: [2.8, 3.8, 5.0, 6.2, 7.0, 7.6, 7.3, 6.7, 5.5, 4.3, 3.2, 2.5],
      peakSunHours: 5.2,
      climateFactor: 0.92,
    },
  };

  const locationOptions = [
    { value: 'southwest', label: 'Southwest US (AZ, NV, CA, NM)' },
    { value: 'southeast', label: 'Southeast US (FL, GA, SC, NC)' },
    { value: 'northeast', label: 'Northeast US (NY, NJ, CT, MA)' },
    { value: 'northwest', label: 'Northwest US (WA, OR, ID)' },
    { value: 'midwest', label: 'Midwest US (IL, IN, OH, MI)' },
    { value: 'mountain', label: 'Mountain West (CO, UT, WY, MT)' },
  ];

  const shadingFactors = {
    none: { factor: 1.0, label: 'No shading' },
    light: { factor: 0.9, label: 'Light shading (2-3 hours/day)' },
    moderate: { factor: 0.8, label: 'Moderate shading (4-5 hours/day)' },
    heavy: { factor: 0.6, label: 'Heavy shading (6+ hours/day)' },
  };

  const orientationFactors = {
    south: 1.0,
    southeast: 0.95,
    southwest: 0.95,
    east: 0.85,
    west: 0.85,
    north: 0.6,
  };

  const tiltFactors = {
    0: 0.87, // Flat
    15: 0.95, // Low tilt
    30: 1.0, // Optimal for most locations
    45: 0.97, // High tilt
    90: 0.7, // Vertical
  };

  const calculatePanelNeeds = () => {
    const dailyNeed = parseFloat(systemInputs.dailyEnergyNeed);
    const panelWatts = parseInt(systemInputs.panelWattage);
    const tilt = parseInt(systemInputs.roofTilt);
    const futureExpansion = parseFloat(systemInputs.futureExpansion) / 100;

    if (!location.selectedLocation || !dailyNeed) return;

    const solarRegion = solarData[location.selectedLocation];

    // Apply derating factors
    const orientationFactor =
      orientationFactors[systemInputs.roofOrientation as keyof typeof orientationFactors];
    const tiltFactor = tiltFactors[tilt as keyof typeof tiltFactors] || 1.0;
    const shadingFactor =
      shadingFactors[systemInputs.shadingFactor as keyof typeof shadingFactors].factor;
    const systemEfficiency = 0.85; // Inverter, wiring, and other losses

    // Calculate total derating
    const totalDerating =
      orientationFactor * tiltFactor * shadingFactor * systemEfficiency * solarRegion.climateFactor;

    // Calculate daily solar production per panel
    const panelKw = panelWatts / 1000;
    const dailyProductionPerPanel = panelKw * solarRegion.peakSunHours * totalDerating;

    // Calculate panels needed (including future expansion)
    const adjustedDailyNeed = dailyNeed * (1 + futureExpansion);
    const panelsNeeded = Math.ceil(adjustedDailyNeed / dailyProductionPerPanel);

    // System specifications
    const systemSizeKw = (panelsNeeded * panelWatts) / 1000;
    const dailySolarProduction = panelsNeeded * dailyProductionPerPanel;

    // Monthly production
    const monthlyProduction = solarRegion.irradiance.map((irradiance) => {
      const monthlyFactor = irradiance / solarRegion.peakSunHours;
      return dailySolarProduction * monthlyFactor * 30; // Approximate days per month
    });

    const annualProduction = monthlyProduction.reduce((sum, month) => sum + month, 0);

    // Panel configuration for string sizing
    const systemVoltage = parseInt(systemInputs.systemVoltage);
    const panelVoltage = systemVoltage === 12 ? 12 : systemVoltage === 24 ? 24 : 48;
    const maxPanelsPerString = Math.floor(600 / 40); // Max 600V system, ~40V per panel
    const strings = Math.ceil(panelsNeeded / maxPanelsPerString);
    const panelsPerString = Math.ceil(panelsNeeded / strings);

    // Roof area calculation (typical panel: 2m x 1m)
    const roofAreaNeeded = panelsNeeded * 2; // Square meters

    const panelResults: PanelResults = {
      dailySolarProduction,
      panelsNeeded,
      systemSizeKw,
      monthlyProduction,
      roofAreaNeeded,
      annualProduction,
      panelConfiguration: {
        strings,
        panelsPerString,
        totalPanels: panelsNeeded,
      },
    };

    setResults(panelResults);
    setShowRecommendations(true);
  };

  const generatePanelRecommendations = () => {
    if (!results) return [];

    const recommendations = [];
    const panelWatts = parseInt(systemInputs.panelWattage);

    // Budget Option
    recommendations.push({
      tier: 'Budget',
      brand: 'Renogy',
      model: `${panelWatts}W Monocrystalline Solar Panel`,
      quantity: results.panelsNeeded,
      pricePerPanel: panelWatts === 400 ? 180 : panelWatts === 300 ? 140 : 220,
      efficiency: '20-21%',
      warranty: '25 years',
      affiliate: 'https://amzn.to/renogy-panels',
      features: ['Reliable performance', 'Good warranty', 'Budget-friendly'],
    });

    // Mid-Range Option
    recommendations.push({
      tier: 'Mid-Range',
      brand: 'AIMS Power',
      model: `${panelWatts}W High Efficiency Monocrystalline`,
      quantity: results.panelsNeeded,
      pricePerPanel: panelWatts === 400 ? 220 : panelWatts === 300 ? 170 : 260,
      efficiency: '21-22%',
      warranty: '25 years',
      affiliate: 'https://amzn.to/aims-panels',
      features: ['Higher efficiency', 'Better low-light performance', 'Durable frame'],
    });

    // Premium Option
    recommendations.push({
      tier: 'Premium',
      brand: 'Goal Zero',
      model: `${panelWatts}W Boulder Solar Panel`,
      quantity: results.panelsNeeded,
      pricePerPanel: panelWatts === 400 ? 280 : panelWatts === 300 ? 210 : 320,
      efficiency: '22-23%',
      warranty: '25 years',
      affiliate: 'https://amzn.to/goalzero-panels',
      features: ['Maximum efficiency', 'Premium build quality', 'Excellent customer support'],
    });

    return recommendations;
  };

  const panelRecommendations = results ? generatePanelRecommendations() : [];

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
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Solar Panel Sizing Calculator</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Calculate exactly how many solar panels you need based on your location, roof
            characteristics, and energy requirements. Get specific product recommendations.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Location Selection */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Location & Climate</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Select Your Region</label>
                  <select
                    value={location.selectedLocation}
                    onChange={(e) => setLocation({ ...location, selectedLocation: e.target.value })}
                    className="w-full rounded border px-3 py-2"
                  >
                    <option value="">Choose your region...</option>
                    {locationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>
                    💡 <strong>Tip:</strong> More precise location data gives better accuracy. We
                    use regional solar irradiance data and climate factors for calculations.
                  </p>
                </div>
              </div>
            </div>

            {/* System Requirements */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Energy Requirements</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Daily Energy Need (kWh)
                    <span className="text-muted-foreground">- from Load Analysis Calculator</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 8.5"
                    value={systemInputs.dailyEnergyNeed}
                    onChange={(e) =>
                      setSystemInputs({ ...systemInputs, dailyEnergyNeed: e.target.value })
                    }
                    className="w-full rounded border px-3 py-2"
                  />
                  <div className="mt-2 text-sm">
                    <Link
                      href="/solar-calculators/load-analysis"
                      className="text-primary hover:underline"
                    >
                      → Don't know your daily energy need? Use Load Analysis Calculator first
                    </Link>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Future Expansion (%)</label>
                  <select
                    value={systemInputs.futureExpansion}
                    onChange={(e) =>
                      setSystemInputs({ ...systemInputs, futureExpansion: e.target.value })
                    }
                    className="w-full rounded border px-3 py-2"
                  >
                    <option value="0">No expansion planned</option>
                    <option value="25">25% - Some growth expected</option>
                    <option value="50">50% - Significant expansion planned</option>
                    <option value="100">100% - Double capacity for future</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Roof Characteristics */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Roof & Installation Details</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Roof Orientation</label>
                    <select
                      value={systemInputs.roofOrientation}
                      onChange={(e) =>
                        setSystemInputs({ ...systemInputs, roofOrientation: e.target.value })
                      }
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="south">South (Best)</option>
                      <option value="southeast">Southeast</option>
                      <option value="southwest">Southwest</option>
                      <option value="east">East</option>
                      <option value="west">West</option>
                      <option value="north">North (Least optimal)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Roof Tilt (degrees)</label>
                    <select
                      value={systemInputs.roofTilt}
                      onChange={(e) =>
                        setSystemInputs({ ...systemInputs, roofTilt: e.target.value })
                      }
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="0">0° (Flat)</option>
                      <option value="15">15° (Low slope)</option>
                      <option value="30">30° (Optimal)</option>
                      <option value="45">45° (Steep)</option>
                      <option value="90">90° (Vertical)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Shading Conditions</label>
                  <select
                    value={systemInputs.shadingFactor}
                    onChange={(e) =>
                      setSystemInputs({ ...systemInputs, shadingFactor: e.target.value })
                    }
                    className="w-full rounded border px-3 py-2"
                  >
                    <option value="none">No shading</option>
                    <option value="light">Light shading (2-3 hours/day)</option>
                    <option value="moderate">Moderate shading (4-5 hours/day)</option>
                    <option value="heavy">Heavy shading (6+ hours/day)</option>
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Panel Wattage</label>
                    <select
                      value={systemInputs.panelWattage}
                      onChange={(e) =>
                        setSystemInputs({ ...systemInputs, panelWattage: e.target.value })
                      }
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="300">300W (Budget)</option>
                      <option value="400">400W (Standard)</option>
                      <option value="500">500W (High Power)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">System Voltage</label>
                    <select
                      value={systemInputs.systemVoltage}
                      onChange={(e) =>
                        setSystemInputs({ ...systemInputs, systemVoltage: e.target.value })
                      }
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="12">12V (Small systems)</option>
                      <option value="24">24V (Medium systems)</option>
                      <option value="48">48V (Large systems)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={calculatePanelNeeds}
                disabled={!location.selectedLocation || !systemInputs.dailyEnergyNeed}
                className="mt-4 w-full rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Calculate Panel Requirements
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Panel Sizing Results</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Panels Needed:</span>
                    <span className="font-semibold text-primary">
                      {results.panelsNeeded} panels
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>System Size:</span>
                    <span className="font-semibold">{results.systemSizeKw.toFixed(1)} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Production:</span>
                    <span className="font-semibold">
                      {results.dailySolarProduction.toFixed(1)} kWh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Production:</span>
                    <span className="font-semibold">{results.annualProduction.toFixed(0)} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Roof Area Needed:</span>
                    <span className="font-semibold">{results.roofAreaNeeded} m²</span>
                  </div>

                  <div className="border-t pt-3">
                    <h3 className="mb-2 font-semibold">Panel Configuration:</h3>
                    <div className="space-y-1 text-sm">
                      <div>Strings: {results.panelConfiguration.strings}</div>
                      <div>Panels per string: {results.panelConfiguration.panelsPerString}</div>
                      <div>Total panels: {results.panelConfiguration.totalPanels}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showRecommendations && panelRecommendations.length > 0 && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">🛒 Recommended Solar Panels</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Based on your requirements, here are the best panel options with affiliate links:
                </p>

                <div className="space-y-4">
                  {panelRecommendations.map((rec, index) => (
                    <div key={index} className="rounded border bg-background p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <div className="font-semibold">{rec.tier} Option</div>
                          <div className="text-sm text-muted-foreground">
                            {rec.brand} - {rec.model}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${rec.pricePerPanel}/panel</div>
                          <div className="text-sm text-muted-foreground">
                            Total: ${(rec.pricePerPanel * rec.quantity).toFixed(0)}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 text-sm">
                        <div>Quantity needed: {rec.quantity} panels</div>
                        <div>
                          Efficiency: {rec.efficiency} | Warranty: {rec.warranty}
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
                        View {rec.tier} Panels →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showRecommendations && (
              <div className="rounded-lg border bg-gradient-to-br from-accent/10 to-primary/10 p-6">
                <h3 className="mb-2 text-lg font-semibold">Next Steps</h3>
                <div className="space-y-2 text-sm">
                  <div>✅ Calculated your panel requirements</div>
                  <div>🔋 Size battery storage for backup power</div>
                  <div>⚙️ Calculate inverter requirements</div>
                  <div>⚡ Verify electrical components and wiring</div>
                  <div>🎯 Create complete system design</div>
                </div>
                <div className="mt-4 space-y-2">
                  <Link
                    href="/solar-calculators/battery-sizing"
                    className="block rounded bg-primary px-4 py-2 text-center text-primary-foreground hover:bg-primary/90"
                  >
                    Continue to Battery Calculator →
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
