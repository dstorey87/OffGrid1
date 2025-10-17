import { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object;
  noindex?: boolean;
}

export function generateSEOMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage = '/images/og-default.jpg',
    structuredData,
    noindex = false,
  } = config;

  const fullTitle = title.includes('OffGrid1')
    ? title
    : `${title} | OffGrid1 - Complete Off-Grid Solar Solutions`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    canonical: canonicalUrl,
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'OffGrid1 - Off-Grid Solar & Portugal Living',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@OffGrid1',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    other: structuredData
      ? {
          'structured-data': JSON.stringify(structuredData),
        }
      : undefined,
  };
}

// High-traffic keyword clusters from research
export const SEO_KEYWORDS = {
  SOLAR_CALCULATORS: [
    'solar calculator',
    'solar panel calculator',
    'off grid solar calculator',
    'solar system calculator',
    'solar power calculator',
    'solar battery calculator',
    'solar panel sizing calculator',
    'solar inverter calculator',
    'DIY solar calculator',
    'residential solar calculator',
  ],
  GREEN_SOLUTIONS: [
    'rainwater harvesting calculator',
    'greywater system design',
    'composting toilet calculator',
    'wind power calculator',
    'micro hydro calculator',
    'greenhouse calculator',
    'hydroponics system calculator',
    'aquaponics calculator',
    'biogas calculator',
    'permaculture design calculator',
  ],
  WATER_SYSTEMS: [
    'rainwater collection calculator',
    'cistern sizing calculator',
    'greywater recycling system',
    'blackwater treatment system',
    'water storage calculator',
    'well pump calculator',
    'water filtration system',
    'septic system calculator',
    'pond liner calculator',
    'irrigation system calculator',
  ],
  SUSTAINABLE_LIVING: [
    'sustainable living calculator',
    'eco friendly solutions',
    'green technology calculator',
    'renewable energy systems',
    'carbon footprint calculator',
    'homestead calculator',
    'self sufficiency calculator',
    'zero waste calculator',
    'energy efficiency calculator',
    'sustainable agriculture calculator',
  ],
  OFF_GRID: [
    'off grid living',
    'off grid solar system',
    'off grid power',
    'off grid electricity',
    'off grid energy',
    'self sufficient living',
    'sustainable living',
    'remote power systems',
    'off grid battery bank',
    'off grid inverter sizing',
    'off grid water systems',
    'off grid waste management',
  ],
  PORTUGAL: [
    'Portugal digital nomad visa',
    'living in Portugal',
    'Portugal cost of living',
    'Portugal visa requirements',
    'Portugal property prices',
    'Portugal tax benefits',
    'Portugal retirement',
    'Portugal real estate',
    'moving to Portugal',
    'Portugal lifestyle',
  ],
  SOLAR_PRODUCTS: [
    'best solar panels 2024',
    'solar battery reviews',
    'lithium solar batteries',
    'MPPT charge controller',
    'pure sine wave inverter',
    'solar panel deals',
    'cheap solar panels',
    'solar equipment reviews',
    'solar panel installation',
    'DIY solar kit',
  ],
  LONG_TAIL: [
    'how to calculate solar panel needs',
    'what size solar system do I need',
    'how many solar panels for off grid cabin',
    'best solar batteries for off grid',
    'solar panel calculator by zip code',
    'off grid solar system cost calculator',
    'DIY solar panel installation guide',
    'solar battery bank sizing calculator',
    'how to calculate rainwater harvesting needs',
    'what size water tank do I need',
    'greywater system design calculator',
    'composting toilet sizing guide',
    'wind turbine calculator for home',
    'micro hydro power calculator',
    'greenhouse heating calculator',
    'hydroponics nutrient calculator',
    'biogas production calculator',
    'permaculture zone calculator',
    'Portugal vs Spain cost of living',
    'Portugal digital nomad tax benefits',
  ],
};

// Structured data schemas
export const generateCalculatorSchema = (
  calculatorName: string,
  description: string,
  url: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: `${calculatorName} - OffGrid1`,
  description,
  url,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  provider: {
    '@type': 'Organization',
    name: 'OffGrid1',
    url: 'https://offgrid1.com',
  },
});

export const generateProductSchema = (product: {
  name: string;
  description: string;
  brand: string;
  price: string;
  rating?: number;
  reviewCount?: number;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  brand: {
    '@type': 'Brand',
    name: product.brand,
  },
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: product.brand,
    },
  },
  aggregateRating: product.rating
    ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 100,
      }
    : undefined,
});

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OffGrid1',
  description: 'Complete off-grid solar solutions, calculators, and Portugal living guides',
  url: 'https://offgrid1.com',
  logo: 'https://offgrid1.com/images/logo.png',
  sameAs: [
    'https://twitter.com/OffGrid1',
    'https://facebook.com/OffGrid1',
    'https://youtube.com/OffGrid1',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'hello@offgrid1.com',
  },
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// SEO-optimized internal linking helpers
export const INTERNAL_LINKS = {
  SOLAR_CALCULATORS: {
    'load analysis': '/solar-calculators/load-analysis',
    'panel sizing': '/solar-calculators/panel-sizing',
    'battery calculator': '/solar-calculators/battery-sizing',
    'inverter sizing': '/solar-calculators/inverter-sizing',
    'electrical calculator': '/solar-calculators/electrical',
    'system designer': '/solar-calculators/system-designer',
  },
  WATER_CALCULATORS: {
    'rainwater harvesting': '/green-calculators/rainwater-harvesting',
    'greywater systems': '/green-calculators/greywater-systems',
    'water storage': '/green-calculators/water-storage',
    'irrigation calculator': '/green-calculators/irrigation',
    'well pump sizing': '/green-calculators/well-pump',
  },
  GREEN_CALCULATORS: {
    'wind power': '/green-calculators/wind-power',
    'micro hydro': '/green-calculators/micro-hydro',
    'composting toilet': '/green-calculators/composting-toilet',
    'greenhouse calculator': '/green-calculators/greenhouse',
    'hydroponics calculator': '/green-calculators/hydroponics',
    'biogas calculator': '/green-calculators/biogas',
    'permaculture design': '/green-calculators/permaculture',
  },
  GUIDES: {
    'Portugal visa guide': '/guides/portugal-visa',
    'off-grid living guide': '/guides/off-grid-living',
    'solar installation guide': '/guides/solar-installation',
  },
  PRODUCTS: {
    'solar panels': '/solar-shop/panels',
    'solar batteries': '/solar-shop/batteries',
    inverters: '/solar-shop/inverters',
  },
};

// Content optimization helpers
export const optimizeContentForSEO = (content: string, _targetKeywords: string[]) => {
  // Add semantic variations and related terms
  const _semanticTerms = {
    solar: ['photovoltaic', 'PV', 'renewable energy', 'clean energy'],
    calculator: ['tool', 'sizing guide', 'estimation tool', 'planning tool'],
    'off-grid': ['off-the-grid', 'standalone', 'independent', 'self-sufficient'],
    battery: ['energy storage', 'power storage', 'battery bank', 'storage system'],
    water: ['H2O', 'aqua', 'hydro', 'liquid'],
    green: ['eco-friendly', 'sustainable', 'environmentally friendly', 'clean'],
    renewable: ['sustainable', 'green', 'clean', 'eco-friendly'],
  };

  // This would implement content optimization logic
  return content;
};
