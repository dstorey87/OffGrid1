import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryProvider } from '@/components/query-provider';
import ErrorBoundary from '@/components/error-boundary';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://offgrid1.com'),
  title: {
    default: 'OffGrid1 - Free Solar Calculators & Portugal Digital Nomad Guide',
    template: '%s | OffGrid1',
  },
  description:
    'FREE solar panel calculator, battery sizing tools, and Portugal digital nomad visa guides. Calculate your complete off-grid solar system and plan your Portugal move with expert guidance.',
  keywords: [
    'solar calculator',
    'off grid solar system',
    'Portugal digital nomad visa',
    'solar panel calculator',
    'battery sizing calculator',
    'Portugal cost of living',
    'off grid living',
    'solar system calculator',
    'Portugal visa requirements',
    'free solar calculator',
    'inverter calculator',
    'load analysis calculator',
  ],
  authors: [{ name: 'OffGrid1 Team' }],
  creator: 'OffGrid1',
  publisher: 'OffGrid1',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://offgrid1.com',
    siteName: 'OffGrid1 - Off-Grid Solar & Portugal Living',
    title: 'Free Solar Calculators & Portugal Digital Nomad Guide',
    description:
      'Calculate solar panels, batteries, inverters for off-grid systems. Complete Portugal visa and cost of living guides for digital nomads.',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'OffGrid1 - Solar Calculators & Portugal Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@OffGrid1',
    creator: '@OffGrid1',
    title: 'Free Solar Calculators & Portugal Guide',
    description: 'Calculate solar systems and plan your Portugal move',
    images: ['/images/og-default.jpg'],
  },
  alternates: {
    canonical: 'https://offgrid1.com',
  },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://amzn.to" />

        {/* Organization Schema for better search understanding */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'OffGrid1',
              url: 'https://offgrid1.com',
              description: 'Complete off-grid solar calculators and Portugal digital nomad guides',
              logo: 'https://offgrid1.com/images/logo.png',
              sameAs: ['https://twitter.com/OffGrid1', 'https://youtube.com/OffGrid1'],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                email: 'hello@offgrid1.com',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="offgrid-theme"
          >
            <QueryProvider>
              <div className="relative min-h-screen">{children}</div>
            </QueryProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
