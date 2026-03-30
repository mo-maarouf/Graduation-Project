-- V40 Migration
-- PURPOSE: Add caption column to tour_media table
-- Applied to: tour_media table

ALTER TABLE tour_media ADD COLUMN caption VARCHAR(255);
