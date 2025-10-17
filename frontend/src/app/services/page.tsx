'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PortugalHeader from '@/components/PortugalHeader';

interface ServiceProvider {
  id: number;
  name: string;
  category: string;
  location: string;
  description: string;
  services: string[];
  priceRange: string;
  rating: number;
  reviewCount: number;
  phone: string;
  email: string;
  website?: string;
  verified: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceProvider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    const mockServices: ServiceProvider[] = [
      {
        id: 1,
        name: 'João Silva Excavations',
        category: 'Excavation & Earthworks',
        location: 'Leiria',
        description:
          'Professional excavation services including septic systems, foundations, and land clearing. 20+ years experience.',
        services: [
          'Septic Tank Installation',
          'Foundation Digging',
          'Land Clearing',
          'Drainage Systems',
        ],
        priceRange: '€50-80/hour',
        rating: 4.8,
        reviewCount: 23,
        phone: '+351 912 345 678',
        email: 'joao@silvaexcavations.pt',
        website: 'www.silvaexcavations.pt',
        verified: true,
      },
      {
        id: 2,
        name: 'Central Portugal Builders',
        category: 'Construction',
        location: 'Coimbra',
        description:
          'Full construction services specializing in eco-friendly and off-grid builds. Licensed and insured.',
        services: [
          'House Building',
          'Renovations',
          'Sustainable Construction',
          'Project Management',
        ],
        priceRange: '€35-65/hour',
        rating: 4.6,
        reviewCount: 41,
        phone: '+351 963 789 012',
        email: 'info@cpbuilders.pt',
        verified: true,
      },
      {
        id: 3,
        name: 'Solar Solutions Portugal',
        category: 'Electrical',
        location: 'Viseu',
        description:
          'Certified electricians specializing in solar installations and off-grid electrical systems.',
        services: [
          'Solar Panel Installation',
          'Electrical Wiring',
          'Off-Grid Systems',
          'Battery Storage',
        ],
        priceRange: '€40-70/hour',
        rating: 4.9,
        reviewCount: 67,
        phone: '+351 934 567 890',
        email: 'contact@solarsolutions.pt',
        website: 'www.solarsolutions.pt',
        verified: true,
      },
    ];
    setServices(mockServices);
  }, []);

  const categories = [
    'all',
    'Excavation & Earthworks',
    'Construction',
    'Electrical',
    'Plumbing',
    'Renewable Energy',
    'Carpentry',
    'Roofing',
    'Landscaping',
  ];

  const locations = [
    'all',
    'Leiria',
    'Coimbra',
    'Viseu',
    'Aveiro',
    'Porto',
    'Braga',
    'Castelo Branco',
    'Guarda',
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.services.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || service.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <main className="renewable-gradient portugal-pattern min-h-screen">
      <div className="portugal-accent w-full"></div>
      <PortugalHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary">Local Services Directory</h1>
          <p className="text-lg text-muted-foreground">
            Find trusted local service providers across Central Portugal for your off-grid project
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search services, providers, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <svg
              className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>

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

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location === 'all' ? 'All Locations' : location}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Your Service CTA */}
        <div className="mb-8 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
          <h3 className="mb-2 text-xl font-semibold text-primary">Are you a service provider?</h3>
          <p className="mb-4 text-muted-foreground">
            Join our directory and connect with off-grid enthusiasts across Portugal
          </p>
          <Button className="bg-gradient-to-r from-primary to-accent text-white">
            Submit Your Service
          </Button>
        </div>

        {/* Service Providers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="tile-hover overflow-hidden border-l-4 border-l-primary/30"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{service.location}</p>
                  </div>
                  {service.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(service.rating)}</div>
                  <span className="text-sm text-muted-foreground">
                    {service.rating} ({service.reviewCount} reviews)
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Badge className="mb-2">{service.category}</Badge>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Services Offered:</h4>
                  <div className="flex flex-wrap gap-1">
                    {service.services.map((srv, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {srv}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">{service.priceRange}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      📞 Contact
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary to-accent text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No services found matching your criteria. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
