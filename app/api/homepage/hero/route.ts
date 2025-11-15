import { NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { siteConfig } from 'config/site';

export const dynamic = 'force-dynamic';

// GET - Get hero settings (public)
export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({ 
        hero: {
          profileImage: siteConfig.profile_image,
          name: siteConfig.name,
          bio: siteConfig.bio,
          title: siteConfig.home.title,
          description: siteConfig.home.description,
          talksAbout: siteConfig.talks_about,
        }
      }, { status: 200 });
    }

    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'hero' },
    });

    if (!setting) {
      // Fallback to config
      return NextResponse.json({ 
        hero: {
          profileImage: siteConfig.profile_image,
          name: siteConfig.name,
          bio: siteConfig.bio,
          title: siteConfig.home.title,
          description: siteConfig.home.description,
          talksAbout: siteConfig.talks_about,
        }
      }, { status: 200 });
    }

    let heroData;
    try {
      heroData = JSON.parse(setting.value);
    } catch {
      heroData = {
        profileImage: siteConfig.profile_image,
        name: siteConfig.name,
        bio: siteConfig.bio,
        title: siteConfig.home.title,
        description: siteConfig.home.description,
        talksAbout: siteConfig.talks_about,
      };
    }

    return NextResponse.json({ hero: heroData }, { status: 200 });
  } catch (error: any) {
    console.error('[Hero API] Error:', error);
    return NextResponse.json({ 
      hero: {
        profileImage: siteConfig.profile_image,
        name: siteConfig.name,
        bio: siteConfig.bio,
        title: siteConfig.home.title,
        description: siteConfig.home.description,
        talksAbout: siteConfig.talks_about,
      }
    }, { status: 200 });
  }
}

