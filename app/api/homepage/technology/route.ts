import { NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { siteConfig } from 'config/site';

export const dynamic = 'force-dynamic';

// GET - List all technology stack items (public)
export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({ 
        technology: siteConfig.technology_stack || [] 
      }, { status: 200 });
    }

    const technology = await prisma.technologyStack.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    if (technology.length === 0) {
      return NextResponse.json({ 
        technology: siteConfig.technology_stack || [] 
      }, { status: 200 });
    }

    // Map to match config format
    const formattedTechnology = technology.map(tech => ({
      name: tech.name,
      imageUrl: tech.imageUrl,
      category: tech.category,
    }));

    return NextResponse.json({ technology: formattedTechnology }, { status: 200 });
  } catch (error: any) {
    console.error('[Technology API] Error:', error);
    return NextResponse.json({ 
      technology: siteConfig.technology_stack || [] 
    }, { status: 200 });
  }
}

