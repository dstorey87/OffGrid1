import Link from 'next/link';

export default function SolarShop() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/" className="mb-4 inline-block text-primary hover:underline">
            ← Back to Home
          </Link>
          <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-6xl">
            Solar Equipment Shop
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Curated solar equipment with affiliate links. Get the best value products recommended by
            our calculators with fast delivery and reliable warranties.
          </p>
        </div>

        {/* Coming Soon Notice */}
        <div className="mx-auto max-w-2xl rounded-lg border bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center">
          <div className="mb-4 text-6xl">🚧</div>
          <h2 className="mb-4 text-2xl font-bold">Shop Coming Soon!</h2>
          <p className="mb-6 text-muted-foreground">
            We're building an intelligent shopping system that automatically generates product
            recommendations based on your calculator results. Each product will include:
          </p>
          <div className="mb-6 space-y-2 text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <span>Personalized recommendations from your load analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔗</span>
              <span>Direct affiliate purchase links with best pricing</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <span>Expert reviews and compatibility verification</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <span>Fast delivery from trusted suppliers</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <span>Warranty support and installation guidance</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-semibold">Get personalized product recommendations now:</p>
            <Link
              href="/solar-calculators/load-analysis"
              className="inline-block rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
            >
              Start Load Analysis Calculator →
            </Link>
          </div>
        </div>

        {/* Preview Categories */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold">Product Categories Coming Soon</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mb-3 text-4xl">☀️</div>
              <h3 className="mb-2 text-lg font-semibold">Solar Panels</h3>
              <p className="text-sm text-muted-foreground">
                Monocrystalline, polycrystalline, and flexible panels from trusted manufacturers
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mb-3 text-4xl">🔋</div>
              <h3 className="mb-2 text-lg font-semibold">Battery Storage</h3>
              <p className="text-sm text-muted-foreground">
                LiFePO4, AGM, and gel batteries with BMS and monitoring systems
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mb-3 text-4xl">⚙️</div>
              <h3 className="mb-2 text-lg font-semibold">Inverters</h3>
              <p className="text-sm text-muted-foreground">
                Pure sine wave, grid-tie, and hybrid inverters for all applications
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mb-3 text-4xl">📊</div>
              <h3 className="mb-2 text-lg font-semibold">Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Battery monitors, solar charge controllers, and system monitoring
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mb-3 text-4xl">⚡</div>
              <h3 className="mb-2 text-lg font-semibold">Electrical</h3>
              <p className="text-sm text-muted-foreground">
                Wiring, breakers, fuses, and safety equipment for code compliance
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mb-3 text-4xl">🛠️</div>
              <h3 className="mb-2 text-lg font-semibold">Tools & Hardware</h3>
              <p className="text-sm text-muted-foreground">
                Installation tools, mounting hardware, and maintenance equipment
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
