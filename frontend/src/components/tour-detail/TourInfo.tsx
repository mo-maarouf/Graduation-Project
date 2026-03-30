// ============================================================================
// TOUR INFO - DESCRIPTION, ITINERARY, & INCLUSIONS
// ============================================================================
// LOCATION: /frontend/src/components/tour-detail/TourInfo.tsx
// 
// PURPOSE: Detailed information about the tour experience
// 
// FEATURES:
// 1. Description with 'Read More' toggle (Phase 2)
// 2. Interactive visual itinerary
// 3. Halal certification details
// 4. Meeting point with simple map view
// 5. Requirements and what to bring
// ============================================================================

'use client'

import {
    Check,
    X,
    MapPin,
    Clock,
    AlertTriangle,
    Backpack,
    ShieldCheck,
    ChevronDown,
    Info,
    Globe,
    Tag,
    Timer,
    Zap
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { TourInfoProps } from '@/src/types/tour-detail.types'
import { parseList, parseItinerary } from '@/src/lib/utils/tour-parser'

export default function TourInfo({
    description,
    itinerary,
    inclusions,
    exclusions,
    requirements,
    whatToBring,
    meetingPoint,
    safetyMeasures,
    isHalalCertified,
    halalCertificationDetails,
    tags,
    languages,
    durationHours,
    durationMinutes,
    occurrences
}: any) {
    const searchParams = useSearchParams()
    const selectedDateStr = searchParams.get('date')

    const inclusionList = parseList(inclusions)
    const exclusionList = parseList(exclusions)
    const requirementList = parseList(requirements)
    const bringList = parseList(whatToBring)
    const safetyList = parseList(safetyMeasures)
    const itineraryList = parseItinerary(itinerary)

    const tagList = Array.isArray(tags) ? tags : parseList(tags)
    const languageList = Array.isArray(languages) ? languages : parseList(languages)

    // Dynamic duration calculation
    let displayHours = durationHours
    let displayMinutes = durationMinutes
    let isOverridden = false

    if (selectedDateStr && occurrences && occurrences.length > 0) {
        const occ = occurrences.find((o: any) => (o.startTimeUtc === selectedDateStr || o.startTime === selectedDateStr))
        if (occ) {
            const start = new Date(occ.startTimeUtc || occ.startTime)
            const end = new Date(occ.endTimeUtc || occ.endTime)
            const diffMs = end.getTime() - start.getTime()
            const totalMinutes = Math.floor(diffMs / (60 * 1000))
            if (totalMinutes > 0) {
                displayHours = Math.floor(totalMinutes / 60)
                displayMinutes = totalMinutes % 60
                isOverridden = true
            }
        }
    }

    return (
        <div className="space-y-10">
            {/* Quick Specs / Tags & Languages */}
            <section className="flex flex-wrap gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
                {/* Duration */}
                {(displayHours > 0 || displayMinutes > 0) && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${displayHours}-${displayMinutes}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                                isOverridden 
                                    ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-700/50' 
                                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30'
                            }`}
                        >
                            {isOverridden ? (
                                <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            ) : (
                                <Timer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            )}
                            <span className={`text-sm font-bold ${isOverridden ? 'text-indigo-700 dark:text-indigo-300' : 'text-blue-700 dark:text-blue-300'}`}>
                                {displayHours > 0 && `${displayHours}h`} {displayMinutes > 0 && `${displayMinutes}m`}
                                {isOverridden && <span className="ml-1 text-[10px] opacity-70 font-medium">(Selected Date)</span>}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Languages */}
                {languageList.length > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <div className="flex gap-2">
                            {languageList.map((lang, i) => (
                                <span key={i} className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">
                                    {typeof lang === 'string' ? lang : (lang.language || JSON.stringify(lang))}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* ========================================
          ABOUT THE TOUR
          ======================================== */}
            <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    About this tour
                </h2>
                <div className="prose prose-blue dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                        {description}
                    </p>
                </div>
            </section>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* ========================================
          HALAL CERTIFICATION DETAILS
          ======================================== */}
            {isHalalCertified && halalCertificationDetails && (
                <>
                    <section className="p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-1">
                                    Halal Travel Commitment
                                </h3>
                                <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
                                    {halalCertificationDetails}
                                </p>
                            </div>
                        </div>
                    </section>
                    <hr className="border-gray-100 dark:border-gray-800" />
                </>
            )}

            {/* ========================================
          ITINERARY
          ======================================== */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Visual Itinerary
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {itineraryList.length} stops
                    </span>
                </div>

                <div className="space-y-0">
                    {itineraryList.map((stop, index) => (
                        <div key={stop.id} className="relative flex gap-4 pb-8 last:pb-0">
                            {/* Connector line */}
                            {index !== itineraryList.length - 1 && (
                                <div className="absolute left-[15px] top-[30px] bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />
                            )}

                            {/* Order number */}
                            <div className="relative z-10 w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                {index + 1}
                            </div>

                            <div className="space-y-1.5 pt-1">
                                <h3 className="font-bold text-gray-900 dark:text-white">
                                    {stop.title}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{stop.duration}</span>
                                    </div>
                                    {stop.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span>{stop.location.name}</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {stop.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* ========================================
          INCLUSIONS & EXCLUSIONS
          ======================================== */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inclusions */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        What's included
                    </h3>
                    <ul className="space-y-2.5">
                        {inclusionList.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Exclusions */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                        What's excluded
                    </h3>
                    <ul className="space-y-2.5">
                        {exclusionList.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                                <X className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* ========================================
          REQUIREMENTS & WHAT TO BRING
          ======================================== */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                {/* Requirements */}
                {requirements && requirements.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
                            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            Requirements
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            {requirementList.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-gray-400 mt-1">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* What to bring */}
                {whatToBring && whatToBring.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
                            <Backpack className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            What to bring
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            {bringList.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-gray-400 mt-1">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* ========================================
          MEETING POINT
          ======================================== */}
            <section id="meeting-point" className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Meeting Point
                </h2>
                <div className="
          p-5
          border border-gray-200 dark:border-gray-800
          rounded-2xl
          space-y-4
        ">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="font-bold text-gray-900 dark:text-white">
                                {meetingPoint.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {meetingPoint.address}
                            </p>
                        </div>
                    </div>

                    {meetingPoint.instructions && (
                        <div className="flex items-start gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg">
                            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                                {meetingPoint.instructions}
                            </p>
                        </div>
                    )}

                    {/* Map placeholder */}
                    <div className="
            aspect-[21/9]
            bg-gray-100 dark:bg-gray-900
            rounded-xl
            flex items-center justify-center
            border border-gray-200 dark:border-gray-800
          ">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Map integration in Phase 2
                        </p>
                    </div>
                </div>
            </section>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* ========================================
          SAFETY MEASURES
          ======================================== */}
            {safetyMeasures && safetyMeasures.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Safety Measures
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {safetyList.map((measure, i) => (
                            <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm text-gray-600 dark:text-gray-400">
                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>{measure}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
