'use client';

import Link from 'next/link';
import Image from 'next/image';
import { WaterIcon, PlantIcon, TargetIcon } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Metadata moved to layout or separate metadata export

const calculatorCategories = [
  {
    title: 'Water Systems',
    icon: WaterIcon,
    description: 'Rainwater harvesting, greywater recycling, and water storage solutions',
    calculators: [
      {
        name: 'Total Water Independence Calculator',
        description: 'Complete self-sufficiency system for household + farm (Portugal optimized)',
        href: '/green-calculators/total-water-independence',
        difficulty: 'Hard',
        time: '15 min',
        popular: true,
      },
      {
        name: 'Water Independence Build Guide',
        description: 'Complete construction plans, shopping list & diagrams for water independence',
        href: '/water-independence-guide',
        difficulty: 'Medium',
        time: '10 min',
        popular: true,
      },
      {
        name: 'Rainwater Harvesting Calculator',
        description: 'Calculate cistern size, collection area, and annual water yield',
        href: '/green-calculators/rainwater-harvesting',
        difficulty: 'Easy',
        time: '5 min',
        popular: true,
      },
      {
        name: 'Greywater System Designer',
        description: 'Size greywater treatment and distribution systems',
        href: '/green-calculators/greywater-systems',
        difficulty: 'Medium',
        time: '8 min',
        popular: true,
      },
      {
        name: 'Water Storage Calculator',
        description: 'Determine optimal tank size and backup water needs',
        href: '/green-calculators/water-storage',
        difficulty: 'Easy',
        time: '4 min',
        popular: false,
      },
      {
        name: 'Irrigation System Calculator',
        description: 'Design efficient drip irrigation and sprinkler systems',
        href: '/green-calculators/irrigation',
        difficulty: 'Medium',
        time: '10 min',
        popular: false,
      },
    ],
  },
  {
    title: '🌪️ Alternative Energy',
    description: 'Wind, micro-hydro, and other renewable energy solutions',
    calculators: [
      {
        name: 'Wind Power Calculator',
        description: 'Size wind turbines and estimate power generation',
        href: '/green-calculators/wind-power',
        difficulty: 'Hard',
        time: '12 min',
        popular: true,
      },
      {
        name: 'Micro Hydro Calculator',
        description: 'Calculate power output from streams and small rivers',
        href: '/green-calculators/micro-hydro',
        difficulty: 'Hard',
        time: '15 min',
        popular: false,
      },
      {
        name: 'Biogas Production Calculator',
        description: 'Estimate methane production from organic waste',
        href: '/green-calculators/biogas',
        difficulty: 'Medium',
        time: '8 min',
        popular: false,
      },
    ],
  },
  {
    title: 'Growing Systems',
    icon: PlantIcon,
    description: 'Hydroponics, aquaponics, and greenhouse calculations',
    calculators: [
      {
        name: 'Hydroponics Calculator',
        description: 'Calculate nutrients, pH, and system requirements',
        href: '/green-calculators/hydroponics',
        difficulty: 'Medium',
        time: '10 min',
        popular: true,
      },
      {
        name: 'Greenhouse Calculator',
        description: 'Size heating, cooling, and ventilation systems',
        href: '/green-calculators/greenhouse',
        difficulty: 'Medium',
        time: '12 min',
        popular: false,
      },
      {
        name: 'Aquaponics Calculator',
        description: 'Balance fish tanks, grow beds, and nutrient cycles',
        href: '/green-calculators/aquaponics',
        difficulty: 'Hard',
        time: '15 min',
        popular: false,
      },
      {
        name: 'Composting Calculator',
        description: 'Calculate compost bin size and decomposition time',
        href: '/green-calculators/composting',
        difficulty: 'Easy',
        time: '5 min',
        popular: true,
      },
    ],
  },
  {
    title: '🏠 Waste Management',
    description: 'Sustainable waste treatment and recycling solutions',
    calculators: [
      {
        name: 'Composting Toilet Calculator',
        description: 'Size composting toilets and ventilation systems',
        href: '/green-calculators/composting-toilet',
        difficulty: 'Medium',
        time: '8 min',
        popular: true,
      },
      {
        name: 'Septic System Calculator',
        description: 'Design septic tanks and leach field systems',
        href: '/green-calculators/septic-system',
        difficulty: 'Hard',
        time: '15 min',
        popular: false,
      },
      {
        name: 'Recycling Calculator',
        description: 'Calculate waste reduction and recycling benefits',
        href: '/green-calculators/recycling',
        difficulty: 'Easy',
        time: '5 min',
        popular: false,
      },
    ],
  },
  {
    title: '🌍 Sustainability Planning',
    description: 'Holistic design and environmental impact calculations',
    calculators: [
      {
        name: 'Carbon Footprint Calculator',
        description: 'Measure and reduce your environmental impact',
        href: '/green-calculators/carbon-footprint',
        difficulty: 'Medium',
        time: '10 min',
        popular: true,
      },
      {
        name: 'Permaculture Design Calculator',
        description: 'Plan sustainable land use and food systems',
        href: '/green-calculators/permaculture',
        difficulty: 'Hard',
        time: '20 min',
        popular: false,
      },
      {
        name: 'Energy Efficiency Calculator',
        description: 'Audit and improve home energy performance',
        href: '/green-calculators/energy-efficiency',
        difficulty: 'Medium',
        time: '12 min',
        popular: true,
      },
    ],
  },
];

