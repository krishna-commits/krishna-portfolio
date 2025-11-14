'use client'

import Link from 'next/link'
import { Button } from 'app/theme/components/ui/button'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
			<div className="max-w-2xl w-full text-center space-y-8">
				<div className="space-y-4">
					<h1 className="text-6xl sm:text-7xl md:text-8xl font-light text-slate-900 dark:text-slate-50">
						404
					</h1>
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-700 dark:text-slate-300">
						Page Not Found
					</h2>
					<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
						The page you're looking for doesn't exist or has been moved. Let's get you back on track.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<Button asChild size="lg" className="gap-2">
						<Link href="/">
							<Home className="h-4 w-4" aria-hidden="true" />
							Go Home
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg" className="gap-2">
						<Link href="/blog">
							<Search className="h-4 w-4" aria-hidden="true" />
							Browse Blog
						</Link>
					</Button>
					<Button 
						variant="ghost" 
						size="lg" 
						className="gap-2"
						onClick={() => window.history.back()}
					>
						<ArrowLeft className="h-4 w-4" aria-hidden="true" />
						Go Back
					</Button>
				</div>

				<div className="pt-8 border-t border-slate-200 dark:border-slate-800">
					<p className="text-sm text-slate-500 dark:text-slate-500">
						Popular pages: <Link href="/research-core" className="text-slate-900 dark:text-slate-50 hover:underline">Research Core</Link>, <Link href="/projects" className="text-slate-900 dark:text-slate-50 hover:underline">Projects</Link>, <Link href="/contact" className="text-slate-900 dark:text-slate-50 hover:underline">Contact</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
