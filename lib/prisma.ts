import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more: https://pris.ly/d/help/nextjs-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient | undefined {
	// Only create Prisma client if database is configured
	if (!process.env.POSTGRES_PRISMA_URL) {
		return undefined;
	}

	try {
		return new PrismaClient({
			log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
		});
	} catch (error) {
		console.error('[Prisma] Failed to create Prisma client:', error);
		return undefined;
	}
}

let prisma: PrismaClient | undefined;

if (typeof window === 'undefined') {
	// Server-side only
	prisma = globalForPrisma.prisma || createPrismaClient();

	if (process.env.NODE_ENV !== 'production' && prisma) {
		globalForPrisma.prisma = prisma;
	}
}

export { prisma };
export default prisma;
