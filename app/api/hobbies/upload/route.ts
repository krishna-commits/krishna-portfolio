import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

/**
 * POST /api/hobbies/upload
 * Upload a hobby image
 */
export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return NextResponse.json(
				{ error: 'No file provided' },
				{ status: 400 }
			);
		}

		// Validate file type
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json(
				{ error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
				{ status: 400 }
			);
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			return NextResponse.json(
				{ error: 'File size too large. Maximum size is 5MB.' },
				{ status: 400 }
			);
		}

		// Generate unique filename
		const timestamp = Date.now();
		const extension = file.name.split('.').pop();
		const filename = `hobby-${timestamp}.${extension}`;

		// Create hobbies directory if it doesn't exist
		const hobbiesDir = join(process.cwd(), 'public', 'hobbies');
		if (!existsSync(hobbiesDir)) {
			await mkdir(hobbiesDir, { recursive: true });
		}

		// Save file
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const filepath = join(hobbiesDir, filename);
		await writeFile(filepath, buffer);

		// Return public URL
		const publicUrl = `/hobbies/${filename}`;

		return NextResponse.json(
			{
				message: 'File uploaded successfully',
				url: publicUrl,
				filename: filename,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error('[Hobbies Upload API] Error:', error);
		return NextResponse.json(
			{
				error: process.env.NODE_ENV === 'development'
					? error.message || 'Failed to upload file'
					: 'Failed to upload file. Please try again later.',
			},
			{ status: 500 }
		);
	}
}

