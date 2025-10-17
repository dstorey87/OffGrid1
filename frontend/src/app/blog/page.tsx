import Link from 'next/link';
import { Metadata } from 'next';
import { generateSEOMetadata, SEO_KEYWORDS } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Sustainable Living & Green Technology Blog - Expert Guides & Reviews',
  description:
    'Expert guides on sustainable living, green technology, and Portugal digital nomad life. Solar systems, rainwater harvesting, wind power, greywater recycling, hydroponics, and off-grid solutions.',
  keywords: [
    ...SEO_KEYWORDS.LONG_TAIL,
    ...SEO_KEYWORDS.GREEN_SOLUTIONS,
    ...SEO_KEYWORDS.WATER_SYSTEMS,
    'sustainable living blog',
    'green technology guides',
    'rainwater harvesting guide',
    'greywater systems blog',
    'wind power tutorials',
    'hydroponics guides',
    'composting toilet reviews',
    'off grid blog',
    'solar installation guide',
    'Portugal living blog',
    'Portugal tax guide',
    'eco friendly solutions',
  ],
  canonicalUrl: 'https://offgrid1.com/blog',
});

const blogPosts = [
  {
    title: 'Complete Rainwater Harvesting System Guide: Calculate, Build, and Maintain',
    excerpt:
      'Design your complete rainwater collection system. Calculate cistern size, filtration needs, and costs with our free calculator and expert installation guide.',
    slug: 'complete-rainwater-harvesting-system-guide',
    category: 'Water Systems',
    readTime: '15 min read',
    date: '2024-10-17',
    keywords: 'rainwater harvesting calculator, cistern sizing guide, water collection system',
  },
  {
    title: 'Greywater Recycling: Transform Waste Water into Garden Gold',
    excerpt:
      'Build efficient greywater systems to reuse water from sinks, showers, and laundry. Design calculations, treatment options, and legal considerations.',
    slug: 'greywater-recycling-system-design-guide',
    category: 'Water Systems',
    readTime: '18 min read',
    date: '2024-10-16',
    keywords: 'greywater system design, water recycling, sustainable irrigation',
  },
  {
    title: 'Complete Guide: How to Calculate Solar Panel Needs for Off-Grid Cabin',
    excerpt:
      'Step-by-step tutorial on sizing solar panels for off-grid cabins. Includes load analysis, seasonal adjustments, and equipment recommendations.',
    slug: 'calculate-solar-panel-needs-off-grid-cabin',
    category: 'Solar Guides',
    readTime: '12 min read',
    date: '2024-10-15',
    keywords: 'how to calculate solar panel needs, off grid cabin solar, solar panel sizing guide',
  },
  {
    title: 'Portugal Digital Nomad Visa 2024: Complete Application Guide',
    excerpt:
      "Everything you need to know about Portugal's D8 digital nomad visa. Requirements, application process, costs, and insider tips.",
    slug: 'portugal-digital-nomad-visa-guide-2024',
    category: 'Portugal Guides',
    readTime: '15 min read',
    date: '2024-10-10',
    keywords: 'Portugal digital nomad visa 2024, D8 visa application, Portugal visa requirements',
  },
  {
    title: 'Best Solar Batteries for Off-Grid Systems 2024 - LiFePO4 vs AGM Review',
    excerpt:
      'Comprehensive comparison of lithium vs lead-acid batteries for off-grid solar. Performance, lifespan, and cost analysis.',
    slug: 'best-solar-batteries-off-grid-2024-review',
    category: 'Equipment Reviews',
    readTime: '10 min read',
    date: '2024-10-08',
    keywords: 'best solar batteries 2024, LiFePO4 vs AGM batteries, off grid battery comparison',
  },
  {
    title: 'Portugal vs Spain Cost of Living Comparison 2024',
    excerpt:
      'Detailed cost comparison for digital nomads and expats. Housing, food, transport, and lifestyle costs in both countries.',
    slug: 'portugal-vs-spain-cost-living-comparison-2024',
    category: 'Portugal Guides',
    readTime: '8 min read',
    date: '2024-10-05',
    keywords: 'Portugal vs Spain cost of living, Portugal Spain comparison, digital nomad costs',
  },
  {
    title: 'DIY Solar Panel Installation Guide: Step-by-Step Tutorial',
    excerpt:
      'Complete DIY solar installation tutorial. Roof mounting, wiring, safety compliance, and code requirements for beginners.',
    slug: 'diy-solar-panel-installation-guide-tutorial',
    category: 'Solar Guides',
    readTime: '18 min read',
    date: '2024-10-01',
    keywords: 'DIY solar panel installation, solar installation guide, how to install solar panels',
  },
  {
    title: 'Wind Power vs Solar: Complete Comparison Guide for Off-Grid Systems',
    excerpt:
      'Compare wind turbines and solar panels for off-grid power. Cost analysis, energy production, and hybrid system recommendations.',
    slug: 'wind-power-vs-solar-comparison-guide',
    category: 'Renewable Energy',
    readTime: '14 min read',
    date: '2024-10-02',
    keywords: 'wind power vs solar, residential wind turbines, hybrid renewable energy',
  },
  {
    title: 'Hydroponics for Beginners: Complete System Setup Calculator',
    excerpt:
      'Start your hydroponic garden with proper calculations. Nutrient solutions, pH management, and system sizing for maximum yields.',
    slug: 'hydroponics-system-setup-calculator-guide',
    category: 'Growing Systems',
    readTime: '16 min read',
    date: '2024-09-30',
    keywords: 'hydroponics calculator, hydroponic nutrients, soilless growing guide',
  },
  {
    title: 'What Size Solar System Do I Need? Calculator and Guide',
    excerpt:
      'Determine the right solar system size for your home or off-grid setup. Includes our free calculator and sizing methodology.',
    slug: 'what-size-solar-system-do-i-need-calculator',
    category: 'Solar Guides',
    readTime: '12 min read',
    date: '2024-09-28',
    keywords: 'what size solar system do I need, solar system sizing, solar calculator guide',
  },
];

