import { NextRequest, NextResponse } from 'next/server';
import { getSql } from 'lib/db';

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

		const sql = getSql();
		
		let rows: any[];
		if (includeInactive) {
			const result = await sql`
				SELECT 
					id,
					title,
					description,
					image_url,
					order_index,
					is_active,
					created_at,
					updated_at
				FROM hobbies
				ORDER BY order_index ASC, created_at DESC
			`;
			rows = result.rows;
		} else {
			const result = await sql`
				SELECT 
					id,
					title,
					description,
					image_url,
					order_index,
					is_active,
					created_at,
					updated_at
				FROM hobbies
				WHERE is_active = true
				ORDER BY order_index ASC, created_at DESC
			`;
			rows = result.rows;
		}

		return NextResponse.json(
			{
				hobbies: rows,
				count: rows.length,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		// Handle missing database connection gracefully
		if (error?.message?.includes('connection string') || error?.code === 'missing_connection_string') {
			return NextResponse.json(
				{
					error: process.env.NODE_ENV === 'development'
						? 'Database not configured. Please set POSTGRES_URL environment variable.'
						: 'Database temporarily unavailable.',
					hobbies: [],
					count: 0,
				},
				{ status: 503 } // Service Unavailable
			);
		}

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

		// Insert new hobby
		const sql = getSql();
		const { rows } = await sql`
			INSERT INTO hobbies (title, description, image_url, order_index, is_active)
			VALUES (${title}, ${description || null}, ${image_url}, ${order_index || 0}, ${is_active !== undefined ? is_active : true})
			RETURNING 
				id,
				title,
				description,
				image_url,
				order_index,
				is_active,
				created_at,
				updated_at
		`;

		return NextResponse.json(
			{
				message: 'Hobby created successfully',
				hobby: rows[0],
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

