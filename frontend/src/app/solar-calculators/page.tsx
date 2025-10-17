import Link from 'next/link';
import { Metadata } from 'next';
import { generateSEOMetadata, SEO_KEYWORDS, generateCalculatorSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Free Solar Panel Calculator Suite - Size Your Off-Grid System',
  description:
    'Professional solar calculators: panel sizing, battery calculator, inverter sizing, load analysis. Calculate your complete off-grid solar system with instant shopping lists. 100% FREE tools.',
  keywords: [
    ...SEO_KEYWORDS.SOLAR_CALCULATORS,
    ...SEO_KEYWORDS.OFF_GRID,
    'free solar panel calculator',
    'solar system sizing calculator',
    'off grid solar calculator',
    'battery sizing calculator',
    'solar inverter calculator',
    'DIY solar system calculator',
  ],
  canonicalUrl: 'https://offgrid1.com/solar-calculators',
  structuredData: generateCalculatorSchema(
    'Solar Calculator Suite',
    'Complete suite of professional solar calculators for off-grid system design',
    'https://offgrid1.com/solar-calculators'
  ),
});

export default function SolarCalculators() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-6xl">
            Free Solar Panel Calculator Suite
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Professional <strong>solar calculators</strong> for off-grid system design. Calculate
            <em>solar panels, batteries, inverters, and electrical components</em>. Get instant
            shopping lists with verified affiliate pricing. <strong>100% FREE</strong> - no signup
            required.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Load Analysis Calculator - START HERE */}
          <Link
            href="/solar-calculators/load-analysis"
            className="group rounded-lg border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/10 p-8 transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="mb-4 text-5xl">⚡</div>
            <h3 className="mb-3 text-2xl font-bold">Load Analysis Calculator - Start Here</h3>
            <p className="mb-4 text-muted-foreground">
              <strong>Calculate your power needs</strong> from appliances, lighting, and seasonal
              usage. Essential first step for sizing your <em>off-grid solar system</em>. Get
              personalized equipment recommendations based on your actual energy consumption.
            </p>
            <div className="mb-4 rounded-full bg-primary/20 px-4 py-2 text-sm font-medium">
              🎯 Start Here First
            </div>
            <div className="text-sm text-muted-foreground">
              ✅ Appliance power audit
              <br />
              ✅ Seasonal variations
              <br />
              ✅ Future expansion planning
              <br />✅ Critical vs non-critical loads
            </div>
          </Link>

          {/* Solar Panel Sizing */}
          <Link
            href="/solar-calculators/panel-sizing"
            className="group rounded-lg border bg-card p-8 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
          >
            <div className="mb-4 text-4xl">☀️</div>
            <h3 className="mb-3 text-xl font-bold">Solar Panel Sizing</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Calculate exactly how many panels you need based on your location, roof space, and
              energy usage.
            </p>
            <div className="text-xs text-muted-foreground">
              ✅ Climate-adjusted calculations
              <br />
              ✅ Shading analysis
              <br />
              ✅ Optimal panel configuration
              <br />✅ Product recommendations
            </div>
          </Link>

          {/* Battery Storage Calculator */}
          <Link
            href="/solar-calculators/battery-sizing"
            className="group rounded-lg border bg-card p-8 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
          >
            <div className="mb-4 text-4xl">🔋</div>
            <h3 className="mb-3 text-xl font-bold">Battery Storage</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Size your battery bank for backup power, including chemistry selection and
              configuration.
            </p>
            <div className="text-xs text-muted-foreground">
              ✅ Backup duration planning
              <br />
              ✅ Battery chemistry comparison
              <br />
              ✅ Depth of discharge optimization
              <br />✅ Lifespan calculations
            </div>
          </Link>

          {/* Inverter Sizing */}
          <Link
            href="/solar-calculators/inverter-sizing"
            className="group rounded-lg border bg-card p-8 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
          >
            <div className="mb-4 text-4xl">⚙️</div>
            <h3 className="mb-3 text-xl font-bold">Inverter Sizing</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Calculate inverter capacity for continuous and surge power requirements.
            </p>
            <div className="text-xs text-muted-foreground">
              ✅ Continuous power needs
              <br />
              ✅ Surge capacity planning
              <br />
              ✅ Efficiency optimization
              <br />✅ Grid-tie vs off-grid options
            </div>
          </Link>

          {/* Wire & Electrical */}
          <Link
            href="/solar-calculators/electrical"
            className="group rounded-lg border bg-card p-8 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
          >
            <div className="mb-4 text-4xl">⚡</div>
            <h3 className="mb-3 text-xl font-bold">Wire & Electrical</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Critical safety calculations for wire sizing, fusing, and electrical compliance.
            </p>
            <div className="text-xs text-muted-foreground">
              ✅ Wire gauge calculations
              <br />
              ✅ Voltage drop analysis
              <br />
              ✅ Safety compliance
              <br />✅ Code requirements
            </div>
          </Link>

          {/* Complete System Designer */}
          <Link
            href="/solar-calculators/system-designer"
            className="group rounded-lg border-2 border-accent bg-gradient-to-br from-accent/10 to-primary/10 p-8 transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="mb-4 text-5xl">🎯</div>
            <h3 className="mb-3 text-2xl font-bold">Complete System Designer</h3>
            <p className="mb-4 text-muted-foreground">
              Advanced tool that combines all calculators for complete system design with shopping
              basket.
            </p>
            <div className="mb-4 rounded-full bg-accent/20 px-4 py-2 text-sm font-medium">
              🛒 Generates Shopping List
            </div>
            <div className="text-sm text-muted-foreground">
              ✅ Complete system integration
              <br />
              ✅ Cost optimization
              <br />
              ✅ Affiliate product basket
              <br />✅ Installation guide
            </div>
          </Link>
        </div>

        {/* Value Proposition */}
        <div className="mt-16 rounded-lg border bg-gradient-to-br from-card to-accent/5 p-8">
          <h2 className="mb-6 text-center text-2xl font-semibold">
            Why Our Solar Calculators Are Different
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-3 text-3xl">🎯</div>
              <h3 className="mb-2 text-lg font-semibold">Complete Analysis</h3>
              <p className="text-sm text-muted-foreground">
                We calculate everything others miss - wiring, safety, seasonal variations, and
                real-world efficiency losses.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-3 text-3xl">🛒</div>
              <h3 className="mb-2 text-lg font-semibold">Instant Shopping Baskets</h3>
              <p className="text-sm text-muted-foreground">
                Get curated product recommendations with affiliate links to reliable, affordable
                equipment with fast delivery.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-3 text-3xl">💰</div>
              <h3 className="mb-2 text-lg font-semibold">Best Value Products</h3>
              <p className="text-sm text-muted-foreground">
                We focus on reliable but affordable options from trusted brands with good customer
                support and warranties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
