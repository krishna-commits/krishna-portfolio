'use client'

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, Sparkles, Camera, Loader2 } from "lucide-react"
import { cn } from "app/theme/lib/utils"
import useSWR from 'swr'

interface Hobby {
	id: number
	title: string
	description: string | null
	image_url: string
	order_index: number
	is_active: boolean
	created_at: string
	updated_at: string
}

const fetcher = async (url: string) => {
	const res = await fetch(url)
	if (!res.ok) {
		throw new Error('Failed to fetch hobbies')
	}
	const data = await res.json()
	return data.hobbies || []
}

export function HobbiesSection() {
	const { data: hobbies, error, isLoading } = useSWR<Hobby[]>('/api/hobbies', fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
	})

	if (isLoading) {
		return (
			<section className="relative w-full py-6 sm:py-8 lg:py-10" aria-label="Hobbies">
				<div className="mb-6 sm:mb-8">
					<div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
						<div className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 shadow-md">
							<Heart className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
						</div>
						<h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
							Hobbies
						</h2>
					</div>
				</div>
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-6 w-6 animate-spin text-slate-400" />
				</div>
			</section>
		)
	}

	if (error || !hobbies || hobbies.length === 0) {
		return null // Don't show section if no hobbies
	}

	return (
		<section className="relative w-full py-6 sm:py-8 lg:py-10 bg-slate-50/30 dark:bg-slate-900/30" aria-label="Hobbies">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-6 sm:mb-8"
			>
				<div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
					<motion.div
						animate={{ rotate: [0, 360] }}
						transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
						className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 shadow-md"
					>
						<Heart className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
					</motion.div>
					<h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
						Hobbies
					</h2>
				</div>
				<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
					Things I enjoy doing in my free time
				</p>
			</motion.div>

			{/* Hobbies Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
				{hobbies.map((hobby, index) => (
					<HobbyCard key={hobby.id} hobby={hobby} index={index} />
				))}
			</div>
		</section>
	)
}

function HobbyCard({ hobby, index }: { hobby: Hobby; index: number }) {
	const [imageError, setImageError] = useState(false)
	const [isHovered, setIsHovered] = useState(false)

	return (
		<motion.div
			initial={{ opacity: 0, y: 20, scale: 0.9 }}
			whileInView={{ opacity: 1, y: 0, scale: 1 }}
			viewport={{ once: true }}
			transition={{ delay: index * 0.05, duration: 0.4 }}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			className="group relative"
		>
			<div className="relative aspect-square rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-400 dark:hover:border-rose-600 hover:shadow-lg transition-all duration-300 cursor-pointer">
				{/* Image */}
				{!imageError ? (
					<Image
						src={hobby.image_url}
						alt={hobby.title}
						fill
						className={cn(
							"object-cover transition-transform duration-500",
							isHovered && "scale-110"
						)}
						sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
						onError={() => setImageError(true)}
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30">
						<Camera className="h-8 w-8 text-rose-400 dark:text-rose-500" />
					</div>
				)}

				{/* Overlay with title and description */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
						<h3 className="text-xs sm:text-sm font-bold text-white mb-1 line-clamp-1">
							{hobby.title}
						</h3>
						{hobby.description && (
							<p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
								{hobby.description}
							</p>
						)}
					</div>
				</div>

				{/* Sparkle effect on hover */}
				{isHovered && (
					<motion.div
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0 }}
						className="absolute top-2 right-2"
					>
						<Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
					</motion.div>
				)}
			</div>
		</motion.div>
	)
}

