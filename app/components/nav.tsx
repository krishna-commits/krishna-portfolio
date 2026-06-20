'use client';

import { motion, LayoutGroup } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from "app/theme/lib/utils"
import { useState, useEffect } from 'react';
import { useNavigationConfig } from 'lib/hooks/use-navigation-config';
import { getNavIcon } from 'lib/nav-icon-map';

function NavItem({ path, name, icon: Icon, ariaLabel, isAnchor, isContact }: { 
	path: string; 
	name: string; 
	icon: React.ComponentType<{ className?: string }>; 
	ariaLabel: string; 
	isAnchor: boolean;
	isContact?: boolean;
}) {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
	const pathname = usePathname() || '/';
	const router = useRouter()
	const [currentHash, setCurrentHash] = useState('')
	
	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		setPrefersReducedMotion(mediaQuery.matches)
		
		const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
		mediaQuery.addEventListener('change', handleChange)
		
		if (typeof window !== 'undefined') {
			setCurrentHash(window.location.hash)
		}
		
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
	
	const normalizedPathname = pathname.includes('/blog/') ? '/blog' : 
	                           pathname.includes('/projects') ? '/projects' : 
	                           pathname.includes('/codecanvas') ? '/codecanvas' : pathname;
	
	const targetHash = isAnchor ? path.substring(2) : '';
	const isActive = isAnchor
		? (normalizedPathname === '/' && currentHash === `#${targetHash}`)
		: normalizedPathname === path;

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (isAnchor && path.startsWith('/#')) {
			e.preventDefault();
			const targetId = path.substring(2);
			
			if (normalizedPathname !== '/') {
				router.push(path);
			} else {
				const targetElement = document.getElementById(targetId);
				if (targetElement) {
					window.location.hash = targetId;
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
			title={name}
			aria-current={isActive ? 'page' : undefined}
			className="no-underline relative group flex-shrink-0"
			onClick={handleClick}
		>
			<motion.div
				className={cn(
					"relative flex items-center justify-center gap-1.5 min-h-10 min-w-10 px-2 lg:px-2.5 xl:px-3 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
					isActive
						? "bg-amber-600 text-white shadow-sm dark:bg-amber-600"
						: isContact
							? "border border-amber-300/80 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-100 dark:hover:bg-amber-950/70"
							: "border border-border bg-muted/50 text-foreground hover:bg-muted"
				)}
				whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -1 }}
				whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
				transition={prefersReducedMotion ? {} : { type: "spring", stiffness: 400, damping: 25 }}
			>
				{isActive && (
					<motion.div
						className="absolute inset-0 rounded-lg bg-amber-600 dark:bg-amber-600"
						layoutId="navbar-active"
						transition={prefersReducedMotion ? {} : {
							type: 'spring',
							stiffness: 500,
							damping: 30,
						}}
					/>
				)}
				
				<div className="relative z-10 flex items-center gap-1">
					<Icon className={cn(
						"h-3 w-3 sm:h-3.5 sm:w-3.5 transition-all duration-200 flex-shrink-0",
						isActive 
							? "text-white" 
							: "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-50"
					)} />
					<span className={cn(
						"hidden xl:inline text-xs font-semibold transition-all duration-200 whitespace-nowrap lg:text-sm",
						isActive 
							? "text-white font-bold" 
							: "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-50"
					)}>
						{name}
					</span>
				</div>
			</motion.div>
		</Link>
	);
}

export function Navbar({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const { desktopItems } = useNavigationConfig()

	return (
		<nav
			className={cn("flex items-center gap-1 lg:gap-1.5 xl:gap-2 min-w-0 overflow-x-auto scrollbar-hide", className)}
			aria-label="Main navigation"
			{...props}
		>
			<LayoutGroup>
				{desktopItems.map((item) => {
					const Icon = getNavIcon(item.icon)
					return (
						<NavItem 
							key={item.path} 
							path={item.path} 
							name={item.name} 
							icon={Icon}
							ariaLabel={item.ariaLabel}
							isAnchor={item.isAnchor}
							isContact={item.path === '/contact'}
						/>
					);
				})}
			</LayoutGroup>
		</nav>
	)
}
