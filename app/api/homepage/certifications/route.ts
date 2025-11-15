import { NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { siteConfig } from 'config/site';

export const dynamic = 'force-dynamic';

// GET - List all certifications (public)
export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({ 
        certifications: (siteConfig.certification || []).map((c: any) => ({
          title: c.title,
          issuedby: c.issuedby,
          imageURL: c.imageURL,
          link: c.link,
          time: c.time,
        }))
      }, { status: 200 });
    }

    try {
      const certifications = await prisma.certification.findMany({
        orderBy: { orderIndex: 'asc' },
      });

      if (certifications.length === 0) {
        return NextResponse.json({ 
          certifications: (siteConfig.certification || []).map((c: any) => ({
            title: c.title,
            issuedby: c.issuedby,
            imageURL: c.imageURL,
            link: c.link,
            time: c.time,
          }))
        }, { status: 200 });
      }

      // Map to match config format
      const formattedCertifications = certifications.map(cert => ({
        title: cert.title,
        issuedby: cert.issuedby,
        imageURL: cert.imageUrl,
        link: cert.link,
        time: cert.time,
      }));

      return NextResponse.json({ certifications: formattedCertifications }, { status: 200 });
    } catch (dbError: any) {
      // Handle database connection errors gracefully
      if (dbError.code === 'P1001' || dbError.message?.includes('Can\'t reach database server')) {
        console.warn('[Certifications API] Database connection error - using config fallback');
        return NextResponse.json({
          certifications: (siteConfig.certification || []).map((c: any) => ({
            title: c.title,
            issuedby: c.issuedby,
            imageURL: c.imageURL,
            link: c.link,
            time: c.time,
          }))
        }, { status: 200 });
      }
      throw dbError; // Re-throw other errors
    }
  } catch (error: any) {
    console.error('[Certifications API] Error:', error);
    return NextResponse.json({ 
      certifications: (siteConfig.certification || []).map((c: any) => ({
        title: c.title,
        issuedby: c.issuedby,
        imageURL: c.imageURL,
        link: c.link,
        time: c.time,
      }))
    }, { status: 200 });
  }
}

