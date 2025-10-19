'use client'

import { ReactNode, useState } from 'react'
import { useSubscription } from '@/hooks/useSubscription'
import { PaywallModal } from './PaywallModal'

interface ContentGateProps {
  children: ReactNode
  feature: string
  requiredTier?: 'pro' | 'expert'
  previewLines?: number
  title?: string
  description?: string
}

export function ContentGate({
  children,
  feature,
  requiredTier = 'pro',
  previewLines = 3,
  title,
  description,
}: ContentGateProps) {
  const { canAccessFeature } = useSubscription()
  const [showPaywall, setShowPaywall] = useState(false)
  const hasAccess = canAccessFeature(feature)

  if (hasAccess) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {/* Preview content (blurred) */}
      <div 
        className="relative overflow-hidden" 
        style={{ maxHeight: `${previewLines * 1.5}rem` }}
      >
        <div className="blur-sm select-none pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-gray-900/50 dark:to-gray-900" />
      </div>

      {/* Lock overlay */}
      <div className="mt-8 border-2 border-dashed border-orange-300 dark:border-orange-700 rounded-2xl p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {title || `Unlock ${requiredTier === 'pro' ? 'Pro' : 'Expert'} Content`}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {description || `This section is available to ${requiredTier === 'pro' ? 'Pro' : 'Expert'} members. Upgrade to access complete DIY guides, video tutorials, and downloadable templates.`}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowPaywall(true)}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
            >
              Unlock Now - Start Free Trial
            </button>
            <a
              href="/pricing"
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-orange-500 dark:hover:border-orange-500 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all"
            >
              See All Plans
            </a>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            7-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={title || feature}
        featureDescription={description}
        tier={requiredTier}
      />
    </div>
  )
}
