-- =============================================================================
-- V54: Add index to optimize pessimistic lock acquisition on tour_occurrences
-- =============================================================================
-- Context:
--   BookingService.resolveOccurrenceWithLock() issues:
--     SELECT ... FROM tour_occurrences WHERE id = ? AND deleted_at_utc IS NULL FOR UPDATE
--
--   PostgreSQL must locate the target row before it can acquire the lock.
--   Without a covering index, it may resort to a sequential scan — especially
--   during periods of high concurrency where multiple transactions are queuing
--   for the same row. A seq scan while holding or waiting for a lock is wasteful.
--
-- This partial index on (id) WHERE deleted_at_utc IS NULL:
--   - Covers the exact predicate used by findByIdWithLock()
--   - Mirrors the same partial condition so Postgres uses it preferentially
--   - Makes the FOR UPDATE row lookup O(log n) in the number of active occurrences
--   - Reduces lock wait time, indirectly lowering the chance of hitting the 2-second
--     lock timeout configured in TourOccurrenceRepository
--
-- Notes:
--   - The primary key index on `id` is already unique but does NOT filter out
--     deleted rows. This supplementary partial index gives the query planner
--     a narrower, faster path for the most common lock-and-read pattern.
--   - IF NOT EXISTS is safe to add here (idempotent if run twice, e.g. after repair).
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_tour_occurrences_active_id
    ON tour_occurrences (id)
    WHERE deleted_at_utc IS NULL;
