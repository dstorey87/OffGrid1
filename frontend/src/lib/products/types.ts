/**
 * Product types and interfaces for the OffGrid1 shop system
 */

export type ProductCategory =
  | 'solar-panels'
  | 'batteries'
  | 'inverters'
  | 'charge-controllers'
  | 'monitoring'
  | 'wiring'
  | 'mounting'
  | 'tools'
  | 'water-filtration'
  | 'water-pumps'
  | 'water-storage'
  | 'irrigation';

export type Currency = 'USD' | 'EUR' | 'GBP';

export interface ProductPrice {
  amount: number;
  currency: Currency;
  lastUpdated: string;
}

export interface AffiliateLink {
  provider: string; // Amazon, Leroy Merlin, Bricomarché, etc.
  url: string;
  price: ProductPrice;
  availability: 'in-stock' | 'out-of-stock' | 'pre-order' | 'unknown';
  shipping: {
    portugal: boolean;
    eu: boolean;
    worldwide: boolean;
    estimatedDays: number;
  };
}

export interface ProductSpecification {
  key: string;
  value: string;
  unit?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  specifications: ProductSpecification[];
  images: string[];
  affiliateLinks: AffiliateLink[];
  rating: number;
  reviewCount: number;
  tags: string[];
  compatibility: string[];
  installation: {
    difficulty: 'easy' | 'moderate' | 'advanced';
    timeEstimate: string;
    toolsRequired: string[];
  };
  warranty: string;
  certifications: string[];
}

export interface ProductSearchParams {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  currency?: Currency;
  inStockOnly?: boolean;
  shipsToPortugal?: boolean;
  brands?: string[];
  tags?: string[];
  minRating?: number;
}

export interface ProductRecommendation extends Product {
  matchScore: number;
  reason: string;
  alternatives: string[];
}
