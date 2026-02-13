'use client'

// ============================================================================
// REVOKED REGISTRY CLIENT COMPONENT
// ============================================================================
// LOCATION: /frontend/src/app/blacklist/RevokedRegistryClient.tsx
// 
// PURPOSE: Interactive table/card view of revoked guides
// 
// FEATURES:
// - Responsive: Table on desktop, cards on mobile
// - Filter by reason category
// - Sort by date
// - Pagination
// - Dual theme support
// ============================================================================

import { useState } from 'react'
import {
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  Shield,
  Clock,
  FileText
} from 'lucide-react'
import { 
  RevokedGuide, 
  BlacklistStats, 
  BanReason, 
  BanReasonLabels,
  BanReasonColors 
} from '@/src/types/blacklist.types'
import { getRevokedGuides } from '@/src/lib/api/blacklist'
import toast from 'react-hot-toast'

interface RevokedRegistryClientProps {
  initialGuides: RevokedGuide[]
  initialStats: BlacklistStats
  initialPagination: {
    page: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function RevokedRegistryClient({
  initialGuides,
  initialStats,
  initialPagination
}: RevokedRegistryClientProps) {
  // ========================================
  // STATE
  // ========================================
  const [guides, setGuides] = useState(initialGuides)
  const [pagination, setPagination] = useState(initialPagination)
  const [selectedReason, setSelectedReason] = useState<BanReason | 'all'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // ========================================
  // HANDLERS
  // ========================================
 // ========================================
// LOAD PAGE - ACCEPTS EXPLICIT PARAMETERS
// ========================================
const loadPage = async (
  page: number, 
  filterReason: BanReason | 'all' = selectedReason
) => {
  setIsLoading(true)
  try {
    // Use the provided reason, NOT the state
    const reasonToUse = filterReason
    
    const data = await getRevokedGuides({
      page,
      limit: 10,
      reason: reasonToUse !== 'all' ? reasonToUse : undefined
    })
    
    setGuides(data.items)
    setPagination({
      page: data.page,
      total: data.total,
      totalPages: data.totalPages,
      hasNext: data.hasNext,
      hasPrev: data.hasPrev
    })
  } catch (error) {
    toast.error('Failed to load registry data')
  } finally {
    setIsLoading(false)
  }
}

// ========================================
// FILTER HANDLER - PASS REASON DIRECTLY
// ========================================
 const handleFilterChange = async (reason: BanReason | 'all') => {
    setSelectedReason(reason)
    await loadPage(1, reason)
  }

// ========================================
// PAGINATION HANDLER - PASS CURRENT FILTER
// ========================================


 
const handlePageChange = (page: number) => {
  loadPage(page, selectedReason) // Pass the current filter
}
  // ========================================
  // FORMATTING HELPERS
  // ========================================
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="space-y-8">
      
      {/* ========================================
          STATS CARDS
          ======================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Banned */}
        <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">All time</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {initialStats.totalBanned}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Guides revoked
          </p>
        </div>

        {/* Banned This Month */}
        <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">This month</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {initialStats.bannedThisMonth}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            New revocations
          </p>
        </div>

        {/* Most Common Reason */}
        <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Top violation</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
            {BanReasonLabels[initialStats.mostCommonReason]}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Most frequent reason
          </p>
        </div>

        {/* Avg Complaints */}
        <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Per case</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {initialStats.avgComplaintsPerCase.toFixed(1)}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Avg. complaints
          </p>
        </div>
      </div>

      {/* ========================================
          FILTER BAR
          ======================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="sm:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm"
          >
            <Filter className="w-4 h-4" />
            Filter by reason
            {isFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Desktop filters */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Filter:</span>
            <select
              value={selectedReason}
              onChange={(e) => handleFilterChange(e.target.value as BanReason | 'all')}
              className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All violations</option>
              {Object.values(BanReason).map((reason) => (
                <option key={reason} value={reason}>
                  {BanReasonLabels[reason]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium text-gray-900 dark:text-white">{guides.length}</span> of{' '}
          <span className="font-medium text-gray-900 dark:text-white">{pagination.total}</span> revoked guides
        </p>
      </div>

      {/* Mobile filter dropdown */}
      {isFilterOpen && (
        <div className="sm:hidden p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg space-y-2">
          {[{ id: 'all', label: 'All violations' }, ...Object.values(BanReason).map(r => ({ id: r, label: BanReasonLabels[r] }))].map((reason) => (
            <button
              key={reason.id}
              onClick={() => {
                handleFilterChange(reason.id as BanReason | 'all')
                setIsFilterOpen(false)
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedReason === reason.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {reason.label}
            </button>
          ))}
        </div>
      )}

      {/* ========================================
          DESKTOP TABLE VIEW
          ======================================== */}
      <div className="hidden lg:block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Guide ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ban Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Violation
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Complaints
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {guides.map((guide) => {
              const colors = BanReasonColors[guide.reason]
              return (
                <tr key={guide.guideId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                      {guide.displayId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {formatDate(guide.bannedAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors.light} ${colors.dark}`}>
                      {BanReasonLabels[guide.reason]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {guide.complaintCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {guide.description && (
                      <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {guide.description}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ========================================
          MOBILE CARD VIEW
          ======================================== */}
      <div className="lg:hidden space-y-4">
        {guides.map((guide) => {
          const colors = BanReasonColors[guide.reason]
          return (
            <div
              key={guide.guideId}
              className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                  {guide.displayId}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors.light} ${colors.dark}`}>
                  {BanReasonLabels[guide.reason]}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Banned {formatDate(guide.bannedAt)}</span>
              </div>
              
              {guide.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                  {guide.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{guide.complaintCount}</span> confirmed complaints
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ========================================
          PAGINATION
          ======================================== */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between sm:justify-center gap-2 pt-4">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev || isLoading}
            className="inline-flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum: number
              if (pagination.totalPages <= 5) {
                pageNum = i + 1
              } else if (pagination.page <= 3) {
                pageNum = i + 1
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i
              } else {
                pageNum = pagination.page - 2 + i
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}// pass current filter
                  disabled={isLoading}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    pagination.page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNext || isLoading}
            className="inline-flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================
          DISCLAIMER
          ======================================== */}
      <div className="pt-6 text-center border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-500">
          This registry is updated daily. If you believe a guide was incorrectly listed, 
          please <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact support</a>.
        </p>
      </div>
    </div>
  )
}