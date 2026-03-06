-- Email verification tokens are stored hashed (never store raw tokens/codes).
-- Supports both:
-- 1) Long link token (recommended)
-- 2) Short code (UI fallback) - must be rate-limited later

CREATE TABLE IF NOT EXISTS email_verification_tokens (
                                                         id BIGSERIAL PRIMARY KEY,
                                                         user_id BIGINT NOT NULL REFERENCES users(id),

    -- One of these hashes will be set:
                                                         token_hash VARCHAR(64) UNIQUE,  -- SHA-256 hex of long token
                                                         code_hash  VARCHAR(64) UNIQUE,  -- SHA-256 hex of short code

                                                         created_at_utc TIMESTAMP NOT NULL DEFAULT NOW(),
                                                         expires_at_utc TIMESTAMP NOT NULL,
                                                         used_at_utc TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_email_verif_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verif_expires_at ON email_verification_tokens(expires_at_utc);