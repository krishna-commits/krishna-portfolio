import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { siteConfig } from 'config/site'
import { cn } from 'app/theme/lib/utils'

const HUBS = [
	{ label: 'Research Core', href: '/research-core', external: false },
	{ label: 'Blog', href: '/blog', external: false },
	{ label: 'Medium', href: siteConfig.links.medium, external: true },
] as const

export function ContentHubLinks({ className }: { className?: string }) {
	return (
		<nav
			aria-label="Content hubs"
			className={cn(
				'flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground',
				className,
			)}
		>
			<span className="font-medium text-foreground/80">Deeper dives:</span>
			{HUBS.map((hub, idx) => (
				<span key={hub.href} className="inline-flex items-center gap-2">
					{idx > 0 && <span aria-hidden className="text-border">·</span>}
					<Link
						href={hub.href}
						target={hub.external ? '_blank' : undefined}
						rel={hub.external ? 'noopener noreferrer' : undefined}
						className="inline-flex items-center gap-0.5 font-semibold text-amber-700 transition-colors hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
					>
						{hub.label}
						{hub.external && <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />}
					</Link>
				</span>
			))}
		</nav>
	)
}
