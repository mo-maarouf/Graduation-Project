'use client'

// ============================================================================
// BLACKLIST PAGE - ERROR BOUNDARY
// ============================================================================
// LOCATION: /frontend/src/app/blacklist/error.tsx
// ============================================================================

import { useEffect } from 'react'
import PageLayout from '@/src/components/layout/PageLayout'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function BlacklistError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Blacklist Error]:', error)
  }, [error])

  return (
    <PageLayout>
      <div className="pt-14 sm:pt-16">
        <div className="container-safe mx-auto max-w-7xl py-16 sm:py-24">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Failed to Load Registry
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't load the revoked guides registry. Please try again.
            </p>
            
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}