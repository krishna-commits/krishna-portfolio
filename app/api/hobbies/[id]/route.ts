import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';

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

		if (!prisma) {
			return NextResponse.json(
				{ error: 'Hobby not found' },
				{ status: 404 }
			);
		}

		const hobby = await prisma.hobby.findUnique({
			where: { id },
		});

		if (!hobby) {
			return NextResponse.json(
				{ error: 'Hobby not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				hobby,
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

		if (!prisma) {
			return NextResponse.json(
				{ error: 'Database not configured' },
				{ status: 503 }
			);
		}

		// Build update data object
		const updateData: any = {};
		if (title !== undefined) updateData.title = title;
		if (description !== undefined) updateData.description = description;
		if (image_url !== undefined) updateData.imageUrl = image_url;
		if (order_index !== undefined) updateData.orderIndex = order_index;
		if (is_active !== undefined) updateData.isActive = is_active;

		const hobby = await prisma.hobby.update({
			where: { id },
			data: updateData,
		});

		return NextResponse.json(
			{
				message: 'Hobby updated successfully',
				hobby,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		// Handle Prisma not found error
		if (error.code === 'P2025') {
			return NextResponse.json(
				{ error: 'Hobby not found' },
				{ status: 404 }
			);
		}

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

		if (!prisma) {
			return NextResponse.json(
				{ error: 'Database not configured' },
				{ status: 503 }
			);
		}

		await prisma.hobby.delete({
			where: { id },
		});

		return NextResponse.json(
			{
				message: 'Hobby deleted successfully',
			},
			{ status: 200 }
		);
	} catch (error: any) {
		// Handle Prisma not found error
		if (error.code === 'P2025') {
			return NextResponse.json(
				{ error: 'Hobby not found' },
				{ status: 404 }
			);
		}

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
