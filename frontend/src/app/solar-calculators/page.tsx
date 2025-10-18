'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  EnergyIcon,
  SolarIcon,
  BatteryIcon,
  TargetIcon,
  CartIcon,
  MoneyIcon,
  ToolsIcon,
} from '@/components/icons';

// Metadata moved to layout or separate metadata export

export default function SolarCalculators() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Header with Image */}
        <div className="relative mb-12 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/solar-panel-system.png"
              alt="Complete solar panel system with batteries and inverters"
              fill
              className="object-cover opacity-10"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background"></div>
          </div>

          <div className="relative z-10 px-4 py-16 text-center md:px-8">
            <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-6xl">
              Free Solar Panel Calculator Suite
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-foreground">
              Professional <strong>solar calculators</strong> for off-grid system design. Calculate
              <em>solar panels, batteries, inverters, and electrical components</em>. Get instant
              shopping lists with verified affiliate pricing. <strong>100% FREE</strong> - no signup
              required.
            </p>
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Load Analysis Calculator - START HERE */}
          <Link
            href="/solar-calculators/load-analysis"
            className="group relative overflow-hidden rounded-lg border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/10 p-8 transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="absolute right-0 top-0 h-32 w-32 opacity-5 transition-opacity group-hover:opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80"
                alt="Power meter and energy monitoring"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 mb-4">
              <EnergyIcon size="xl" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">Load Analysis Calculator - Start Here</h3>
            <p className="mb-4 text-muted-foreground">
              <strong>Calculate your power needs</strong> from appliances, lighting, and seasonal
              usage. Essential first step for sizing your <em>off-grid solar system</em>. Get
              personalized equipment recommendations based on your actual energy consumption.
            </p>
            <div className="mb-4 flex items-center justify-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm font-medium">
              <TargetIcon size="sm" />
              Start Here First
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
            className="group relative overflow-hidden rounded-lg border bg-card p-8 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
          >
            <div className="absolute right-0 top-0 h-32 w-32 opacity-5 transition-opacity group-hover:opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80"
                alt="Solar panels on roof"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 mb-4">
              <SolarIcon size="lg" />
            </div>
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
            className="group relative overflow-hidden rounded-lg border bg-card p-8 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
          >
            <div className="absolute right-0 top-0 h-32 w-32 opacity-5 transition-opacity group-hover:opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80"
                alt="Solar battery bank"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 mb-4">
              <BatteryIcon size="lg" />
            </div>
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
            className="group relative overflow-hidden rounded-lg border bg-card p-8 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
          >
            <div className="absolute right-0 top-0 h-32 w-32 opacity-5 transition-opacity group-hover:opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400&q=80"
                alt="Solar inverter equipment"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 mb-4">
              <ToolsIcon size="lg" />
            </div>
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
            className="group relative overflow-hidden rounded-lg border bg-card p-8 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
          >
            <div className="absolute right-0 top-0 h-32 w-32 opacity-5 transition-opacity group-hover:opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80"
                alt="Electrical wiring and cables"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 mb-4">
              <EnergyIcon size="lg" />
            </div>
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
            className="group relative overflow-hidden rounded-lg border-2 border-accent bg-gradient-to-br from-accent/10 to-primary/10 p-8 transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="absolute right-0 top-0 h-40 w-40 opacity-5 transition-opacity group-hover:opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400&q=80"
                alt="Complete solar system design"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 mb-4">
              <TargetIcon size="xl" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">Complete System Designer</h3>
            <p className="mb-4 text-muted-foreground">
              Advanced tool that combines all calculators for complete system design with shopping
              basket.
            </p>
            <div className="mb-4 flex items-center justify-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-medium">
              <CartIcon size="sm" />
              Generates Shopping List
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
              <div className="mb-3 flex justify-center">
                <TargetIcon size="md" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Complete Analysis</h3>
              <p className="text-sm text-muted-foreground">
                We calculate everything others miss - wiring, safety, seasonal variations, and
                real-world efficiency losses.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <CartIcon size="md" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Instant Shopping Baskets</h3>
              <p className="text-sm text-muted-foreground">
                Get curated product recommendations with affiliate links to reliable, affordable
                equipment with fast delivery.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <MoneyIcon size="md" />
              </div>
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
