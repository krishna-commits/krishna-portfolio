/**
 * Load .env.local and run prisma studio
 * This ensures Prisma Studio uses the correct environment variables
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { spawn } from 'child_process';
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

const { usedFallback } = resolveDirectDatabaseUrl();
if (usedFallback) {
  console.warn('⚠️  POSTGRES_URL_NON_POOLING points to localhost; using POSTGRES_URL for Prisma Studio.\n');
}

// Run prisma studio with environment variables
console.log('🚀 Starting Prisma Studio...\n');
console.log('📝 Prisma Studio will open in your browser at http://localhost:5555\n');

const prismaStudio = spawn('npx', ['prisma', 'studio'], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

prismaStudio.on('error', (error) => {
  console.error('❌ Failed to start Prisma Studio:', error);
  process.exit(1);
});

prismaStudio.on('exit', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Prisma Studio exited with code ${code}`);
    process.exit(code || 1);
  }
});

