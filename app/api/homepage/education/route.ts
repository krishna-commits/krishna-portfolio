import { NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { siteConfig } from 'config/site';

export const dynamic = 'force-dynamic';

// GET - List all education entries (public)
export async function GET() {
  try {
    if (!prisma) {
      // Fallback to config if database not configured
      return NextResponse.json({ 
        education: siteConfig.education || [] 
      }, { status: 200 });
    }

    const education = await prisma.education.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    // If database is empty, fallback to config
    if (education.length === 0) {
      return NextResponse.json({ 
        education: siteConfig.education || [] 
      }, { status: 200 });
    }

    return NextResponse.json({ education }, { status: 200 });
  } catch (error: any) {
    console.error('[Education API] Error:', error);
    // Fallback to config on error
    return NextResponse.json({ 
      education: siteConfig.education || [] 
    }, { status: 200 });
  }
}

