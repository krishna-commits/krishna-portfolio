'use client'

import Link from 'next/link'
import { siteConfig } from 'config/site'
import { cn } from 'app/theme/lib/utils'
import { PAGE_CONTAINER } from 'lib/page-layout'

interface CopyrightFooterProps {
	className?: string
}

export function CopyrightFooter({ className }: CopyrightFooterProps) {
	return (
		<footer
			className={cn(
				'relative w-full border-t border-border bg-muted/30 py-6 sm:py-8',
				className,
			)}
		>
			<div className={PAGE_CONTAINER}>
				<div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
					<p className="text-center text-xs font-medium text-muted-foreground sm:text-sm">
						{siteConfig.copyright.text}
					</p>
					<Link
						href="/privacy"
						className="text-xs font-medium text-amber-700 hover:underline dark:text-amber-400 sm:text-sm"
					>
						{siteConfig.copyright.privacy}
					</Link>
				</div>
			</div>
		</footer>
	)
}
