// src/lib/api/tours.ts

import apiClient from '@/src/lib/api/client'
import {
  TourTemplateResponse,
  TourMediaResponse,
  PublicTourCardResponse,
  PublicTourDetailResponse,
  TourOccurrenceResponse,
  GuidePortfolioTourResponse,
  GuidePortfolioTourDetailResponse,
  CreateTourTemplateRequest,
  UpdateTourTemplateRequest,
  CreateOccurrenceRequest,
  UpdateOccurrenceRequest,
  PublicTourFilters,
  CreateBookingRequest,
  BookingResponse,
  GuideBookingResponse,
  WaitlistResponse,
} from '@/src/lib/types/tour.types'
import { GuideProfileResponse } from '@/src/lib/types/guide.types'

// ── Guide: Tour CRUD ─────────────────────────────────────────────────────────

/** Create a new tour (always starts as DRAFT) */
export const createTour = (data: CreateTourTemplateRequest) =>
  apiClient.post<TourTemplateResponse>('/api/guide/tours', data)

/** List all own tours (all statuses, not deleted) */
export const getGuideTours = () =>
  apiClient.get<TourTemplateResponse[]>('/api/guide/tours')

/** Get guide profile stats & info */
export const getGuideProfile = () =>
  apiClient.get<GuideProfileResponse>('/api/guide/profile')

/** Get one own tour by ID */
export const getGuideTour = (id: number) =>
  apiClient.get<TourTemplateResponse>(`/api/guide/tours/${id}`)

/** Partial update — only send fields you want to change */
export const updateTour = (id: number, data: UpdateTourTemplateRequest) =>
  apiClient.put<TourTemplateResponse>(`/api/guide/tours/${id}`, data)

/** Soft delete a tour */
export const deleteTour = (id: number) =>
  apiClient.delete(`/api/guide/tours/${id}`)

// ── Guide: Status transitions ────────────────────────────────────────────────

/** DRAFT or REJECTED → PENDING_REVIEW */
export const submitTourForReview = (id: number) =>
  apiClient.post<TourTemplateResponse>(`/api/guide/tours/${id}/submit`)

/** PENDING_REVIEW → DRAFT (guide withdraws to make more edits) */
export const withdrawTourFromReview = (id: number) =>
  apiClient.post<TourTemplateResponse>(`/api/guide/tours/${id}/withdraw`)

/** PUBLISHED → PAUSED */
export const pauseTour = (id: number) =>
  apiClient.post<TourTemplateResponse>(`/api/guide/tours/${id}/pause`)

/** PAUSED → PENDING_REVIEW (resuming requires re-approval) */
export const resumeTour = (id: number) =>
  apiClient.post<TourTemplateResponse>(`/api/guide/tours/${id}/resume`)

/** PUBLISHED or PAUSED → ARCHIVED (permanent) */
export const archiveTour = (id: number) =>
  apiClient.post<TourTemplateResponse>(`/api/guide/tours/${id}/archive`)

/** DEV-ONLY: Immediately publish a tour bypassing admin review */
export const publishTourImmediately = (id: number) =>
  apiClient.post<TourTemplateResponse>(`/api/guide/tours/${id}/publish-immediately`)

// ── Guide: Media ─────────────────────────────────────────────────────────────

/** Add a media item (base64) to a tour */
export const addTourMedia = (templateId: number, data: { url: string; mediaType: string; displayOrder: number; caption?: string }) =>
  apiClient.post<TourMediaResponse>(`/api/guide/tours/${templateId}/media`, data)

/** Delete a media item by ID */
export const deleteTourMedia = (mediaId: number) =>
  apiClient.delete(`/api/guide/media/${mediaId}`)

// ── Guide: Occurrences ───────────────────────────────────────────────────────

/** Create occurrence under a PUBLISHED tour */
export const createOccurrence = (templateId: number, data: CreateOccurrenceRequest) =>
  apiClient.post<TourOccurrenceResponse>(`/api/guide/tours/${templateId}/occurrences`, data)

/** List all occurrences for one of guide's tours */
export const getGuideOccurrences = (templateId: number) =>
  apiClient.get<TourOccurrenceResponse[]>(`/api/guide/tours/${templateId}/occurrences`)

/** Update an occurrence (reschedule or cancel) */
export const updateOccurrence = (occurrenceId: number, data: UpdateOccurrenceRequest) =>
  apiClient.put<TourOccurrenceResponse>(`/api/guide/occurrences/${occurrenceId}`, data)

/** Soft delete an occurrence */
export const deleteOccurrence = (occurrenceId: number) =>
  apiClient.delete(`/api/guide/occurrences/${occurrenceId}`)

// ── Admin: Review ────────────────────────────────────────────────────────────

/** Get all tours waiting for approval */
export const getAdminPendingTours = () =>
  apiClient.get<TourTemplateResponse[]>('/api/admin/tours/pending')

/** Approve a tour → PUBLISHED */
export const adminApproveTour = (id: number) =>
  apiClient.post<TourTemplateResponse>(`/api/admin/tours/${id}/approve`)

/** Reject a tour with a reason */
export const adminRejectTour = (id: number, rejectionReason: string) =>
  apiClient.post<TourTemplateResponse>(`/api/admin/tours/${id}/reject`, { rejectionReason })

// ── Public: Browsing ─────────────────────────────────────────────────────────

/** Public tour listing with optional filters */
export const getPublicTours = (filters?: PublicTourFilters) =>
  apiClient.get<PublicTourCardResponse[]>('/api/public/tours', { params: filters })

/** Public tour detail page */
export const getPublicTourDetail = (id: number) =>
  apiClient.get<PublicTourDetailResponse>(`/api/public/tours/${id}`)

