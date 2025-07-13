-- Add new indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_x_credentials_github_username 
ON x_credentials(github_username);

-- Example of how to add a new column
-- ALTER TABLE x_credentials 
-- ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMP;
