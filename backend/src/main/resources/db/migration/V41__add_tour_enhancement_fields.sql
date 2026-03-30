-- =============================================================================
-- V41: Add missing enhancement fields to TourTemplate and TourOccurrence
-- 
-- Context: Supports the new premium, family-friendly, and snapshot pricing 
-- fields added during the Tour CRUD & Scheduling card.
-- =============================================================================

ALTER TABLE tour_templates
    ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_family_friendly BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS has_group_discount BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE tour_occurrences
    ADD COLUMN IF NOT EXISTS base_price DECIMAL(10, 2),
    ADD COLUMN IF NOT EXISTS capacity INT,
    ADD COLUMN IF NOT EXISTS available_seats INT;
