import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { Metadata } from 'next';
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
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        {/* Hero Section */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h1 className="mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-6xl font-bold tracking-tight text-transparent">
            <span className="block text-4xl lg:text-6xl">Complete Green Technology</span>
            <span className="block">Calculator Suite</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground lg:text-2xl">
            <strong>Calculate everything</strong> for sustainable living: solar systems, rainwater
            harvesting, greywater recycling, wind power, hydroponics & more. Plus complete
            <strong> Portugal digital nomad</strong> guides. <em>100% FREE</em> - no signup
            required.
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/green-calculators/rainwater-harvesting"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              💧 Rainwater Calculator
            </Link>
            <Link
              href="/solar-calculators/load-analysis"
              className="rounded-lg bg-gradient-to-r from-primary to-accent px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              ⚡ Solar Calculator
            </Link>
            <Link
              href="/green-calculators"
              className="rounded-lg border-2 border-primary bg-background px-8 py-4 text-lg font-semibold transition-colors hover:bg-accent"
            >
              � All Green Calculators
            </Link>
          </div>
        </div>

        {/* Main Sections */}
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-4xl font-bold">
            Complete Sustainable Living Calculator Suite
          </h2>

          {/* Priority Section: Solar Tools & Shop */}
          <div className="mb-16">
            <h3 className="mb-6 text-center text-2xl font-bold text-primary">
              🌟 Solar Panel Calculator & System Design Tools
            </h3>
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <Link
                href="/solar-calculators"
                className="rounded-lg border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/10 p-8 transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="mb-4 text-5xl">�</div>
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
                className="rounded-lg border-2 border-accent bg-gradient-to-br from-accent/10 to-primary/10 p-8 transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="mb-4 text-5xl">🛒</div>
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
            <h3 className="mb-6 text-center text-2xl font-bold text-accent">
              🇵🇹 Portugal Digital Nomad Visa & Living Guide
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/legal"
                className="rounded-lg border bg-card p-6 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
              >
                <div className="mb-4 text-4xl">⚖️</div>
                <h4 className="mb-2 text-xl font-semibold">Portugal Digital Nomad Visa Guide</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Portugal visa requirements</strong>, D8 digital nomad visa application,
                  residency permits, and legal compliance guide.
                </p>
              </Link>

              <Link
                href="/services"
                className="rounded-lg border bg-card p-6 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
              >
                <div className="mb-4 text-4xl">🔧</div>
                <h4 className="mb-2 text-xl font-semibold">Local Services</h4>
                <p className="text-sm text-muted-foreground">
                  Trusted builders, electricians, contractors
                </p>
              </Link>

              <Link
                href="/pricing"
                className="rounded-lg border bg-card p-6 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
              >
                <div className="mb-4 text-4xl">💰</div>
                <h4 className="mb-2 text-xl font-semibold">Cost Comparison</h4>
                <p className="text-sm text-muted-foreground">
                  UK vs Portugal building materials & tools
                </p>
              </Link>
            </div>
          </div>

          {/* Tools & Resources */}
          <div className="mb-16">
            <h3 className="mb-6 text-center text-2xl font-bold">🛠️ Complete Resource Suite</h3>
            <div className="grid gap-4 md:grid-cols-4">
              <Link
                href="/green-calculators"
                className="rounded-lg border bg-card p-4 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
              >
                <div className="mb-3 text-3xl">🌱</div>
                <h4 className="mb-2 text-lg font-semibold">Green Calculators</h4>
                <p className="text-xs text-muted-foreground">Water, wind, growing systems</p>
              </Link>

              <Link
                href="/solar-calculators"
                className="rounded-lg border bg-card p-4 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
              >
                <div className="mb-3 text-3xl">☀️</div>
                <h4 className="mb-2 text-lg font-semibold">Solar Calculators</h4>
                <p className="text-xs text-muted-foreground">Complete solar system design</p>
              </Link>

              <Link
                href="/blog"
                className="rounded-lg border bg-card p-4 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
              >
                <div className="mb-3 text-3xl">📝</div>
                <h4 className="mb-2 text-lg font-semibold">Sustainable Living Blog</h4>
                <p className="text-xs text-muted-foreground">Green tech guides & tutorials</p>
              </Link>

              <Link
                href="/directory"
                className="rounded-lg border bg-card p-4 transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
              >
                <div className="mb-3 text-3xl">�</div>
                <h4 className="mb-2 text-lg font-semibold">Resource Directory</h4>
                <p className="text-xs text-muted-foreground">Properties, guides, tools</p>
              </Link>
            </div>
          </div>

          {/* Premium Services */}
          <div className="mb-12 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-8">
            <h3 className="mb-6 text-center text-2xl font-bold">💎 Premium Services</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-background/50 p-4 text-center">
                <div className="mb-3 text-3xl">🎯</div>
                <h4 className="mb-2 text-lg font-semibold">1-on-1 Consultations</h4>
                <p className="text-sm text-muted-foreground">Personal off-grid planning sessions</p>
              </div>

              <div className="rounded-lg bg-background/50 p-4 text-center">
                <div className="mb-3 text-3xl">🎓</div>
                <h4 className="mb-2 text-lg font-semibold">Masterclass Courses</h4>
                <p className="text-sm text-muted-foreground">Complete off-grid setup guides</p>
              </div>

              <div className="rounded-lg bg-background/50 p-4 text-center">
                <div className="mb-3 text-3xl">🤖</div>
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
                  <span className="text-2xl">🎯</span>
                  <span className="text-muted-foreground">Expert-curated products & reviews</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💰</span>
                  <span className="text-muted-foreground">
                    Best prices through affiliate partnerships
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌍</span>
                  <span className="text-muted-foreground">Real Portugal relocation experience</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛠️</span>
                  <span className="text-muted-foreground">Professional calculators & tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">�</span>
                  <span className="text-muted-foreground">Active community support</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">�</span>
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
