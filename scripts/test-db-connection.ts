/**
 * Test Database Connection Script
 * Run with: npx tsx scripts/test-db-connection.ts
 */

import { PrismaClient } from '@prisma/client';

async function testConnection() {
  console.log('🔍 Testing database connection...\n');

  // Check environment variables
  const prismaUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
  const nonPoolingUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

  console.log('Environment Variables:');
  console.log(`  POSTGRES_PRISMA_URL: ${prismaUrl ? '✅ Set' : '❌ Not set'}`);
  console.log(`  POSTGRES_URL_NON_POOLING: ${nonPoolingUrl ? '✅ Set' : '❌ Not set'}`);
  console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Not set'}\n`);

  if (!prismaUrl) {
    console.error('❌ No database connection string found!');
    console.error('Please set POSTGRES_PRISMA_URL or DATABASE_URL in .env.local');
    process.exit(1);
  }

  // Check if it's localhost (shouldn't be in production)
  if (prismaUrl.includes('localhost') && process.env.NODE_ENV === 'production') {
    console.warn('⚠️  Warning: Using localhost in production is not recommended!');
  }

  const prisma = new PrismaClient({
    log: ['error', 'warn', 'info'],
  });

  try {
    console.log('📡 Attempting to connect to database...\n');

    // Test basic connection
    await prisma.$connect();
    console.log('✅ Successfully connected to database!\n');

    // Test query - count tables
    console.log('📊 Testing database queries...\n');

    const [hobbies, subscribers, education, work, certifications, recommendations, techStack, volunteering] = await Promise.all([
      prisma.hobby.count().catch(() => 0),
      prisma.newsletterSubscriber.count().catch(() => 0),
      prisma.education.count().catch(() => 0),
      prisma.workExperience.count().catch(() => 0),
      prisma.certification.count().catch(() => 0),
      prisma.linkedInRecommendation.count().catch(() => 0),
      prisma.technologyStack.count().catch(() => 0),
      prisma.volunteering.count().catch(() => 0),
    ]);

    console.log('📈 Database Statistics:');
    console.log(`  Hobbies: ${hobbies}`);
    console.log(`  Newsletter Subscribers: ${subscribers}`);
    console.log(`  Education Entries: ${education}`);
    console.log(`  Work Experience: ${work}`);
    console.log(`  Certifications: ${certifications}`);
    console.log(`  LinkedIn Recommendations: ${recommendations}`);
    console.log(`  Technology Stack Items: ${techStack}`);
    console.log(`  Volunteering: ${volunteering}\n`);

    // Test write operation
    console.log('✍️  Testing write operation...');
    const testSetting = await prisma.siteSetting.upsert({
      where: { key: '__db_test__' },
      update: { value: new Date().toISOString() },
      create: {
        key: '__db_test__',
        value: new Date().toISOString(),
      },
    });
    console.log('✅ Write operation successful!\n');

    // Clean up test data
    await prisma.siteSetting.delete({
      where: { key: '__db_test__' },
    }).catch(() => {});
    console.log('🧹 Test data cleaned up\n');

    console.log('🎉 All database tests passed!');
    console.log('✅ Your database connection is working properly.\n');

  } catch (error: any) {
    console.error('❌ Database connection failed!\n');
    console.error('Error details:');
    console.error(`  Code: ${error.code || 'N/A'}`);
    console.error(`  Message: ${error.message}`);
    
    if (error.code === 'P1001') {
      console.error('\n💡 This usually means:');
      console.error('  - Database server is not running');
      console.error('  - Connection string is incorrect');
      console.error('  - Network/firewall issues');
    } else if (error.code === 'P1012') {
      console.error('\n💡 This usually means:');
      console.error('  - Missing environment variable: POSTGRES_URL_NON_POOLING');
      console.error('  - Schema validation error');
    } else if (error.code === 'P2002') {
      console.error('\n💡 This usually means:');
      console.error('  - Unique constraint violation (duplicate entry)');
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from database');
  }
}

testConnection().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

