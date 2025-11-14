'use client'

import { cn } from 'app/theme/lib/utils'
import { motion } from 'framer-motion'

export function SkeletonLoader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<motion.div
			className={cn(
				"animate-pulse bg-slate-200 dark:bg-slate-800 rounded",
				className
			)}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
			{...props}
		/>
	)
}

export function ShimmerEffect({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"relative overflow-hidden bg-slate-200 dark:bg-slate-800 rounded",
				className
			)}
			{...props}
		>
			<motion.div
				className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
				animate={{
					x: ['-100%', '100%'],
				}}
				transition={{
					repeat: Infinity,
					duration: 1.5,
					ease: 'linear'
				}}
			/>
		</div>
	)
}

export function ProgressIndicator({ 
	value, 
	max = 100, 
	className,
	showLabel = true 
}: { 
	value: number
	max?: number
	className?: string
	showLabel?: boolean
}) {
	const percentage = Math.min((value / max) * 100, 100)

	return (
		<div className={cn("space-y-2", className)}>
			{showLabel && (
				<div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
					<span>Loading...</span>
					<span>{Math.round(percentage)}%</span>
				</div>
			)}
			<div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
				<motion.div
					className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"
					initial={{ width: 0 }}
					animate={{ width: `${percentage}%` }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
				/>
			</div>
		</div>
	)
}

export function Spinner({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
	const sizes = {
		sm: 'w-4 h-4',
		md: 'w-8 h-8',
		lg: 'w-12 h-12'
	}

	return (
		<motion.div
			className={cn(
				"border-4 border-slate-200 dark:border-slate-800 border-t-yellow-400 border-r-amber-500 border-b-orange-500 rounded-full",
				sizes[size],
				className
			)}
			animate={{ rotate: 360 }}
			transition={{
				duration: 1,
				repeat: Infinity,
				ease: 'linear'
			}}
		/>
	)
}

