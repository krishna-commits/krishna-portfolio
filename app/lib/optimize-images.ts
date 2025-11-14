/**
 * Image optimization utilities
 */

export interface ImageOptimizationOptions {
	width?: number
	height?: number
	quality?: number
	format?: 'webp' | 'avif' | 'jpeg' | 'png'
	blur?: boolean
}

/**
 * Get optimized image URL
 */
export function getOptimizedImageUrl(
	src: string,
	options: ImageOptimizationOptions = {}
): string {
	const { width, height, quality = 75, format = 'webp' } = options

	// If using next/image, it handles optimization automatically
	// This is for external images
	if (src.startsWith('http')) {
		// Use image CDN or optimization service
		// Example: Cloudinary, Imgix, etc.
		return src
	}

	return src
}

/**
 * Generate image sizes for responsive images
 */
export function generateImageSizes(breakpoints: number[] = [640, 768, 1024, 1280, 1536]): string {
	return breakpoints.map(bp => `(max-width: ${bp}px) ${bp}px`).join(', ') + ', 100vw'
}

/**
 * Get image priority based on position
 */
export function getImagePriority(index: number, aboveTheFoldCount: number = 3): boolean {
	return index < aboveTheFoldCount
}

/**
 * Generate blur placeholder
 */
export function generateBlurPlaceholder(width: number = 10, height: number = 10): string {
	// Generate a tiny blurred version of the image
	// This is typically done server-side or with a service
	return `data:image/svg+xml;base64,${Buffer.from(
		`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
			<rect width="100%" height="100%" fill="#e2e8f0"/>
		</svg>`
	).toString('base64')}`
}