export default function GreenCalculators() {
  const popularCalculators = calculatorCategories
    .flatMap((category) => category.calculators)
    .filter((calc) => calc.popular);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Header with Image */}
        <div className="relative mb-16 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80"
              alt="Sustainable green technology and water systems"
              fill
              className="object-cover opacity-10"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background"></div>
          </div>

          <div className="relative z-10 px-4 py-16 text-center md:px-8 md:py-20">
            <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-6xl">
              Green Technology
              <span className="block text-primary">Calculators & Tools</span>
            </h1>
            <p className="mx-auto max-w-4xl text-xl text-foreground">
              <strong>Comprehensive sustainable living calculators</strong> for rainwater
              harvesting, greywater systems, wind power, hydroponics, composting toilets, and more{' '}
              <em>eco-friendly solutions</em>. Plan your complete off-grid and sustainable lifestyle
              with our expert tools.
            </p>
          </div>
        </div>

        {/* Popular Calculators */}
        <div className="mb-16">
          <h2 className="mb-8 flex items-center gap-3 text-3xl font-bold">
            <TargetIcon size="md" />
            Most Popular Tools
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularCalculators.map((calculator, index) => (
              <Link key={index} href={calculator.href} className="group">
                <Card className="relative h-full overflow-hidden transition-all hover:shadow-lg group-hover:-translate-y-1">
                  <div className="absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10">
                    <Image
                      src={
                        index === 0
                          ? 'https://images.unsplash.com/photo-1563410959-f99e14e49e09?w=400&q=80'
                          : index === 1
                            ? 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80'
                            : index === 2
                              ? 'https://images.unsplash.com/photo-1563005147-cc73a7094f93?w=400&q=80'
                              : index === 3
                                ? 'https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?w=400&q=80'
                                : index === 4
                                  ? 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=400&q=80'
                                  : index === 5
                                    ? 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80'
                                    : 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80'
                      }
                      alt={calculator.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{calculator.difficulty}</Badge>
                      <span className="text-sm text-muted-foreground">{calculator.time}</span>
                    </div>
                    <CardTitle className="group-hover:text-primary">{calculator.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription>{calculator.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* All Calculator Categories */}
        <div className="space-y-16">
          {calculatorCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="mb-4 flex items-center gap-3 text-3xl font-bold">
                {category.icon && <category.icon size="lg" />}
                {category.title}
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">{category.description}</p>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.calculators.map((calculator, calcIndex) => (
                  <Link key={calcIndex} href={calculator.href} className="group">
                    <Card className="relative h-full overflow-hidden transition-all hover:shadow-lg group-hover:-translate-y-1">
                      <div className="absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10">
                        <Image
                          src={
                            categoryIndex === 0 && calcIndex === 0
                              ? 'https://images.unsplash.com/photo-1563410959-f99e14e49e09?w=400&q=80'
                              : categoryIndex === 0 && calcIndex === 1
                                ? 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80'
                                : categoryIndex === 0 && calcIndex === 2
                                  ? 'https://images.unsplash.com/photo-1563005147-cc73a7094f93?w=400&q=80'
                                  : categoryIndex === 0 && calcIndex === 3
                                    ? 'https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?w=400&q=80'
                                    : categoryIndex === 1 && calcIndex === 0
                                      ? 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=400&q=80'
                                      : categoryIndex === 1 && calcIndex === 1
                                        ? 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80'
                                        : categoryIndex === 2 && calcIndex === 0
                                          ? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'
                                          : categoryIndex === 2 && calcIndex === 1
                                            ? 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=80'
                                            : categoryIndex === 3
                                              ? 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80'
                                              : 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80'
                          }
                          alt={calculator.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="relative z-10">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={
                              calculator.difficulty === 'Easy'
                                ? 'default'
                                : calculator.difficulty === 'Medium'
                                  ? 'secondary'
                                  : 'destructive'
                            }
                          >
                            {calculator.difficulty}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{calculator.time}</span>
                          {calculator.popular && (
                            <Badge variant="outline" className="ml-2">
                              🔥 Popular
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="group-hover:text-primary">
                          {calculator.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <CardDescription>{calculator.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-lg border-2 border-primary bg-gradient-to-r from-primary/10 to-accent/10 p-8 text-center">
          <h2 className="mb-4 flex items-center justify-center gap-2 text-2xl font-bold">
            <PlantIcon size="md" />
            Start Your Sustainable Journey
          </h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Need help choosing the right green technologies? Our <strong>solar calculators</strong>{' '}
            work perfectly with these sustainable solutions for complete off-grid living.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/solar-calculators/load-analysis"
              className="rounded bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Calculate Solar Needs
            </Link>
            <Link
              href="/green-calculators/rainwater-harvesting"
              className="rounded border border-primary px-6 py-3 font-semibold hover:bg-accent"
            >
              Size Water System
            </Link>
            <Link
              href="/pricing"
              className="rounded bg-accent px-6 py-3 font-semibold hover:bg-accent/90"
            >
              Compare Costs
            </Link>
          </div>
        </div>

        {/* SEO Content */}
        <div className="prose prose-lg mx-auto mt-16 max-w-4xl">
          <h2>Complete Sustainable Living Calculator Suite</h2>
          <p>
            Our <strong>green technology calculators</strong> help you design and size every aspect
            of sustainable living. From <em>rainwater harvesting systems</em> that capture and store
            water efficiently, to <em>greywater recycling</em> that reduces water waste, we cover
            all the essential calculations.
          </p>

          <h3>Water Independence Solutions</h3>
          <p>
            Calculate optimal <strong>rainwater collection</strong> based on your roof area and
            local rainfall data. Our <em>greywater system calculator</em> helps you recycle water
            from sinks, showers, and laundry for irrigation. Size storage tanks, pumps, and
            filtration systems for complete water independence.
          </p>

          <h3>Alternative Energy Beyond Solar</h3>
          <p>
            While our <Link href="/solar-calculators">solar calculators</Link> handle photovoltaic
            systems, these tools cover <strong>wind power generation</strong>, micro-hydro systems
            for streams, and biogas production from organic waste. Diversify your renewable energy
            portfolio for maximum reliability.
          </p>

          <h3>Food Production & Growing Systems</h3>
          <p>
            Design productive <em>hydroponics and aquaponics systems</em> with precise nutrient
            calculations. Size greenhouses for year-round growing, calculate compost requirements,
            and plan permaculture food forests for sustainable agriculture.
          </p>

          <p className="text-center text-muted-foreground">
            <strong>Start with any calculator above</strong> - they&apos;re all free and provide
            instant results with shopping lists and implementation guides.
          </p>
        </div>
      </div>
    </main>
  );
}
