'use client'

import { useState } from 'react'
import { X, Lock, Check, Sparkles } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
  feature: string
  featureDescription?: string
  tier?: 'pro' | 'expert'
}

export function PaywallModal({ 
  isOpen, 
  onClose, 
  feature,
  featureDescription,
  tier = 'pro'
}: PaywallModalProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'expert'>(tier)

  if (!isOpen) return null

  const proFeatures = [
    'Complete DIY course library (50+ hours)',
    'Advanced calculators with detailed BOM',
    'Product recommendations & supplier lists',
    'Community forum access',
    'Monthly live Q&A webinars',
    'Downloadable templates & checklists',
  ]

  const expertFeatures = [
    ...proFeatures,
    'Custom system design service (1/month)',
    '30-minute expert consultation',
    'Premium tools (3D layout, shade analysis)',
    'Priority support (24hr response)',
    'Professional network access',
  ]

  const handleUpgrade = () => {
    if (!session?.user) {
      // Redirect to sign up
      router.push('/auth/signup?redirect=/pricing')
    } else {
      // Redirect to pricing page
      router.push(`/pricing?plan=${selectedPlan}`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Unlock {feature}</h2>
          </div>
          {featureDescription && (
            <p className="text-white/90">{featureDescription}</p>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Plan selector */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setSelectedPlan('pro')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                selectedPlan === 'pro'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
              }`}
            >
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Pro</div>
              <div className="text-2xl font-bold mt-1">€29<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <div className="text-xs text-gray-500 mt-1">Save €99/year with annual</div>
            </button>
            
            <button
              onClick={() => setSelectedPlan('expert')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all relative ${
                selectedPlan === 'expert'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
              }`}
            >
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                BEST
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Expert</div>
              <div className="text-2xl font-bold mt-1">€79<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <div className="text-xs text-gray-500 mt-1">Save €158/year with annual</div>
            </button>
          </div>

          {/* Features list */}
          <div className="space-y-3 mb-8">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {selectedPlan === 'pro' ? 'Pro includes:' : 'Expert includes everything in Pro, plus:'}
            </div>
            {(selectedPlan === 'pro' ? proFeatures : expertFeatures).map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`mt-0.5 p-1 rounded-full ${
                  selectedPlan === 'pro' 
                    ? 'bg-orange-100 dark:bg-orange-900/30' 
                    : 'bg-purple-100 dark:bg-purple-900/30'
                }`}>
                  <Check className={`w-4 h-4 ${
                    selectedPlan === 'pro' ? 'text-orange-600' : 'text-purple-600'
                  }`} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 border-2 border-white dark:border-gray-800" />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                Join <strong className="text-gray-900 dark:text-white">2,400+ members</strong> saving €5,000+ on their solar installations
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleUpgrade}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
              selectedPlan === 'pro'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            }`}
          >
            {session?.user ? `Upgrade to ${selectedPlan === 'pro' ? 'Pro' : 'Expert'}` : 'Sign Up & Start Free Trial'}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            7-day free trial • Cancel anytime • No credit card required
          </p>
        </div>
      </div>
    </div>
  )
}
