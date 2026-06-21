import { prisma } from 'lib/prisma';
import { siteConfig } from 'config/site';
import { publicJson } from 'lib/public-api-response';

export const dynamic = 'force-dynamic';

function certificationsFromConfig() {
  return (siteConfig.certification || []).map((c: { title: string; issuedby: string; imageURL: string; link?: string; time: string }) => ({
    title: c.title,
    issuedby: c.issuedby,
    imageURL: c.imageURL,
    link: c.link,
    time: c.time,
  }));
}

// GET - List all certifications (public)
export async function GET() {
  try {
    if (!prisma) {
      return publicJson({ certifications: certificationsFromConfig() });
    }

    try {
      const certifications = await prisma.certification.findMany({
        orderBy: { orderIndex: 'asc' },
      });

      if (certifications.length === 0) {
        return publicJson({ certifications: certificationsFromConfig() });
      }

      const formattedCertifications = certifications.map(cert => ({
        title: cert.title,
        issuedby: cert.issuedby,
        imageURL: cert.imageUrl,
        link: cert.link,
        time: cert.time,
      }));

      return publicJson({ certifications: formattedCertifications });
    } catch (dbError: unknown) {
      const err = dbError as { code?: string; message?: string };
      if (err.code === 'P1001' || err.message?.includes("Can't reach database server")) {
        console.warn('[Certifications API] Database connection error - using config fallback');
        return publicJson({ certifications: certificationsFromConfig() });
      }
      throw dbError;
    }
  } catch (error: unknown) {
    console.error('[Certifications API] Error:', error);
    return publicJson({ certifications: certificationsFromConfig() });
  }
}