const categories = [
  { name: 'Water Systems', count: 18, color: 'bg-blue-100 text-blue-800' },
  { name: 'Solar Guides', count: 15, color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Portugal Guides', count: 12, color: 'bg-green-100 text-green-800' },
  { name: 'Renewable Energy', count: 10, color: 'bg-purple-100 text-purple-800' },
  { name: 'Growing Systems', count: 8, color: 'bg-pink-100 text-pink-800' },
  { name: 'Equipment Reviews', count: 8, color: 'bg-indigo-100 text-indigo-800' },
  { name: 'Off-Grid Living', count: 6, color: 'bg-orange-100 text-orange-800' },
];

export default function Blog() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-6xl">
            Sustainable Living & Green Tech
            <span className="block text-primary">Expert Guides & Reviews</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            <strong>Complete sustainable living guides</strong> covering solar systems, rainwater
            harvesting, greywater recycling, wind power, hydroponics, and{' '}
            <em>Portugal digital nomad life</em>. Expert tutorials, equipment reviews, and
            calculators for complete off-grid independence.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Calculator CTA */}
            <div className="mb-12 rounded-lg border-2 border-primary bg-gradient-to-r from-primary/10 to-accent/10 p-8">
              <h2 className="mb-4 text-2xl font-bold">🧮 Free Sustainable Living Calculators</h2>
              <p className="mb-4 text-lg text-muted-foreground">
                Use our <strong>comprehensive calculator suite</strong> for solar, water, wind, and
                growing systems. Get exact sizing, costs, and instant shopping lists for your
                sustainable living projects.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/green-calculators/rainwater-harvesting"
                  className="rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Rainwater Calculator
                </Link>
                <Link
                  href="/solar-calculators/load-analysis"
                  className="rounded bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Solar Calculators
                </Link>
                <Link
                  href="/green-calculators"
                  className="rounded border border-primary px-6 py-3 font-semibold hover:bg-accent"
                >
                  All Green Tools
                </Link>
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold">Latest Articles</h2>
              <div className="grid gap-8 md:grid-cols-2">
                {blogPosts.map((post, index) => (
                  <article
                    key={index}
                    className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-lg"
                  >
                    <div className="mb-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          categories.find((cat) => cat.name === post.category)?.color ||
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {post.category}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">{post.readTime}</span>
                    </div>

                    <h3 className="mb-3 text-xl font-bold hover:text-primary">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="mb-4 text-muted-foreground">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <time className="text-xs text-muted-foreground" dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">Categories</h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    href={`/blog/category/${category.name.toLowerCase().replace(' ', '-')}`}
                    className="flex items-center justify-between rounded p-2 hover:bg-accent"
                  >
                    <span>{category.name}</span>
                    <span className="text-sm text-muted-foreground">({category.count})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Tools */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">Popular Calculators</h3>
              <div className="space-y-3">
                <Link
                  href="/green-calculators/rainwater-harvesting"
                  className="block rounded bg-blue-100 p-3 hover:bg-blue-200"
                >
                  <div className="font-medium">Rainwater Harvesting</div>
                  <div className="text-xs text-muted-foreground">Calculate cistern size</div>
                </Link>
                <Link
                  href="/green-calculators/greywater-systems"
                  className="block rounded bg-green-100 p-3 hover:bg-green-200"
                >
                  <div className="font-medium">Greywater Systems</div>
                  <div className="text-xs text-muted-foreground">Design water recycling</div>
                </Link>
                <Link
                  href="/solar-calculators/load-analysis"
                  className="block rounded bg-primary/10 p-3 hover:bg-primary/20"
                >
                  <div className="font-medium">Solar Load Analysis</div>
                  <div className="text-xs text-muted-foreground">Calculate power needs</div>
                </Link>
                <Link
                  href="/green-calculators/wind-power"
                  className="block rounded bg-purple-100 p-3 hover:bg-purple-200"
                >
                  <div className="font-medium">Wind Power Calculator</div>
                  <div className="text-xs text-muted-foreground">Size wind turbines</div>
                </Link>
                <Link
                  href="/pricing"
                  className="block rounded bg-orange-100 p-3 hover:bg-orange-200"
                >
                  <div className="font-medium">Portugal Cost Calculator</div>
                  <div className="text-xs text-muted-foreground">Compare living costs</div>
                </Link>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="rounded-lg border bg-gradient-to-br from-primary/10 to-accent/10 p-6">
              <h3 className="mb-4 text-lg font-semibold">Stay Updated</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Get the latest solar guides and Portugal living tips delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded border px-3 py-2 text-sm"
                />
                <button className="w-full rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
                  Subscribe Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
