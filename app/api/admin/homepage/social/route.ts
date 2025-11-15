import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';
import { getSocialLinksFromConfig } from 'lib/homepage-data';
import { siteConfig } from 'config/site';

export const dynamic = 'force-dynamic';

// GET - Get social links
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const socialLinks = await prisma.siteSetting.findUnique({
      where: { key: 'social_links' },
    });

    if (!socialLinks) {
      // Fallback to config/site.tsx
      const configLinks = getSocialLinksFromConfig();
      return NextResponse.json({
        github: configLinks.github || '',
        linkedIn: configLinks.linkedIn || '',
        researchgate: configLinks.researchgate || '',
        orcid: configLinks.orcid || '',
        medium: configLinks.medium || '',
        twitter: '',
        email: siteConfig.copyright?.email || '',
        instagram: configLinks.instagram || '',
        _source: 'config',
      }, { status: 200 });
    }

    const data = JSON.parse(socialLinks.value);
    return NextResponse.json({
      ...data,
      _source: 'database',
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Social Links API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch social links' },
      { status: 500 }
    );
  }
}

// PUT - Update social links
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
    const { github, linkedIn, researchgate, orcid, medium, twitter, email } = body;

    const socialData = {
      github: github || '',
      linkedIn: linkedIn || '',
      researchgate: researchgate || '',
      orcid: orcid || '',
      medium: medium || '',
      twitter: twitter || '',
      email: email || '',
      updatedAt: new Date().toISOString(),
    };

    const updated = await prisma.siteSetting.upsert({
      where: { key: 'social_links' },
      update: { value: JSON.stringify(socialData) },
      create: {
        key: 'social_links',
        value: JSON.stringify(socialData),
      },
    });

    return NextResponse.json(
      { message: 'Social links updated successfully', data: JSON.parse(updated.value) },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Social Links API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update social links' },
      { status: 500 }
    );
  }
}

