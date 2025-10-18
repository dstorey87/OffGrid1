// Admin Settings Configuration
// This file defines site-wide settings that can be modified from the admin panel

export interface AdminSettings {
  theme: {
    defaultTheme: 'light' | 'dark' | 'system';
    forceDark: boolean;
  };
  currency: {
    default: 'USD' | 'GBP' | 'EUR';
    exchangeRates: {
      USD: number;
      GBP: number;
      EUR: number;
    };
  };
  units: {
    default: 'metric' | 'imperial';
  };
  affiliate: {
    amazonTag: string;
    enableAffiliateLinks: boolean;
  };
  features: {
    enableShop: boolean;
    enableBlog: boolean;
    enableAISearch: boolean;
  };
  contact: {
    email: string;
    twitter: string;
    youtube: string;
  };
  seo: {
    siteName: string;
    tagline: string;
  };
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  theme: {
    defaultTheme: 'dark',
    forceDark: true,
  },
  currency: {
    default: 'GBP',
    exchangeRates: {
      USD: 1,
      GBP: 0.79,
      EUR: 0.92,
    },
  },
  units: {
    default: 'metric',
  },
  affiliate: {
    amazonTag: 'offgrid1-20',
    enableAffiliateLinks: true,
  },
  features: {
    enableShop: true,
    enableBlog: true,
    enableAISearch: true,
  },
  contact: {
    email: 'hello@offgrid1.com',
    twitter: '@OffGrid1',
    youtube: 'OffGrid1',
  },
  seo: {
    siteName: 'OffGrid1',
    tagline: 'Complete Off-Grid Solar Solutions',
  },
};

// Load settings from localStorage with fallback to defaults
export function loadAdminSettings(): AdminSettings {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_SETTINGS;

  try {
    const stored = localStorage.getItem('admin_settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_ADMIN_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load admin settings:', error);
  }
  return DEFAULT_ADMIN_SETTINGS;
}

// Save settings to localStorage
export function saveAdminSettings(settings: AdminSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('admin-settings-changed', { detail: settings }));
  } catch (error) {
    console.error('Failed to save admin settings:', error);
  }
}

// Get a specific setting value
export function getAdminSetting<K extends keyof AdminSettings>(category: K): AdminSettings[K] {
  const settings = loadAdminSettings();
  return settings[category];
}

// Update a specific setting category
export function updateAdminSetting<K extends keyof AdminSettings>(
  category: K,
  value: AdminSettings[K]
): void {
  const settings = loadAdminSettings();
  settings[category] = value;
  saveAdminSettings(settings);
}
