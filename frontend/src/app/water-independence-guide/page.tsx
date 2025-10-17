'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, ShoppingCart, Wrench, Ruler, Edit, MapPin } from 'lucide-react';

type Region = 'uk' | 'portugal' | 'us';

interface Supplier {
  name: string;
  location: string;
  website?: string;
  phone?: string;
  notes: string;
}

interface RegionConfig {
  currency: string;
  currencySymbol: string;
  lengthUnit: string;
  volumeUnit: string;
  amazonDomain: string;
  IBCPrice: number;
  gutterPrice: number;
  pumpPrice: number;
  linerPricePerSqM: number;
  cisternPrice: number;
  excavationPricePerCubicM: number;
  localSuppliers?: Record<string, Supplier[]>;
}

const regionConfigs: Record<Region, RegionConfig> = {
  uk: {
    currency: 'GBP',
    currencySymbol: '£',
    lengthUnit: 'm',
    volumeUnit: 'litres',
    amazonDomain: 'amazon.co.uk',
    IBCPrice: 65,
    gutterPrice: 15,
    pumpPrice: 120,
    linerPricePerSqM: 12,
    cisternPrice: 12000,
    excavationPricePerCubicM: 18,
  },
  portugal: {
    currency: 'EUR',
    currencySymbol: '€',
    lengthUnit: 'm',
    volumeUnit: 'litres',
    amazonDomain: 'amazon.es',
    IBCPrice: 35, // Local used totes from farms
    gutterPrice: 8, // Leroy Merlin Portugal
    pumpPrice: 85, // Local agriculture suppliers
    linerPricePerSqM: 7, // Direct from wholesalers
    cisternPrice: 6500, // Local concrete suppliers
    excavationPricePerCubicM: 12, // Local excavator hire DIY
    localSuppliers: {
      ibcTotes: [
        {
          name: 'Facebook Marketplace Central Portugal',
          location: 'Coimbra, Leiria, Castelo Branco area',
          notes: 'Used 1000L food-grade IBCs €25-40. Search "IBC 1000L" or "Deposito 1000L"',
        },
        {
          name: 'OLX Portugal',
          location: 'Nacional',
          website: 'olx.pt',
          notes: 'Used IBCs €30-50, check food-grade certification',
        },
        {
          name: 'Local Olive Oil/Wine Producers',
          location: 'Your area',
          notes: 'Ask wineries and olive oil mills - they often sell used tanks cheap (€20-35)',
        },
      ],
      building: [
        {
          name: 'Leroy Merlin',
          location: 'Coimbra, Leiria',
          website: 'leroymerlin.pt',
          phone: '+351 239 801 900',
          notes: 'PVC gutters €6-10/m, downspouts, fittings. Quality materials.',
        },
        {
          name: 'Bricomarché',
          location: 'Multiple locations',
          website: 'bricomarche.pt',
          notes: 'Cheaper alternative for PVC plumbing, gutters €5-8/m',
        },
        {
          name: 'Ferreira & Santos',
          location: 'Regional builders merchants',
          notes: 'Wholesale prices if buying bulk. Timber, cement, aggregate.',
        },
      ],
      pond: [
        {
          name: 'Geoplastic',
          location: 'Santarém',
          website: 'geoplastic.pt',
          phone: '+351 243 329 030',
          notes: 'EPDM liner €5-8/m² for bulk orders. Geotextile underlay.',
        },
        {
          name: 'Agriloja',
          location: 'Multiple agricultural stores',
          website: 'agriloja.pt',
          notes: 'Agricultural pond liners, cheaper quality €4-6/m²',
        },
        {
          name: 'Local Excavator Hire',
          location: 'Your area',
          notes: 'Mini-digger hire €80-120/day. Ask local farmers for contacts. Much cheaper than contractors.',
        },
      ],
      pumps: [
        {
          name: 'Agriloja / Casa do Agricultor',
          location: 'Regional',
          notes: '12V solar pumps €70-100. Agricultural irrigation equipment.',
        },
        {
          name: 'AliExpress',
          location: 'Online (ships to PT)',
          website: 'aliexpress.com',
          notes: '12V solar pumps €40-60 (slower shipping, but huge savings)',
        },
      ],
    },
  },
  us: {
    currency: 'USD',
    currencySymbol: '$',
    lengthUnit: 'ft',
    volumeUnit: 'gallons',
    amazonDomain: 'amazon.com',
    IBCPrice: 80,
    gutterPrice: 18,
    pumpPrice: 130,
    linerPricePerSqM: 15,
    cisternPrice: 13000,
    excavationPricePerCubicM: 25,
  },
};

interface ShoppingItem {
  id: string;
  name: string;
  searchTerm: string;
  quantity: number;
  price: number;
  category: string;
}

interface CustomPrices {
  [key: string]: number | null;
}

