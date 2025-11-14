'use client'

import { useState, useEffect, useMemo, ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Clock, Share2, BookOpen, ChevronDown, ChevronUp, X } from 'lucide-react'
import { cn } from 'app/theme/lib/utils'
import Link from 'next/link'

interface ReadingProgressProps {
	targetId?: string
}

export function ReadingProgress({ targetId = 'blog-content' }: ReadingProgressProps) {
	const { scrollYProgress } = useScroll({
		target: typeof document !== 'undefined' ? document.getElementById(targetId) : undefined,
		offset: ['start end', 'end start']
	})

	const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

	return (
		<div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 z-50">
			<motion.div
				className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"
				style={{ width }}
			/>
		</div>
	)
}

export function ReadingTime({ content, className }: { content: string; className?: string }) {
	const readingTime = useMemo(() => {
		const wordsPerMinute = 200
		const words = content.split(/\s+/).length
		const minutes = Math.ceil(words / wordsPerMinute)
		return minutes
	}, [content])

	return (
		<div className={cn("flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400", className)}>
			<Clock className="h-3 w-3" />
			<span>{readingTime} min read</span>
		</div>
	)
}

interface TableOfContentsProps {
	headings: Array<{ id: string; text: string; level: number }>
	className?: string
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState<string>('')
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		if (headings.length === 0) return

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id)
					}
				})
			},
			{ rootMargin: '-20% 0px -70% 0px' }
		)

		headings.forEach((heading) => {
			const element = document.getElementById(heading.id)
			if (element) observer.observe(element)
		})

		return () => {
			headings.forEach((heading) => {
				const element = document.getElementById(heading.id)
				if (element) observer.unobserve(element)
			})
		}
	}, [headings])

	if (headings.length === 0) return null

	return (
		<div className={cn("relative", className)}>
			{/* Mobile Toggle Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="lg:hidden fixed bottom-4 right-4 z-40 p-3 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all"
				aria-label="Toggle table of contents"
			>
				{isOpen ? <X className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
			</button>

			{/* Desktop Sidebar / Mobile Overlay */}
			<motion.div
				initial={false}
				animate={{
					x: typeof window !== 'undefined' && (isOpen || window.innerWidth >= 1024) ? 0 : typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : -320
				}}
				className={cn(
					"fixed lg:sticky top-20 left-0 lg:top-24 z-30 h-[calc(100vh-5rem)] overflow-y-auto",
					"w-80 max-w-[calc(100vw-2rem)] lg:w-auto",
					"bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800",
					"lg:bg-transparent lg:border-0",
					!isOpen && typeof window !== 'undefined' && window.innerWidth < 1024 && "hidden"
				)}
			>
				<div className="p-6 lg:p-0">
					<h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-4 lg:hidden">
						Table of Contents
					</h3>
					<nav className="space-y-1">
						{headings.map((heading) => (
							<Link
								key={heading.id}
								href={`#${heading.id}`}
								onClick={() => setIsOpen(false)}
								className={cn(
									"block px-3 py-2 rounded-md text-sm transition-all duration-200",
									"hover:bg-slate-100 dark:hover:bg-slate-800",
									activeId === heading.id
										? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-l-2 border-yellow-400 font-semibold text-slate-900 dark:text-slate-50"
										: "text-slate-600 dark:text-slate-400"
								)}
								style={{
									paddingLeft: `${(heading.level - 1) * 1 + 0.75}rem`
								}}
							>
								{heading.text}
							</Link>
						))}
					</nav>
				</div>
			</motion.div>
		</div>
	)
}

interface ShareButtonsProps {
	url: string
	title: string
	className?: string
}

export function ShareButtons({ url, title, className }: ShareButtonsProps) {
	const [copied, setCopied] = useState(false)
	const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url

	const handleShare = async (platform: string) => {
		const shareUrl = encodeURIComponent(fullUrl)
		const shareTitle = encodeURIComponent(title)

		const urls: Record<string, string> = {
			twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
			linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
			whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
			telegram: `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`,
		}

		if (platform === 'copy') {
			try {
				await navigator.clipboard.writeText(fullUrl)
				setCopied(true)
				setTimeout(() => setCopied(false), 2000)
			} catch (err) {
				console.error('Failed to copy:', err)
			}
			return
		}

		if (urls[platform]) {
			window.open(urls[platform], '_blank', 'width=600,height=400')
		}
	}

	const shareButtons = [
		{ platform: 'twitter', label: 'Twitter', icon: '🐦' },
		{ platform: 'linkedin', label: 'LinkedIn', icon: '💼' },
		{ platform: 'facebook', label: 'Facebook', icon: '📘' },
		{ platform: 'whatsapp', label: 'WhatsApp', icon: '💬' },
		{ platform: 'telegram', label: 'Telegram', icon: '✈️' },
		{ platform: 'copy', label: copied ? 'Copied!' : 'Copy Link', icon: copied ? '✓' : '🔗' },
	]

	return (
		<div className={cn("flex items-center gap-2 flex-wrap", className)}>
			<span className="text-xs text-slate-600 dark:text-slate-400 mr-2">Share:</span>
			{shareButtons.map((button) => (
				<motion.button
					key={button.platform}
					onClick={() => handleShare(button.platform)}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					className={cn(
						"px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
						"bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
						"hover:bg-slate-200 dark:hover:bg-slate-700",
						"border border-slate-200 dark:border-slate-700"
					)}
					aria-label={`Share on ${button.label}`}
				>
					<span className="mr-1">{button.icon}</span>
					{button.label}
				</motion.button>
			))}
		</div>
	)
}

interface RelatedArticlesProps {
	currentArticleId: string
	articles: Array<{ id: string; title: string; url: string; excerpt?: string }>
	className?: string
}

export function RelatedArticles({ currentArticleId, articles, className }: RelatedArticlesProps) {
	const related = useMemo(() => {
		return articles
			.filter(article => article.id !== currentArticleId)
			.slice(0, 3)
	}, [articles, currentArticleId])

	if (related.length === 0) return null

	return (
		<section className={cn("mt-12 pt-8 border-t border-slate-200 dark:border-slate-800", className)}>
			<h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
				Related Articles
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{related.map((article, idx) => (
					<motion.div
						key={article.id}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: idx * 0.1 }}
						className="group"
					>
						<Link
							href={article.url}
							className="block p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300"
						>
							<h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors line-clamp-2">
								{article.title}
							</h4>
							{article.excerpt && (
								<p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
									{article.excerpt}
								</p>
							)}
						</Link>
					</motion.div>
				))}
			</div>
		</section>
	)
}

