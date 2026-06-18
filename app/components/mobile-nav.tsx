"use client"

import * as React from "react"
import Link from "next/link"
import { siteConfig } from "config/site"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetClose,
} from "app/theme/components/ui/sheet"
import { ThemeToggle } from "./theme-toggle"
import { Icons } from "app/theme/components/theme/icons"
import {
	Home,
	Code2,
	BookOpen,
	GraduationCap,
	Lightbulb,
	FolderKanban,
	Mail,
	Shield,
	Menu,
	X,
	ArrowRight,
} from "lucide-react"
import { Button } from "app/theme/components/ui/button"
import { cn } from "app/theme/lib/utils"

const items = [
	{ title: "Home", href: "/", icon: Home, description: "Overview and introduction", ariaLabel: "Navigate to home page" },
	{ title: "Projects", href: "/projects", icon: FolderKanban, description: "Portfolio showcase", ariaLabel: "Navigate to projects page" },
	{ title: "Code Canvas", href: "/codecanvas", icon: Code2, description: "Technical projects and code", ariaLabel: "Navigate to code canvas page" },
	{ title: "Blog", href: "/blog", icon: BookOpen, description: "Articles and insights", ariaLabel: "Navigate to blog page" },
	{ title: "Research Core", href: "/research-core", icon: GraduationCap, description: "Academic research and publications", ariaLabel: "Navigate to research core page" },
	{ title: "Mantras", href: "/mantras", icon: Lightbulb, description: "Philosophy and principles", ariaLabel: "Navigate to mantras page" },
	{ title: "Contact", href: "/contact", icon: Mail, description: "Get in touch", ariaLabel: "Navigate to contact page" },
] as const

export function MobileNav() {
	const pathname = usePathname()
	const [open, setOpen] = React.useState(false)

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open navigation menu"
					className="inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-md border border-border bg-muted/50 shadow-sm transition-colors hover:bg-muted lg:hidden"
				>
					<Menu className="h-5 w-5 text-foreground" aria-hidden />
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="w-[90%] overflow-y-auto border-r border-border bg-background p-0 sm:w-[420px]"
			>
				<div className="border-b border-border px-6 py-6">
					<SheetHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<span className="inline-flex rounded-xl border border-border bg-muted p-2.5 text-foreground">
									<Shield className="h-6 w-6" aria-hidden />
								</span>
								<div>
									<SheetTitle className="text-xl font-semibold text-foreground">{siteConfig.title}</SheetTitle>
									<SheetDescription className="mt-1 text-xs text-muted-foreground">Navigate the site</SheetDescription>
								</div>
							</div>
							<SheetClose asChild>
								<button
									type="button"
									aria-label="Close menu"
									className="rounded-lg p-2 transition-colors hover:bg-muted"
								>
									<X className="h-5 w-5 text-foreground" />
								</button>
							</SheetClose>
						</div>
					</SheetHeader>
				</div>

				<nav className="space-y-2 p-6" aria-label="Mobile navigation">
					{items.map((item, idx) => {
						const normalizedPathname = pathname?.includes("/blog/")
							? "/blog"
							: pathname?.includes("/projects")
								? "/projects"
								: pathname
						const active =
							normalizedPathname === item.href ||
							(item.href !== "/" && normalizedPathname?.startsWith(item.href))
						const Icon = item.icon

						return (
							<SheetClose key={item.href} asChild>
								<Link href={item.href} aria-label={item.ariaLabel} aria-current={active ? "page" : undefined} className="block">
									<motion.div
										initial={{ opacity: 0, x: -12 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: idx * 0.04 }}
										className={cn(
											"rounded-xl border p-4 transition-colors",
											active
												? "border-amber-600 bg-amber-600 text-white shadow-sm dark:border-amber-600 dark:bg-amber-600"
												: "border-border bg-card text-foreground hover:bg-muted/60",
										)}
									>
										<div className="flex items-center gap-4">
											<span
												className={cn(
													"inline-flex flex-shrink-0 rounded-lg border p-2.5",
													active ? "border-white/20 bg-white/10" : "border-border bg-muted",
												)}
											>
												<Icon className={cn("h-5 w-5", active ? "text-white" : "text-foreground")} />
											</span>
											<div className="min-w-0 flex-1">
												<div className={cn("text-base font-semibold", active ? "text-white" : "text-foreground")}>
													{item.title}
												</div>
												{item.description && (
													<div className={cn("mt-1 text-xs", active ? "text-white/90" : "text-muted-foreground")}>
														{item.description}
													</div>
												)}
											</div>
											{!active && <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />}
										</div>
									</motion.div>
								</Link>
							</SheetClose>
						)
					})}
				</nav>

				<div className="border-t border-border px-6 py-6">
					<h3 className="mb-1 text-sm font-semibold text-foreground">Connect</h3>
					<p className="mb-4 text-xs text-muted-foreground">Follow me on these platforms</p>
					<div className="grid grid-cols-4 gap-3">
						{[
							{ href: siteConfig.links.github, label: "GitHub profile", Icon: Icons.gitHub },
							{ href: siteConfig.links.linkedIn, label: "LinkedIn profile", Icon: Icons.linkedIn },
							{ href: siteConfig.links.researchgate, label: "ResearchGate profile", Icon: Icons.researchgate },
							{ href: siteConfig.links.orcid, label: "ORCID profile", Icon: Icons.orcid },
						].map(({ href, label, Icon }) => (
							<Link
								key={href}
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={label}
								className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted"
							>
								<Icon className="mx-auto h-6 w-6 fill-current text-foreground" />
							</Link>
						))}
					</div>
				</div>

				<div className="border-t border-border px-6 py-6">
					<SheetClose asChild>
						<Link href="/contact" className="block">
							<Button className="w-full bg-amber-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500">
								<Mail className="mr-2 h-5 w-5" />
								Get In Touch
								<ArrowRight className="ml-2 h-5 w-5" />
							</Button>
						</Link>
					</SheetClose>
				</div>

				<div className="border-t border-border px-6 py-6">
					<div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
						<div>
							<span className="block text-sm font-semibold text-foreground">Theme</span>
							<span className="text-xs text-muted-foreground">Light or dark mode</span>
						</div>
						<ThemeToggle />
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
