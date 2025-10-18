'use client';

import Link from 'next/link';
import { useState, useCallback, memo } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { SolarIcon, WaterIcon, GlobeIcon, CartIcon, ToolsIcon } from './icons';

export const Navigation = memo(function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solarDropdownOpen, setSolarDropdownOpen] = useState(false);
  const [greenDropdownOpen, setGreenDropdownOpen] = useState(false);

  const toggleSolarDropdown = useCallback(() => setSolarDropdownOpen((prev) => !prev), []);
  const toggleGreenDropdown = useCallback(() => setGreenDropdownOpen((prev) => !prev), []);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <SolarIcon size="sm" className="text-white" />
            </div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              OffGrid1
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {/* Solar Calculators Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setSolarDropdownOpen(true)}
              onMouseLeave={() => setSolarDropdownOpen(false)}
            >
              <button
                onClick={toggleSolarDropdown}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <SolarIcon size="sm" />
                Solar Calculators
                <ChevronDown className="h-4 w-4" />
              </button>
              {solarDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-64 rounded-lg border bg-popover p-2 shadow-lg">
                  <Link
                    href="/solar-calculators/load-analysis"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                  >
                    Load Analysis Calculator
                  </Link>
                  <Link
                    href="/solar-calculators/panel-sizing"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                  >
                    Panel Sizing Calculator
                  </Link>
                  <Link
                    href="/solar-calculators/battery-sizing"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                  >
                    Battery Sizing Calculator
                  </Link>
                  <Link
                    href="/solar-calculators/inverter-sizing"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                  >
                    Inverter Sizing Calculator
                  </Link>
                  <Link
                    href="/solar-calculators/electrical"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                  >
                    Electrical Components
                  </Link>
                  <div className="my-1 border-t"></div>
                  <Link
                    href="/solar-calculators"
                    className="block rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-accent"
                  >
                    View All Solar Tools →
                  </Link>
                </div>
              )}
            </div>

            {/* Green Calculators Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setGreenDropdownOpen(true)}
              onMouseLeave={() => setGreenDropdownOpen(false)}
            >
              <button
                onClick={toggleGreenDropdown}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <WaterIcon size="sm" />
                Green Calculators
                <ChevronDown className="h-4 w-4" />
              </button>
              {greenDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-64 rounded-lg border bg-popover p-2 shadow-lg">
                  <Link
                    href="/green-calculators/rainwater-harvesting"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                  >
                    Rainwater Harvesting
                  </Link>
                  <Link
                    href="/green-calculators/greywater-systems"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                  >
                    Greywater Systems
                  </Link>
                  <Link
                    href="/green-calculators/wind-power"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                  >
                    Wind Power Calculator
                  </Link>
                  <Link
                    href="/green-calculators/hydroponics"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                  >
                    Hydroponics Systems
                  </Link>
                  <Link
                    href="/green-calculators/total-water-independence"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                  >
                    Total Water Independence
                  </Link>
                  <div className="my-1 border-t"></div>
                  <Link
                    href="/green-calculators"
                    className="block rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-accent"
                  >
                    View All Green Tools →
                  </Link>
                </div>
              )}
            </div>

            {/* Portugal Guide */}
            <Link
              href="/legal"
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <GlobeIcon size="sm" />
              Portugal Guide
            </Link>

            {/* Shop */}
            <Link
              href="/solar-shop"
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <CartIcon size="sm" />
              Shop
            </Link>

            {/* Services */}
            <Link
              href="/services"
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ToolsIcon size="sm" />
              Services
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-md p-2 hover:bg-accent"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <div className="space-y-1">
              {/* Solar Calculators */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                  Solar Calculators
                </div>
                <Link
                  href="/solar-calculators/load-analysis"
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Load Analysis
                </Link>
                <Link
                  href="/solar-calculators/panel-sizing"
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Panel Sizing
                </Link>
                <Link
                  href="/solar-calculators/battery-sizing"
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Battery Sizing
                </Link>
                <Link
                  href="/solar-calculators/inverter-sizing"
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inverter Sizing
                </Link>
                <Link
                  href="/solar-calculators/electrical"
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Electrical Components
                </Link>
              </div>

              {/* Green Calculators */}
              <div className="space-y-1 pt-2">
                <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                  Green Calculators
                </div>
                <Link
                  href="/green-calculators/rainwater-harvesting"
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Rainwater Harvesting
                </Link>
                <Link
                  href="/green-calculators/greywater-systems"
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Greywater Systems
                </Link>
                <Link
                  href="/green-calculators/wind-power"
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Wind Power
                </Link>
                <Link
                  href="/green-calculators/hydroponics"
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hydroponics
                </Link>
                <Link
                  href="/green-calculators/total-water-independence"
                  className="block rounded-md px-6 py-2 text-sm hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Total Water Independence
                </Link>
              </div>

              {/* Other Links */}
              <div className="space-y-1 border-t pt-2">
                <Link
                  href="/legal"
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Portugal Guide
                </Link>
                <Link
                  href="/solar-shop"
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  href="/services"
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="/pricing"
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});
