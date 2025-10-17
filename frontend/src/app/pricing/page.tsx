'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PortugalHeader from '@/components/PortugalHeader';
import NoSSR from '@/components/no-ssr';

interface MaterialPrice {
  id: string;
  name: string;
  category: string;
  unit: string;
  ukPrice: number;
  portugalPrice: number;
  ukCurrency: string;
  portugalCurrency: string;
  lastUpdated: string;
  suppliers: {
    uk: string[];
    portugal: string[];
  };
}

interface PriceCalculation {
  material: string;
  quantity: number;
  ukTotal: number;
  portugalTotal: number;
  savings: number;
  savingsPercentage: number;
}

export default function PricingPage() {
  const [materials, setMaterials] = useState<MaterialPrice[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [calculator, setCalculator] = useState({
    length: '',
    width: '',
    height: '',
    material: 'timber-2x4',
    quantity: '',
  });
  const [calculation, setCalculation] = useState<PriceCalculation | null>(null);

  // Mock data - in real app, this would come from APIs
  useEffect(() => {
    const mockMaterials: MaterialPrice[] = [
      {
        id: 'timber-2x4',
        name: '2x4 Treated Timber',
        category: 'Timber',
        unit: 'per metre',
        ukPrice: 8.5,
        portugalPrice: 4.2,
        ukCurrency: '£',
        portugalCurrency: '€',
        lastUpdated: '2025-10-16',
        suppliers: {
          uk: ['B&Q', 'Wickes', 'Travis Perkins'],
          portugal: ['Leroy Merlin', 'Aki', 'Bricomarché'],
        },
      },
      {
        id: 'concrete-blocks',
        name: 'Concrete Blocks (20x20x40cm)',
        category: 'Masonry',
        unit: 'per block',
        ukPrice: 2.8,
        portugalPrice: 1.45,
        ukCurrency: '£',
        portugalCurrency: '€',
        lastUpdated: '2025-10-16',
        suppliers: {
          uk: ['Travis Perkins', 'Jewson', 'Selco'],
          portugal: ['Leroy Merlin', 'Bricomarché', 'Cofundi'],
        },
      },
      {
        id: 'cement-bag',
        name: 'Portland Cement (25kg bag)',
        category: 'Cement & Aggregates',
        unit: 'per bag',
        ukPrice: 6.5,
        portugalPrice: 3.8,
        ukCurrency: '£',
        portugalCurrency: '€',
        lastUpdated: '2025-10-16',
        suppliers: {
          uk: ['Wickes', 'B&Q', 'Travis Perkins'],
          portugal: ['Leroy Merlin', 'Secil', 'Cimpor'],
        },
      },
      {
        id: 'sand-tonne',
        name: 'Building Sand',
        category: 'Cement & Aggregates',
        unit: 'per tonne',
        ukPrice: 35.0,
        portugalPrice: 18.0,
        ukCurrency: '£',
        portugalCurrency: '€',
        lastUpdated: '2025-10-16',
        suppliers: {
          uk: ['Local Quarries', 'Travis Perkins', 'Jewson'],
          portugal: ['Agregados do Centro', 'Secil Britas', 'Local Quarries'],
        },
      },
      {
        id: 'roof-tiles',
        name: 'Clay Roof Tiles',
        category: 'Roofing',
        unit: 'per m²',
        ukPrice: 12.0,
        portugalPrice: 8.5,
        ukCurrency: '£',
        portugalCurrency: '€',
        lastUpdated: '2025-10-16',
        suppliers: {
          uk: ['Travis Perkins', 'Roofing Superstore', 'Local Suppliers'],
          portugal: ['Torreense', 'Cerâmica Vale da Gândara', 'Leroy Merlin'],
        },
      },
      {
        id: 'insulation-rockwool',
        name: 'Rockwool Insulation (100mm)',
        category: 'Insulation',
        unit: 'per m²',
        ukPrice: 8.9,
        portugalPrice: 6.2,
        ukCurrency: '£',
        portugalCurrency: '€',
        lastUpdated: '2025-10-16',
        suppliers: {
          uk: ['Wickes', 'Screwfix', 'Insulation Express'],
          portugal: ['Leroy Merlin', 'Rockwool Portugal', 'Bricomarché'],
        },
      },
    ];
    setMaterials(mockMaterials);
  }, []);

  const categories = [
    'all',
    'Timber',
    'Masonry',
    'Cement & Aggregates',
    'Roofing',
    'Insulation',
    'Electrical',
    'Plumbing',
  ];

  const filteredMaterials = materials.filter(
    (material) => selectedCategory === 'all' || material.category === selectedCategory
  );

  const calculateMaterialCost = () => {
    const selectedMaterial = materials.find((m) => m.id === calculator.material);
    if (!selectedMaterial || !calculator.quantity) return;

    const quantity = parseFloat(calculator.quantity);
    const ukTotal = selectedMaterial.ukPrice * quantity;
    const portugalTotal = selectedMaterial.portugalPrice * quantity;
    const savings = ukTotal - portugalTotal;
    const savingsPercentage = (savings / ukTotal) * 100;

    setCalculation({
      material: selectedMaterial.name,
      quantity,
      ukTotal,
      portugalTotal,
      savings,
      savingsPercentage,
    });
  };

  const calculateAreaQuantity = () => {
    if (!calculator.length || !calculator.width) return;

    const length = parseFloat(calculator.length);
    const width = parseFloat(calculator.width);
    const area = length * width;

    setCalculator((prev) => ({ ...prev, quantity: area.toString() }));
  };

  const getSavingsColor = (ukPrice: number, portugalPrice: number) => {
    const savingsPercentage = ((ukPrice - portugalPrice) / ukPrice) * 100;
    if (savingsPercentage > 50) return 'text-green-600';
    if (savingsPercentage > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  return (
    <main className="renewable-gradient portugal-pattern min-h-screen">
      <div className="portugal-accent w-full"></div>
      <PortugalHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary">UK vs Portugal Price Comparison</h1>
          <p className="text-lg text-muted-foreground">
            Compare building material costs and calculate potential savings for your project
          </p>
        </div>

        <NoSSR fallback={<div className="h-48 animate-pulse rounded-lg bg-muted"></div>}>
          {/* Material Calculator */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>📐 Material Cost Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">Length (m)</label>
                  <Input
                    type="number"
                    value={calculator.length}
                    onChange={(e) => setCalculator((prev) => ({ ...prev, length: e.target.value }))}
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Width (m)</label>
                  <Input
                    type="number"
                    value={calculator.width}
                    onChange={(e) => setCalculator((prev) => ({ ...prev, width: e.target.value }))}
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Material</label>
                  <select
                    value={calculator.material}
                    onChange={(e) =>
                      setCalculator((prev) => ({ ...prev, material: e.target.value }))
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    {materials.map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Quantity</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={calculator.quantity}
                      onChange={(e) =>
                        setCalculator((prev) => ({ ...prev, quantity: e.target.value }))
                      }
                      placeholder="80"
                    />
                    <Button onClick={calculateAreaQuantity} variant="outline" size="sm">
                      Auto
                    </Button>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button onClick={calculateMaterialCost} className="w-full">
                    Calculate
                  </Button>
                </div>
              </div>

              {calculation && (
                <div className="mt-6 rounded-lg border bg-gradient-to-r from-blue-50 to-green-50 p-4">
                  <h4 className="mb-3 font-semibold">Cost Comparison Results:</h4>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">UK Total Cost</p>
                      <p className="text-lg font-semibold text-red-600">
                        £{calculation.ukTotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Portugal Total Cost</p>
                      <p className="text-lg font-semibold text-green-600">
                        €{calculation.portugalTotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Potential Savings</p>
                      <p className="text-lg font-semibold text-green-600">
                        {calculation.savingsPercentage.toFixed(1)}% less
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Filter */}
          <div className="mb-6">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Comparison Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMaterials.map((material) => {
              const savings =
                ((material.ukPrice - material.portugalPrice) / material.ukPrice) * 100;
              return (
                <Card
                  key={material.id}
                  className="tile-hover overflow-hidden border-l-4 border-l-primary/30"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{material.name}</CardTitle>
                        <Badge className="mt-1">{material.category}</Badge>
                      </div>
                      <Badge
                        variant="outline"
                        className={getSavingsColor(material.ukPrice, material.portugalPrice)}
                      >
                        {savings.toFixed(0)}% less
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border bg-red-50 p-3 text-center">
                        <p className="text-sm font-medium text-red-700">UK Price</p>
                        <p className="text-lg font-semibold text-red-600">
                          {formatCurrency(material.ukPrice, material.ukCurrency)}
                        </p>
                        <p className="text-xs text-muted-foreground">{material.unit}</p>
                      </div>
                      <div className="rounded-lg border bg-green-50 p-3 text-center">
                        <p className="text-sm font-medium text-green-700">Portugal Price</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(material.portugalPrice, material.portugalCurrency)}
                        </p>
                        <p className="text-xs text-muted-foreground">{material.unit}</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="mb-2 text-sm font-medium">UK Suppliers:</h5>
                      <div className="flex flex-wrap gap-1">
                        {material.suppliers.uk.map((supplier) => (
                          <Badge key={supplier} variant="outline" className="text-xs">
                            {supplier}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="mb-2 text-sm font-medium">Portugal Suppliers:</h5>
                      <div className="flex flex-wrap gap-1">
                        {material.suppliers.portugal.map((supplier) => (
                          <Badge key={supplier} variant="outline" className="text-xs">
                            {supplier}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Updated: {material.lastUpdated}</span>
                      <Button variant="outline" size="sm">
                        Get Quotes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Exchange Rate Notice */}
          <Card className="mt-8">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💱</span>
                <div>
                  <h4 className="font-semibold">Exchange Rate Notice</h4>
                  <p className="text-sm text-muted-foreground">
                    Prices shown are approximate and subject to currency fluctuations. Current rate:
                    £1 ≈ €1.16 (indicative only - check current rates before purchasing)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Integration Notice */}
          <Card className="mt-4 border-2 border-dashed border-primary/30 bg-primary/5">
            <CardContent className="p-6 text-center">
              <h3 className="mb-2 text-xl font-semibold text-primary">
                Coming Soon: Live API Integration
              </h3>
              <p className="mb-4 text-muted-foreground">
                We&apos;re working on real-time price feeds from major suppliers in both the UK and
                Portugal
              </p>
              <Button className="bg-gradient-to-r from-primary to-accent text-white">
                Request API Access
              </Button>
            </CardContent>
          </Card>
        </NoSSR>
      </div>
    </main>
  );
}
