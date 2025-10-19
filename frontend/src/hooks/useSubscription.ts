'use client'

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

export type SubscriptionTier = 'free' | 'pro' | 'expert'

export interface AccessControl {
  tier: SubscriptionTier
  isActive: boolean
  canAccess: (requiredTier: SubscriptionTier) => boolean
  canAccessFeature: (feature: string) => boolean
}

const tierHierarchy: Record<SubscriptionTier, number> = {
  free: 0,
  pro: 1,
  expert: 2,
}

const featureAccess: Record<string, SubscriptionTier> = {
  // Free features
  'basic-calculators': 'free',
  'diy-guide-preview': 'free',
  'blog-content': 'free',
  
  // Pro features
  'complete-diy-courses': 'pro',
  'advanced-calculators': 'pro',
  'product-recommendations': 'pro',
  'community-forum': 'pro',
  'bom-generator': 'pro',
  'templates-download': 'pro',
  'monthly-webinar': 'pro',
  
  // Expert features
  'custom-design-service': 'expert',
  '3d-layout-tool': 'expert',
  'shade-analysis-advanced': 'expert',
  'priority-support': 'expert',
  'professional-network': 'expert',
  'expert-consultation': 'expert',
}

export function useSubscription(): AccessControl {
  const { data: session, status } = useSession()

  return useMemo(() => {
    const tier = (session?.user?.subscriptionTier as SubscriptionTier) || 'free'
    const isActive = session?.user?.subscriptionStatus === 'active' || tier === 'free'

    return {
      tier,
      isActive,
      canAccess: (requiredTier: SubscriptionTier) => {
        if (!isActive && tier !== 'free') return false
        return tierHierarchy[tier] >= tierHierarchy[requiredTier]
      },
      canAccessFeature: (feature: string) => {
        const requiredTier = featureAccess[feature] || 'expert'
        if (!isActive && tier !== 'free') return false
        return tierHierarchy[tier] >= tierHierarchy[requiredTier]
      },
    }
  }, [session, status])
}
