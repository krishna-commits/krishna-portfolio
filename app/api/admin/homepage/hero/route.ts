import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';
import { siteConfig } from 'config/site';

export const dynamic = 'force-dynamic';

// GET - Get hero settings (from database or config/site.tsx)
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let heroData = null;
    let source = 'config'; // Track where data comes from

    // Try to get from database first
    if (prisma) {
      try {
        const heroSetting = await prisma.siteSetting.findUnique({
          where: { key: 'hero' },
        });

        if (heroSetting) {
          heroData = JSON.parse(heroSetting.value);
          source = 'database';
        }
      } catch (error) {
        console.warn('[Hero API] Database error, falling back to config:', error);
      }
    }

    // If not in database, use config/site.tsx
    if (!heroData) {
      heroData = {
        profileImage: siteConfig.profile_image || 'https://yqymybxe5e8jynd2.public.blob.vercel-storage.com/public/photo.JPG',
        name: siteConfig.name,
        bio: siteConfig.bio,
        title: siteConfig.home.title,
        description: siteConfig.home.description,
        talksAbout: siteConfig.talks_about.split(',').map((tag: string) => tag.trim()),
      };
      source = 'config';
    }

    return NextResponse.json({
      ...heroData,
      _source: source, // Indicate where data comes from
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Hero API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hero settings' },
      { status: 500 }
    );
  }
}

// PUT - Update hero settings
export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { profileImage, name, bio, title, description, talksAbout } = body;

    if (!name || !bio || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: name, bio, title, description' },
        { status: 400 }
      );
    }

    const heroData = {
      profileImage: profileImage || 'https://yqymybxe5e8jynd2.public.blob.vercel-storage.com/public/photo.JPG',
      name,
      bio,
      title,
      description,
      talksAbout: Array.isArray(talksAbout) ? talksAbout : (talksAbout || '').split(',').map((t: string) => t.trim()),
    };

    const updated = await prisma.siteSetting.upsert({
      where: { key: 'hero' },
      update: { value: JSON.stringify(heroData) },
      create: {
        key: 'hero',
        value: JSON.stringify(heroData),
      },
    });

    return NextResponse.json(
      { message: 'Hero settings updated successfully', data: JSON.parse(updated.value) },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Hero API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update hero settings' },
      { status: 500 }
    );
  }
}

