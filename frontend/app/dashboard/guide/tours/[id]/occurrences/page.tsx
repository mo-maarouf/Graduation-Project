'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  CalendarRange,
  Repeat,
  DollarSign,
  MapPin,
  X,
  PlusCircle,
  LayoutGrid,
  History,
  Settings2,
  CalendarDays
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import CalendarPicker from '@/src/components/ui/CalendarPicker'
import { 
  getGuideTour, 
  getGuideOccurrences, 
  createOccurrence, 
  updateOccurrence, 
  deleteOccurrence,
  updateTour,
  withdrawTourFromReview
} from '@/src/lib/api/tours'
import { 
  TourTemplateResponse, 
  TourOccurrenceResponse, 
  TourOccurrenceStatus,
  CreateOccurrenceRequest
} from '@/src/lib/types/tour.types'

// ============================================================================
// UTILITIES (UTC <-> Beirut)
// ============================================================================

const toUTC = (localDateTime: string) => {
  if (!localDateTime) return ''
  return new Date(localDateTime).toISOString()
}

const fromUTC = (utcDateTime: string) => {
  if (!utcDateTime) return ''
  const d = new Date(utcDateTime)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const getBeirutTimeOnly = (isoString: string) => {
  if (!isoString) return ''
  const d = new Date(isoString)
  const isDST = d >= new Date('2026-03-29T00:00:00Z') && d < new Date('2026-10-25T00:00:00Z')
  const offset = isDST ? 3 : 2
  const target = new Date(d.getTime() + (offset * 3600000))
  
  return target.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  })
}

const getBeirutDateInfo = (isoString: string) => {
  if (!isoString) return { month: '', day: '', weekday: '', year: '' }
  const d = new Date(isoString)
  const isDST = d >= new Date('2026-03-29T00:00:00Z') && d < new Date('2026-10-25T00:00:00Z')
  const offset = isDST ? 3 : 2
  const target = new Date(d.getTime() + (offset * 3600000))
  
  return {
    month: target.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
    day: target.getUTCDate(),
    weekday: target.toLocaleString('en-US', { weekday: 'short', timeZone: 'UTC' }),
    year: target.getUTCFullYear()
  }
}

// ============================================================================
// STATUS BADGE
// ============================================================================

const StatusBadge = ({ status }: { status: TourOccurrenceStatus }) => {
  const styles: Record<TourOccurrenceStatus, { bg: string, text: string, dot: string, icon: any }> = {
    SCHEDULED: {
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      dot: 'bg-emerald-500',
      icon: Calendar
    },
    FULL: {
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      text: 'text-amber-700 dark:text-amber-400',
      dot: 'bg-amber-500',
      icon: Users
    },
    COMPLETED: {
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      text: 'text-blue-700 dark:text-blue-400',
      dot: 'bg-blue-500',
      icon: CheckCircle
    },
    CANCELLED: {
      bg: 'bg-red-50 dark:bg-red-500/10',
      text: 'text-red-700 dark:text-red-400',
      dot: 'bg-red-500',
      icon: XCircle
    }
  }

  const config = styles[status] || styles.SCHEDULED

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {status}
    </span>
  )
}

// ============================================================================
// OCCURRENCE CARD
// ============================================================================

