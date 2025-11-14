import { NextRequest, NextResponse } from 'next/server';
import { getSql } from 'lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/hobbies/[id]
 * Fetch a single hobby by ID
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const id = parseInt(params.id);

		if (isNaN(id)) {
			return NextResponse.json(
				{ error: 'Invalid hobby ID' },
				{ status: 400 }
			);
		}

		const sql = getSql();
		const { rows } = await sql`
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
			WHERE id = ${id}
		`;

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'Hobby not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				hobby: rows[0],
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error('[Hobbies API] GET Error:', error);
		return NextResponse.json(
			{
				error: process.env.NODE_ENV === 'development'
					? error.message || 'Failed to fetch hobby'
					: 'Failed to fetch hobby. Please try again later.',
			},
			{ status: 500 }
		);
	}
}

/**
 * PUT /api/hobbies/[id]
 * Update a hobby by ID
 */
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const id = parseInt(params.id);

		if (isNaN(id)) {
			return NextResponse.json(
				{ error: 'Invalid hobby ID' },
				{ status: 400 }
			);
		}

		const body = await request.json();
		const { title, description, image_url, order_index, is_active } = body;

		// Check if at least one field is provided
		if (title === undefined && description === undefined && image_url === undefined && 
			order_index === undefined && is_active === undefined) {
			return NextResponse.json(
				{ error: 'No fields to update' },
				{ status: 400 }
			);
		}

		// First, get the current hobby to preserve undefined fields
		const sql = getSql();
		const currentResult = await sql`
			SELECT * FROM hobbies WHERE id = ${id}
		`;

		if (currentResult.rows.length === 0) {
			return NextResponse.json(
				{ error: 'Hobby not found' },
				{ status: 404 }
			);
		}

		const current = currentResult.rows[0];

		// Update only provided fields
		const updateTitle = title !== undefined ? title : current.title;
		const updateDescription = description !== undefined ? description : current.description;
		const updateImageUrl = image_url !== undefined ? image_url : current.image_url;
		const updateOrderIndex = order_index !== undefined ? order_index : current.order_index;
		const updateIsActive = is_active !== undefined ? is_active : current.is_active;

		// Perform the update
		const { rows } = await sql`
			UPDATE hobbies
			SET 
				title = ${updateTitle},
				description = ${updateDescription},
				image_url = ${updateImageUrl},
				order_index = ${updateOrderIndex},
				is_active = ${updateIsActive},
				updated_at = CURRENT_TIMESTAMP
			WHERE id = ${id}
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

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'Hobby not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				message: 'Hobby updated successfully',
				hobby: rows[0],
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error('[Hobbies API] PUT Error:', error);
		return NextResponse.json(
			{
				error: process.env.NODE_ENV === 'development'
					? error.message || 'Failed to update hobby'
					: 'Failed to update hobby. Please try again later.',
			},
			{ status: 500 }
		);
	}
}

/**
 * DELETE /api/hobbies/[id]
 * Delete a hobby by ID
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const id = parseInt(params.id);

		if (isNaN(id)) {
			return NextResponse.json(
				{ error: 'Invalid hobby ID' },
				{ status: 400 }
			);
		}

		const sql = getSql();
		const { rows } = await sql`
			DELETE FROM hobbies
			WHERE id = ${id}
			RETURNING id
		`;

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'Hobby not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				message: 'Hobby deleted successfully',
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error('[Hobbies API] DELETE Error:', error);
		return NextResponse.json(
			{
				error: process.env.NODE_ENV === 'development'
					? error.message || 'Failed to delete hobby'
					: 'Failed to delete hobby. Please try again later.',
			},
			{ status: 500 }
		);
	}
}

