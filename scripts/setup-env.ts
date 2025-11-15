/**
 * Setup Environment Variables for Database
 * This script helps ensure all required Prisma environment variables are set
 * Run with: npx tsx scripts/setup-env.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

function setupEnv() {
  console.log('🔧 Setting up database environment variables...\n');

  // Load .env.local if it exists
  const envLocalPath = path.join(process.cwd(), '.env.local');
  const envPath = path.join(process.cwd(), '.env');

  let envVars: Record<string, string> = {};

  // Try to load .env.local first
  if (fs.existsSync(envLocalPath)) {
    console.log('📄 Found .env.local file');
    const envLocalContent = fs.readFileSync(envLocalPath, 'utf-8');
    dotenv.config({ path: envLocalPath });
    envLocalContent.split('\n').forEach((line) => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        envVars[key] = value;
      }
    });
  }

  // Also load .env if it exists
  if (fs.existsSync(envPath)) {
    console.log('📄 Found .env file');
    dotenv.config({ path: envPath });
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!envVars[key]) {
          envVars[key] = value;
        }
      }
    });
  }

  // Check what we have
  const prismaUrl = process.env.POSTGRES_PRISMA_URL || envVars.POSTGRES_PRISMA_URL;
  const nonPoolingUrl = process.env.POSTGRES_URL_NON_POOLING || envVars.POSTGRES_URL_NON_POOLING;
  const databaseUrl = process.env.DATABASE_URL || envVars.DATABASE_URL;

  console.log('\n📊 Current Environment Variables:');
  console.log(`  POSTGRES_PRISMA_URL: ${prismaUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`  POSTGRES_URL_NON_POOLING: ${nonPoolingUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`  DATABASE_URL: ${databaseUrl ? '✅ Set' : '❌ Missing'}\n`);

  // Determine what we need
  let needsUpdate = false;
  const updates: string[] = [];

  if (!prismaUrl && !databaseUrl) {
    console.error('❌ Error: No database connection string found!');
    console.error('Please set POSTGRES_PRISMA_URL or DATABASE_URL in .env.local\n');
    process.exit(1);
  }

  // Use the available URL
  const mainUrl = prismaUrl || databaseUrl;

  // If POSTGRES_PRISMA_URL is missing but DATABASE_URL exists, use it
  if (!prismaUrl && databaseUrl) {
    updates.push(`POSTGRES_PRISMA_URL=${databaseUrl}`);
    needsUpdate = true;
  }

  // If POSTGRES_URL_NON_POOLING is missing, use the main URL (remove pgbouncer if present)
  if (!nonPoolingUrl) {
    let directUrl = mainUrl;
    // Remove pgbouncer parameter if present
    directUrl = directUrl.replace(/\?pgbouncer=true/, '');
    directUrl = directUrl.replace(/&pgbouncer=true/, '');
    updates.push(`POSTGRES_URL_NON_POOLING=${directUrl}`);
    needsUpdate = true;
  }

  if (needsUpdate) {
    console.log('📝 Adding missing environment variables to .env.local:\n');
    updates.forEach((update) => {
      console.log(`  + ${update.split('=')[0]}`);
    });
    console.log('');

    // Append to .env.local
    const newLines = updates.map((u) => `\n${u}`).join('');
    if (fs.existsSync(envLocalPath)) {
      fs.appendFileSync(envLocalPath, newLines);
      console.log('✅ Updated .env.local file\n');
    } else {
      // Create .env.local
      fs.writeFileSync(envLocalPath, updates.join('\n') + '\n');
      console.log('✅ Created .env.local file\n');
    }

    console.log('🔄 Please restart your development server for changes to take effect.\n');
  } else {
    console.log('✅ All required environment variables are set!\n');
  }

  // Show connection info (masked)
  if (mainUrl) {
    const maskedUrl = mainUrl.replace(/(:\/\/[^:]+:)([^@]+)(@)/, '$1****$3');
    console.log('🔗 Connection String (masked):');
    console.log(`  ${maskedUrl}\n`);
  }

  console.log('💡 Next steps:');
  console.log('  1. Run: npx prisma db push');
  console.log('  2. Test connection: npx tsx scripts/test-db-connection.ts');
  console.log('  3. Or visit: http://localhost:3000/admin/database\n');
}

setupEnv();

