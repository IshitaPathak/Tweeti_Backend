-- Create x_credentials table
CREATE TABLE IF NOT EXISTS x_credentials (
  id SERIAL PRIMARY KEY,
  access_token TEXT NOT NULL,
  access_secret TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  github_username TEXT UNIQUE NOT NULL
);
