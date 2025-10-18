import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  WaterIcon,
  EnergyIcon,
  SolarIcon,
  CartIcon,
  PlantIcon,
  DocumentIcon,
  ScaleIcon,
  ToolsIcon,
  MoneyIcon,
  TargetIcon,
  DiamondIcon,
  FolderIcon,
  EducationIcon,
  AIIcon,
  GlobeIcon,
  PeopleIcon,
  BookIcon,
} from '@/components/icons';
import { generateSEOMetadata, SEO_KEYWORDS, generateOrganizationSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Complete Green Technology Calculators & Sustainable Living Guide',
  description:
    'FREE calculators for solar, rainwater harvesting, greywater systems, wind power, hydroponics & more. Complete sustainable living tools with shopping lists. Portugal digital nomad guides included.',
  keywords: [
    ...SEO_KEYWORDS.SOLAR_CALCULATORS,
    ...SEO_KEYWORDS.GREEN_SOLUTIONS,
    ...SEO_KEYWORDS.WATER_SYSTEMS,
    ...SEO_KEYWORDS.SUSTAINABLE_LIVING,
    ...SEO_KEYWORDS.OFF_GRID,
    ...SEO_KEYWORDS.PORTUGAL,
    'free green technology calculator',
    'sustainable living calculator',
    'rainwater harvesting calculator',
    'greywater system calculator',
    'Portugal digital nomad',
  ],
  canonicalUrl: 'https://offgrid1.com',
  structuredData: generateOrganizationSchema(),
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section with Background Image */}
        <div className="relative mx-auto mb-16 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/sustainable-living-hero.png"
              alt="Off-grid sustainable living with solar panels and green technology"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90"></div>
          </div>

          <div className="relative z-10 px-4 py-16 text-center md:px-8 md:py-24">
            <h1 className="mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-6xl font-bold tracking-tight text-transparent drop-shadow-lg">
              <span className="block text-4xl lg:text-6xl">Complete Green Technology</span>
              <span className="block">Calculator Suite</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-xl text-foreground lg:text-2xl">
              <strong>Calculate everything</strong> for sustainable living: solar systems, rainwater
              harvesting, greywater recycling, wind power, hydroponics & more. Plus complete
              <strong> Portugal digital nomad</strong> guides. <em>100% FREE</em> - no signup
              required.
            </p>

            {/* CTA Buttons */}
            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/green-calculators/rainwater-harvesting"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <WaterIcon size="sm" className="text-white" />
                Rainwater Calculator
              </Link>
              <Link
                href="/solar-calculators/load-analysis"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <EnergyIcon size="sm" className="text-white" />
                Solar Calculator
              </Link>
              <Link
                href="/green-calculators"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-primary bg-background px-8 py-4 text-lg font-semibold transition-colors hover:bg-accent"
              >
                <PlantIcon size="sm" />
                All Green Calculators
              </Link>
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-4xl font-bold">
            Complete Sustainable Living Calculator Suite
          </h2>

          {/* Priority Section: Solar Tools & Shop */}
          <div className="mb-16">
            <h3 className="mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold text-primary">
              <DiamondIcon size="md" />
              Solar Panel Calculator & System Design Tools
            </h3>
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <Link
                href="/solar-calculators"
                className="group relative overflow-hidden rounded-lg border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/10 p-8 transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="absolute right-0 top-0 h-40 w-40 opacity-10 transition-opacity group-hover:opacity-20">
                  <Image
                    src="/images/solar-panel-system.png"
                    alt="Solar panel system"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="mb-4">
                  <SolarIcon size="xl" />
                </div>
                <h4 className="mb-3 text-2xl font-bold">FREE Solar Panel Calculator</h4>
                <p className="text-lg text-muted-foreground">
                  <strong>Calculate solar panels, battery sizing, inverter requirements</strong>.
                  Get instant shopping lists with best prices for your off-grid solar system.
                </p>
                <div className="mt-4 rounded-full bg-primary/20 px-4 py-2 text-sm font-medium">
                  Most Popular
                </div>
              </Link>

              <Link
                href="/solar-shop"
                className="group relative overflow-hidden rounded-lg border-2 border-accent bg-gradient-to-br from-accent/10 to-primary/10 p-8 transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="absolute right-0 top-0 h-40 w-40 opacity-10 transition-opacity group-hover:opacity-20">
                  <Image
                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80"
                    alt="Solar equipment and technology"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mb-4">
                  <CartIcon size="xl" />
                </div>
                <h4 className="mb-3 text-2xl font-bold">Solar Equipment Shop</h4>
                <p className="text-lg text-muted-foreground">
                  Curated panels, batteries, inverters with expert reviews & affiliate pricing
                </p>
                <div className="mt-4 rounded-full bg-accent/20 px-4 py-2 text-sm font-medium">
                  Best Deals
                </div>
              </Link>
            </div>
          </div>

          {/* Portugal Relocation Hub */}
          <div className="mb-16">
            <h3 className="mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold text-accent">
              <GlobeIcon size="md" />
              Portugal Digital Nomad Visa & Living Guide
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/legal"
                className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
              >
                <div className="absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10">
                  <Image
                    src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&q=80"
                    alt="Portugal legal documentation"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <div className="mb-4">
                    <ScaleIcon size="lg" />
                  </div>
                  <h4 className="mb-2 text-xl font-semibold">Portugal Digital Nomad Visa Guide</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Portugal visa requirements</strong>, D8 digital nomad visa application,
                    residency permits, and legal compliance guide.
                  </p>
                </div>
              </Link>

              <Link
                href="/services"
                className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
              >
                <div className="absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10">
                  <Image
                    src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80"
                    alt="Construction and building services"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <div className="mb-4">
                    <ToolsIcon size="lg" />
                  </div>
                  <h4 className="mb-2 text-xl font-semibold">Local Services</h4>
                  <p className="text-sm text-muted-foreground">
                    Trusted builders, electricians, contractors
                  </p>
                </div>
              </Link>

              <Link
                href="/pricing"
                className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
              >
                <div className="absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10">
                  <Image
                    src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80"
                    alt="Cost comparison and pricing"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <div className="mb-4">
                    <MoneyIcon size="lg" />
                  </div>
                  <h4 className="mb-2 text-xl font-semibold">Cost Comparison</h4>
                  <p className="text-sm text-muted-foreground">
                    UK vs Portugal building materials & tools
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Tools & Resources */}
          <div className="mb-16">
            <h3 className="mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold">
              <ToolsIcon size="md" />
              Complete Resource Suite
            </h3>
            <div className="grid gap-4 md:grid-cols-4">
              <Link
                href="/green-calculators"
                className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
              >
                <div className="absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10">
                  <Image
                    src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&q=80"
                    alt="Green technology and water systems"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <div className="mb-3">
                    <PlantIcon size="md" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold">Green Calculators</h4>
                  <p className="text-xs text-muted-foreground">Water, wind, growing systems</p>
                </div>
              </Link>

              <Link
                href="/solar-calculators"
                className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
              >
                <div className="absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10">
                  <Image
                    src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&q=80"
                    alt="Solar energy panels"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <div className="mb-3">
                    <SolarIcon size="md" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold">Solar Calculators</h4>
                  <p className="text-xs text-muted-foreground">Complete solar system design</p>
                </div>
              </Link>

              <Link
                href="/blog"
                className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
              >
                <div className="absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10">
                  <Image
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80"
                    alt="Sustainable living guides"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <div className="mb-3">
                    <DocumentIcon size="md" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold">Sustainable Living Blog</h4>
                  <p className="text-xs text-muted-foreground">Green tech guides & tutorials</p>
                </div>
              </Link>

              <Link
                href="/directory"
                className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
              >
                <div className="absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10">
                  <Image
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80"
                    alt="Property and resources directory"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <div className="mb-3">
                    <FolderIcon size="md" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold">Resource Directory</h4>
                  <p className="text-xs text-muted-foreground">Properties, guides, tools</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Premium Services */}
          <div className="mb-12 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-8">
            <h3 className="mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold">
              <DiamondIcon size="md" />
              Premium Services
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-background/50 p-4 text-center">
                <div className="mb-3 flex justify-center">
                  <TargetIcon size="md" />
                </div>
                <h4 className="mb-2 text-lg font-semibold">1-on-1 Consultations</h4>
                <p className="text-sm text-muted-foreground">Personal off-grid planning sessions</p>
              </div>

              <div className="rounded-lg bg-background/50 p-4 text-center">
                <div className="mb-3 flex justify-center">
                  <EducationIcon size="md" />
                </div>
                <h4 className="mb-2 text-lg font-semibold">Masterclass Courses</h4>
                <p className="text-sm text-muted-foreground">Complete off-grid setup guides</p>
              </div>

              <div className="rounded-lg bg-background/50 p-4 text-center">
                <div className="mb-3 flex justify-center">
                  <AIIcon size="md" />
                </div>
                <h4 className="mb-2 text-lg font-semibold">AI Assistant Pro</h4>
                <p className="text-sm text-muted-foreground">Advanced personalized guidance</p>
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="rounded-lg border bg-gradient-to-br from-card to-accent/5 p-8">
            <h3 className="mb-6 text-center text-2xl font-semibold">
              Why Choose Our Offgrid Journey?
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <TargetIcon size="sm" />
                  <span className="text-muted-foreground">Expert-curated products & reviews</span>
                </div>
                <div className="flex items-center gap-3">
                  <MoneyIcon size="sm" />
                  <span className="text-muted-foreground">
                    Best prices through affiliate partnerships
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <GlobeIcon size="sm" />
                  <span className="text-muted-foreground">Real Portugal relocation experience</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ToolsIcon size="sm" />
                  <span className="text-muted-foreground">Professional calculators & tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <PeopleIcon size="sm" />
                  <span className="text-muted-foreground">Active community support</span>
                </div>
                <div className="flex items-center gap-3">
                  <BookIcon size="sm" />
                  <span className="text-muted-foreground">Comprehensive guides & resources</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
