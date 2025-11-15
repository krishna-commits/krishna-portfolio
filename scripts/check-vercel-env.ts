/**
 * Check Vercel Environment Variables
 * This script helps verify that all required environment variables are set
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

console.log('🔍 Checking Vercel Environment Variables...\n');

// Check if we're in production
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

if (isProduction) {
  console.log('📊 Running in PRODUCTION mode (Vercel)\n');
} else {
  console.log('📊 Running in DEVELOPMENT mode\n');
  
  // Load .env.local for development
  const envLocalPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath, override: true });
    console.log('✅ Loaded .env.local\n');
  }
}

// Environment variable configuration type
interface EnvVarConfig {
  description: string;
  required: boolean;
  mustNotContain?: string[];
}

// Required environment variables
const requiredVars: Record<string, EnvVarConfig> = {
  'POSTGRES_PRISMA_URL': {
    description: 'Prisma Accelerate URL (for queries)',
    required: true,
    mustNotContain: ['localhost', '127.0.0.1'],
  },
  'POSTGRES_URL_NON_POOLING': {
    description: 'Direct database connection (for migrations)',
    required: true,
    mustNotContain: ['localhost', '127.0.0.1'],
  },
  'AUTH_SECRET': {
    description: 'Authentication secret',
    required: true,
  },
  'BLOB_READ_WRITE_TOKEN': {
    description: 'Vercel Blob Storage token',
    required: false,
  },
  'ADMIN_EMAIL': {
    description: 'Admin email (optional)',
    required: false,
  },
  'ADMIN_PASSWORD': {
    description: 'Admin password (optional)',
    required: false,
  },
};

console.log('📋 Environment Variables Status:\n');
console.log('='.repeat(60));

let hasErrors = false;
let hasWarnings = false;

for (const [varName, config] of Object.entries(requiredVars)) {
  const value = process.env[varName];
  const isSet = !!value;
  
  // Check if required
  if (config.required && !isSet) {
    console.log(`❌ ${varName}: MISSING (REQUIRED)`);
    console.log(`   ${config.description}`);
    if (isProduction) {
      console.log(`   ⚠️  Must be set in Vercel Dashboard → Settings → Environment Variables`);
    }
    hasErrors = true;
    console.log('');
    continue;
  }
  
  if (!isSet) {
    console.log(`⚠️  ${varName}: Not set (optional)`);
    console.log(`   ${config.description}`);
    hasWarnings = true;
    console.log('');
    continue;
  }
  
  // Check for forbidden values (localhost, etc.)
  if (config.mustNotContain) {
    const containsForbidden = config.mustNotContain.some(forbidden => 
      value.includes(forbidden)
    );
    
    if (containsForbidden && isProduction) {
      console.log(`❌ ${varName}: Contains forbidden value (localhost/127.0.0.1)`);
      console.log(`   ${config.description}`);
      console.log(`   ⚠️  Production cannot use localhost - check Vercel environment variables`);
      hasErrors = true;
      console.log('');
      continue;
    }
  }
  
  // Mask sensitive parts
  const maskedValue = value
    .replace(/(:\/\/[^:]+:)([^@]+)(@)/, '$1***$3')
    .substring(0, 80) + (value.length > 80 ? '...' : '');
  
  console.log(`✅ ${varName}: Set`);
  console.log(`   ${config.description}`);
  console.log(`   Value: ${maskedValue}`);
  console.log('');
}

console.log('='.repeat(60));

if (hasErrors) {
  console.log('\n❌ ERRORS FOUND:');
  console.log('   Some required environment variables are missing or invalid.');
  if (isProduction) {
    console.log('\n🔧 FIX:');
    console.log('   1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
    console.log('   2. Add missing variables');
    console.log('   3. Make sure URLs do NOT contain localhost or 127.0.0.1');
    console.log('   4. Redeploy your application');
  } else {
    console.log('\n🔧 FIX:');
    console.log('   1. Create/update .env.local file');
    console.log('   2. Add missing variables');
    console.log('   3. Run: npm run db:setup');
  }
  process.exit(1);
}

if (hasWarnings) {
  console.log('\n⚠️  WARNINGS:');
  console.log('   Some optional environment variables are not set.');
  console.log('   This might affect some features.');
}

console.log('\n✅ All required environment variables are set correctly!');
console.log('\n💡 Next Steps:');
if (isProduction) {
  console.log('   - Verify database connection in Vercel logs');
  console.log('   - Test admin dashboard: https://krishnaneupane.com/admin');
} else {
  console.log('   - Run: npm run db:test (to test connection)');
  console.log('   - Run: npm run db:p (to push schema)');
}

console.log('');

