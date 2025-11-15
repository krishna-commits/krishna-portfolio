import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/hobbies
 * Fetch all active hobbies ordered by order_index
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const includeInactive = searchParams.get('includeInactive') === 'true';

		// Check if Prisma client is available (database configured)
		if (!prisma) {
			return NextResponse.json(
				{
					hobbies: [],
					count: 0,
				},
				{ status: 200 }
			);
		}

		const where = includeInactive ? {} : { isActive: true };

		const hobbies = await prisma.hobby.findMany({
			where,
			orderBy: [
				{ orderIndex: 'asc' },
				{ createdAt: 'desc' },
			],
		});

		return NextResponse.json(
			{
				hobbies,
				count: hobbies.length,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error('[Hobbies API] GET Error:', error);
		return NextResponse.json(
			{
				error: process.env.NODE_ENV === 'development'
					? error.message || 'Failed to fetch hobbies'
					: 'Failed to fetch hobbies. Please try again later.',
				hobbies: [],
				count: 0,
			},
			{ status: 500 }
		);
	}
}

/**
 * POST /api/hobbies
 * Create a new hobby
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { title, description, image_url, order_index, is_active } = body;

		// Validation
		if (!title || !image_url) {
			return NextResponse.json(
				{ error: 'Title and image_url are required' },
				{ status: 400 }
			);
		}

		if (!prisma) {
			return NextResponse.json(
				{
					error: 'Database not configured',
				},
				{ status: 503 }
			);
		}

		const hobby = await prisma.hobby.create({
			data: {
				title,
				description: description || null,
				imageUrl: image_url,
				orderIndex: order_index || 0,
				isActive: is_active !== undefined ? is_active : true,
			},
		});

		return NextResponse.json(
			{
				message: 'Hobby created successfully',
				hobby,
			},
			{ status: 201 }
		);
	} catch (error: any) {
		console.error('[Hobbies API] POST Error:', error);
		return NextResponse.json(
			{
				error: process.env.NODE_ENV === 'development'
					? error.message || 'Failed to create hobby'
					: 'Failed to create hobby. Please try again later.',
			},
			{ status: 500 }
		);
	}
}
