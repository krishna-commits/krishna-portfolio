/**
 * Load .env.local and run prisma db push
 * This ensures Prisma uses the correct environment variables
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { execSync } from 'child_process';
import { resolveDirectDatabaseUrl } from '../lib/db-env';

// Load .env.local first (highest priority)
const envLocalPath = path.join(process.cwd(), '.env.local');
if (require('fs').existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
  console.log('✅ Loaded .env.local');
}

// Also load .env (fallback)
const envPath = path.join(process.cwd(), '.env');
if (require('fs').existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('✅ Loaded .env');
}

// Check if required variables are set
const prismaUrl = process.env.POSTGRES_PRISMA_URL;
const nonPoolingUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

console.log('\n📊 Environment Variables Status:');
console.log(`  POSTGRES_PRISMA_URL: ${prismaUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`  POSTGRES_URL_NON_POOLING: ${nonPoolingUrl ? '✅ Set' : '❌ Missing'}\n`);

if (!prismaUrl && !nonPoolingUrl) {
  console.error('❌ Error: No database connection string found!');
  console.error('Please set POSTGRES_PRISMA_URL in .env.local\n');
  process.exit(1);
}

if (!process.env.POSTGRES_URL_NON_POOLING && nonPoolingUrl) {
  // Set it from POSTGRES_URL if available
  process.env.POSTGRES_URL_NON_POOLING = nonPoolingUrl;
  console.log('ℹ️  Using POSTGRES_URL as POSTGRES_URL_NON_POOLING\n');
}

// db push uses directUrl — localhost often stale when the app uses hosted Postgres/Accelerate
const { usedFallback } = resolveDirectDatabaseUrl();
if (usedFallback) {
  console.warn('⚠️  POSTGRES_URL_NON_POOLING points to localhost but POSTGRES_URL is remote.');
  console.warn('   Using POSTGRES_URL for schema push (update .env.local to match production).\n');
}

// Run prisma db push
try {
  console.log('🚀 Running: prisma db push\n');
  execSync('npx prisma db push', {
    stdio: 'inherit',
    env: process.env,
  });
  console.log('\n✅ Schema pushed successfully!');
} catch (error) {
  console.error('\n❌ Schema push failed!');
  process.exit(1);
}

