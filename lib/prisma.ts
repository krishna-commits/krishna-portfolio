import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more: https://pris.ly/d/help/nextjs-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient | undefined {
	// Only create Prisma client if database is configured
	// Check for both Vercel Postgres and standard Postgres connection strings
	// Priority: POSTGRES_PRISMA_URL > DATABASE_URL (for compatibility)
	const prismaUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
	const nonPoolingUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || prismaUrl;
	
	// Log what we're finding (helpful for debugging in production)
	if (process.env.NODE_ENV === 'production') {
		console.log('[Prisma] Checking database configuration:');
		console.log('[Prisma] POSTGRES_PRISMA_URL:', prismaUrl ? '✅ Set' : '❌ Missing');
		console.log('[Prisma] POSTGRES_URL_NON_POOLING:', nonPoolingUrl ? '✅ Set' : '❌ Missing');
		
		if (prismaUrl) {
			// Mask sensitive parts but show structure
			const maskedUrl = prismaUrl.replace(/(:\/\/[^:]+:)([^@]+)(@)/, '$1***$3');
			console.log('[Prisma] Connection string:', maskedUrl.substring(0, 100) + '...');
		}
	}
	
	if (!prismaUrl) {
		if (process.env.NODE_ENV === 'development') {
			console.warn('[Prisma] Database not configured: POSTGRES_PRISMA_URL or DATABASE_URL not found');
		} else {
			console.error('[Prisma] Production: Database connection string not found!');
			console.error('[Prisma] Please set POSTGRES_PRISMA_URL or DATABASE_URL in Vercel environment variables');
		}
		return undefined;
	}

	// Prevent connecting to localhost on production
	if (prismaUrl.includes('localhost') || prismaUrl.includes('127.0.0.1')) {
		console.error('[Prisma] Production environment cannot use localhost database URL');
		console.error('[Prisma] Current URL contains localhost/127.0.0.1');
		console.error('[Prisma] Please check your Vercel environment variables');
		return undefined;
	}

	try {
		// PrismaClient reads connection strings from environment variables
		// configured in prisma/schema.prisma (POSTGRES_PRISMA_URL and POSTGRES_URL_NON_POOLING)
		const client = new PrismaClient({
			log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
			datasources: {
				db: {
					url: prismaUrl,
				},
			},
		});
		
		if (process.env.NODE_ENV === 'production') {
			console.log('[Prisma] Client created successfully for production');
		}
		
		return client;
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
