'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BatteryIcon, TargetIcon, EnergyIcon } from '@/components/icons';
import { ContentGate } from '@/components/ContentGate';

export default function DIYBatteryBuildingGuide() {
  const [configCalculator, setConfigCalculator] = useState({
    systemVoltage: '48',
    capacityKwh: '10',
    cellType: '18650',
  });

  const [calculatedConfig, setCalculatedConfig] = useState<{
    seriesCells: number;
    parallelGroups: number;
    totalCells: number;
    configuration: string;
    estimatedCost: number;
  } | null>(null);

  const cellSpecs = {
    '18650': { capacity: 3.0, voltage: 3.6, costPerCell: 3.5, name: '18650 (3000mAh)' },
    '21700': { capacity: 4.8, voltage: 3.6, costPerCell: 5.0, name: '21700 (4800mAh)' },
    lifepo4: { capacity: 3.2, voltage: 3.2, costPerCell: 4.2, name: 'LiFePO4 32650' },
  };

  const calculateConfiguration = () => {
    const voltage = parseInt(configCalculator.systemVoltage);
    const capacityWh = parseFloat(configCalculator.capacityKwh) * 1000;
    const cellType = configCalculator.cellType as keyof typeof cellSpecs;
    const cell = cellSpecs[cellType];

    // Calculate series cells for voltage
    const seriesCells = Math.ceil(voltage / cell.voltage);
    const actualVoltage = seriesCells * cell.voltage;

    // Calculate parallel groups for capacity
    const capacityPerCell = cell.capacity; // Ah
    const parallelGroups = Math.ceil(capacityWh / (actualVoltage * capacityPerCell));

    const totalCells = seriesCells * parallelGroups;
    const configuration = `${seriesCells}S${parallelGroups}P`;
    const estimatedCost = totalCells * cell.costPerCell;

    setCalculatedConfig({
      seriesCells,
      parallelGroups,
      totalCells,
      configuration,
      estimatedCost: Math.round(estimatedCost),
    });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 py-16">
          <h1 className="mb-4 text-center text-4xl font-bold tracking-tight md:text-5xl">
            How to Build Your Own Solar Battery Bank
            <br />
            <span className="text-primary">Using 18650/21700 Lithium Cells</span>
          </h1>
          <p className="mx-auto max-w-3xl text-center text-lg text-muted-foreground">
            Complete step-by-step guide to building safe, reliable solar battery storage. Save 60%
            compared to commercial batteries while learning valuable skills. Includes safety
            warnings, BMS selection, and assembly instructions.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-background p-4 text-center">
              <div className="text-3xl font-bold text-primary">€400-800</div>
              <div className="text-sm text-muted-foreground">Typical Build Cost (10kWh)</div>
            </div>
            <div className="rounded-lg bg-background p-4 text-center">
              <div className="text-3xl font-bold text-primary">8-12 hours</div>
              <div className="text-sm text-muted-foreground">Build Time (First Build)</div>
            </div>
            <div className="rounded-lg bg-background p-4 text-center">
              <div className="text-3xl font-bold text-primary">60% Savings</div>
              <div className="text-sm text-muted-foreground">vs Commercial Batteries</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Table of Contents */}
        <div className="mb-12 rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold">📋 Table of Contents</h2>
          <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <a href="#why-diy" className="text-primary hover:underline">
              1. Why DIY Battery Banks?
            </a>
            <a href="#safety" className="text-primary hover:underline">
              2. ⚠️ Safety First
            </a>
            <a href="#cell-comparison" className="text-primary hover:underline">
              3. 18650 vs 21700 vs LiFePO4
            </a>
            <a href="#configuration" className="text-primary hover:underline flex items-center gap-2">
              4. Configuration Calculator
              <span className="text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">PRO</span>
            </a>
            <a href="#parts-list" className="text-muted-foreground hover:text-primary flex items-center gap-2">
              5. Complete Parts List
              <span className="text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">PRO</span>
            </a>
            <a href="#assembly" className="text-muted-foreground hover:text-primary flex items-center gap-2">
              6. Step-by-Step Assembly
              <span className="text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">PRO</span>
            </a>
            <a href="#bms-guide" className="text-muted-foreground hover:text-primary flex items-center gap-2">
              7. BMS Selection Guide
              <span className="text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">PRO</span>
            </a>
            <a href="#testing" className="text-muted-foreground hover:text-primary flex items-center gap-2">
              8. Testing & Validation
              <span className="text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-0.5 rounded-full font-semibold">EXPERT</span>
            </a>
            <a href="#troubleshooting" className="text-muted-foreground hover:text-primary flex items-center gap-2">
              9. Troubleshooting
              <span className="text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-0.5 rounded-full font-semibold">EXPERT</span>
            </a>
            <a href="#solar-integration" className="text-muted-foreground hover:text-primary flex items-center gap-2">
              10. Solar Integration
              <span className="text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-0.5 rounded-full font-semibold">EXPERT</span>
            </a>
            <a href="#maintenance" className="text-muted-foreground hover:text-primary flex items-center gap-2">
              11. Maintenance
              <span className="text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-0.5 rounded-full font-semibold">EXPERT</span>
            </a>
            <a href="#cost-analysis" className="text-muted-foreground hover:text-primary flex items-center gap-2">
              12. Cost Analysis
            </a>
          </nav>
        </div>

        {/* Safety Warning Banner */}
        <div className="mb-12 rounded-lg border-2 border-red-500 bg-red-50 p-6 dark:bg-red-950/20">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚠️</div>
            <div>
              <h3 className="mb-2 text-xl font-bold text-red-600 dark:text-red-400">
                CRITICAL SAFETY WARNING
              </h3>
              <p className="mb-2 text-red-700 dark:text-red-300">
                Building lithium battery packs involves serious fire and electric shock hazards.
                Lithium cells can explode or catch fire if mishandled. This guide is for
                educational purposes only.
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-red-700 dark:text-red-300">
                <li>Work in well-ventilated area with fire extinguisher nearby</li>
                <li>Never short-circuit cells or connect wrong polarity</li>
                <li>Always use proper BMS protection</li>
                <li>Wear safety glasses and insulated gloves</li>
                <li>If unsure, consult with professionals</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 1: Why DIY? */}
        <section id="why-diy" className="mb-12">
          <h2 className="mb-6 text-3xl font-bold">Why Build Your Own Solar Battery Bank?</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-green-600">
                ✅ Advantages
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">💰</span>
                  <span>
                    <strong>Huge Cost Savings:</strong> 50-70% cheaper than commercial batteries
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">🔧</span>
                  <span>
                    <strong>Full Customization:</strong> Build exactly the capacity and voltage you
                    need
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">📚</span>
                  <span>
                    <strong>Learning Experience:</strong> Understand battery technology deeply
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">🔄</span>
                  <span>
                    <strong>Repairability:</strong> Replace individual cells instead of entire
                    battery
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">📈</span>
                  <span>
                    <strong>Scalability:</strong> Easily expand capacity by adding parallel packs
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-orange-600">
                ⚠️ Challenges
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">🔥</span>
                  <span>
                    <strong>Safety Risks:</strong> Fire hazard if built incorrectly
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">⏱️</span>
                  <span>
                    <strong>Time Investment:</strong> 8-12 hours for first build
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">🛠️</span>
                  <span>
                    <strong>Tool Requirements:</strong> Need spot welder or soldering skills
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">⚡</span>
                  <span>
                    <strong>No Warranty:</strong> DIY builds aren&apos;t covered by manufacturer
                    warranty
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">📋</span>
                  <span>
                    <strong>Regulatory:</strong> May void insurance/electrical permits in some areas
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Cost Comparison Table */}
          <div className="mt-6 rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-xl font-semibold">💵 Cost Comparison: DIY vs Commercial</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left">Capacity</th>
                    <th className="p-3 text-right">DIY Cost</th>
                    <th className="p-3 text-right">Commercial Cost</th>
                    <th className="p-3 text-right">Savings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">5 kWh (Small System)</td>
                    <td className="p-3 text-right font-semibold">€250-400</td>
                    <td className="p-3 text-right">€1,200-1,800</td>
                    <td className="p-3 text-right text-green-600">€800-1,400</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">10 kWh (Medium System)</td>
                    <td className="p-3 text-right font-semibold">€450-750</td>
                    <td className="p-3 text-right">€2,400-3,600</td>
                    <td className="p-3 text-right text-green-600">€1,650-3,150</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">20 kWh (Large System)</td>
                    <td className="p-3 text-right font-semibold">€900-1,500</td>
                    <td className="p-3 text-right">€4,800-7,200</td>
                    <td className="p-3 text-right text-green-600">€3,300-6,300</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              * DIY costs include cells, BMS, nickel strips, and tools. Commercial costs are LiFePO4
              batteries with BMS from major brands.
            </p>
          </div>
        </section>

        {/* Section 2: Safety */}
        <section id="safety" className="mb-12">
          <h2 className="mb-6 text-3xl font-bold">⚠️ Essential Safety Precautions</h2>
          
          <div className="space-y-6">
            <div className="rounded-lg border-2 border-orange-500 bg-orange-50 p-6 dark:bg-orange-950/20">
              <h3 className="mb-3 text-xl font-semibold text-orange-700 dark:text-orange-400">
                Understanding the Risks
              </h3>
              <p className="mb-3">
                Lithium-ion cells store enormous energy in small packages. A single 18650 cell
                contains enough energy to cause severe burns or start a fire if short-circuited.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold">Fire Hazards:</h4>
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    <li>Short circuits can ignite lithium fire (burns at 2000°C)</li>
                    <li>Damaged cells may vent toxic gas before fire</li>
                    <li>Water cannot extinguish lithium fires</li>
                    <li>Fire can spread rapidly between cells</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Electric Shock:</h4>
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    <li>48V batteries can deliver lethal current</li>
                    <li>Always disconnect before working</li>
                    <li>Use insulated tools only</li>
                    <li>Never work on wet surfaces</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-4 text-xl font-semibold">🛡️ Required Safety Equipment</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">👓</span>
                    <div>
                      <strong>Safety Glasses:</strong> ANSI Z87.1 rated for metal fragments
                      <div className="mt-1">
                        <a
                          href="https://amzn.to/safety-glasses-ansi"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          → Buy Safety Glasses (€15-25)
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🧤</span>
                    <div>
                      <strong>Insulated Gloves:</strong> Electrical work rated, cut-resistant
                      <div className="mt-1">
                        <a
                          href="https://amzn.to/insulated-gloves"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          → Buy Insulated Gloves (€20-35)
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🧯</span>
                    <div>
                      <strong>Fire Extinguisher:</strong> Class D (metal fires) or ABC
                      <div className="mt-1">
                        <a
                          href="https://amzn.to/fire-extinguisher-class-d"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          → Buy Fire Extinguisher (€50-80)
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">💨</span>
                    <div>
                      <strong>Ventilation:</strong> Fan or fume extractor for soldering fumes
                      <div className="mt-1">
                        <a
                          href="https://amzn.to/fume-extractor"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          → Buy Fume Extractor (€40-70)
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">📏</span>
                    <div>
                      <strong>Non-Conductive Work Mat:</strong> Prevents accidental shorts
                      <div className="mt-1">
                        <a
                          href="https://amzn.to/esd-mat"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          → Buy ESD Mat (€25-40)
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-4 text-xl font-semibold">🚫 Never Do This!</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                      <strong>Short Circuit Cells:</strong> Never let positive/negative terminals
                      touch metal objects. Can cause instant fire.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                      <strong>Use Damaged Cells:</strong> Dented, swollen, or rusty cells are
                      dangerous. Dispose of properly.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                      <strong>Skip the BMS:</strong> Battery Management System is not optional. It
                      prevents overcharge fires.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                      <strong>Mix Cell Types:</strong> Never mix different capacities, brands, or
                      ages in same pack.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                      <strong>Work Alone First Time:</strong> Have someone nearby who can call
                      emergency services if needed.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                      <strong>Build Indoors Without Ventilation:</strong> Garage or outdoor
                      workspace is safer.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-xl font-semibold">🚨 Emergency Procedures</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <h4 className="mb-2 font-semibold text-red-600">If Cell Starts Smoking:</h4>
                  <ol className="list-inside list-decimal space-y-1 text-sm">
                    <li>Evacuate area immediately</li>
                    <li>Call fire department (toxic fumes)</li>
                    <li>Do NOT use water on lithium fire</li>
                    <li>Use Class D extinguisher or sand</li>
                  </ol>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-orange-600">If You Get Shocked:</h4>
                  <ol className="list-inside list-decimal space-y-1 text-sm">
                    <li>Pull away from power source</li>
                    <li>Disconnect battery immediately</li>
                    <li>Seek medical attention</li>
                    <li>Check for burns or irregular heartbeat</li>
                  </ol>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-yellow-600">If Cell is Swollen:</h4>
                  <ol className="list-inside list-decimal space-y-1 text-sm">
                    <li>Move to outdoor area</li>
                    <li>Place in fireproof container</li>
                    <li>Do not puncture or squeeze</li>
                    <li>Take to battery recycling center</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration Calculator - PREMIUM CONTENT */}
        <ContentGate
          feature="diy-battery-calculator"
          requiredTier="pro"
          title="🧮 Battery Configuration Calculator"
          description="Access the interactive calculator to determine exact cell counts, series/parallel configuration, and cost estimates for your custom battery pack. Pro members get instant calculations plus downloadable BOM templates."
        >
          <section id="configuration" className="mb-12">
            <h2 className="mb-6 text-3xl font-bold">🧮 Battery Configuration Calculator</h2>
          
          <div className="rounded-lg border bg-gradient-to-br from-primary/10 to-accent/10 p-6">
            <p className="mb-6 text-muted-foreground">
              Use this calculator to determine how many cells you need and in what configuration
              (series/parallel) for your battery pack.
            </p>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-medium">System Voltage</label>
                  <select
                    value={configCalculator.systemVoltage}
                    onChange={(e) =>
                      setConfigCalculator({ ...configCalculator, systemVoltage: e.target.value })
                    }
                    className="w-full rounded border px-3 py-2"
                  >
                    <option value="12">12V (Small systems, portable)</option>
                    <option value="24">24V (Medium systems, RVs)</option>
                    <option value="48">48V (Large systems, home backup)</option>
                    <option value="72">72V (Electric vehicles)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-medium">Desired Capacity (kWh)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={configCalculator.capacityKwh}
                    onChange={(e) =>
                      setConfigCalculator({ ...configCalculator, capacityKwh: e.target.value })
                    }
                    className="w-full rounded border px-3 py-2"
                    placeholder="e.g., 10"
                  />
                  <p className="mt-1 text-sm text-muted-foreground">
                    Typical home backup: 10-20 kWh | Off-grid: 20-40 kWh
                  </p>
                </div>

                <div>
                  <label className="mb-2 block font-medium">Cell Type</label>
                  <select
                    value={configCalculator.cellType}
                    onChange={(e) =>
                      setConfigCalculator({ ...configCalculator, cellType: e.target.value })
                    }
                    className="w-full rounded border px-3 py-2"
                  >
                    <option value="18650">18650 (3000mAh) - Most Common</option>
                    <option value="21700">21700 (4800mAh) - Higher Capacity</option>
                    <option value="lifepo4">LiFePO4 32650 - Safest, Longest Life</option>
                  </select>
                </div>

                <button
                  onClick={calculateConfiguration}
                  className="w-full rounded bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Calculate Configuration
                </button>
              </div>

              {calculatedConfig && (
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-4 text-xl font-semibold">Your Battery Configuration:</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Configuration:</span>
                      <span className="text-2xl font-bold text-primary">
                        {calculatedConfig.configuration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cells in Series (Voltage):</span>
                      <span className="font-semibold">{calculatedConfig.seriesCells}S</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cells in Parallel (Capacity):</span>
                      <span className="font-semibold">{calculatedConfig.parallelGroups}P</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Cells Needed:</span>
                      <span className="font-semibold">{calculatedConfig.totalCells} cells</span>
                    </div>
                    <div className="mt-4 flex justify-between border-t pt-2">
                      <span className="text-muted-foreground">Estimated Cell Cost:</span>
                      <span className="text-xl font-bold text-green-600">
                        €{calculatedConfig.estimatedCost}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      + BMS (€80-150) + Nickel strips (€20-30) + Tools (~€200 if needed)
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="mb-2 font-semibold">What This Means:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>
                        • You&apos;ll build <strong>{calculatedConfig.parallelGroups}</strong>{' '}
                        parallel groups
                      </li>
                      <li>
                        • Each group has <strong>{calculatedConfig.seriesCells}</strong> cells in
                        series
                      </li>
                      <li>
                        • Groups are connected in parallel to increase capacity
                      </li>
                      <li>• BMS must support {calculatedConfig.seriesCells}S configuration</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        </ContentGate>

        {/* Continue to next article link */}
        <div className="mt-12 rounded-lg border bg-gradient-to-br from-accent/10 to-primary/10 p-6">
          <p className="mb-4 text-center text-muted-foreground">
            This is a comprehensive guide. Bookmark this page and work through each section
            carefully.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/solar-calculators/battery-sizing"
              className="rounded bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
            >
              Calculate Battery Size Needed →
            </Link>
            <Link
              href="/system-designer"
              className="rounded border px-6 py-3 hover:bg-accent"
            >
              Complete System Designer
            </Link>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 rounded-lg border-2 border-primary bg-primary/5 p-6 text-center">
          <h3 className="mb-2 text-xl font-semibold">📚 Full Guide Coming Soon</h3>
          <p className="text-muted-foreground">
            The complete step-by-step assembly instructions, BMS wiring diagrams, and video
            tutorials are being added. Check back soon or sign up for updates.
          </p>
          <button className="mt-4 rounded bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90">
            Notify Me When Complete
          </button>
        </div>
      </div>
    </main>
  );
}
