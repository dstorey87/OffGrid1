'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AdminSettings,
  loadAdminSettings,
  saveAdminSettings,
  DEFAULT_ADMIN_SETTINGS,
} from '@/lib/adminSettings';

export default function AdminPage() {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if already authenticated in this session
    const isAuth = sessionStorage.getItem('admin_auth') === 'true';
    if (isAuth) {
      setAuthenticated(true);
      setSettings(loadAdminSettings());
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (in production, use proper authentication)
    if (password === 'offgrid2024') {
      setAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setSettings(loadAdminSettings());
    } else {
      alert('Invalid password');
    }
  };

  const handleSave = () => {
    saveAdminSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    // Reload page to apply new settings
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleReset = () => {
    if (confirm('Reset all settings to default? This cannot be undone.')) {
      saveAdminSettings(DEFAULT_ADMIN_SETTINGS);
      setSettings(DEFAULT_ADMIN_SETTINGS);
      window.location.reload();
    }
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Enter password to access admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Admin Settings</h1>
            <p className="text-muted-foreground">Configure site-wide settings and preferences</p>
          </div>
          <div className="flex gap-2">
            {saved && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                ✓ Saved
              </Badge>
            )}
            <Button variant="outline" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Control default theme and appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Default Theme</label>
                <select
                  value={settings.theme.defaultTheme}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      theme: {
                        ...settings.theme,
                        defaultTheme: e.target.value as 'light' | 'dark' | 'system',
                      },
                    })
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="forceDark"
                  checked={settings.theme.forceDark}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      theme: { ...settings.theme, forceDark: e.target.checked },
                    })
                  }
                  className="h-4 w-4"
                />
                <label htmlFor="forceDark" className="text-sm font-medium">
                  Force Dark Theme (Override user preference)
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Currency Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
              <CardDescription>Set default currency and exchange rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Default Currency</label>
                <select
                  value={settings.currency.default}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      currency: {
                        ...settings.currency,
                        default: e.target.value as 'USD' | 'GBP' | 'EUR',
                      },
                    })
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2"
                >
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Exchange Rates (relative to USD)</label>
                <div className="grid gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="USD Rate"
                    value={settings.currency.exchangeRates.USD}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        currency: {
                          ...settings.currency,
                          exchangeRates: {
                            ...settings.currency.exchangeRates,
                            USD: parseFloat(e.target.value),
                          },
                        },
                      })
                    }
                    disabled
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="GBP Rate"
                    value={settings.currency.exchangeRates.GBP}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        currency: {
                          ...settings.currency,
                          exchangeRates: {
                            ...settings.currency.exchangeRates,
                            GBP: parseFloat(e.target.value),
                          },
                        },
                      })
                    }
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="EUR Rate"
                    value={settings.currency.exchangeRates.EUR}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        currency: {
                          ...settings.currency,
                          exchangeRates: {
                            ...settings.currency.exchangeRates,
                            EUR: parseFloat(e.target.value),
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Units Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Measurement Units</CardTitle>
              <CardDescription>Default unit system for calculators</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <label className="mb-2 block text-sm font-medium">Default Units</label>
                <select
                  value={settings.units.default}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      units: { default: e.target.value as 'metric' | 'imperial' },
                    })
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2"
                >
                  <option value="metric">Metric (L, m², kg)</option>
                  <option value="imperial">Imperial (gal, ft², lbs)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Affiliate Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Settings</CardTitle>
              <CardDescription>Manage affiliate links and tags</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Amazon Affiliate Tag</label>
                <Input
                  type="text"
                  placeholder="offgrid1-20"
                  value={settings.affiliate.amazonTag}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      affiliate: { ...settings.affiliate, amazonTag: e.target.value },
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableAffiliate"
                  checked={settings.affiliate.enableAffiliateLinks}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      affiliate: {
                        ...settings.affiliate,
                        enableAffiliateLinks: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
                <label htmlFor="enableAffiliate" className="text-sm font-medium">
                  Enable Affiliate Links
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Feature Toggles */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable site features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableShop"
                  checked={settings.features.enableShop}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      features: { ...settings.features, enableShop: e.target.checked },
                    })
                  }
                  className="h-4 w-4"
                />
                <label htmlFor="enableShop" className="text-sm font-medium">
                  Enable Shop Page
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableBlog"
                  checked={settings.features.enableBlog}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      features: { ...settings.features, enableBlog: e.target.checked },
                    })
                  }
                  className="h-4 w-4"
                />
                <label htmlFor="enableBlog" className="text-sm font-medium">
                  Enable Blog
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableAISearch"
                  checked={settings.features.enableAISearch}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      features: { ...settings.features, enableAISearch: e.target.checked },
                    })
                  }
                  className="h-4 w-4"
                />
                <label htmlFor="enableAISearch" className="text-sm font-medium">
                  Enable AI Product Search
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Site contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="hello@offgrid1.com"
                  value={settings.contact.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, email: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Twitter Handle</label>
                <Input
                  type="text"
                  placeholder="@OffGrid1"
                  value={settings.contact.twitter}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, twitter: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">YouTube Channel</label>
                <Input
                  type="text"
                  placeholder="OffGrid1"
                  value={settings.contact.youtube}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, youtube: e.target.value },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Site name and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Site Name</label>
                <Input
                  type="text"
                  placeholder="OffGrid1"
                  value={settings.seo.siteName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      seo: { ...settings.seo, siteName: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Tagline</label>
                <Input
                  type="text"
                  placeholder="Complete Off-Grid Solar Solutions"
                  value={settings.seo.tagline}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      seo: { ...settings.seo, tagline: e.target.value },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 rounded-lg border bg-card p-6">
          <h3 className="mb-2 text-lg font-semibold">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                sessionStorage.removeItem('admin_auth');
                window.location.href = '/';
              }}
            >
              Logout
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const data = JSON.stringify(settings, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'admin-settings-backup.json';
                a.click();
              }}
            >
              Export Settings
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
