import { NextRequest, NextResponse } from 'next/server';
import type { Product, ProductSearchParams } from '@/lib/products/types';
import { PRODUCT_DATABASE } from '@/lib/products/database';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const filters: ProductSearchParams = {
    category: searchParams.get('category') as any,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    currency: (searchParams.get('currency') as any) || 'EUR',
    inStockOnly: searchParams.get('inStockOnly') === 'true',
    shipsToPortugal: searchParams.get('shipsToPortugal') === 'true',
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
  };

  // Start with full database
  let results = PRODUCT_DATABASE;

  // Apply filters
  if (filters.category) {
    results = results.filter((p) => p.category === filters.category);
  }

  if (filters.inStockOnly) {
    results = results.filter((p) =>
      p.affiliateLinks.some((link) => link.availability === 'in-stock')
    );
  }

  if (filters.shipsToPortugal) {
    results = results.filter((p) => p.affiliateLinks.some((link) => link.shipping.portugal));
  }

  if (filters.minRating) {
    results = results.filter((p) => p.rating >= (filters.minRating || 0));
  }

  if (filters.minPrice || filters.maxPrice) {
    results = results.filter((p) => {
      const prices = p.affiliateLinks
        .filter((link) => link.price.currency === filters.currency)
        .map((link) => link.price.amount);

      if (prices.length === 0) return false;

      const minPrice = Math.min(...prices);

      if (filters.minPrice && minPrice < filters.minPrice) return false;
      if (filters.maxPrice && minPrice > filters.maxPrice) return false;

      return true;
    });
  }

  return NextResponse.json({
    products: results,
    total: results.length,
    filters,
  });
}
