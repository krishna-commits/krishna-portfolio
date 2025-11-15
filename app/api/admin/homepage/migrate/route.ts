import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';
import { siteConfig } from 'config/site';

export const dynamic = 'force-dynamic';

// POST - Migrate data from config to database
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      console.error('[Migration] Prisma client not available');
      return NextResponse.json(
        { error: 'Database not configured. Please check your database connection.' },
        { status: 500 }
      );
    }

    // Test database connection
    try {
      await prisma.$connect();
    } catch (dbError: any) {
      console.error('[Migration] Database connection failed:', dbError);
      return NextResponse.json(
        { error: `Database connection failed: ${dbError.message}` },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { section } = body; // Optional: migrate specific section only

    const results: Record<string, number | string> = {};

    // Migrate Education
    if (!section || section === 'education') {
      try {
        if (!siteConfig.education || siteConfig.education.length === 0) {
          results.education = 0;
          results.education_note = 'No education data in config';
        } else {
          // Delete existing
          await prisma.education.deleteMany({});
          
          // Insert from config
          for (let i = 0; i < siteConfig.education.length; i++) {
            const edu = siteConfig.education[i];
            await prisma.education.create({
              data: {
                organization: edu.organization,
                course: edu.course,
                university: edu.university || null,
                time: edu.time,
                thesis: edu.thesis || null,
                modules: edu.modules || [],
                orderIndex: i,
              },
            });
          }
          results.education = siteConfig.education.length;
        }
      } catch (error: any) {
        console.error('Error migrating education:', error);
        results.education_error = error.message || String(error);
      }
    }

    // Migrate Work Experience
    if (!section || section === 'work') {
      try {
        if (!siteConfig.work_experience || siteConfig.work_experience.length === 0) {
          results.work = 0;
          results.work_note = 'No work experience data in config';
        } else {
          await prisma.workExperience.deleteMany({});
          
          for (let i = 0; i < siteConfig.work_experience.length; i++) {
            const work = siteConfig.work_experience[i];
            await prisma.workExperience.create({
              data: {
                organization: work.organization,
                role: work.role,
                time: work.time,
                description: work.description || null,
                imageUrl: work.imageUrl || null,
                url: work.url || null,
                orderIndex: i,
              },
            });
          }
          results.work = siteConfig.work_experience.length;
        }
      } catch (error: any) {
        console.error('Error migrating work experience:', error);
        results.work_error = error.message || String(error);
      }
    }

    // Migrate Certifications
    if (!section || section === 'certifications') {
      try {
        if (!siteConfig.certification || siteConfig.certification.length === 0) {
          results.certifications = 0;
          results.certifications_note = 'No certifications data in config';
        } else {
          await prisma.certification.deleteMany({});
          
          for (let i = 0; i < siteConfig.certification.length; i++) {
            const cert = siteConfig.certification[i];
            await prisma.certification.create({
              data: {
                title: cert.title,
                issuedby: cert.issuedby,
                imageUrl: cert.imageURL,
                link: cert.link || null,
                time: cert.time,
                orderIndex: i,
              },
            });
          }
          results.certifications = siteConfig.certification.length;
        }
      } catch (error: any) {
        console.error('Error migrating certifications:', error);
        results.certifications_error = error.message || String(error);
      }
    }

    // Migrate Recommendations
    if (!section || section === 'recommendations') {
      try {
        if (!siteConfig.linkedin_recommendations || siteConfig.linkedin_recommendations.length === 0) {
          results.recommendations = 0;
          results.recommendations_note = 'No recommendations data in config';
        } else {
          await prisma.linkedInRecommendation.deleteMany({});
          
          for (let i = 0; i < siteConfig.linkedin_recommendations.length; i++) {
            const rec = siteConfig.linkedin_recommendations[i];
            await prisma.linkedInRecommendation.create({
              data: {
                name: rec.name,
                title: rec.title,
                company: rec.company || null,
                text: rec.text,
                date: rec.date,
                orderIndex: i,
              },
            });
          }
          results.recommendations = siteConfig.linkedin_recommendations.length;
        }
      } catch (error: any) {
        console.error('Error migrating recommendations:', error);
        results.recommendations_error = error.message || String(error);
      }
    }

    // Migrate Technology Stack
    if (!section || section === 'technology') {
      try {
        if (!siteConfig.technology_stack || siteConfig.technology_stack.length === 0) {
          results.technology = 0;
          results.technology_note = 'No technology stack data in config';
        } else {
          await prisma.technologyStack.deleteMany({});
          
          for (let i = 0; i < siteConfig.technology_stack.length; i++) {
            const tech = siteConfig.technology_stack[i];
            // Determine category (optional - can be set in admin panel later)
            let category: string | null = null;
            
            await prisma.technologyStack.create({
              data: {
                name: tech.name,
                imageUrl: tech.imageUrl,
                category: category,
                orderIndex: i,
              },
            });
          }
          results.technology = siteConfig.technology_stack.length;
        }
      } catch (error: any) {
        console.error('Error migrating technology stack:', error);
        results.technology_error = error.message || String(error);
      }
    }

    // Migrate Volunteering
    if (!section || section === 'volunteering') {
      try {
        if (!siteConfig.volunteering || siteConfig.volunteering.length === 0) {
          results.volunteering = 0;
          results.volunteering_note = 'No volunteering data in config';
        } else {
          await prisma.volunteering.deleteMany({});
          
          for (let i = 0; i < siteConfig.volunteering.length; i++) {
            const vol = siteConfig.volunteering[i];
            await prisma.volunteering.create({
              data: {
                organization: vol.organization,
                role: vol.role,
                time: vol.time,
                duration: vol.duration || null,
                type: vol.type || null,
                orderIndex: i,
              },
            });
          }
          results.volunteering = siteConfig.volunteering.length;
        }
      } catch (error: any) {
        console.error('Error migrating volunteering:', error);
        results.volunteering_error = error.message || String(error);
      }
    }

    // Migrate Hero Settings
    if (!section || section === 'hero') {
      try {
        await prisma.siteSetting.upsert({
          where: { key: 'hero' },
          update: {
            value: JSON.stringify({
              profileImage: siteConfig.profile_image,
              name: siteConfig.name,
              bio: siteConfig.bio,
              title: siteConfig.home.title,
              description: siteConfig.home.description,
              talksAbout: siteConfig.talks_about,
            }),
          },
          create: {
            key: 'hero',
            value: JSON.stringify({
              profileImage: siteConfig.profile_image,
              name: siteConfig.name,
              bio: siteConfig.bio,
              title: siteConfig.home.title,
              description: siteConfig.home.description,
              talksAbout: siteConfig.talks_about,
            }),
          },
        });
        results.hero = 1;
      } catch (error: any) {
        console.error('Error migrating hero settings:', error);
        results.hero_error = error.message || String(error);
      }
    }

    // Disconnect from database
    await prisma.$disconnect().catch(() => {});

    const hasErrors = Object.keys(results).some(key => key.endsWith('_error'));
    const successMessage = hasErrors 
      ? 'Migration completed with some errors. Check results for details.'
      : 'Migration completed successfully';

    return NextResponse.json(
      { 
        message: successMessage,
        results,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Migration API] Error:', error);
    
    // Disconnect on error
    if (prisma) {
      await prisma.$disconnect().catch(() => {});
    }
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to migrate data',
        details: error.stack || String(error)
      },
      { status: 500 }
    );
  }
}

