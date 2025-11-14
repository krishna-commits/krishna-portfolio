'use client'

import { cn } from 'app/theme/lib/utils'

export function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn('animate-pulse rounded-md bg-slate-200 dark:bg-slate-800', className)}
			{...props}
		/>
	)
}

export function CardSkeleton() {
	return (
		<div className="space-y-4 p-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
			<Skeleton className="h-6 w-3/4" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-5/6" />
			<div className="flex gap-2">
				<Skeleton className="h-6 w-16" />
				<Skeleton className="h-6 w-16" />
				<Skeleton className="h-6 w-16" />
			</div>
		</div>
	)
}

export function ProjectCardSkeleton() {
	return (
		<div className="space-y-4 p-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
			<div className="flex items-start justify-between">
				<Skeleton className="h-12 w-12 rounded-lg" />
				<Skeleton className="h-5 w-5 rounded" />
			</div>
			<Skeleton className="h-6 w-3/4" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-5/6" />
			<div className="flex gap-2">
				<Skeleton className="h-6 w-16" />
				<Skeleton className="h-6 w-16" />
			</div>
		</div>
	)
}

export function StatsCardSkeleton() {
	return (
		<div className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
			<div className="space-y-4">
				<Skeleton className="h-10 w-10 rounded-lg" />
				<Skeleton className="h-8 w-20" />
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-3 w-16" />
			</div>
		</div>
	)
}

export function GitHubMetricsSkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-4 w-64" />
				</div>
				<Skeleton className="h-10 w-24" />
			</div>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<StatsCardSkeleton key={i} />
				))}
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<CardSkeleton />
				<CardSkeleton />
			</div>
		</div>
	)
}

export function SkillsShowcaseSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-4 w-96" />
			</div>
			<div className="flex flex-wrap gap-2">
				{Array.from({ length: 8 }).map((_, i) => (
					<Skeleton key={i} className="h-8 w-24 rounded-full" />
				))}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<CardSkeleton key={i} />
				))}
			</div>
		</div>
	)
}

export function HeroSkeleton() {
	return (
		<div className="space-y-8 py-16">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				<div className="lg:col-span-7 space-y-6">
					<div className="flex gap-2">
						<Skeleton className="h-6 w-32 rounded-full" />
						<Skeleton className="h-6 w-24 rounded-full" />
					</div>
					<Skeleton className="h-12 w-3/4" />
					<Skeleton className="h-6 w-full" />
					<Skeleton className="h-6 w-5/6" />
					<div className="flex gap-2">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} className="h-8 w-20 rounded-full" />
						))}
					</div>
					<div className="flex gap-4">
						<Skeleton className="h-10 w-40" />
						<Skeleton className="h-10 w-40" />
					</div>
				</div>
				<div className="lg:col-span-5">
					<Skeleton className="h-64 w-full rounded-lg" />
				</div>
			</div>
		</div>
	)
}

