// ============================================================================
// BLACKLIST PAGE - LOADING SKELETON
// ============================================================================
// LOCATION: /frontend/src/app/blacklist/loading.tsx
// ============================================================================

import PageLayout from '@/src/components/layout/PageLayout'

export default function BlacklistLoading() {
  return (
    <PageLayout>
      <div className="pt-14 sm:pt-16">
        <div className="container-safe mx-auto max-w-7xl py-8 sm:py-12">
          
          {/* Header skeleton */}
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
            <div className="w-32 h-6 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="w-96 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="w-full h-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>

          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl animate-pulse">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg mb-3" />
                <div className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            ))}
          </div>

          {/* Table skeleton */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden animate-pulse">
            <div className="h-14 bg-gray-100 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800" />
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 border-b border-gray-200 dark:border-gray-800 last:border-0" />
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}