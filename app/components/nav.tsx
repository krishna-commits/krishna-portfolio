'use client';

import { motion, LayoutGroup } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from "app/theme/lib/utils"
import { siteConfig } from 'config/site';
import { Home, BookOpen, GraduationCap, Lightbulb, FolderKanban, Mail, Code2 } from 'lucide-react';
import { useState, useEffect } from 'react';

type NavItemConfig = {
	name: string;
	icon: any;
	ariaLabel: string;
	gradient: string;
	isAnchor: boolean;
};

type NavItems = Record<string, NavItemConfig>;

// Primary navigation items (always visible) - Vibrant colors: Yellow, Gold, Mustard, Orange, Red, Light Blue
const primaryNavItems: NavItems = {
	'/': {
		name: 'Home',
		icon: Home,
		ariaLabel: 'Navigate to home page',
		gradient: 'from-yellow-400 via-amber-500 to-yellow-600', // Yellow, Gold, Mustard
		isAnchor: false,
	},
	'/projects': {
		name: 'Projects',
		icon: FolderKanban,
		ariaLabel: 'Navigate to projects page',
		gradient: 'from-yellow-500 to-amber-600', // Yellow to Gold
		isAnchor: false,
	},
	'/blog': {
		name: 'Blog',
		icon: BookOpen,
		ariaLabel: 'Navigate to blog page',
		gradient: 'from-orange-500 via-red-500 to-orange-600', // Orange, Red, Gold
		isAnchor: false,
	},
	'/codecanvas': {
		name: 'Code Canvas',
		icon: Code2,
		ariaLabel: 'Navigate to code canvas page',
		gradient: 'from-blue-400 to-sky-500', // Light Blue
		isAnchor: false,
	},
	'/research-core': {
		name: 'Research',
		icon: GraduationCap,
		ariaLabel: 'Navigate to research core page',
		gradient: 'from-red-500 via-orange-500 to-red-600', // Red, Orange, Red
		isAnchor: false,
	},
	'/mantras': {
		name: 'Mantras',
		icon: Lightbulb,
		ariaLabel: 'Navigate to mantras page',
		gradient: 'from-blue-400 to-sky-500', // Light Blue vibrant
		isAnchor: false,
	},
	'/contact': {
		name: 'Contact',
		icon: Mail,
		ariaLabel: 'Navigate to contact page',
		gradient: 'from-sky-400 to-blue-500', // Light Blue vibrant
		isAnchor: false,
	},
};

// Secondary navigation items (anchor links - shown on larger screens)
const secondaryNavItems: NavItems = {
	// No secondary items currently
};

// Combined nav items (for mobile/desktop)
const navItems = { ...primaryNavItems, ...secondaryNavItems };

