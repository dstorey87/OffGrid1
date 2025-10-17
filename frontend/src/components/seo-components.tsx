'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  data: object;
}

export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [data]);

  return null;
}

// Breadcrumb component for SEO
interface BreadcrumbProps {
  items: Array<{
    name: string;
    href?: string;
  }>;
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href ? `https://offgrid1.com${item.href}` : undefined,
    })),
  };

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex space-x-2 text-sm text-muted-foreground">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {item.href ? (
                <a href={item.href} className="hover:text-primary">
                  {item.name}
                </a>
              ) : (
                <span className="font-medium text-foreground">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

// FAQ Schema component
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <StructuredData data={faqSchema} />;
}

// Article Schema component
interface ArticleSchemaProps {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}

export function ArticleSchema({
  headline,
  description,
  author,
  datePublished,
  dateModified,
  image,
}: ArticleSchemaProps) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'OffGrid1',
      logo: {
        '@type': 'ImageObject',
        url: 'https://offgrid1.com/logo.png',
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    image: image
      ? {
          '@type': 'ImageObject',
          url: image,
        }
      : undefined,
  };

  return <StructuredData data={articleSchema} />;
}

// Product Schema component for affiliate products
interface ProductSchemaProps {
  name: string;
  description: string;
  brand: string;
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  rating?: {
    value: number;
    count: number;
  };
  image?: string;
}

export function ProductSchema({
  name,
  description,
  brand,
  price,
  currency,
  availability,
  rating,
  image,
}: ProductSchemaProps) {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
    },
    aggregateRating: rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: rating.value.toString(),
          reviewCount: rating.count.toString(),
        }
      : undefined,
    image: image
      ? {
          '@type': 'ImageObject',
          url: image,
        }
      : undefined,
  };

  return <StructuredData data={productSchema} />;
}

// Service Schema for Portugal services
interface ServiceSchemaProps {
  name: string;
  description: string;
  serviceType: string;
  areaServed: string;
  provider: string;
}

export function ServiceSchema({
  name,
  description,
  serviceType,
  areaServed,
  provider,
}: ServiceSchemaProps) {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    areaServed: {
      '@type': 'Place',
      name: areaServed,
    },
    provider: {
      '@type': 'Organization',
      name: provider,
    },
  };

  return <StructuredData data={serviceSchema} />;
}
