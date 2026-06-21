import { prisma } from 'lib/prisma';
import { siteConfig } from 'config/site';
import { publicJson } from 'lib/public-api-response';

export const dynamic = 'force-dynamic';

// GET - List all education entries (public)
export async function GET() {
  try {
    if (!prisma) {
      return publicJson({
        education: siteConfig.education || [],
      });
    }

    const education = await prisma.education.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    if (education.length === 0) {
      return publicJson({
        education: siteConfig.education || [],
      });
    }

    return publicJson({ education });
  } catch (error: unknown) {
    console.error('[Education API] Error:', error);
    return publicJson({
      education: siteConfig.education || [],
    });
  }
}
