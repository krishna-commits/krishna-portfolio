'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from 'app/theme/lib/utils'

interface OptimizedImageProps {
	src: string
	alt: string
	width?: number
	height?: number
	className?: string
	priority?: boolean
	placeholder?: 'blur' | 'empty'
	blurDataURL?: string
	quality?: number
	fill?: boolean
	sizes?: string
	objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

export function OptimizedImage({
	src,
	alt,
	width,
	height,
	className,
	priority = false,
	placeholder = 'blur',
	blurDataURL,
	quality = 85,
	fill = false,
	sizes,
	objectFit = 'cover'
}: OptimizedImageProps) {
	const [isLoading, setIsLoading] = useState(true)
	const [hasError, setHasError] = useState(false)
	const [imageSrc, setImageSrc] = useState(src)

	// Generate blur placeholder if not provided
	const generateBlurDataURL = () => {
		if (blurDataURL) return blurDataURL
		// Simple gradient blur placeholder (base64 encoded SVG)
		const svg = `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style="stop-color:rgb(241,245,249);stop-opacity:1" />
					<stop offset="100%" style="stop-color:rgb(226,232,240);stop-opacity:1" />
				</linearGradient>
			</defs>
			<rect width="100%" height="100%" fill="url(#grad)"/>
		</svg>`
		// Use btoa for browser-side encoding
		if (typeof window !== 'undefined') {
			return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
		}
		// Fallback for SSR
		return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad"%3E%3Cstop offset="0%" style="stop-color:rgb(241,245,249)"/%3E%3Cstop offset="100%" style="stop-color:rgb(226,232,240)"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="100%" height="100%" fill="url(%23grad)"/%3E%3C/svg%3E'
	}

	const blurPlaceholder = placeholder === 'blur' ? generateBlurDataURL() : undefined

	const handleLoad = () => {
		setIsLoading(false)
	}

	const handleError = () => {
		setHasError(true)
		setIsLoading(false)
	}

	// Shimmer effect component
	const Shimmer = () => (
		<motion.div
			className={cn(
				"absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800",
				className
			)}
			animate={{
				x: ['-100%', '100%'],
			}}
			transition={{
				repeat: Infinity,
				duration: 1.5,
				ease: 'linear'
			}}
			style={{
				backgroundSize: '200% 100%'
			}}
		/>
	)

	if (hasError) {
		return (
			<div className={cn(
				"flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded",
				className
			)}>
				<span className="text-xs text-slate-400">Failed to load image</span>
			</div>
		)
	}

	return (
		<div className={cn("relative overflow-hidden", className)}>
			{/* Shimmer Effect While Loading */}
			{isLoading && <Shimmer />}

			{/* Image */}
			<AnimatePresence mode="wait">
				{isLoading && (
					<motion.div
						key="placeholder"
						className="absolute inset-0 bg-slate-200 dark:bg-slate-800"
						initial={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					/>
				)}
				<motion.div
					key="image"
					initial={{ opacity: 0, scale: 1.05 }}
					animate={{ opacity: isLoading ? 0 : 1, scale: 1 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
					className="relative"
					onAnimationComplete={() => handleLoad()}
				>
					{fill ? (
						<Image
							src={imageSrc}
							alt={alt}
							fill
							className={cn("object-cover", objectFit === 'contain' && 'object-contain')}
							priority={priority}
							placeholder={placeholder}
							blurDataURL={blurPlaceholder}
							quality={quality}
							sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
							onLoad={handleLoad}
							onError={handleError}
						/>
					) : (
						<Image
							src={imageSrc}
							alt={alt}
							width={width || 800}
							height={height || 600}
							className={cn("object-cover", objectFit === 'contain' && 'object-contain')}
							priority={priority}
							placeholder={placeholder}
							blurDataURL={blurPlaceholder}
							quality={quality}
							onLoad={handleLoad}
							onError={handleError}
						/>
					)}
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