function NavItem({ path, name, icon: Icon, ariaLabel, gradient, isAnchor }: { 
	path: string; 
	name: string; 
	icon: any; 
	ariaLabel: string; 
	gradient: string;
	isAnchor: boolean;
}) {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
	const [isHovered, setIsHovered] = useState(false)
	const [currentHash, setCurrentHash] = useState('')
	const pathname = usePathname() || '/';
	const router = useRouter()
	
	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		setPrefersReducedMotion(mediaQuery.matches)
		
		const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
		mediaQuery.addEventListener('change', handleChange)
		
		// Set initial hash
		if (typeof window !== 'undefined') {
			setCurrentHash(window.location.hash)
		}
		
		// Listen for hash changes
		const handleHashChange = () => {
			if (typeof window !== 'undefined') {
				setCurrentHash(window.location.hash)
			}
		}
		
		window.addEventListener('hashchange', handleHashChange)
		
		return () => {
			mediaQuery.removeEventListener('change', handleChange)
			window.removeEventListener('hashchange', handleHashChange)
		}
	}, [])
	
	// Normalize pathname for blog posts and project pages
	const normalizedPathname = pathname.includes('/blog/') ? '/blog' : 
	                           pathname.includes('/projects') ? '/projects' : 
	                           pathname.includes('/codecanvas') ? '/codecanvas' : pathname;
	
	// Determine if active
	const targetHash = isAnchor ? path.substring(2) : ''; // Remove '/#' for anchor links
	const isActive = isAnchor
		? (normalizedPathname === '/' && currentHash === `#${targetHash}`)
		: normalizedPathname === path;

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (isAnchor && path.startsWith('/#')) {
			e.preventDefault();
			const targetId = path.substring(2); // Remove '/#'
			
			// If we're not on the homepage, navigate there first
			if (normalizedPathname !== '/') {
				router.push(path);
			} else {
				// We're already on homepage, just scroll to the section
				const targetElement = document.getElementById(targetId);
				if (targetElement) {
					// Update hash first (this will trigger hashchange event)
					window.location.hash = targetId;
					// Then scroll to the section
					setTimeout(() => {
						targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
					}, 10);
				}
			}
		}
	};

	return (
		<Link
			href={path}
			aria-label={ariaLabel}
			aria-current={isActive ? 'page' : undefined}
			className="relative group"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={handleClick}
		>
			<motion.div
				className={cn(
					"relative flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 overflow-hidden",
					isActive
						? `bg-gradient-to-r ${gradient} text-white shadow-sm`
						: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
				)}
				whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -1 }}
				whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
				transition={prefersReducedMotion ? {} : { type: "spring", stiffness: 400, damping: 25 }}
			>
				{/* Active state background */}
				{isActive && (
					<motion.div
						className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-lg`}
						layoutId="navbar-active"
						transition={prefersReducedMotion ? {} : {
							type: 'spring',
							stiffness: 500,
							damping: 30,
						}}
					/>
				)}
				
				{/* Content */}
				<div className="relative z-10 flex items-center gap-1">
					<Icon className={cn(
						"h-3 w-3 sm:h-3.5 sm:w-3.5 transition-all duration-200 flex-shrink-0",
						isActive 
							? "text-white" 
							: "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-50"
					)} />
					<span className={cn(
						"text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap",
						isActive 
							? "text-white font-bold" 
							: "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-50"
					)}>
						{name}
					</span>
				</div>

				{/* Active indicator */}
				{isActive && (
					<motion.div
						initial={prefersReducedMotion ? {} : { scale: 0 }}
						animate={prefersReducedMotion ? {} : { scale: 1 }}
						transition={prefersReducedMotion ? {} : { duration: 0.2 }}
						className="absolute -right-1 -top-1 w-2 h-2 bg-white rounded-full shadow-lg border border-blue-600/50 z-20"
					/>
				)}
			</motion.div>
		</Link>
	);
}

export function Navbar({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	return (
		<nav
			className={cn("flex items-center gap-2 flex-shrink-0 overflow-x-auto scrollbar-hide", className)}
			aria-label="Main navigation"
			{...props}
		>
			<LayoutGroup>
				{/* Primary items - always visible */}
				{Object.entries(primaryNavItems).map(([path, { name, icon, ariaLabel, gradient, isAnchor }]) => {
					return (
						<NavItem 
							key={path} 
							path={path} 
							name={name} 
							icon={icon}
							ariaLabel={ariaLabel}
							gradient={gradient}
							isAnchor={isAnchor}
						/>
					);
				})}
				{/* Secondary items (anchor links) - show on 2xl screens if any exist */}
				{Object.keys(secondaryNavItems).length > 0 && (
					<div className="hidden 2xl:flex items-center gap-2">
						{Object.entries(secondaryNavItems).map(([path, item]) => {
							const { name, icon, ariaLabel, gradient, isAnchor } = item;
							return (
								<NavItem 
									key={path} 
									path={path} 
									name={name} 
									icon={icon}
									ariaLabel={ariaLabel}
									gradient={gradient}
									isAnchor={isAnchor}
								/>
							);
						})}
					</div>
				)}
			</LayoutGroup>
		</nav>
	)
}
