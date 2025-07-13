require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '..', 'migrations');

// Get all SQL files and sort them numerically
const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort();

console.log('Running migrations...');

migrationFiles.forEach(file => {
  console.log(`Applying migration: ${file}`);
  const migrationPath = path.join(migrationsDir, file);
  try {
    execSync(`psql "${process.env.DATABASE_URL}" -f "${migrationPath}"`, { stdio: 'inherit' });
    console.log(`✅ Successfully applied ${file}`);
  } catch (error) {
    console.error(`❌ Error applying ${file}:`, error);
    process.exit(1);
  }
});
