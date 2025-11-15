import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from 'lib/auth';
import { allBlogPosts } from 'contentlayer/generated';
import { allProjects } from 'contentlayer/generated';
import { allResearchCores } from 'contentlayer/generated';
import { allMantras } from 'contentlayer/generated';

export const dynamic = 'force-dynamic';

// POST - Generate sitemap
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://krishnaneupane.com';
    const currentDate = new Date().toISOString().split('T')[0];

    // Build sitemap entries
    const urls: string[] = [
      `  <url><loc>${baseUrl}</loc><lastmod>${currentDate}</lastmod><priority>1.0</priority></url>`,
      `  <url><loc>${baseUrl}/blog</loc><lastmod>${currentDate}</lastmod><priority>0.8</priority></url>`,
      `  <url><loc>${baseUrl}/projects</loc><lastmod>${currentDate}</lastmod><priority>0.8</priority></url>`,
      `  <url><loc>${baseUrl}/research-core</loc><lastmod>${currentDate}</lastmod><priority>0.8</priority></url>`,
      `  <url><loc>${baseUrl}/codecanvas</loc><lastmod>${currentDate}</lastmod><priority>0.7</priority></url>`,
      `  <url><loc>${baseUrl}/mantras</loc><lastmod>${currentDate}</lastmod><priority>0.7</priority></url>`,
    ];

    // Add blog posts
    allBlogPosts.forEach((post) => {
      const date = post.date ? new Date(post.date).toISOString().split('T')[0] : currentDate;
      urls.push(`  <url><loc>${baseUrl}/blog/${post.slug}</loc><lastmod>${date}</lastmod><priority>0.6</priority></url>`);
    });

    // Add projects (projects don't have date fields, using current date)
    allProjects.forEach((project) => {
      urls.push(`  <url><loc>${baseUrl}/projects/${project.slug}</loc><lastmod>${currentDate}</lastmod><priority>0.6</priority></url>`);
    });

    // Add research articles
    allResearchCores.forEach((research) => {
      const date = research.date ? new Date(research.date).toISOString().split('T')[0] : currentDate;
      urls.push(`  <url><loc>${baseUrl}/research-core/${research.slug}</loc><lastmod>${date}</lastmod><priority>0.6</priority></url>`);
    });

    // Add mantras
    allMantras.forEach((mantra) => {
      const date = mantra.date ? new Date(mantra.date).toISOString().split('T')[0] : currentDate;
      urls.push(`  <url><loc>${baseUrl}/mantras/${mantra.slug}</loc><lastmod>${date}</lastmod><priority>0.5</priority></url>`);
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    // In a real implementation, you would write this to public/sitemap.xml
    // For now, we'll return it as a response
    
    return NextResponse.json({
      success: true,
      message: 'Sitemap generated successfully',
      urlCount: urls.length,
      sitemap,
      note: 'Save this content to public/sitemap.xml',
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Sitemap Generator] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate sitemap' },
      { status: 500 }
    );
  }
}

