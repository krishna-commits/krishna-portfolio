import { NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { siteConfig } from 'config/site';
import { publicJson } from 'lib/public-api-response';

export const dynamic = 'force-dynamic';

// GET - List all work experience entries (public)
export async function GET() {
  try {
    if (!prisma) {
      return publicJson({ 
        workExperience: siteConfig.work_experience || [] 
      });
    }

    const workExperience = await prisma.workExperience.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    if (workExperience.length === 0) {
      return publicJson({ 
        workExperience: siteConfig.work_experience || [] 
      });
    }

    return publicJson({ workExperience });
  } catch (error: any) {
    console.error('[Work Experience API] Error:', error);
    return publicJson({ 
      workExperience: siteConfig.work_experience || [] 
    });
  }
}

