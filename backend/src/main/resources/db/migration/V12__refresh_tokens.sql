CREATE TABLE IF NOT EXISTS refresh_tokens (
                                              id BIGSERIAL PRIMARY KEY,
                                              user_id BIGINT NOT NULL REFERENCES users(id),
                                              token_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 hex = 64 chars
                                              created_at_utc TIMESTAMP NOT NULL DEFAULT NOW(),
                                              expires_at_utc TIMESTAMP NOT NULL,
                                              revoked_at_utc TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at_utc);