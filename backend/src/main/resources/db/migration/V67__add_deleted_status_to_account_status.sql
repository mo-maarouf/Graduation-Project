-- V67: Add DELETED and DEACTIVATED to account_status CHECK constraint
-- The delete-account endpoint sets status to 'DELETED' but the original
-- CHECK constraint only allowed ACTIVE, SUSPENDED, BANNED.

ALTER TABLE users
    DROP CONSTRAINT IF EXISTS users_account_status_check;

ALTER TABLE users
    ADD CONSTRAINT users_account_status_check
        CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'BANNED', 'DEACTIVATED', 'DELETED'));
