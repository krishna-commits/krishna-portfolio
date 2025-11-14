'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { cn } from 'app/theme/lib/utils'
import Link from 'next/link'

interface Section {
	id: string
	label: string
	href: string
}

interface StickySidebarProps {
	sections: Section[]
	className?: string
}

export function StickySidebar({ sections, className }: StickySidebarProps) {
	const [activeSection, setActiveSection] = useState<string>('')
	const [progress, setProgress] = useState(0)
	const { scrollYProgress } = useScroll()
	const progressSpring = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001
	})

	useEffect(() => {
		progressSpring.on('change', (latest) => {
			setProgress(latest * 100)
		})

		const handleScroll = () => {
			const scrollPosition = window.scrollY + 100
			const sectionElements = sections.map(section => ({
				id: section.id,
				element: document.getElementById(section.id)
			})).filter(item => item.element !== null)

			for (let i = sectionElements.length - 1; i >= 0; i--) {
				const element = sectionElements[i].element
				if (element && element.offsetTop <= scrollPosition) {
					setActiveSection(sectionElements[i].id)
					break
				}
			}
		}

		window.addEventListener('scroll', handleScroll, { passive: true })
		handleScroll() // Initial check

		return () => {
			window.removeEventListener('scroll', handleScroll)
			progressSpring.destroy()
		}
	}, [sections, progressSpring])

	if (sections.length === 0) return null

	return (
		<aside
			className={cn(
				"hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40",
				className
			)}
		>
			<div className="relative">
				{/* Progress Indicator */}
				<motion.div
					className="absolute left-0 top-0 w-0.5 h-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"
					style={{ height: '100%' }}
				>
					<motion.div
						className="w-full bg-gradient-to-b from-yellow-400 via-amber-500 to-orange-500 rounded-full"
						style={{
							height: `${progress}%`,
							originY: 1
						}}
						transition={{ duration: 0.1 }}
					/>
				</motion.div>

				{/* Navigation Links */}
				<nav className="ml-6 space-y-4">
					{sections.map((section) => (
						<Link
							key={section.id}
							href={section.href}
							className={cn(
								"group relative flex items-center gap-3 text-xs font-medium transition-colors duration-200",
								activeSection === section.id
									? "text-slate-900 dark:text-slate-50"
									: "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
							)}
							onClick={(e) => {
								e.preventDefault()
								const element = document.getElementById(section.id)
								if (element) {
									element.scrollIntoView({ behavior: 'smooth', block: 'start' })
								}
							}}
						>
							{/* Active Indicator */}
							<motion.div
								className={cn(
									"absolute -left-7 w-1 h-4 rounded-full bg-gradient-to-b from-yellow-400 via-amber-500 to-orange-500",
									activeSection === section.id ? 'opacity-100' : 'opacity-0'
								)}
								transition={{ duration: 0.2 }}
							/>
							
							{/* Dot */}
							<motion.div
								className={cn(
									"w-2 h-2 rounded-full border-2 transition-all duration-200",
									activeSection === section.id
										? "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 border-transparent scale-125"
										: "bg-transparent border-slate-300 dark:border-slate-700 group-hover:border-slate-400 dark:group-hover:border-slate-600"
								)}
							/>

							{/* Label */}
							<span className="truncate">{section.label}</span>
						</Link>
					))}
				</nav>
			</div>
		</aside>
	)
}