const OccurrenceCard = ({ 
  occurrence, 
  onAction,
  isLoading,
  tourStatus
}: { 
  occurrence: TourOccurrenceResponse; 
  onAction: (action: string, id: number) => void;
  isLoading: boolean;
  tourStatus?: string;
}) => {
  const dateInfo = getBeirutDateInfo(occurrence.startTimeUtc)
  const isPast = new Date(occurrence.startTimeUtc) < new Date()
  const isCancelled = occurrence.status === 'CANCELLED'
  const isFull = occurrence.seatsReserved >= occurrence.maxCapacity
  const capacityPct = Math.min(100, (occurrence.seatsReserved / occurrence.maxCapacity) * 100)

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group relative bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 ${isPast ? 'opacity-70' : ''}`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-white/5 shadow-inner">
              <span className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">{dateInfo.month}</span>
              <span className="text-xl font-black text-gray-900 dark:text-white leading-none">{dateInfo.day}</span>
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1.5">
                {dateInfo.weekday}, {dateInfo.year}
              </h4>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {getBeirutTimeOnly(occurrence.startTimeUtc)} – {getBeirutTimeOnly(occurrence.endTimeUtc)}
              </div>
            </div>
          </div>
          <StatusBadge status={occurrence.status} />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
            <span>Reserved Seats</span>
            <span className={isFull ? 'text-amber-600' : 'text-emerald-500'}>
              {occurrence.seatsReserved} / {occurrence.maxCapacity} Guests
            </span>
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${capacityPct}%` }}
              className={`h-full rounded-full ${isFull ? 'bg-amber-500' : 'bg-emerald-500'} shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/guide/bookings?occurrence=${occurrence.id}`}
            className="flex-1 h-10 bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-600/20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl flex items-center justify-center gap-2 transition-all border border-gray-100 dark:border-white/5 hover:border-blue-100 dark:hover:border-blue-500/30 text-xs font-black uppercase tracking-widest"
          >
            <Users className="w-4 h-4" />
            Attendees
          </Link>
          
          <button 
            onClick={() => onAction('edit', occurrence.id)}
            disabled={tourStatus === 'PENDING_REVIEW'}
            className="w-10 h-10 bg-gray-50 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-600/20 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 border border-gray-100 dark:border-white/5 hover:border-emerald-100 dark:hover:border-emerald-500/30 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Edit Time"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button 
            onClick={() => onAction('delete', occurrence.id)}
            disabled={isLoading || tourStatus === 'PENDING_REVIEW'}
            className="w-10 h-10 bg-gray-50 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-600/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-gray-100 dark:border-white/5 hover:border-red-100 dark:hover:border-red-500/30 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Force Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {isCancelled && (
        <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <div className="rotate-12 border-2 border-red-500/50 text-red-500/80 px-4 py-1 rounded-lg text-lg font-black uppercase tracking-widest shadow-xl">
            Cancelled
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ============================================================================
// MODAL: ADD/EDIT OCCURRENCE
// ============================================================================

