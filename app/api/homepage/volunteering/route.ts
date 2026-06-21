import { prisma } from 'lib/prisma';
import { siteConfig } from 'config/site';
import { publicJson } from 'lib/public-api-response';

export const dynamic = 'force-dynamic';

// GET - List all volunteering entries (public)
export async function GET() {
  try {
    if (!prisma) {
      return publicJson({
        volunteering: siteConfig.volunteering || [],
      });
    }

    const volunteering = await prisma.volunteering.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    if (volunteering.length === 0) {
      return publicJson({
        volunteering: siteConfig.volunteering || [],
      });
    }

    const formattedVolunteering = volunteering.map(vol => ({
      organization: vol.organization,
      role: vol.role,
      time: vol.time,
      duration: vol.duration,
      type: vol.type,
    }));

    return publicJson({ volunteering: formattedVolunteering });
  } catch (error: unknown) {
    console.error('[Volunteering API] Error:', error);
    return publicJson({
      volunteering: siteConfig.volunteering || [],
    });
  }
}