/** Future active occurrences for a published tour */
export const getPublicTourOccurrences = (id: number) =>
  apiClient.get<TourOccurrenceResponse[]>(`/api/public/tours/${id}/occurrences`)

// ── Public: Portfolio ────────────────────────────────────────────────────────

/** Guide's public portfolio tour list */
export const getGuidePortfolio = (guideId: number | string) =>
  apiClient.get<GuidePortfolioTourResponse[]>(`/api/public/guides/${guideId}/tours`)

/** Single portfolio tour — full case-study view */
export const getPortfolioTourDetail = (guideId: number, tourId: number) =>
  apiClient.get<GuidePortfolioTourDetailResponse>(`/api/public/guides/${guideId}/tours/${tourId}`)

// ── Bookings: Traveler ───────────────────────────────────────────────────────

export const createBooking = (data: CreateBookingRequest) =>
  apiClient.post<BookingResponse>('/api/traveler/bookings', data)

/** Update an existing booking */
export const updateBooking = (id: number, data: { occurrenceId: number; peopleCount: number; confirmWaitlistTransition?: boolean }) =>
  apiClient.patch<BookingResponse>(`/api/traveler/bookings/${id}`, data)

/** List traveler's bookings */
export const getTravelerBookings = () =>
  apiClient.get<BookingResponse[]>('/api/traveler/bookings')

/** Get single traveler booking */
export const getTravelerBooking = (id: number) =>
  apiClient.get<BookingResponse>(`/api/traveler/bookings/${id}`)

// Cancel a traveler's own booking.
// reason is optional — backend defaults to 'Cancelled by Traveler' if omitted.
// The backend calculates refundPercent based on hours until tour start.
// IMPORTANT: axios DELETE with a body requires the { data } wrapper.
export const cancelBooking = (id: number, reason?: string) =>
  apiClient.delete<BookingResponse>(`/api/traveler/bookings/${id}`, {
    data: reason ? { reason } : undefined,
  })

// ── Bookings: Guide ──────────────────────────────────────────────────────────

/** List guide's incoming bookings */
export const getGuideBookings = () =>
  apiClient.get<GuideBookingResponse[]>('/api/guide/bookings')

/** Get single guide booking */
export const getGuideBooking = (id: number) =>
  apiClient.get<GuideBookingResponse>(`/api/guide/bookings/${id}`)

/** Confirm a pending booking */
export const confirmBooking = (id: number) =>
  apiClient.put<GuideBookingResponse>(`/api/guide/bookings/${id}/confirm`)

// Guide rejects a PENDING_GUIDE booking.
// reason is optional — backend defaults to 'Rejected by Guide' if omitted.
export const rejectBooking = (id: number, reason?: string) =>
  apiClient.put<GuideBookingResponse>(`/api/guide/bookings/${id}/reject`, {
    reason,
  })

export const noShowBooking = (id: number, reason?: string) =>
  apiClient.post<GuideBookingResponse>(`/api/guide/bookings/${id}/no-show`, {
    reason,
  })

// ── Bookings: Guide — Check-in & Completion ─────────────────────────────────

// Guide checks in a traveler by tapping from their dashboard list.
// Transitions booking: CONFIRMED → IN_PROGRESS.
// Guide checks in a traveler by scanning the UUID embedded in their QR code.
// This is the primary in-field scanner flow.
// Backend validates the token belongs to one of this guide’s own occurrences.
// Transitions booking: CONFIRMED → IN_PROGRESS.
export const checkInByQrToken = (qrToken: string) =>
  apiClient.post<GuideBookingResponse>(`/api/guide/bookings/checkin-by-qr/${qrToken}`)

// Guide marks a booking as fully completed after the tour ends.
// Transitions booking: IN_PROGRESS → COMPLETED.
// Sets completedAtUtc — starts the 48h payout freeze window (future payout card).
// Also unlocks review eligibility for the traveler (future review card).
export const completeBooking = (id: number) =>
  apiClient.post<GuideBookingResponse>(`/api/guide/bookings/${id}/complete`)

// ── Waitlist: Traveler ─────────────────────────────────────────────────

// Join the waitlist for a full occurrence.
// Returns 400 if occurrence is not actually full — traveler should book directly.
// Returns 409 if traveler already has an active waitlist entry or booking.
// peopleCount specifies how many seats the traveler wants to wait for.
export const joinWaitlist = (occurrenceId: number, peopleCount: number = 1) =>
  apiClient.post<WaitlistResponse>('/api/traveler/waitlist', { occurrenceId, peopleCount })

// Get all active waitlist entries for the authenticated traveler.
// Promoted or self-removed entries are excluded by the backend.
export const getMyWaitlist = () =>
  apiClient.get<WaitlistResponse[]>('/api/traveler/waitlist')

// Remove the traveler from a waitlist entry they own.
// Soft-deletes the entry and decrements the occurrence waitlist counter.
export const leaveWaitlist = (waitlistId: number) =>
  apiClient.delete<void>(`/api/traveler/waitlist/${waitlistId}`)

// ── Placeholders & Legacy Support ────────────────────────────────────────────

/** Alias for getPublicTourDetail used by legacy components */
export const getTourById = ({ id }: { id: string | number }) =>
  getPublicTourDetail(Number(id)).then(r => r.data)

/** Fetch reviews (Placeholder) */
export const getTourReviews = (params: any) =>
  Promise.resolve({ data: { data: [], total: 0, page: 1, limit: 10, hasNext: false, hasPrev: false } } as any)

/** Fetch similar tours (Placeholder) */
export const getSimilarTours = (params: any) =>
  apiClient.get<PublicTourCardResponse[]>('/api/public/tours', { params }).then(r => r.data).catch(() => [])

/** Export types used by callers */
export type { GetTourReviewsParams, PaginatedResponse } from '../types/tour.types'