const OccurrenceModal = ({ 
  onClose, 
  onSave, 
  initialData, 
  template 
}: {
  onClose: () => void
  onSave: (data: CreateOccurrenceRequest) => Promise<void>
  initialData?: TourOccurrenceResponse | null
  template: TourTemplateResponse
}) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    startTime: initialData ? fromUTC(initialData.startTimeUtc) : '',
    endTime: initialData ? fromUTC(initialData.endTimeUtc) : ''
  })

  // Auto-calculate end time when start time is picked for NEW occurrences
  useEffect(() => {
    if (!initialData && formData.startTime && !formData.endTime) {
      const start = new Date(formData.startTime)
      const h = template.durationHours || 2
      const m = template.durationMinutes || 0
      const end = new Date(start.getTime() + (h * 3600000) + (m * 60000))
      
      // Format back to datetime-local string
      const pad = (n: number) => n.toString().padStart(2, '0')
      const endStr = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}`
      setFormData(prev => ({ ...prev, endTime: endStr }))
    }
  }, [formData.startTime, initialData, template.durationHours, template.durationMinutes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.startTime || !formData.endTime) {
      toast.error('Both start and end times are required')
      return
    }

    setLoading(true)
    try {
      await onSave({
        startTimeUtc: toUTC(formData.startTime),
        endTimeUtc: toUTC(formData.endTime)
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
      >
        <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-900 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            {initialData ? 'Update Date' : 'New Departure'}
          </h3>
          <button onClick={onClose} className="p-2.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-2xl transition-all text-gray-400 hover:text-gray-900 dark:hover:text-white active:scale-90">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Start Date & Time</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="datetime-local"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500/50 rounded-2xl text-sm font-bold text-gray-900 dark:text-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Arrival Date & Time</label>
              <div className="relative group">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="datetime-local"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500/50 rounded-2xl text-sm font-bold text-gray-900 dark:text-white transition-all outline-none"
                />
              </div>
              {formData.startTime && formData.endTime && new Date(formData.endTime) <= new Date(formData.startTime) && (
                <p className="px-2 text-[10px] font-bold text-red-500 uppercase tracking-widest pt-1">
                  ⚠️ End time must follow start time
                </p>
              )}
            </div>
          </div>

          <div className="p-5 bg-blue-50 dark:bg-blue-600/10 rounded-[1.5rem] border border-blue-100 dark:border-blue-500/30 flex items-center gap-4">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
                <Users className="w-5 h-5" />
             </div>
             <div>
                <span className="block text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-tight">Capacity Rule</span>
                <p className="text-sm font-black text-gray-900 dark:text-white">
                  {template.minCapacity} to {template.maxCapacity} Guests
                </p>
             </div>
          </div>

          <div className="flex gap-4">
             <button
               type="button"
               onClick={onClose}
               className="flex-1 h-14 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 font-black rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-gray-100 dark:border-white/5 uppercase text-xs tracking-widest"
             >
               Discard
             </button>
              <button
                type="submit"
                disabled={Boolean(loading || (formData.startTime && formData.endTime && new Date(formData.endTime) <= new Date(formData.startTime)))}
                className="flex-[2] h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 uppercase text-xs tracking-widest"
              >
               {loading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : (initialData ? 'Confirm Update' : 'Publish Date')}
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ============================================================================
// MODAL: BULK SCHEDULE
// ============================================================================

const BulkScheduleModal = ({ onClose, onSave, template }: {
  onClose: () => void
  onSave: (dates: { startTimeUtc: string, endTimeUtc: string }[], durationHours: number, durationMinutes: number) => Promise<void>
  template: TourTemplateResponse
}) => {
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [durationHours, setDurationHours] = useState(template.durationHours || 2)
  const [durationMinutes, setDurationMinutes] = useState(template.durationMinutes || 0)
  const [selectedDays, setSelectedDays] = useState<number[]>([]) // 0=Sun, 1=Mon...
  const [generatedDates, setGeneratedDates] = useState<Date[]>([])

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const generateDates = () => {
    if (!startDate || !endDate || selectedDays.length === 0) {
      toast.error('Select date range and days')
      return
    }
    const start = new Date(startDate)
    const end = new Date(endDate)
    const dates: Date[] = []
    let current = new Date(start)
    while (current <= end) {
      if (selectedDays.includes(current.getDay())) {
        dates.push(new Date(current))
      }
      current.setDate(current.getDate() + 1)
    }
    if (dates.length === 0) {
      toast.error('No valid dates found in range')
    } else {
      setGeneratedDates(dates)
      toast.success(`Generated ${dates.length} departures`)
    }
  }

  const handleSubmit = async () => {
    if (generatedDates.length === 0) return
    setLoading(true)
    try {
      const payloads = generatedDates.map(date => {
        const start = new Date(date)
        const [h, m] = startTime.split(':').map(Number)
        start.setHours(h, m, 0, 0)
        
        // Use milliseconds for precise duration addition
        const durationMs = (durationHours * 3600000) + (durationMinutes * 60000)
        const end = new Date(start.getTime() + durationMs)
        
        return {
          startTimeUtc: start.toISOString(),
          endTimeUtc: end.toISOString()
        }
      })
      await onSave(payloads, durationHours, durationMinutes)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-950 rounded-[3rem] shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col"
      >
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-600">
                <Repeat className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Bulk Scheduling</h3>
           </div>
           <button onClick={onClose} className="p-2.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-2xl transition-all active:scale-90 text-gray-400">
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Range Start</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Range End</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Weekly Pattern</label>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map((day, i) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDays(prev => prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i])}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedDays.includes(i) ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-gray-600'}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Daily Start Time</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Hours</label>
                    <input type="number" min="0" value={durationHours} onChange={e => setDurationHours(Number(e.target.value))} className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-blue-500/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Mins</label>
                    <input type="number" min="0" max="59" value={durationMinutes} onChange={e => setDurationMinutes(Number(e.target.value))} className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-blue-500/50" />
                  </div>
                </div>
              </div>

              <button
                onClick={generateDates}
                className="w-full h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-gray-400/10 active:scale-95 transition-all"
              >
                Scan Range & Preview
              </button>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 mb-3 block">Departures Preview</label>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] p-4 border border-gray-100 dark:border-white/5">
                <CalendarPicker
                  selectedDates={generatedDates}
                  onToggleDate={(date) => {
                    setGeneratedDates(prev => {
                      const exists = prev.some(d => d.getTime() === date.getTime())
                      return exists ? prev.filter(d => d.getTime() !== date.getTime()) : [...prev, date]
                    })
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-gray-100 dark:border-gray-800 flex gap-4">
          <button onClick={onClose} className="px-8 h-14 bg-gray-50 dark:bg-white/5 text-gray-500 font-black rounded-2xl text-xs uppercase tracking-widest">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={loading || generatedDates.length === 0}
            className="flex-1 h-14 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 disabled:opacity-50 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : `Commit ${generatedDates.length} Departures`}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ============================================================================
// MODAL: BULK TIME SHIFT
// ============================================================================

const BulkTimeShiftModal = ({ onClose, onSave, template }: {
  onClose: () => void
  onSave: (newTime: string) => Promise<void>
  template: TourTemplateResponse
}) => {
  const [loading, setLoading] = useState(false)
  const [newTime, setNewTime] = useState('09:00')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(newTime)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
      >
        <div className="p-8 border-b border-gray-50 dark:border-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-600">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Time Sync</h3>
            </div>
          <button onClick={onClose} className="p-2.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-2xl transition-all">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="p-5 bg-orange-50 dark:bg-orange-500/10 rounded-[1.5rem] border border-orange-100 dark:border-orange-500/30">
            <p className="text-xs text-orange-800 dark:text-orange-300 font-bold leading-relaxed">
              This shifts the start time for ALL future departures. Existing bookings will be moved automatically.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Global Start Time</label>
            <div className="relative group">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500" />
              <input
                type="time"
                required
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>

          <div className="flex gap-4">
             <button type="button" onClick={onClose} className="flex-1 h-14 bg-gray-50 dark:bg-white/5 text-gray-500 font-black rounded-2xl uppercase text-[10px] tracking-widest">Abort</button>
              <button type="submit" disabled={loading} className="flex-1 h-14 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-500/30 uppercase text-[10px] tracking-widest">
               {loading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : 'Apply Sync'}
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function TourOccurrencesPage() {
  const params = useParams()
  const router = useRouter()
  const tourId = Number(params.id)

  const [tour, setTour] = useState<TourTemplateResponse | null>(null)
  const [occurrences, setOccurrences] = useState<TourOccurrenceResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming')
  
  const [showModal, setShowModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [showShiftModal, setShowShiftModal] = useState(false)
  const [editingOccId, setEditingOccId] = useState<number | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tourRes, occRes] = await Promise.all([
        getGuideTour(tourId),
        getGuideOccurrences(tourId)
      ])
      setTour(tourRes)
      setOccurrences(occRes)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sync departures')
      router.push('/dashboard/guide/tours')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [tourId])

  const handleAction = async (action: string, id: number) => {
    const occ = occurrences.find(o => o.id === id)
    const hasBookings = (occ?.seatsReserved || 0) > 0

    if (action === 'edit') {
      if (hasBookings) {
        if (!confirm('WARNING: This departure has active bookings. Travelers have already paid. Changing the date or time may violate the cancellation policy. Proceed with CAUTION.')) {
          return
        }
      }
      setEditingOccId(id)
      setShowModal(true)
      return
    }

    if (action === 'delete') {
      const confirmMsg = hasBookings 
        ? 'DANGER: This departure has active bookings! Deleting it will strand travelers who have already paid. You MUST handle refunds and notifications manually if you proceed. Are you ABSOLUTELY sure?'
        : 'Permanently delete this occurrence? This action cannot be undone.'
      
      if (confirm(confirmMsg)) {
        try {
          await deleteOccurrence(id)
          toast.success('Occurrence purged')
          fetchData()
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Delete failed')
        }
      }
      return
    }
  }

  const handleSave = async (data: CreateOccurrenceRequest) => {
    try {
      if (editingOccId) {
        await updateOccurrence(editingOccId, data)
        toast.success('Date updated')
      } else {
        await createOccurrence(tourId, data)
        toast.success('New date scheduled')
      }
      setShowModal(false)
      fetchData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed')
    }
  }

  const handleBulkSave = async (payloads: { startTimeUtc: string, endTimeUtc: string }[], durationHours: number, durationMinutes: number) => {
    try {
      setLoading(true)
      toast.loading(`Creating ${payloads.length} departures...`, { id: 'bulk-create' })
      
      // Update the tour template's duration first
      await updateTour(tourId, { durationHours, durationMinutes })
      
      for (const payload of payloads) {
        await createOccurrence(tourId, payload)
      }
      toast.success(`${payloads.length} dates scheduled`, { id: 'bulk-create' })
      setShowBulkModal(false)
      fetchData()
    } catch (err: any) {
      toast.error('Partial bulk failure', { id: 'bulk-create' })
      fetchData()
    } finally {
      setLoading(false)
    }
  }

  const handleTimeShift = async (newTime: string) => {
    if (!tour) return
    try {
      setLoading(true)
      toast.loading('Syncing departure times...', { id: 'time-shift' })
      const [h, m] = newTime.split(':').map(Number)
      
      const futureOccs = occurrences.filter(o => 
        new Date(o.startTimeUtc) > new Date() && o.status !== 'CANCELLED'
      )

      for (const occ of futureOccs) {
        const start = new Date(occ.startTimeUtc)
        start.setUTCHours(h - 2, m, 0, 0) // Beirut-ish simplified sync
        const end = new Date(start)
        end.setHours(start.getHours() + 2) // Maintain basic 2h default
        
        await updateOccurrence(occ.id, {
          startTimeUtc: start.toISOString(),
          endTimeUtc: end.toISOString()
        })
      }

      toast.success('All future times synced', { id: 'time-shift' })
      setShowShiftModal(false)
      fetchData()
    } catch (err: any) {
      toast.error('Sync failed', { id: 'time-shift' })
    } finally {
      setLoading(false)
    }
  }

  const handleWithdrawReview = async () => {
    if (!confirm('Withdraw this tour from the review queue? It will return to DRAFT status and you can make further edits.')) {
      return
    }

    try {
      setLoading(true)
      toast.loading('Withdrawing review...', { id: 'withdraw-review' })
      await withdrawTourFromReview(tourId)
      toast.success('Tour withdrawn to DRAFT', { id: 'withdraw-review' })
      fetchData() // Refresh status
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Withdrawal failed', { id: 'withdraw-review' })
    } finally {
      setLoading(false)
    }
  }

  const upcomingOccs = useMemo(() => 
    occurrences.filter(o => new Date(o.startTimeUtc) >= new Date() && o.status !== 'CANCELLED')
    .sort((a,b) => a.startTimeUtc.localeCompare(b.startTimeUtc))
  , [occurrences])

  const historyOccs = useMemo(() => 
    occurrences.filter(o => new Date(o.startTimeUtc) < new Date() || o.status === 'CANCELLED')
    .sort((a,b) => b.startTimeUtc.localeCompare(a.startTimeUtc))
  , [occurrences])

  if (loading && !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Initializing Interface...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-3xl border-b border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all hover:scale-110 active:scale-95">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-600/20 px-2 py-0.5 rounded-md">Management</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID #{tourId}</span>
                 </div>
                 <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">{tour?.title}</h1>
              </div>
           </div>

           <div className="flex items-center gap-3">
              {tour?.status === 'PENDING_REVIEW' && (
                <button 
                  onClick={handleWithdrawReview}
                  className="h-12 px-6 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95 uppercase text-[10px] tracking-widest border border-amber-400"
                >
                  <History className="w-4 h-4" /> Withdraw Review
                </button>
              )}
              <button 
                onClick={() => { setEditingOccId(null); setShowModal(true); }}
                disabled={tour?.status === 'PENDING_REVIEW'}
                className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all active:scale-95 uppercase text-[10px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" /> Add Date
              </button>
           </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between mb-4">
                <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                   <button 
                     onClick={() => setActiveTab('upcoming')}
                     className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'upcoming' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md' : 'text-gray-400 hover:text-gray-600 cursor-pointer'}`}
                   >
                     <LayoutGrid className="w-4 h-4" /> Upcoming ({upcomingOccs.length})
                   </button>
                   <button 
                     onClick={() => setActiveTab('history')}
                     className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md' : 'text-gray-400 hover:text-gray-600 cursor-pointer'}`}
                   >
                     <History className="w-4 h-4" /> History ({historyOccs.length})
                   </button>
                </div>
                
                <div className="relative group">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <input type="text" placeholder="Search..." className="h-10 pl-10 pr-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-white/5 rounded-xl text-xs font-bold outline-none focus:border-blue-500/50 transition-all w-48 group-hover:w-64" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <AnimatePresence mode="popLayout">
                 {(activeTab === 'upcoming' ? upcomingOccs : historyOccs).map((occ) => (
                   <OccurrenceCard 
                     key={occ.id} 
                     occurrence={occ} 
                     onAction={handleAction} 
                     isLoading={loading}
                      tourStatus={tour?.status}
                   />
                 ))}
               </AnimatePresence>
             </div>

             {(activeTab === 'upcoming' ? upcomingOccs : historyOccs).length === 0 && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-white/2 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800"
               >
                 <CalendarDays className="w-16 h-16 text-gray-200 dark:text-white/10 mb-6" />
                 <h3 className="text-xl font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-2">No Records Found</h3>
                 <p className="text-sm font-bold text-gray-400">Zero departures in this category yet.</p>
               </motion.div>
             )}
          </div>

          <div className="space-y-6">
             <div className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none sticky top-32">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-600">
                      <Settings2 className="w-5 h-5" />
                   </div>
                   <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-lg">Smart Tools</h3>
                </div>

                <div className="space-y-3">
                   <button 
                     onClick={() => setShowBulkModal(true)}
                     className="w-full p-4 bg-blue-50/50 dark:bg-blue-600/10 hover:bg-blue-100 dark:hover:bg-blue-600/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl flex items-center gap-4 transition-all group active:scale-95 text-left"
                   >
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                         <Repeat className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-0.5">Bulk Schedule</span>
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400">Add multiple dates</p>
                      </div>
                   </button>

                   <button 
                     onClick={() => setShowShiftModal(true)}
                     className="w-full p-4 bg-orange-50/50 dark:bg-orange-600/10 hover:bg-orange-100 dark:hover:bg-orange-600/20 border border-orange-100 dark:border-orange-900/50 rounded-2xl flex items-center gap-4 transition-all group active:scale-95 text-left"
                   >
                      <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                         <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-0.5">Time Sync</span>
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400">Apply time globally</p>
                      </div>
                   </button>

                   <div className="pt-8 pb-4 border-t border-gray-50 dark:border-gray-800 mt-2">
                      <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        <span>Stats</span>
                        <AlertCircle className="w-3 h-3" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                           <span className="block text-[10px] font-black text-gray-500 uppercase mb-1">Upcoming</span>
                           <span className="text-xl font-black text-gray-900 dark:text-white">{upcomingOccs.length}</span>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                           <span className="block text-[10px] font-black text-gray-500 uppercase mb-1">History</span>
                           <span className="text-xl font-black text-gray-900 dark:text-white">{historyOccs.length}</span>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showModal && tour && (
          <OccurrenceModal 
            onClose={() => { setShowModal(false); setEditingOccId(null); }}
            onSave={handleSave}
            initialData={editingOccId ? occurrences.find(o => o.id === editingOccId) : null}
            template={tour}
          />
        )}
        {showBulkModal && tour && (
          <BulkScheduleModal 
            onClose={() => setShowBulkModal(false)}
            onSave={handleBulkSave}
            template={tour}
          />
        )}
        {showShiftModal && tour && (
          <BulkTimeShiftModal 
            onClose={() => setShowShiftModal(false)}
            onSave={handleTimeShift}
            template={tour}
          />
        )}
      </AnimatePresence>
    </div>
  )
}