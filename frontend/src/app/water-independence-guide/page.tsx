import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function WaterIndependenceGuide() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-6xl">
            Complete Water Independence
            <span className="block text-primary">Visual Guide & Math Breakdown</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Real calculations for 4-person family + 3-acre farm in Portugal
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Badge variant="outline">📊 Complete Math</Badge>
            <Badge variant="outline">🎨 Visual Diagrams</Badge>
            <Badge variant="outline">💡 Creative Solutions</Badge>
          </div>
        </div>

        {/* The Math Breakdown */}
        <Card className="mb-12 border-2 border-primary">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-2xl">📐 The Math Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* Annual Water Needs */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-blue-600">1️⃣ Annual Water Requirements</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-blue-50 p-4">
                  <h4 className="mb-3 font-semibold text-blue-900">🏠 Household (4 people)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-1">
                      <span>Drinking/Cooking:</span>
                      <span className="font-mono">4 × 20L × 365d = 29,200L</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span>Bathing/Showers:</span>
                      <span className="font-mono">4 × 80L × 365d = 116,800L</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span>Toilets (low-flush):</span>
                      <span className="font-mono">4 × 30L × 365d = 43,800L</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span>Laundry/Cleaning:</span>
                      <span className="font-mono">4 × 20L × 365d = 29,200L</span>
                    </div>
                    <div className="flex justify-between border-t-2 border-blue-900 pt-2 font-bold text-blue-900">
                      <span>Household Total:</span>
                      <span className="font-mono">219,000L/year</span>
                    </div>
                    <div className="mt-2 text-xs text-blue-700">
                      💡 With moderate conservation (low-flow): <strong>164,250L/year</strong>
                      <br />
                      💧 With aggressive conservation (composting toilet):{' '}
                      <strong>120,450L/year</strong>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-green-50 p-4">
                  <h4 className="mb-3 font-semibold text-green-900">
                    🌾 Farm (3 acres = 12,140m²)
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-1">
                      <span>Peak Season (May-Sept, 20 weeks):</span>
                      <span className="font-mono">3 × 30,000L × 20 = 1,800,000L</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span>Shoulder Season (Mar-Apr, Oct, 12 weeks):</span>
                      <span className="font-mono">3 × 15,000L × 12 = 540,000L</span>
                    </div>
                    <div className="flex justify-between border-t-2 border-green-900 pt-2 font-bold text-green-900">
                      <span>Farm Total:</span>
                      <span className="font-mono">2,340,000L/year</span>
                    </div>
                    <div className="mt-2 text-xs text-green-700">
                      💡 With drip irrigation (90% efficiency):{' '}
                      <strong>2,600,000L/year needed</strong>
                      <br />
                      🌊 With flood irrigation (50% efficiency):{' '}
                      <strong>4,680,000L/year needed</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border-4 border-orange-400 bg-orange-50 p-6 text-center">
                <div className="text-3xl font-bold text-orange-900">
                  TOTAL ANNUAL NEED: 2,559,000 Liters
                </div>
                <div className="mt-2 text-lg text-orange-700">
                  = 2,559 cubic meters = 676,000 gallons = 7,011 liters/day average
                </div>
              </div>
            </div>

            {/* Rainfall Collection Reality */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-purple-600">
                2️⃣ Portugal Rainfall Collection (Lisbon/Central Region)
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-purple-50 p-4">
                  <h4 className="mb-3 font-semibold text-purple-900">☔ Annual Rainfall Pattern</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Annual Rainfall:</span>
                      <span className="font-mono font-bold">750mm</span>
                    </div>
                    <div className="mt-3 space-y-1 border-t pt-2">
                      <div className="flex items-center justify-between">
                        <span>Oct-May (Wet Season):</span>
                        <span className="font-mono text-blue-600">650mm (87%)</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded bg-gray-200">
                        <div className="h-full w-[87%] bg-blue-500"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Jun-Sep (Dry Season):</span>
                        <span className="font-mono text-orange-600">100mm (13%)</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded bg-gray-200">
                        <div className="h-full w-[13%] bg-orange-500"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-purple-50 p-4">
                  <h4 className="mb-3 font-semibold text-purple-900">
                    🏠 Collection from 200m² Roof
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-1">
                      <span>Gross Rainfall:</span>
                      <span className="font-mono">200m² × 750mm = 150,000L</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span>Collection Loss (20%):</span>
                      <span className="font-mono text-red-600">-30,000L</span>
                    </div>
                    <div className="flex justify-between border-t-2 pt-2 font-bold text-purple-900">
                      <span>Net Collection:</span>
                      <span className="font-mono">120,000L/year</span>
                    </div>
                    <div className="mt-3 rounded bg-red-100 p-2 text-center text-xs font-bold text-red-900">
                      ⚠️ COVERS ONLY 4.7% OF TOTAL NEED!
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border-4 border-red-400 bg-red-50 p-4">
                <div className="text-center font-bold text-red-900">
                  <div className="text-2xl">🚨 ROOF AREA NEEDED FOR 100% COLLECTION:</div>
                  <div className="mt-2 text-4xl">4,267 m² (45,941 sq ft)</div>
                  <div className="mt-2 text-lg">= 21 average houses OR massive warehouse</div>
                </div>
              </div>
            </div>

            {/* Correct Storage Calculation */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-green-600">
                3️⃣ CORRECT Storage Calculation (Key Insight!)
              </h3>
              <div className="rounded-lg bg-green-50 p-6">
                <div className="mb-4 rounded bg-yellow-100 p-4 text-center">
                  <div className="text-lg font-bold text-yellow-900">
                    💡 KEY PRINCIPLE: You don&apos;t store the FULL YEAR of water!
                  </div>
                  <div className="mt-2 text-yellow-800">
                    You only need to store enough to survive the DRY SEASON (Jun-Sep)
                    <br />
                    Because wet season (Oct-May) REPLENISHES your tanks!
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="rounded bg-white p-3">
                    <div className="mb-2 font-semibold">Dry Season Usage (4 months):</div>
                    <div className="font-mono">2,559,000L ÷ 12 months × 4 months = 853,000L</div>
                  </div>

                  <div className="rounded bg-white p-3">
                    <div className="mb-2 font-semibold">
                      Minus: Rain Collected During Dry Season:
                    </div>
                    <div className="font-mono">200m² × 100mm × 0.80 efficiency = 16,000L</div>
                  </div>

                  <div className="rounded bg-white p-3">
                    <div className="mb-2 font-semibold">Net Storage Needed:</div>
                    <div className="font-mono">853,000L - 16,000L = 837,000L</div>
                  </div>

                  <div className="rounded border-4 border-green-600 bg-green-100 p-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-900">
                        ✅ RECOMMENDED STORAGE (with 25% buffer):
                      </div>
                      <div className="mt-2 text-4xl font-bold text-green-900">
                        ~1,050,000 Liters
                      </div>
                      <div className="mt-1 text-lg">(277,000 gallons)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visual System Diagrams */}
        <Card className="mb-12 border-2 border-blue-500">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-2xl">🎨 System Diagrams & Visual Layouts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* Diagram 1: The Problem */}
            <div>
              <h3 className="mb-4 text-xl font-bold">Option 1: &quot;Roof Only&quot; Approach ❌</h3>
              <div className="rounded-lg bg-gray-100 p-8">
                <div className="mx-auto max-w-4xl">
                  <div className="text-center text-sm font-semibold text-gray-600">
                    IMPOSSIBLE SCENARIO - NEEDS 4,267m² ROOF
                  </div>
                  <svg viewBox="0 0 800 400" className="w-full">
                    {/* Giant warehouse roof */}
                    <rect
                      x="50"
                      y="120"
                      width="700"
                      height="200"
                      fill="#8B4513"
                      stroke="#654321"
                      strokeWidth="3"
                    />
                    <polygon
                      points="50,120 400,20 750,120"
                      fill="#DC143C"
                      stroke="#8B0000"
                      strokeWidth="3"
                    />

                    {/* Gutters */}
                    <rect x="40" y="315" width="720" height="15" fill="#666" />
                    <line x1="400" y1="330" x2="400" y2="370" stroke="#666" strokeWidth="8" />

                    {/* Huge cistern */}
                    <ellipse cx="400" cy="370" rx="150" ry="20" fill="#4169E1" opacity="0.5" />
                    <rect
                      x="250"
                      y="370"
                      width="300"
                      height="25"
                      fill="#4169E1"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <text
                      x="400"
                      y="387"
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="bold"
                      fill="#fff"
                    >
                      1,050,000L STORAGE
                    </text>

                    {/* Labels */}
                    <text
                      x="400"
                      y="230"
                      textAnchor="middle"
                      fontSize="24"
                      fontWeight="bold"
                      fill="#fff"
                    >
                      4,267m² WAREHOUSE
                    </text>
                    <text x="400" y="260" textAnchor="middle" fontSize="18" fill="#fff">
                      (65m × 65m building)
                    </text>

                    {/* Cost */}
                    <text
                      x="400"
                      y="50"
                      textAnchor="middle"
                      fontSize="20"
                      fontWeight="bold"
                      fill="#DC143C"
                    >
                      ❌ UNREALISTIC: €500,000+ for building alone
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Diagram 2: Hybrid Solution */}
            <div>
              <h3 className="mb-4 text-xl font-bold">Option 2: Hybrid Collection System ✅</h3>
              <div className="rounded-lg bg-gradient-to-b from-sky-100 to-green-100 p-8">
                <div className="mx-auto max-w-4xl">
                  <div className="text-center text-sm font-semibold text-green-700">
                    REALISTIC SOLUTION - Multiple Collection Sources
                  </div>
                  <svg viewBox="0 0 800 600" className="w-full">
                    {/* Sky */}
                    <rect x="0" y="0" width="800" height="300" fill="#87CEEB" opacity="0.3" />

                    {/* Rain clouds */}
                    <circle cx="150" cy="40" r="25" fill="#ccc" />
                    <circle cx="180" cy="40" r="30" fill="#ccc" />
                    <circle cx="210" cy="40" r="25" fill="#ccc" />
                    <circle cx="650" cy="60" r="25" fill="#ccc" />
                    <circle cx="680" cy="60" r="30" fill="#ccc" />
                    <circle cx="710" cy="60" r="25" fill="#ccc" />

                    {/* Rain lines */}
                    {[...Array(10)].map((_, i) => (
                      <line
                        key={i}
                        x1={140 + i * 10}
                        y1="70"
                        x2={135 + i * 10}
                        y2="110"
                        stroke="#4169E1"
                        strokeWidth="2"
                        opacity="0.5"
                      />
                    ))}

                    {/* House */}
                    <rect
                      x="80"
                      y="180"
                      width="120"
                      height="80"
                      fill="#D2691E"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <polygon
                      points="80,180 140,140 200,180"
                      fill="#8B0000"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <text x="140" y="225" textAnchor="middle" fontSize="12" fontWeight="bold">
                      HOUSE
                    </text>
                    <text x="140" y="240" textAnchor="middle" fontSize="10">
                      200m²
                    </text>
                    <text x="140" y="252" textAnchor="middle" fontSize="10" fill="#4169E1">
                      120,000L
                    </text>

                    {/* Barn */}
                    <rect
                      x="250"
                      y="160"
                      width="180"
                      height="100"
                      fill="#8B4513"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <polygon
                      points="250,160 340,120 430,160"
                      fill="#DC143C"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <text x="340" y="210" textAnchor="middle" fontSize="14" fontWeight="bold">
                      BARN
                    </text>
                    <text x="340" y="228" textAnchor="middle" fontSize="11">
                      500m²
                    </text>
                    <text x="340" y="242" textAnchor="middle" fontSize="11" fill="#4169E1">
                      300,000L
                    </text>

                    {/* Greenhouse */}
                    <path
                      d="M 480 180 Q 530 140 580 180 L 580 240 L 480 240 Z"
                      fill="#90EE90"
                      opacity="0.6"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <text x="530" y="215" textAnchor="middle" fontSize="12" fontWeight="bold">
                      GREENHOUSE
                    </text>
                    <text x="530" y="230" textAnchor="middle" fontSize="10">
                      200m²
                    </text>

                    {/* Downspouts */}
                    <line x1="140" y1="260" x2="140" y2="300" stroke="#666" strokeWidth="4" />
                    <line x1="340" y1="260" x2="340" y2="300" stroke="#666" strokeWidth="4" />
                    <line x1="530" y1="240" x2="530" y2="300" stroke="#666" strokeWidth="4" />

                    {/* Underground cistern */}
                    <ellipse
                      cx="250"
                      cy="380"
                      rx="100"
                      ry="15"
                      fill="#1E90FF"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <rect
                      x="150"
                      y="380"
                      width="200"
                      height="60"
                      fill="#4169E1"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <ellipse
                      cx="250"
                      cy="440"
                      rx="100"
                      ry="15"
                      fill="#00008B"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <text
                      x="250"
                      y="410"
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="bold"
                      fill="#fff"
                    >
                      UNDERGROUND
                    </text>
                    <text x="250" y="427" textAnchor="middle" fontSize="12" fill="#fff">
                      100,000L Cistern
                    </text>

                    {/* IBC Totes */}
                    {[...Array(8)].map((_, i) => (
                      <g key={i}>
                        <rect
                          x={480 + (i % 4) * 35}
                          y={340 + Math.floor(i / 4) * 50}
                          width="30"
                          height="40"
                          fill="#4682B4"
                          stroke="#000"
                          strokeWidth="1.5"
                        />
                      </g>
                    ))}
                    <text x="550" y="445" textAnchor="middle" fontSize="11" fontWeight="bold">
                      50× IBC Totes
                    </text>
                    <text x="550" y="458" textAnchor="middle" fontSize="10">
                      50,000L
                    </text>

                    {/* Farm Pond */}
                    <ellipse
                      cx="600"
                      cy="500"
                      rx="120"
                      ry="50"
                      fill="#1E90FF"
                      opacity="0.7"
                      stroke="#2F4F4F"
                      strokeWidth="3"
                    />
                    <text
                      x="600"
                      y="495"
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="bold"
                      fill="#fff"
                    >
                      FARM POND
                    </text>
                    <text x="600" y="512" textAnchor="middle" fontSize="12" fill="#fff">
                      900,000L
                    </text>

                    {/* Arrows showing water flow */}
                    <path
                      d="M 140 300 L 180 350"
                      stroke="#4169E1"
                      strokeWidth="3"
                      markerEnd="url(#arrowblue)"
                    />
                    <path
                      d="M 340 300 L 300 350"
                      stroke="#4169E1"
                      strokeWidth="3"
                      markerEnd="url(#arrowblue)"
                    />
                    <path
                      d="M 530 300 L 560 440"
                      stroke="#4169E1"
                      strokeWidth="3"
                      markerEnd="url(#arrowblue)"
                    />

                    {/* Arrow marker */}
                    <defs>
                      <marker
                        id="arrowblue"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <path d="M0,0 L0,6 L9,3 z" fill="#4169E1" />
                      </marker>
                    </defs>

                    {/* Total at bottom */}
                    <rect
                      x="200"
                      y="560"
                      width="400"
                      height="35"
                      fill="#228B22"
                      stroke="#000"
                      strokeWidth="2"
                      rx="5"
                    />
                    <text
                      x="400"
                      y="582"
                      textAnchor="middle"
                      fontSize="18"
                      fontWeight="bold"
                      fill="#fff"
                    >
                      TOTAL STORAGE: 1,050,000L ✅
                    </text>
                  </svg>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-blue-50 p-4">
                  <h4 className="mb-2 font-bold text-blue-900">💧 Potable Water (Household)</h4>
                  <p className="text-sm">Underground cistern with filtration</p>
                  <p className="mt-2 font-mono text-lg font-bold text-blue-600">100,000L</p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <h4 className="mb-2 font-bold text-green-900">🚿 Non-Potable (Distribution)</h4>
                  <p className="text-sm">IBC totes for easy access</p>
                  <p className="mt-2 font-mono text-lg font-bold text-green-600">50,000L</p>
                </div>
                <div className="rounded-lg bg-teal-50 p-4">
                  <h4 className="mb-2 font-bold text-teal-900">🌾 Farm Irrigation</h4>
                  <p className="text-sm">Natural pond/reservoir</p>
                  <p className="mt-2 font-mono text-lg font-bold text-teal-600">900,000L</p>
                </div>
              </div>
            </div>

            {/* Diagram 3: Farm Pond Cross-Section */}
            <div>
              <h3 className="mb-4 text-xl font-bold">Farm Pond Cross-Section Design</h3>
              <div className="rounded-lg bg-gradient-to-b from-sky-200 to-amber-100 p-8">
                <svg viewBox="0 0 800 400" className="w-full">
                  {/* Ground level */}
                  <rect x="0" y="200" width="800" height="200" fill="#8B7355" />
                  <rect x="0" y="200" width="800" height="20" fill="#6B8E23" />

                  {/* Pond excavation */}
                  <path
                    d="M 150 200 L 200 280 L 600 280 L 650 200 Z"
                    fill="#1E90FF"
                    opacity="0.8"
                    stroke="#00008B"
                    strokeWidth="3"
                  />

                  {/* Liner */}
                  <path
                    d="M 150 200 L 200 280 L 600 280 L 650 200"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />

                  {/* Water level */}
                  <line
                    x1="200"
                    y1="240"
                    x2="600"
                    y2="240"
                    stroke="#fff"
                    strokeWidth="2"
                    opacity="0.6"
                  />

                  {/* Dimensions */}
                  <line
                    x1="150"
                    y1="190"
                    x2="650"
                    y2="190"
                    stroke="#000"
                    strokeWidth="2"
                    markerStart="url(#arrowleft)"
                    markerEnd="url(#arrowright)"
                  />
                  <text x="400" y="180" textAnchor="middle" fontSize="16" fontWeight="bold">
                    30m width
                  </text>

                  <line
                    x1="670"
                    y1="200"
                    x2="670"
                    y2="280"
                    stroke="#000"
                    strokeWidth="2"
                    markerStart="url(#arrowup)"
                    markerEnd="url(#arrowdown)"
                  />
                  <text x="710" y="245" fontSize="16" fontWeight="bold">
                    4m depth
                  </text>

                  {/* Labels */}
                  <text
                    x="400"
                    y="260"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="bold"
                    fill="#fff"
                  >
                    900,000L Capacity
                  </text>
                  <text x="400" y="280" textAnchor="middle" fontSize="12" fill="#fff">
                    30m × 30m × 4m deep
                  </text>

                  {/* Inlet pipe */}
                  <rect x="100" y="195" width="50" height="10" fill="#666" />
                  <text x="75" y="192" fontSize="12" fontWeight="bold">
                    From Barn ↓
                  </text>

                  {/* Outlet pipe */}
                  <rect x="250" y="275" width="10" height="30" fill="#666" />
                  <text x="265" y="300" fontSize="12" fontWeight="bold">
                    → To Irrigation
                  </text>

                  {/* Cost */}
                  <rect
                    x="250"
                    y="330"
                    width="300"
                    height="50"
                    fill="#228B22"
                    stroke="#000"
                    strokeWidth="2"
                    rx="5"
                  />
                  <text
                    x="400"
                    y="352"
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill="#fff"
                  >
                    Excavation + Liner Cost
                  </text>
                  <text
                    x="400"
                    y="370"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="bold"
                    fill="#fff"
                  >
                    €8,000 - €12,000
                  </text>

                  {/* Arrow markers */}
                  <defs>
                    <marker
                      id="arrowleft"
                      markerWidth="10"
                      markerHeight="10"
                      refX="1"
                      refY="3"
                      orient="auto"
                    >
                      <path d="M9,0 L9,6 L0,3 z" fill="#000" />
                    </marker>
                    <marker
                      id="arrowright"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <path d="M0,0 L0,6 L9,3 z" fill="#000" />
                    </marker>
                    <marker
                      id="arrowup"
                      markerWidth="10"
                      markerHeight="10"
                      refX="3"
                      refY="1"
                      orient="auto"
                    >
                      <path d="M0,9 L6,9 L3,0 z" fill="#000" />
                    </marker>
                    <marker
                      id="arrowdown"
                      markerWidth="10"
                      markerHeight="10"
                      refX="3"
                      refY="9"
                      orient="auto"
                    >
                      <path d="M0,0 L6,0 L3,9 z" fill="#000" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Comparison */}
        <Card className="mb-12 border-2 border-green-500">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-2xl">💰 Complete Cost Breakdown</CardTitle>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="bg-blue-100">Materials Only</Badge>
              <Badge variant="outline" className="bg-orange-100">+ Labor if Hired</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-left">Component</th>
                    <th className="border p-3 text-left">Specification</th>
                    <th className="border p-3 text-right">Materials (€)</th>
                    <th className="border p-3 text-right">Labor (€)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-blue-50">
                    <td className="border p-3 font-semibold" colSpan={3}>
                      🏠 COLLECTION SYSTEM
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3">House Gutters & Downspouts</td>
                    <td className="border p-3">200m² roof, PVC system</td>
                    <td className="border p-3 text-right font-mono">€600</td>
                    <td className="border p-3 text-right font-mono text-orange-600">€800</td>
                  </tr>
                  <tr>
                    <td className="border p-3">Barn Gutters & Downspouts</td>
                    <td className="border p-3">500m² roof, heavy-duty</td>
                    <td className="border p-3 text-right font-mono">€1,800</td>
                    <td className="border p-3 text-right font-mono text-orange-600">€2,000</td>
                  </tr>
                  <tr>
                    <td className="border p-3">Greenhouse Collection</td>
                    <td className="border p-3">200m² polycarbonate roof</td>
                    <td className="border p-3 text-right font-mono">€400</td>
                    <td className="border p-3 text-right font-mono text-orange-600">€500</td>
                  </tr>
                  <tr>
                    <td className="border p-3">First Flush Diverters (6×)</td>
                    <td className="border p-3">100L capacity each</td>
                    <td className="border p-3 text-right font-mono">€270</td>
                    <td className="border p-3 text-right font-mono text-orange-600">€300</td>
                  </tr>

                  <tr className="bg-purple-50">
                    <td className="border p-3 font-semibold" colSpan={3}>
                      🏗️ STORAGE SYSTEM
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3">Underground Cistern</td>
                    <td className="border p-3">100,000L concrete tank</td>
                    <td className="border p-3 text-right font-mono">€8,000</td>
                    <td className="border p-3 text-right font-mono text-orange-600">€7,000</td>
                  </tr>
                  <tr>
                    <td className="border p-3">IBC Totes (50×)</td>
                    <td className="border p-3">1000L used food-grade @ €75</td>
                    <td className="border p-3 text-right font-mono">€3,750</td>
                    <td className="border p-3 text-right font-mono text-green-600">€0 (DIY)</td>
                  </tr>
                  <tr>
                    <td className="border p-3">Farm Pond Excavation</td>
                    <td className="border p-3">30×30×4m deep, 900,000L</td>
                    <td className="border p-3 text-right font-mono">€0</td>
                    <td className="border p-3 text-right font-mono text-orange-600">€8,000</td>
                  </tr>
                  <tr>
                    <td className="border p-3">Pond Liner (EPDM)</td>
                    <td className="border p-3">1.2mm thickness, 1000m²</td>
                    <td className="border p-3 text-right font-mono">€4,000</td>
                    <td className="border p-3 text-right font-mono text-orange-600">€1,500</td>
                  </tr>

                  <tr className="bg-orange-50">
                    <td className="border p-3 font-semibold" colSpan={3}>
                      🔧 PLUMBING & DISTRIBUTION
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3">PVC Piping & Manifolds</td>
                    <td className="border p-3">Complete distribution network</td>
                    <td className="border p-3 text-right font-mono">€2,500</td>
                    <td className="border p-3 text-right font-mono text-orange-600">€3,500</td>
                  </tr>
                  <tr>
                    <td className="border p-3">Agricultural Pump (2HP)</td>
                    <td className="border p-3">100L/min, pressure switch</td>
                    <td className="border p-3 text-right font-mono">€850</td>
                    <td className="border p-3 text-right font-mono text-orange-600">€400</td>
                  </tr>
                  <tr>
                    <td className="border p-3">Household Pressure System</td>
                    <td className="border p-3">Pump + tank + controls</td>
                    <td className="border p-3 text-right font-mono">€1,200</td>
                    <td className="border p-3 text-right font-mono text-orange-600">€600</td>
                  </tr>

                  <tr className="bg-yellow-50">
                    <td className="border p-3 font-semibold" colSpan={3}>
                      💧 FILTRATION & TREATMENT
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3">Household Filtration</td>
                    <td className="border p-3">UV + Carbon + Sediment (potable)</td>
                    <td className="border p-3 text-right font-mono">€2,500</td>
                  </tr>
                  <tr>
                    <td className="border p-3">Pre-Filters (3×)</td>
                    <td className="border p-3">200 micron mesh for tanks</td>
                    <td className="border p-3 text-right font-mono">€180</td>
                  </tr>

                  <tr className="bg-green-50">
                    <td className="border p-3 font-semibold" colSpan={3}>
                      🌾 IRRIGATION SYSTEM
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3">Drip Irrigation Kit</td>
                    <td className="border p-3">3 acres complete system</td>
                    <td className="border p-3 text-right font-mono">€1,200</td>
                  </tr>
                  <tr>
                    <td className="border p-3">Timer & Controllers</td>
                    <td className="border p-3">Automatic scheduling</td>
                    <td className="border p-3 text-right font-mono">€350</td>
                  </tr>

                  <tr className="border-t-4 border-green-600 bg-green-100">
                    <td className="border p-4 text-xl font-bold" colSpan={2}>
                      TOTAL INVESTMENT:
                    </td>
                    <td className="border p-4 text-right text-2xl font-bold text-green-900">
                      €42,600
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-blue-50 p-4">
                <h4 className="mb-2 text-sm font-semibold text-blue-900">
                  💧 Municipal Water Cost
                </h4>
                <div className="text-3xl font-bold text-blue-600">€5,118</div>
                <div className="text-sm text-blue-700">per year at €2/m³</div>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <h4 className="mb-2 text-sm font-semibold text-green-900">💰 Annual Savings</h4>
                <div className="text-3xl font-bold text-green-600">€4,918</div>
                <div className="text-sm text-green-700">after €200 maintenance</div>
              </div>
              <div className="rounded-lg bg-purple-50 p-4">
                <h4 className="mb-2 text-sm font-semibold text-purple-900">⏱️ Payback Period</h4>
                <div className="text-3xl font-bold text-purple-600">8.7 years</div>
                <div className="text-sm text-purple-700">Then free water forever!</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creative Solutions */}
        <Card className="mb-12 border-2 border-orange-500">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-2xl">💡 Creative Optimization Ideas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border-2 border-green-400 bg-green-50 p-6">
                <h3 className="mb-3 text-lg font-bold text-green-900">🌾 Reduce Farm Water 60%</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Drip irrigation:</strong> 90% efficiency vs 50% flood
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Mulching:</strong> Reduces evaporation by 50%
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Drought-tolerant crops:</strong> 30% less water
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Soil improvement:</strong> Compost holds 5× water
                    </span>
                  </li>
                </ul>
                <div className="mt-4 rounded bg-green-200 p-3 text-center">
                  <div className="font-bold text-green-900">New farm need: 936,000L/year</div>
                  <div className="text-sm text-green-800">Storage reduces to 390,000L!</div>
                </div>
              </div>

              <div className="rounded-lg border-2 border-blue-400 bg-blue-50 p-6">
                <h3 className="mb-3 text-lg font-bold text-blue-900">🚿 Reduce Household 70%</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Composting toilet:</strong> Saves 43,800L/year
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Navy showers:</strong> 5min max = 58,400L saved
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Greywater reuse:</strong> Toilets/irrigation 35%
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Low-flow everything:</strong> 25% reduction
                    </span>
                  </li>
                </ul>
                <div className="mt-4 rounded bg-blue-200 p-3 text-center">
                  <div className="font-bold text-blue-900">New household: 65,700L/year</div>
                  <div className="text-sm text-blue-800">That&apos;s 80L per person per day!</div>
                </div>
              </div>

              <div className="rounded-lg border-2 border-purple-400 bg-purple-50 p-6">
                <h3 className="mb-3 text-lg font-bold text-purple-900">
                  ☔ Increase Collection 300%
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Barn roof:</strong> +500m² = +300,000L/year
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Greenhouse:</strong> +200m² = +120,000L/year
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Shed/garage:</strong> +100m² = +60,000L/year
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Solar array frame:</strong> +200m² bonus!
                    </span>
                  </li>
                </ul>
                <div className="mt-4 rounded bg-purple-200 p-3 text-center">
                  <div className="font-bold text-purple-900">Total collection: 600,000L/year</div>
                  <div className="text-sm text-purple-800">From 1,000m² total surface!</div>
                </div>
              </div>

              <div className="rounded-lg border-2 border-teal-400 bg-teal-50 p-6">
                <h3 className="mb-3 text-lg font-bold text-teal-900">🌊 Natural Water Retention</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Swales:</strong> Catch runoff, recharge groundwater
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Multiple small ponds:</strong> Reduce evaporation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Shade ponds:</strong> Trees reduce loss 40%
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>
                      <strong>Aquatic plants:</strong> Natural filtration
                    </span>
                  </li>
                </ul>
                <div className="mt-4 rounded bg-teal-200 p-3 text-center">
                  <div className="font-bold text-teal-900">Bonus: Biodiversity habitat!</div>
                  <div className="text-sm text-teal-800">Frogs, dragonflies, birds</div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-4 border-yellow-400 bg-yellow-50 p-6">
              <h3 className="mb-4 text-center text-2xl font-bold text-yellow-900">
                🎯 OPTIMIZED SYSTEM (All Strategies Combined)
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded bg-white p-4 text-center">
                  <div className="text-sm font-semibold text-gray-600">New Annual Need</div>
                  <div className="text-3xl font-bold text-yellow-900">1,002,000L</div>
                  <div className="text-sm text-green-600">↓ 61% reduction!</div>
                </div>
                <div className="rounded bg-white p-4 text-center">
                  <div className="text-sm font-semibold text-gray-600">New Collection</div>
                  <div className="text-3xl font-bold text-yellow-900">600,000L</div>
                  <div className="text-sm text-green-600">↑ 400% increase!</div>
                </div>
                <div className="rounded bg-white p-4 text-center">
                  <div className="text-sm font-semibold text-gray-600">Storage Needed</div>
                  <div className="text-3xl font-bold text-yellow-900">334,000L</div>
                  <div className="text-sm text-green-600">↓ 68% less!</div>
                </div>
              </div>
              <div className="mt-4 rounded bg-green-600 p-4 text-center text-white">
                <div className="text-2xl font-bold">NEW TOTAL COST: €28,500</div>
                <div className="text-lg">Payback: 5.8 years • ROI: 17.2% annually</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="rounded-lg border-2 border-primary bg-gradient-to-r from-primary/10 to-accent/10 p-8 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Design Your System?</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Use our interactive calculator with all these insights built-in
          </p>
          <Link
            href="/green-calculators/total-water-independence"
            className="inline-block rounded-lg bg-primary px-8 py-4 text-xl font-semibold text-primary-foreground hover:bg-primary/90"
          >
            🚀 Launch Water Independence Calculator
          </Link>
        </div>
      </div>
    </main>
  );
}
