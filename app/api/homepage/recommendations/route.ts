import { NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { siteConfig } from 'config/site';

export const dynamic = 'force-dynamic';

// GET - List all recommendations (public)
export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({ 
        recommendations: siteConfig.linkedin_recommendations || [] 
      }, { status: 200 });
    }

    const recommendations = await prisma.linkedInRecommendation.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    if (recommendations.length === 0) {
      return NextResponse.json({ 
        recommendations: siteConfig.linkedin_recommendations || [] 
      }, { status: 200 });
    }

    // Map to match config format
    const formattedRecommendations = recommendations.map(rec => ({
      name: rec.name,
      title: rec.title,
      company: rec.company,
      text: rec.text,
      date: rec.date,
    }));

    return NextResponse.json({ recommendations: formattedRecommendations }, { status: 200 });
  } catch (error: any) {
    console.error('[Recommendations API] Error:', error);
    return NextResponse.json({ 
      recommendations: siteConfig.linkedin_recommendations || [] 
    }, { status: 200 });
  }
}

