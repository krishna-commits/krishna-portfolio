'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Loader2, CheckCircle2, ArrowRight, Bell } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

type NewsletterFormInput = {
	email: string
}

export function Newsletter() {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
		reset,
	} = useForm<NewsletterFormInput>()

	const [submitted, setSubmitted] = useState(false)

	const onSubmit = async (data: NewsletterFormInput) => {
		try {
			const response = await fetch('/api/newsletter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			if (response.ok) {
				toast.success('Subscribed successfully!')
				reset()
				setSubmitted(true)
				setTimeout(() => setSubmitted(false), 5000)
			} else {
				const errorData = await response.json()
				toast.error(errorData.error || 'Failed to subscribe. Please try again.')
			}
		} catch (error) {
			toast.error('An unexpected error occurred. Please try again.')
		}
	}

	return (
		<section className="relative w-full" aria-label="Newsletter subscription">
			{/* Header - Compact */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-4 sm:mb-5"
			>
				<div className="inline-flex items-center gap-1.5 mb-1.5">
					<div className="p-1.5 rounded-md bg-gradient-to-br from-blue-400 to-sky-500 shadow-sm">
						<Bell className="h-3 w-3 text-white" />
					</div>
					<h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-slate-900 dark:text-slate-50">
						Stay Updated
					</h2>
				</div>
				<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-light max-w-2xl leading-relaxed">
					Subscribe to my newsletter for the latest research insights, project updates, and DevSecOps best practices
				</p>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-950/50 dark:to-slate-900 backdrop-blur-sm p-4 sm:p-5 shadow-md"
			>
				<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-sky-500 to-blue-500" />
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808004_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
				
				<div className="relative max-w-xl mx-auto text-center space-y-3 sm:space-y-4">
					<div className="inline-flex p-2 rounded-md bg-gradient-to-br from-blue-400 to-sky-500 shadow-sm">
						<Mail className="h-4 w-4 text-white" aria-hidden="true" />
					</div>
					
					<form onSubmit={handleSubmit(onSubmit)} className="mt-4 max-w-md mx-auto flex flex-col sm:flex-row gap-2" noValidate>
						<div className="flex-1">
							<label htmlFor="newsletter-email" className="sr-only">
								Email address
							</label>
							<input
								id="newsletter-email"
								type="email"
								placeholder="Your email address"
								aria-label="Email address for newsletter subscription"
								aria-invalid={errors.email ? 'true' : 'false'}
								aria-describedby={errors.email ? 'email-error' : undefined}
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: "Invalid email address"
									}
								})}
								className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent transition-all touch-target shadow-sm"
							/>
							{errors.email && (
								<p id="email-error" className="mt-1 text-xs text-red-600 dark:text-red-400 text-left" role="alert">
									{errors.email.message}
								</p>
							)}
						</div>
						<button
							type="submit"
							disabled={isSubmitting}
							aria-label="Subscribe to newsletter"
							className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200 px-4 py-2 text-sm font-semibold text-white dark:text-slate-900 shadow-md hover:shadow-lg hover:from-slate-800 hover:to-slate-700 dark:hover:from-slate-200 dark:hover:to-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-target focus-visible-ring"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
									<span className="sr-only">Subscribing...</span>
								</>
							) : (
								<>
									Subscribe
									<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
								</>
							)}
						</button>
					</form>

					<AnimatePresence>
						{submitted && (
							<motion.div
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -5 }}
								className="mt-3 flex items-center justify-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium"
								role="status"
								aria-live="polite"
							>
								<CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
								<span>Thanks for subscribing!</span>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.div>
		</section>
	)
}
