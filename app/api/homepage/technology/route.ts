import { prisma } from 'lib/prisma';
import { siteConfig } from 'config/site';
import { publicJson } from 'lib/public-api-response';

export const dynamic = 'force-dynamic';

// GET - List all technology stack items (public)
export async function GET() {
  try {
    if (!prisma) {
      return publicJson({
        technology: siteConfig.technology_stack || [],
      });
    }

    const technology = await prisma.technologyStack.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    if (technology.length === 0) {
      return publicJson({
        technology: siteConfig.technology_stack || [],
      });
    }

    const formattedTechnology = technology.map(tech => ({
      name: tech.name,
      imageUrl: tech.imageUrl,
      category: tech.category,
    }));

    return publicJson({ technology: formattedTechnology });
  } catch (error: unknown) {
    console.error('[Technology API] Error:', error);
    return publicJson({
      technology: siteConfig.technology_stack || [],
    });
  }
}
