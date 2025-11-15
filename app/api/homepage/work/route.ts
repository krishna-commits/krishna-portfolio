import { NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { siteConfig } from 'config/site';

export const dynamic = 'force-dynamic';

// GET - List all work experience entries (public)
export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({ 
        workExperience: siteConfig.work_experience || [] 
      }, { status: 200 });
    }

    const workExperience = await prisma.workExperience.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    if (workExperience.length === 0) {
      return NextResponse.json({ 
        workExperience: siteConfig.work_experience || [] 
      }, { status: 200 });
    }

    return NextResponse.json({ workExperience }, { status: 200 });
  } catch (error: any) {
    console.error('[Work Experience API] Error:', error);
    return NextResponse.json({ 
      workExperience: siteConfig.work_experience || [] 
    }, { status: 200 });
  }
}

