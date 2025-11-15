/**
 * Database Setup Script
 * Reads .env and .env.local, then sets up proper database configuration
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

console.log('🔧 Setting up database connection...\n');

const envPath = path.resolve(process.cwd(), '.env');
const envLocalPath = path.resolve(process.cwd(), '.env.local');

// Load existing environment files
let envConfig: Record<string, string> = {};
let envLocalConfig: Record<string, string> = {};

if (fs.existsSync(envPath)) {
  envConfig = dotenv.parse(fs.readFileSync(envPath));
  console.log('✅ Loaded .env');
} else {
  console.warn('⚠️  .env file not found');
}

if (fs.existsSync(envLocalPath)) {
  envLocalConfig = dotenv.parse(fs.readFileSync(envLocalPath));
  console.log('✅ Loaded .env.local');
} else {
  console.log('📝 Creating .env.local');
  fs.writeFileSync(envLocalPath, '');
}

// Find direct postgres connection (not Accelerate)
const findDirectPostgresUrl = (config: Record<string, string>): string | null => {
  for (const [key, value] of Object.entries(config)) {
    if (
      value &&
      value.startsWith('postgres://') &&
      !value.startsWith('prisma+postgres://') &&
      !value.includes('accelerate.prisma-data.net')
    ) {
      return value;
    }
  }
  return null;
};

// Find Prisma Accelerate URL
const findAccelerateUrl = (config: Record<string, string>): string | null => {
  for (const [key, value] of Object.entries(config)) {
    if (
      value &&
      (value.startsWith('prisma+postgres://') || value.includes('accelerate.prisma-data.net'))
    ) {
      return value;
    }
  }
  return null;
};

// Extract values from both files
const directPostgresUrl = findDirectPostgresUrl(envConfig) || findDirectPostgresUrl(envLocalConfig);
const accelerateUrl = findAccelerateUrl(envConfig) || findAccelerateUrl(envLocalConfig);

console.log('\n📊 Found Connection Strings:');
console.log(`  Direct Postgres: ${directPostgresUrl ? '✅ Found' : '❌ Not found'}`);
console.log(`  Prisma Accelerate: ${accelerateUrl ? '✅ Found' : '❌ Not found'}\n`);

// Read existing .env.local content
let envLocalContent = fs.existsSync(envLocalPath) ? fs.readFileSync(envLocalPath, 'utf8') : '';
const lines = envLocalContent.split('\n');
const existingVars: Record<string, boolean> = {};

// Parse existing variables
lines.forEach((line) => {
  const match = line.match(/^([^=:#]+)=/);
  if (match) {
    existingVars[match[1].trim()] = true;
  }
});

// Prepare new content
const updates: string[] = [];
let changed = false;

// Update POSTGRES_PRISMA_URL (should be Accelerate URL for queries)
if (accelerateUrl) {
  if (!existingVars['POSTGRES_PRISMA_URL']) {
    envLocalContent += `\nPOSTGRES_PRISMA_URL="${accelerateUrl}"`;
    updates.push('✅ Added POSTGRES_PRISMA_URL (Accelerate URL)');
    changed = true;
  } else {
    // Update existing line
    const updatedLines = lines.map((line) => {
      if (line.startsWith('POSTGRES_PRISMA_URL=')) {
        return `POSTGRES_PRISMA_URL="${accelerateUrl}"`;
      }
      return line;
    });
    envLocalContent = updatedLines.join('\n');
    updates.push('✅ Updated POSTGRES_PRISMA_URL (Accelerate URL)');
    changed = true;
  }
} else {
  console.warn('⚠️  No Prisma Accelerate URL found. You may need to set POSTGRES_PRISMA_URL manually.');
}

// Update POSTGRES_URL_NON_POOLING (should be direct connection for migrations)
if (directPostgresUrl) {
  if (!existingVars['POSTGRES_URL_NON_POOLING']) {
    envLocalContent += `\nPOSTGRES_URL_NON_POOLING="${directPostgresUrl}"`;
    updates.push('✅ Added POSTGRES_URL_NON_POOLING (Direct connection)');
    changed = true;
  } else {
    // Update existing line
    const updatedLines = lines.map((line) => {
      if (line.startsWith('POSTGRES_URL_NON_POOLING=')) {
        return `POSTGRES_URL_NON_POOLING="${directPostgresUrl}"`;
      }
      return line;
    });
    envLocalContent = updatedLines.join('\n');
    updates.push('✅ Updated POSTGRES_URL_NON_POOLING (Direct connection)');
    changed = true;
  }
} else {
  console.warn('⚠️  No direct Postgres URL found. You may need to set POSTGRES_URL_NON_POOLING manually.');
  if (accelerateUrl) {
    console.warn('   Note: If using Prisma Accelerate, you need a direct connection URL for migrations.');
    console.warn('   The direct URL should start with "postgres://" (not "prisma+postgres://")');
  }
}

// Copy other important variables from .env if not in .env.local
const importantVars = [
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'AUTH_SECRET',
  'BLOB_READ_WRITE_TOKEN',
  'NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN',
];

importantVars.forEach((varName) => {
  if (envConfig[varName] && !existingVars[varName]) {
    const value = envConfig[varName];
    // Remove quotes if already quoted
    const cleanValue = value.replace(/^["']|["']$/g, '');
    envLocalContent += `\n${varName}="${cleanValue}"`;
    updates.push(`✅ Added ${varName}`);
    changed = true;
  }
});

// Write updated .env.local
if (changed) {
  // Clean up: remove empty lines at start/end, ensure single newline at end
  envLocalContent = envLocalContent.trim() + '\n';
  fs.writeFileSync(envLocalPath, envLocalContent);
  
  console.log('\n📝 Updates made to .env.local:');
  updates.forEach((update) => console.log(`  ${update}`));
  console.log('\n✅ .env.local updated successfully!');
} else {
  console.log('\n✅ .env.local is already up to date.');
}

// Summary
console.log('\n📋 Configuration Summary:');
console.log('  POSTGRES_PRISMA_URL: Used for queries (should be Accelerate URL)');
console.log('  POSTGRES_URL_NON_POOLING: Used for migrations (should be direct connection)');
console.log('\n💡 Next Steps:');
console.log('  1. Verify your .env.local file has the correct values');
console.log('  2. Run: npm run db:p (to push schema)');
console.log('  3. Run: npm run db:test (to test connection)');
console.log('\n');