export default function WaterIndependenceGuide() {
  const [region, setRegion] = useState<Region>('uk');
  const [customPrices, setCustomPrices] = useState<CustomPrices>({});
  const [editMode, setEditMode] = useState(false);
  const [showLocalSuppliers, setShowLocalSuppliers] = useState(false);
  const config = regionConfigs[region];

  const formatVolume = (litres: number) => {
    if (region === 'us') {
      return `${Math.round(litres * 0.264172).toLocaleString()} gallons`;
    }
    return `${litres.toLocaleString()} litres`;
  };

  const formatLength = (metres: number) => {
    if (region === 'us') {
      return `${(metres * 3.281).toFixed(1)} ft`;
    }
    return `${metres} m`;
  };

  const formatArea = (sqMetres: number) => {
    if (region === 'us') {
      return `${Math.round(sqMetres * 10.764)} sq ft`;
    }
    return `${sqMetres} m²`;
  };

  const formatPrice = (amount: number) => {
    return `${config.currencySymbol}${amount.toLocaleString()}`;
  };

  const getAmazonLink = (searchTerm: string) => {
    return `https://www.${config.amazonDomain}/s?k=${encodeURIComponent(searchTerm)}`;
  };

  const getPrice = (itemId: string, defaultPrice: number): number => {
    const custom = customPrices[itemId];
    return custom !== undefined && custom !== null ? custom : defaultPrice;
  };

  const handlePriceChange = (itemId: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setCustomPrices((prev) => ({ ...prev, [itemId]: numValue }));
  };

  const shoppingList: ShoppingItem[] = [
    {
      id: 'ibc',
      name: 'IBC Totes (1000L)',
      searchTerm: '1000L IBC water tank food grade',
      quantity: 50,
      price: getPrice('ibc', config.IBCPrice),
      category: 'storage',
    },
    {
      id: 'gutter',
      name: 'Guttering System',
      searchTerm: 'PVC gutter system',
      quantity: 100, // metres
      price: getPrice('gutter', config.gutterPrice),
      category: 'collection',
    },
    {
      id: 'pump',
      name: 'Solar Water Pump',
      searchTerm: '12V solar submersible water pump',
      quantity: 2,
      price: getPrice('pump', config.pumpPrice),
      category: 'equipment',
    },
    {
      id: 'liner',
      name: 'EPDM Pond Liner',
      searchTerm: 'EPDM pond liner rubber',
      quantity: 900, // sq metres
      price: getPrice('liner', config.linerPricePerSqM),
      category: 'pond',
    },
    {
      id: 'firstFlush',
      name: 'First Flush Diverter',
      searchTerm: 'rainwater first flush diverter',
      quantity: 6,
      price: getPrice('firstFlush', 45),
      category: 'collection',
    },
    {
      id: 'ballValve',
      name: 'Ball Valves (2" BSP)',
      searchTerm: '2 inch ball valve water tank',
      quantity: 60,
      price: getPrice('ballValve', 8),
      category: 'plumbing',
    },
    {
      id: 'connectors',
      name: 'Hose Connectors Kit',
      searchTerm: 'IBC tote connection kit',
      quantity: 10,
      price: getPrice('connectors', 25),
      category: 'plumbing',
    },
    {
      id: 'floatValve',
      name: 'Float Valve',
      searchTerm: 'water tank float valve',
      quantity: 6,
      price: getPrice('floatValve', 15),
      category: 'plumbing',
    },
    {
      id: 'excavation',
      name: 'Pond Excavation',
      searchTerm: 'mini digger hire',
      quantity: 3600, // cubic metres
      price: getPrice('excavation', config.excavationPricePerCubicM),
      category: 'pond',
    },
    {
      id: 'geotextile',
      name: 'Geotextile Underlay',
      searchTerm: 'geotextile fabric pond',
      quantity: 900, // sq metres
      price: getPrice('geotextile', 2),
      category: 'pond',
    },
    {
      id: 'timber',
      name: 'Timber & Hardware (IBC racks)',
      searchTerm: 'pressure treated timber posts',
      quantity: 1,
      price: getPrice('timber', 1200),
      category: 'storage',
    },
    {
      id: 'pipes',
      name: 'Pipes & Fittings',
      searchTerm: 'PVC pipe fittings',
      quantity: 1,
      price: getPrice('pipes', 800),
      category: 'plumbing',
    },
  ];

  const totalMaterialsCost = shoppingList.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header with Region Selector */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-6xl">
            Complete Water Independence
            <span className="block text-primary">Build Plans, Shopping List & Diagrams</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Detailed construction guide for 4-person family + 3-acre farm
          </p>

          {/* Region Selector */}
          <div className="mt-8 flex justify-center gap-3">
            <Button
              variant={region === 'uk' ? 'default' : 'outline'}
              onClick={() => setRegion('uk')}
              size="lg"
            >
              🇬🇧 UK ({config.currencySymbol}, metres)
            </Button>
            <Button
              variant={region === 'portugal' ? 'default' : 'outline'}
              onClick={() => setRegion('portugal')}
              size="lg"
            >
              🇵🇹 Portugal ({config.currencySymbol}, metros)
            </Button>
            <Button
              variant={region === 'us' ? 'default' : 'outline'}
              onClick={() => setRegion('us')}
              size="lg"
            >
              🇺🇸 USA ({config.currencySymbol}, feet)
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Badge variant="outline">
              <ShoppingCart className="mr-1 h-3 w-3" />
              Shopping Links
            </Badge>
            <Badge variant="outline">
              <Ruler className="mr-1 h-3 w-3" />
              Detailed Measurements
            </Badge>
            <Badge variant="outline">
              <Wrench className="mr-1 h-3 w-3" />
              Build Instructions
            </Badge>
          </div>
        </div>

        {/* System Overview */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold">System Overview</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                  <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                    Annual Water Needs
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">{formatVolume(2559000)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatVolume(219000)} household + {formatVolume(2340000)} farm
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                  <h3 className="mb-2 font-semibold text-green-900 dark:text-green-100">
                    Storage Required
                  </h3>
                  <p className="text-3xl font-bold text-green-600">{formatVolume(1050000)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Accounts for dry season deficit
                  </p>
                </div>
                <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-950">
                  <h3 className="mb-2 font-semibold text-purple-900 dark:text-purple-100">
                    Total System Cost
                  </h3>
                  <p className="text-3xl font-bold text-purple-600">{formatPrice(totalMaterialsCost)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Materials only (DIY)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Complete Shopping List */}
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold">
              <ShoppingCart className="mb-1 inline h-8 w-8 text-primary" /> Complete Shopping List
            </h2>
            <div className="flex gap-2">
              <Button
                onClick={() => setEditMode(!editMode)}
                variant={editMode ? 'default' : 'outline'}
                size="sm"
              >
                <Edit className="mr-2 h-4 w-4" />
                {editMode ? 'Done Editing' : 'Edit Prices'}
              </Button>
              {region === 'portugal' && config.localSuppliers && (
                <Button
                  onClick={() => setShowLocalSuppliers(!showLocalSuppliers)}
                  variant={showLocalSuppliers ? 'default' : 'outline'}
                  size="sm"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {showLocalSuppliers ? 'Hide' : 'Show'} Local Suppliers
                </Button>
              )}
            </div>
          </div>
          <Card>
            <CardContent className="p-6">
              {editMode && (
                <div className="mb-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    ✏️ <strong>Custom Pricing:</strong> Enter your own prices below. Use 0 for
                    materials you already have. Leave blank to use default pricing.
                  </p>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2">
                      <th className="p-3 text-left">Item</th>
                      <th className="p-3 text-center">Quantity</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                      <th className="p-3 text-center">Shop</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shoppingList.map((item) => {
                      const defaultPrice =
                        item.id === 'ibc'
                          ? config.IBCPrice
                          : item.id === 'gutter'
                            ? config.gutterPrice
                            : item.id === 'pump'
                              ? config.pumpPrice
                              : item.id === 'liner'
                                ? config.linerPricePerSqM
                                : item.id === 'excavation'
                                  ? config.excavationPricePerCubicM
                                  : item.id === 'firstFlush'
                                    ? 45
                                    : item.id === 'ballValve'
                                      ? 8
                                      : item.id === 'connectors'
                                        ? 25
                                        : item.id === 'floatValve'
                                          ? 15
                                          : item.id === 'geotextile'
                                            ? 2
                                            : item.id === 'timber'
                                              ? 1200
                                              : 800;
                      return (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{item.name}</td>
                          <td className="p-3 text-center font-mono">{item.quantity}</td>
                          <td className="p-3 text-right">
                            {editMode ? (
                              <div className="flex items-center justify-end gap-2">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder={formatPrice(defaultPrice)}
                                  value={
                                    customPrices[item.id] !== undefined &&
                                    customPrices[item.id] !== null
                                      ? String(customPrices[item.id])
                                      : ''
                                  }
                                  onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                  className="w-24 text-right"
                                />
                              </div>
                            ) : (
                              <span className="font-mono">{formatPrice(item.price)}</span>
                            )}
                          </td>
                          <td className="p-3 text-right font-mono font-semibold text-primary">
                            {formatPrice(item.quantity * item.price)}
                          </td>
                          <td className="p-3 text-center">
                            <Button size="sm" variant="outline" asChild>
                              <a
                                href={getAmazonLink(item.searchTerm)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-1 h-3 w-3" />
                                Amazon
                              </a>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="border-t-2 bg-muted/50 font-bold">
                      <td colSpan={3} className="p-3 text-right">
                        TOTAL MATERIALS:
                      </td>
                      <td className="p-3 text-right text-xl text-primary">
                        {formatPrice(totalMaterialsCost)}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {region === 'portugal' && (
                <div className="mt-4 rounded-lg bg-green-50 p-4 dark:bg-green-950">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    🇵🇹 <strong>Portugal Savings:</strong> These prices already reflect local
                    suppliers (€35 used IBCs vs €75 Amazon). Click &quot;Show Local
                    Suppliers&quot; to see where to buy!
                  </p>
                </div>
              )}
              <div className="mt-4 rounded-lg bg-amber-50 p-4 dark:bg-amber-950">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  💡 <strong>Pro Tip:</strong> Buy used IBC totes locally to save ~50%. Search
                  Facebook Marketplace, Gumtree, or local farm supply stores for food-grade tanks.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Local Suppliers Section for Portugal */}
          {region === 'portugal' && showLocalSuppliers && config.localSuppliers && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-green-600" />
                  Local Suppliers in Central Portugal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* IBC Totes Suppliers */}
                  {config.localSuppliers.ibcTotes && (
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-blue-600">
                        IBC Totes (€25-50 each)
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {config.localSuppliers.ibcTotes.map((supplier, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950"
                          >
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                              {supplier.name}
                            </h4>
                            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                              📍 {supplier.location}
                            </p>
                            {supplier.website && (
                              <a
                                href={supplier.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400"
                              >
                                <ExternalLink className="mr-1 h-3 w-3" />
                                Visit Website
                              </a>
                            )}
                            {supplier.phone && (
                              <p className="mt-1 text-sm font-mono text-blue-800 dark:text-blue-200">
                                📞 {supplier.phone}
                              </p>
                            )}
                            <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                              {supplier.notes}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Building Materials Suppliers */}
                  {config.localSuppliers.building && (
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-green-600">
                        Gutters & Building Materials (€5-10/m)
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {config.localSuppliers.building.map((supplier, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border-2 border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950"
                          >
                            <h4 className="font-semibold text-green-900 dark:text-green-100">
                              {supplier.name}
                            </h4>
                            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                              📍 {supplier.location}
                            </p>
                            {supplier.website && (
                              <a
                                href={supplier.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center text-sm text-green-600 hover:underline dark:text-green-400"
                              >
                                <ExternalLink className="mr-1 h-3 w-3" />
                                Visit Website
                              </a>
                            )}
                            {supplier.phone && (
                              <p className="mt-1 text-sm font-mono text-green-800 dark:text-green-200">
                                📞 {supplier.phone}
                              </p>
                            )}
                            <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                              {supplier.notes}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pond Materials Suppliers */}
                  {config.localSuppliers.pond && (
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-purple-600">
                        Pond Liner & Excavation (€4-8/m²)
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {config.localSuppliers.pond.map((supplier, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950"
                          >
                            <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                              {supplier.name}
                            </h4>
                            <p className="mt-1 text-sm text-purple-700 dark:text-purple-300">
                              📍 {supplier.location}
                            </p>
                            {supplier.website && (
                              <a
                                href={supplier.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center text-sm text-purple-600 hover:underline dark:text-purple-400"
                              >
                                <ExternalLink className="mr-1 h-3 w-3" />
                                Visit Website
                              </a>
                            )}
                            {supplier.phone && (
                              <p className="mt-1 text-sm font-mono text-purple-800 dark:text-purple-200">
                                📞 {supplier.phone}
                              </p>
                            )}
                            <p className="mt-2 text-xs text-purple-600 dark:text-purple-400">
                              {supplier.notes}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pump Suppliers */}
                  {config.localSuppliers.pumps && (
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-orange-600">
                        Solar Water Pumps (€40-100)
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {config.localSuppliers.pumps.map((supplier, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950"
                          >
                            <h4 className="font-semibold text-orange-900 dark:text-orange-100">
                              {supplier.name}
                            </h4>
                            <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                              📍 {supplier.location}
                            </p>
                            {supplier.website && (
                              <a
                                href={supplier.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center text-sm text-orange-600 hover:underline dark:text-orange-400"
                              >
                                <ExternalLink className="mr-1 h-3 w-3" />
                                Visit Website
                              </a>
                            )}
                            {supplier.phone && (
                              <p className="mt-1 text-sm font-mono text-orange-800 dark:text-orange-200">
                                📞 {supplier.phone}
                              </p>
                            )}
                            <p className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                              {supplier.notes}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950">
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                      💰 <strong>Cost Comparison:</strong>
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                      <li>• IBC Totes: Amazon €75 → Local €35 (53% savings!)</li>
                      <li>• Gutters: Amazon €12/m → Leroy Merlin €8/m (33% savings)</li>
                      <li>• Pond Liner: Amazon €10/m² → Geoplastic €7/m² (30% savings)</li>
                      <li>• Total Estimated Savings: ~€4,000-€6,000 using local suppliers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* COMPONENT 1: IBC Tote System */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold">
            <Wrench className="mb-1 inline h-8 w-8 text-primary" /> Component 1: IBC Tote Bank
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>50× 1000L IBC Totes = {formatVolume(50000)} Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Diagram */}
                <div className="rounded-lg border-2 border-muted p-4">
                  <h3 className="mb-4 font-semibold">Configuration Diagram</h3>
                  <svg viewBox="0 0 600 400" className="w-full">
                    {/* Ground */}
                    <rect x="0" y="350" width="600" height="50" fill="#8b7355" />
                    <text x="300" y="380" textAnchor="middle" fill="white" fontSize="14">
                      Ground Level
                    </text>

                    {/* IBC Rack - 2 rows, 5 columns */}
                    {[0, 1].map((row) =>
                      [0, 1, 2, 3, 4].map((col) => {
                        const x = 80 + col * 100;
                        const y = 220 - row * 130;
                        return (
                          <g key={`${row}-${col}`}>
                            {/* IBC Tote */}
                            <rect
                              x={x}
                              y={y}
                              width="80"
                              height="100"
                              fill="#4a90e2"
                              stroke="#2563eb"
                              strokeWidth="2"
                              opacity="0.8"
                            />
                            {/* Cage frame */}
                            <rect
                              x={x}
                              y={y}
                              width="80"
                              height="100"
                              fill="none"
                              stroke="#333"
                              strokeWidth="1"
                              strokeDasharray="4"
                            />
                            {/* Valve */}
                            <circle cx={x + 40} cy={y + 105} r="4" fill="#e74c3c" />
                          </g>
                        );
                      })
                    )}

                    {/* Connecting Pipes */}
                    <line x1="80" y1="325" x2="560" y2="325" stroke="#666" strokeWidth="4" />
                    <line x1="80" y1="195" x2="560" y2="195" stroke="#666" strokeWidth="4" />

                    {/* Main Feed */}
                    <line x1="300" y1="195" x2="300" y2="50" stroke="#2563eb" strokeWidth="6" />
                    <text x="310" y="120" fontSize="12" fill="#2563eb" fontWeight="bold">
                      To House
                    </text>
                    <circle cx="300" cy="50" r="8" fill="#2563eb" />

                    {/* Dimensions */}
                    <line
                      x1="70"
                      y1="90"
                      x2="70"
                      y2="220"
                      stroke="#e74c3c"
                      strokeWidth="1"
                      markerStart="url(#arrowRed)"
                      markerEnd="url(#arrowRed)"
                    />
                    <text x="35" y="160" fontSize="12" fill="#e74c3c" fontWeight="bold">
                      {formatLength(2.4)}
                    </text>

                    <line
                      x1="80"
                      y1="360"
                      x2="560"
                      y2="360"
                      stroke="#e74c3c"
                      strokeWidth="1"
                      markerStart="url(#arrowRed)"
                      markerEnd="url(#arrowRed)"
                    />
                    <text x="290" y="385" fontSize="12" fill="#e74c3c" fontWeight="bold">
                      {formatLength(6)}
                    </text>

                    {/* Arrow markers */}
                    <defs>
                      <marker
                        id="arrowRed"
                        markerWidth="10"
                        markerHeight="10"
                        refX="5"
                        refY="5"
                        orient="auto"
                      >
                        <polygon points="0,0 10,5 0,10" fill="#e74c3c" />
                      </marker>
                    </defs>

                    {/* Labels */}
                    <text x="300" y="30" textAnchor="middle" fontSize="16" fontWeight="bold">
                      2 Rows × 5 Columns = 10 Totes per Section
                    </text>
                  </svg>
                </div>

                {/* Build Instructions */}
                <div>
                  <h3 className="mb-4 font-semibold">Build Instructions</h3>
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        1
                      </span>
                      <div>
                        <strong>Prepare Level Ground:</strong> Clear {formatArea(36)} area,
                        compact soil, lay 15cm gravel base for drainage.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        2
                      </span>
                      <div>
                        <strong>Build Rack Structure:</strong> Use 100×100mm pressure-treated
                        timber posts. Space {formatLength(1.2)} apart to support each IBC.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        3
                      </span>
                      <div>
                        <strong>Install IBCs:</strong> Position totes in 2×5 grid. Each section =
                        10 totes. Build 5 sections total = 50 totes.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        4
                      </span>
                      <div>
                        <strong>Connect Plumbing:</strong> Install 2&quot; ball valve on each IBC
                        bottom outlet. Connect to 50mm main pipe running length of rack.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        5
                      </span>
                      <div>
                        <strong>Add Inlet System:</strong> Install 32mm pipe to top of each IBC
                        from roof guttering. Add mesh filter (5mm) at each inlet.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        6
                      </span>
                      <div>
                        <strong>Install Overflow:</strong> Add overflow pipe at 90cm height on each
                        IBC, directing to pond or soakaway.
                      </div>
                    </li>
                  </ol>

                  <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                    <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                      Materials for This Component:
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-900 dark:text-blue-100">
                      <li>• 50× IBC Totes = {formatPrice(50 * config.IBCPrice)}</li>
                      <li>• 60× Ball Valves = {formatPrice(60 * 8)}</li>
                      <li>• Timber & Hardware = {formatPrice(1200)}</li>
                      <li className="border-t pt-1 font-bold">
                        Total: {formatPrice(50 * config.IBCPrice + 60 * 8 + 1200)}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* COMPONENT 2: Roof Collection System */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold">
            <Wrench className="mb-1 inline h-8 w-8 text-primary" /> Component 2: Roof Collection
            System
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>900m² Total Collection Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Diagram */}
                <div className="rounded-lg border-2 border-muted p-4">
                  <h3 className="mb-4 font-semibold">House Collection Detail</h3>
                  <svg viewBox="0 0 600 500" className="w-full">
                    {/* House */}
                    <rect x="150" y="200" width="300" height="200" fill="#d4a574" stroke="#8b6f47" strokeWidth="2" />
                    {/* Roof */}
                    <polygon points="150,200 300,100 450,200" fill="#8b0000" stroke="#600" strokeWidth="2" />
                    
                    {/* Rain */}
                    {[...Array(30)].map((_, i) => (
                      <line
                        key={i}
                        x1={50 + i * 20}
                        y1="20"
                        x2={55 + i * 20}
                        y2="80"
                        stroke="#4a90e2"
                        strokeWidth="2"
                        opacity="0.6"
                      />
                    ))}
                    
                    {/* Gutters */}
                    <rect x="130" y="200" width="340" height="15" fill="#666" stroke="#333" strokeWidth="1" />
                    
                    {/* Downspouts */}
                    <rect x="140" y="200" width="20" height="200" fill="#666" />
                    <rect x="440" y="200" width="20" height="200" fill="#666" />
                    
                    {/* First Flush Diverters */}
                    <rect x="135" y="420" width="30" height="60" fill="#e74c3c" stroke="#c0392b" strokeWidth="2" />
                    <rect x="435" y="420" width="30" height="60" fill="#e74c3c" stroke="#c0392b" strokeWidth="2" />
                    <text x="150" y="455" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                      FIRST
                    </text>
                    <text x="150" y="468" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                      FLUSH
                    </text>
                    <text x="450" y="455" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                      FIRST
                    </text>
                    <text x="450" y="468" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                      FLUSH
                    </text>
                    
                    {/* Storage Pipes */}
                    <line x1="150" y1="480" x2="150" y2="520" stroke="#2563eb" strokeWidth="6" />
                    <line x1="450" y1="480" x2="450" y2="520" stroke="#2563eb" strokeWidth="6" />
                    <text x="150" y="540" textAnchor="middle" fontSize="12" fill="#2563eb" fontWeight="bold">
                      To Storage
                    </text>
                    <text x="450" y="540" textAnchor="middle" fontSize="12" fill="#2563eb" fontWeight="bold">
                      To Storage
                    </text>
                    
                    {/* Dimensions */}
                    <line x1="100" y1="200" x2="100" y2="400" stroke="#e74c3c" strokeWidth="1" />
                    <text x="70" y="310" fontSize="12" fill="#e74c3c" fontWeight="bold">
                      {formatLength(4)}
                    </text>
                    
                    <line x1="150" y1="180" x2="450" y2="180" stroke="#e74c3c" strokeWidth="1" />
                    <text x="290" y="170" fontSize="12" fill="#e74c3c" fontWeight="bold" textAnchor="middle">
                      {formatLength(10)} width
                    </text>
                    
                    {/* Labels */}
                    <text x="300" y="30" textAnchor="middle" fontSize="16" fontWeight="bold">
                      House: {formatArea(200)} Roof
                    </text>
                    <text x="300" y="55" textAnchor="middle" fontSize="14" fill="#2563eb">
                      Collects ~{formatVolume(120000)}/year
                    </text>
                  </svg>
                </div>

                {/* Build Instructions */}
                <div>
                  <h3 className="mb-4 font-semibold">Build Instructions</h3>
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        1
                      </span>
                      <div>
                        <strong>Install Gutters:</strong> Fix 150mm PVC gutters to all roof edges
                        with fall of 1:100 towards downspouts. Use brackets every {formatLength(1)}.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        2
                      </span>
                      <div>
                        <strong>Position Downspouts:</strong> Install 100mm downspouts at corners
                        and mid-points. Maximum {formatLength(8)} spacing.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        3
                      </span>
                      <div>
                        <strong>Add First Flush Diverters:</strong> Install 100L diverter on each
                        downspout. This removes first dirty water (bird droppings, dust) before
                        storage.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        4
                      </span>
                      <div>
                        <strong>Connect to Storage:</strong> Run 50mm pipes from each first flush
                        diverter to nearest IBC tote or cistern.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        5
                      </span>
                      <div>
                        <strong>Add Mesh Filters:</strong> Install 5mm stainless steel mesh at all
                        gutter outlets to prevent leaves entering system.
                      </div>
                    </li>
                  </ol>

                  <div className="mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-950">
                    <h4 className="mb-2 font-semibold text-green-900 dark:text-green-100">
                      Collection Efficiency:
                    </h4>
                    <div className="space-y-2 text-sm text-green-900 dark:text-green-100">
                      <div className="flex justify-between">
                        <span>House ({formatArea(200)}):</span>
                        <span className="font-mono font-semibold">{formatVolume(120000)}/yr</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Barn ({formatArea(500)}):</span>
                        <span className="font-mono font-semibold">{formatVolume(300000)}/yr</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Greenhouse ({formatArea(200)}):</span>
                        <span className="font-mono font-semibold">{formatVolume(120000)}/yr</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 font-bold">
                        <span>TOTAL COLLECTION:</span>
                        <span className="font-mono">{formatVolume(540000)}/yr</span>
                      </div>
                      <p className="mt-2 text-xs italic">
                        Based on 750mm/year rainfall (Lisbon) × 80% efficiency
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                    <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                      Materials for This Component:
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-900 dark:text-blue-100">
                      <li>• Guttering System = {formatPrice(100 * config.gutterPrice)}</li>
                      <li>• 6× First Flush Diverters = {formatPrice(6 * 45)}</li>
                      <li>• Pipes & Fittings = {formatPrice(800)}</li>
                      <li className="border-t pt-1 font-bold">
                        Total: {formatPrice(100 * config.gutterPrice + 6 * 45 + 800)}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* COMPONENT 3: Farm Pond */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold">
            <Wrench className="mb-1 inline h-8 w-8 text-primary" /> Component 3: Farm Pond
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>
                {formatLength(30)} × {formatLength(30)} × {formatLength(4)} Deep ={' '}
                {formatVolume(3600000)} Maximum Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Diagram */}
                <div className="rounded-lg border-2 border-muted p-4">
                  <h3 className="mb-4 font-semibold">Pond Cross-Section</h3>
                  <svg viewBox="0 0 600 450" className="w-full">
                    {/* Ground Level */}
                    <line x1="50" y1="100" x2="550" y2="100" stroke="#8b7355" strokeWidth="3" />
                    <text x="30" y="105" fontSize="12" fill="#8b7355" fontWeight="bold">
                      Ground Level
                    </text>

                    {/* Excavated Pond Shape (trapezoid for sloped sides) */}
                    <polygon
                      points="150,100 450,100 500,350 100,350"
                      fill="#4a90e2"
                      stroke="#2563eb"
                      strokeWidth="3"
                      opacity="0.7"
                    />

                    {/* EPDM Liner */}
                    <polyline
                      points="140,90 480,90 520,360 80,360 140,90"
                      fill="none"
                      stroke="#2c3e50"
                      strokeWidth="4"
                      strokeDasharray="8,4"
                    />

                    {/* Soil Layers */}
                    <rect x="50" y="100" width="100" height="50" fill="#d4a574" opacity="0.7" />
                    <rect x="50" y="150" width="100" height="200" fill="#a67c52" opacity="0.7" />
                    <text x="60" y="130" fontSize="10" fill="#333">
                      Topsoil
                    </text>
                    <text x="60" y="260" fontSize="10" fill="#333">
                      Subsoil
                    </text>

                    <rect x="450" y="100" width="100" height="50" fill="#d4a574" opacity="0.7" />
                    <rect x="450" y="150" width="100" height="200" fill="#a67c52" opacity="0.7" />

                    {/* Dimensions */}
                    <line
                      x1="70"
                      y1="100"
                      x2="70"
                      y2="350"
                      stroke="#e74c3c"
                      strokeWidth="2"
                      markerStart="url(#arrowRed2)"
                      markerEnd="url(#arrowRed2)"
                    />
                    <text x="35" y="230" fontSize="14" fill="#e74c3c" fontWeight="bold">
                      {formatLength(4)}
                    </text>

                    <line
                      x1="150"
                      y1="80"
                      x2="450"
                      y2="80"
                      stroke="#e74c3c"
                      strokeWidth="2"
                      markerStart="url(#arrowRed2)"
                      markerEnd="url(#arrowRed2)"
                    />
                    <text x="280" y="70" fontSize="14" fill="#e74c3c" fontWeight="bold">
                      {formatLength(30)} (top)
                    </text>

                    <line
                      x1="100"
                      y1="370"
                      x2="500"
                      y2="370"
                      stroke="#e74c3c"
                      strokeWidth="2"
                      markerStart="url(#arrowRed2)"
                      markerEnd="url(#arrowRed2)"
                    />
                    <text x="280" y="395" fontSize="14" fill="#e74c3c" fontWeight="bold">
                      {formatLength(40)} (bottom with slope)
                    </text>

                    {/* Inlet Pipe */}
                    <rect x="280" y="30" width="40" height="70" fill="#666" />
                    <text x="300" y="20" textAnchor="middle" fontSize="11" fontWeight="bold">
                      Inlet
                    </text>
                    <polygon points="280,100 320,100 300,120" fill="#2563eb" />

                    {/* Overflow Pipe */}
                    <rect x="460" y="180" width="60" height="20" fill="#666" />
                    <text x="520" y="175" fontSize="11" fontWeight="bold">
                      Overflow
                    </text>
                    <polygon points="520,190 540,180 540,200" fill="#e74c3c" />

                    {/* Pump */}
                    <rect x="380" y="320" width="40" height="30" fill="#27ae60" stroke="#229954" strokeWidth="2" />
                    <text x="400" y="340" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                      Pump
                    </text>
                    <line x1="400" y1="320" x2="400" y2="100" stroke="#27ae60" strokeWidth="3" strokeDasharray="4" />

                    {/* Arrow markers */}
                    <defs>
                      <marker
                        id="arrowRed2"
                        markerWidth="10"
                        markerHeight="10"
                        refX="5"
                        refY="5"
                        orient="auto"
                      >
                        <polygon points="0,0 10,5 0,10" fill="#e74c3c" />
                      </marker>
                    </defs>

                    {/* Labels */}
                    <text x="300" y="220" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">
                      {formatVolume(3600000)}
                    </text>
                    <text x="300" y="240" textAnchor="middle" fontSize="12" fill="white">
                      Maximum Capacity
                    </text>
                  </svg>
                </div>

                {/* Build Instructions */}
                <div>
                  <h3 className="mb-4 font-semibold">Build Instructions</h3>
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        1
                      </span>
                      <div>
                        <strong>Excavation:</strong> Hire mini-digger. Dig {formatLength(30)} ×{' '}
                        {formatLength(30)} area to {formatLength(4)} depth. Slope sides at 45°
                        angle for stability. Total excavation: ~{formatVolume(3600000)} soil.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        2
                      </span>
                      <div>
                        <strong>Prepare Base:</strong> Remove all sharp rocks, roots, stones.
                        Compact bottom. Add 10cm sand layer as cushion for liner.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        3
                      </span>
                      <div>
                        <strong>Install Underlay:</strong> Lay geotextile fabric (300g/m²) over
                        entire surface including slopes. Overlap seams by 30cm.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        4
                      </span>
                      <div>
                        <strong>Lay EPDM Liner:</strong> Use 1mm EPDM rubber pond liner. Need ~
                        {formatArea(900)} to cover bottom, sides, and overlap edges. Join multiple
                        sheets with EPDM tape.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        5
                      </span>
                      <div>
                        <strong>Secure Edges:</strong> Dig 30cm trench around perimeter. Fold
                        liner into trench, backfill with soil, compact firmly.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        6
                      </span>
                      <div>
                        <strong>Install Plumbing:</strong> Fit inlet pipe from IBC overflow. Add
                        overflow pipe at {formatLength(3.8)} height. Install 12V solar submersible
                        pump at deepest point.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                        7
                      </span>
                      <div>
                        <strong>Fill & Test:</strong> Slowly fill with collected rainwater over
                        several days. Monitor for leaks. Liner will settle and stretch naturally.
                      </div>
                    </li>
                  </ol>

                  <div className="mt-6 rounded-lg bg-purple-50 p-4 dark:bg-purple-950">
                    <h4 className="mb-2 font-semibold text-purple-900 dark:text-purple-100">
                      Purpose & Benefits:
                    </h4>
                    <ul className="space-y-1 text-sm text-purple-900 dark:text-purple-100">
                      <li>✓ Primary irrigation storage for farm</li>
                      <li>✓ Captures IBC tote overflow</li>
                      <li>✓ Natural cooling in summer heat</li>
                      <li>✓ Wildlife habitat (frogs eat pests!)</li>
                      <li>✓ Fire suppression water reserve</li>
                    </ul>
                  </div>

                  <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                    <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                      Materials for This Component:
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-900 dark:text-blue-100">
                      <li>
                        • Excavation ({formatLength(30)}×{formatLength(30)}×{formatLength(4)}) ={' '}
                        {formatPrice(config.excavationPricePerCubicM * 3600)}
                      </li>
                      <li>
                        • EPDM Liner ({formatArea(900)}) ={' '}
                        {formatPrice(900 * config.linerPricePerSqM)}
                      </li>
                      <li>• Geotextile Underlay = {formatPrice(1800)}</li>
                      <li>• 2× Solar Pumps = {formatPrice(2 * config.pumpPrice)}</li>
                      <li>• Plumbing & Fittings = {formatPrice(600)}</li>
                      <li className="border-t pt-1 font-bold">
                        Total:{' '}
                        {formatPrice(
                          config.excavationPricePerCubicM * 3600 +
                            900 * config.linerPricePerSqM +
                            1800 +
                            2 * config.pumpPrice +
                            600
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* System Summary & Total Cost */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold">Complete System Summary</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Storage Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
                    <span className="font-medium">IBC Totes (50×):</span>
                    <span className="font-mono font-semibold">{formatVolume(50000)}</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-green-50 p-3 dark:bg-green-950">
                    <span className="font-medium">Farm Pond:</span>
                    <span className="font-mono font-semibold">{formatVolume(3600000)}</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-purple-50 p-3 dark:bg-purple-950">
                    <span className="font-medium text-purple-900 dark:text-purple-100">
                      <strong>TOTAL CAPACITY:</strong>
                    </span>
                    <span className="font-mono text-lg font-bold text-purple-600">
                      {formatVolume(3650000)}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    This exceeds your {formatVolume(1050000)} requirement by 3.5×, providing
                    excellent security against drought years.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>DIY Total Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span>IBC Tote System:</span>
                    <span className="font-mono">
                      {formatPrice(50 * config.IBCPrice + 60 * 8 + 1200)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Roof Collection:</span>
                    <span className="font-mono">
                      {formatPrice(100 * config.gutterPrice + 6 * 45 + 800)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Farm Pond:</span>
                    <span className="font-mono">
                      {formatPrice(
                        config.excavationPricePerCubicM * 3600 +
                          900 * config.linerPricePerSqM +
                          1800 +
                          2 * config.pumpPrice +
                          600
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-primary/10 p-4">
                    <span className="text-lg font-bold">TOTAL MATERIALS:</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(totalMaterialsCost)}
                    </span>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Professional installation would add ~{formatPrice(Math.round(totalMaterialsCost * 0.9))}{' '}
                    labor. Hybrid approach (you do 60%) saves ~{formatPrice(Math.round(totalMaterialsCost * 0.4))}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-16">
          <Card className="border-2 border-primary">
            <CardContent className="p-8 text-center">
              <h2 className="mb-4 text-3xl font-bold">Ready to Build?</h2>
              <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
                You now have complete build plans, measurements, and shopping links for your region.
                Start with the roof collection system (easiest), then add IBC totes, and finally
                the farm pond as budget allows.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/green-calculators/total-water-independence">
                    📊 Use Interactive Calculator
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#shopping-list">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    View Shopping List Again
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
