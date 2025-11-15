import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';

export const dynamic = 'force-dynamic';

// GET - Test database connection and schema
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({
        connected: false,
        error: 'Prisma client not initialized. Check your database environment variables.',
      }, { status: 500 });
    }

    const results: Record<string, any> = {
      connected: false,
      tables: {},
      models: [],
      errors: [],
    };

    try {
      // Test connection
      await prisma.$connect();
      results.connected = true;

      // Check each model
      const models = [
        'hobby',
        'newsletterSubscriber',
        'education',
        'workExperience',
        'certification',
        'linkedInRecommendation',
        'technologyStack',
        'volunteering',
        'siteSetting',
        'visitor',
        'pageView',
        'performanceMetric',
      ];

      for (const model of models) {
        try {
          const count = await (prisma as any)[model].count();
          results.tables[model] = {
            exists: true,
            count,
          };
          results.models.push(model);
        } catch (error: any) {
          results.tables[model] = {
            exists: false,
            error: error.message,
          };
          results.errors.push(`${model}: ${error.message}`);
        }
      }

      // Test a simple query
      const testQuery = await prisma.hobby.count();
      results.testQuery = 'success';

      // Get database info
      try {
        const dbInfo = await prisma.$queryRaw`SELECT version() as version`;
        results.databaseInfo = dbInfo;
      } catch {
        // Ignore if query fails
      }

    } catch (error: any) {
      results.connected = false;
      results.error = error.message;
      results.errorCode = error.code;
    } finally {
      try {
        await prisma.$disconnect();
      } catch {
        // Ignore disconnect errors
      }
    }

    return NextResponse.json({
      success: results.connected,
      ...results,
      timestamp: new Date().toISOString(),
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to test database',
      connected: false,
    }, { status: 500 });
  }
}

// POST - Create test data
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { action } = body; // 'create' or 'cleanup'

    if (action === 'create') {
      // Create test data
      const results: Record<string, any> = {};

      // Test Hobby
      try {
        const testHobby = await prisma.hobby.create({
          data: {
            title: 'Test Hobby',
            description: 'This is a test hobby',
            imageUrl: '/placeholder.jpg',
            orderIndex: 0,
            isActive: true,
          },
        });
        results.hobby = { created: true, id: testHobby.id };
      } catch (error: any) {
        results.hobby = { created: false, error: error.message };
      }

      // Test Education
      try {
        const testEdu = await prisma.education.create({
          data: {
            organization: 'Test University',
            course: 'Test Course',
            time: '2024',
            modules: ['Module 1', 'Module 2'],
            orderIndex: 0,
          },
        });
        results.education = { created: true, id: testEdu.id };
      } catch (error: any) {
        results.education = { created: false, error: error.message };
      }

      return NextResponse.json({
        success: true,
        message: 'Test data created',
        results,
      }, { status: 200 });
    }

    if (action === 'cleanup') {
      // Clean up test data
      await prisma.hobby.deleteMany({ where: { title: 'Test Hobby' } });
      await prisma.education.deleteMany({ where: { organization: 'Test University' } });

      return NextResponse.json({
        success: true,
        message: 'Test data cleaned up',
      }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Failed to execute action',
    }, { status: 500 });
  }
}

