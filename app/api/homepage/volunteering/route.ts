import { NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { siteConfig } from 'config/site';

export const dynamic = 'force-dynamic';

// GET - List all volunteering entries (public)
export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({ 
        volunteering: siteConfig.volunteering || [] 
      }, { status: 200 });
    }

    const volunteering = await prisma.volunteering.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    if (volunteering.length === 0) {
      return NextResponse.json({ 
        volunteering: siteConfig.volunteering || [] 
      }, { status: 200 });
    }

    // Map to match config format
    const formattedVolunteering = volunteering.map(vol => ({
      organization: vol.organization,
      role: vol.role,
      time: vol.time,
      duration: vol.duration,
      type: vol.type,
    }));

    return NextResponse.json({ volunteering: formattedVolunteering }, { status: 200 });
  } catch (error: any) {
    console.error('[Volunteering API] Error:', error);
    return NextResponse.json({ 
      volunteering: siteConfig.volunteering || [] 
    }, { status: 200 });
  }
}

