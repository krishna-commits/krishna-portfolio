/**
 * Import All Data from config/site.tsx to Database
 * This script imports all existing data to the database
 */

import { loadEnvLocal } from './load-env-local'

// Must run before dynamic import of lib/prisma (static imports are hoisted).
loadEnvLocal()
console.log('')

async function importAllData() {
  const { prisma } = await import('../lib/prisma')
  const { siteConfig } = await import('../config/site')

  console.log('🚀 Starting data import from config/site.tsx to database...\n')

  if (!prisma) {
    console.error('❌ Error: Database not configured. Please check your database connection.');
    process.exit(1);
  }

  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Connected to database\n');
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }

  const results: Record<string, number | string> = {};

  try {
    // 1. Import Education
    console.log('📚 Importing Education...');
    try {
      if (!siteConfig.education || siteConfig.education.length === 0) {
        results.education = 0;
        console.log('  ⚠️  No education data found');
      } else {
        await prisma.education.deleteMany({});
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
        console.log(`  ✅ Imported ${siteConfig.education.length} education entries`);
      }
    } catch (error: any) {
      console.error('  ❌ Error:', error.message);
      results.education_error = error.message;
    }

    // 2. Import Work Experience
    console.log('\n💼 Importing Work Experience...');
    try {
      if (!siteConfig.work_experience || siteConfig.work_experience.length === 0) {
        results.work = 0;
        console.log('  ⚠️  No work experience data found');
      } else {
        await prisma.workExperience.deleteMany({});
        for (let i = 0; i < siteConfig.work_experience.length; i++) {
          const work = siteConfig.work_experience[i] as any;
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
        console.log(`  ✅ Imported ${siteConfig.work_experience.length} work experience entries`);
      }
    } catch (error: any) {
      console.error('  ❌ Error:', error.message);
      results.work_error = error.message;
    }

    // 3. Import Certifications
    console.log('\n🎓 Importing Certifications...');
    try {
      if (!siteConfig.certification || siteConfig.certification.length === 0) {
        results.certifications = 0;
        console.log('  ⚠️  No certifications data found');
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
        console.log(`  ✅ Imported ${siteConfig.certification.length} certifications`);
      }
    } catch (error: any) {
      console.error('  ❌ Error:', error.message);
      results.certifications_error = error.message;
    }

    // 4. Import LinkedIn Recommendations
    console.log('\n💬 Importing LinkedIn Recommendations...');
    try {
      if (!siteConfig.linkedin_recommendations || siteConfig.linkedin_recommendations.length === 0) {
        results.recommendations = 0;
        console.log('  ⚠️  No recommendations data found');
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
        console.log(`  ✅ Imported ${siteConfig.linkedin_recommendations.length} recommendations`);
      }
    } catch (error: any) {
      console.error('  ❌ Error:', error.message);
      results.recommendations_error = error.message;
    }

    // 5. Import Technology Stack
    console.log('\n🛠️  Importing Technology Stack...');
    try {
      if (!siteConfig.technology_stack || siteConfig.technology_stack.length === 0) {
        results.technology = 0;
        console.log('  ⚠️  No technology stack data found');
      } else {
        await prisma.technologyStack.deleteMany({});
        for (let i = 0; i < siteConfig.technology_stack.length; i++) {
          const tech = siteConfig.technology_stack[i];
          await prisma.technologyStack.create({
            data: {
              name: tech.name,
              imageUrl: tech.imageUrl,
              category: null, // Can be set later in admin panel
              orderIndex: i,
            },
          });
        }
        results.technology = siteConfig.technology_stack.length;
        console.log(`  ✅ Imported ${siteConfig.technology_stack.length} technologies`);
      }
    } catch (error: any) {
      console.error('  ❌ Error:', error.message);
      results.technology_error = error.message;
    }

    // 6. Import Volunteering
    console.log('\n🤝 Importing Volunteering...');
    try {
      if (!siteConfig.volunteering || siteConfig.volunteering.length === 0) {
        results.volunteering = 0;
        console.log('  ⚠️  No volunteering data found');
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
        console.log(`  ✅ Imported ${siteConfig.volunteering.length} volunteering entries`);
      }
    } catch (error: any) {
      console.error('  ❌ Error:', error.message);
      results.volunteering_error = error.message;
    }

    // 7. Import Hero/Site Settings
    console.log('\n⚙️  Importing Hero/Site Settings...');
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

      // Import copyright info
      await prisma.siteSetting.upsert({
        where: { key: 'copyright' },
        update: {
          value: JSON.stringify({
            text: siteConfig.copyright.text,
            privacy: siteConfig.copyright.privacy,
            email: siteConfig.copyright.email,
          }),
        },
        create: {
          key: 'copyright',
          value: JSON.stringify({
            text: siteConfig.copyright.text,
            privacy: siteConfig.copyright.privacy,
            email: siteConfig.copyright.email,
          }),
        },
      });

      // Import links
      await prisma.siteSetting.upsert({
        where: { key: 'links' },
        update: {
          value: JSON.stringify(siteConfig.links),
        },
        create: {
          key: 'links',
          value: JSON.stringify(siteConfig.links),
        },
      });

      results.hero = 1;
      results.copyright = 1;
      results.links = 1;
      console.log('  ✅ Imported hero settings, copyright, and links');
    } catch (error: any) {
      console.error('  ❌ Error:', error.message);
      results.hero_error = error.message;
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Import Summary:');
    console.log('='.repeat(60));
    console.log(`  Education: ${results.education || 0}`);
    console.log(`  Work Experience: ${results.work || 0}`);
    console.log(`  Certifications: ${results.certifications || 0}`);
    console.log(`  Recommendations: ${results.recommendations || 0}`);
    console.log(`  Technology Stack: ${results.technology || 0}`);
    console.log(`  Volunteering: ${results.volunteering || 0}`);
    console.log(`  Site Settings: ${(results.hero ? 1 : 0) + (results.copyright ? 1 : 0) + (results.links ? 1 : 0)}`);
    console.log('='.repeat(60));

    const hasErrors = Object.keys(results).some(key => key.endsWith('_error'));
    if (hasErrors) {
      console.log('\n⚠️  Some errors occurred during import. Check the output above for details.');
    } else {
      console.log('\n✅ All data imported successfully!');
    }

    console.log('\n💡 Next Steps:');
    console.log('  1. Visit http://localhost:3000/admin/homepage to manage data');
    console.log('  2. Run npm run db:studio to view data in Prisma Studio');
    console.log('  3. Your homepage should now use data from the database');

  } catch (error: any) {
    console.error('\n❌ Fatal error during import:', error);
    throw error;
  } finally {
    if (prisma) {
      await prisma.$disconnect();
      console.log('\n🔌 Disconnected from database');
    }
  }
}

// Run the import
importAllData()
  .then(() => {
    console.log('\n✅ Import completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });

