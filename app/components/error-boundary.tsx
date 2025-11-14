'use client'

import React, { Component, ReactNode } from 'react'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { Button } from 'app/theme/components/ui/button'
import Link from 'next/link'

interface Props {
	children: ReactNode
	fallback?: ReactNode
}

interface State {
	hasError: boolean
	error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false, error: null }
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Log error to monitoring service in production
		if (process.env.NODE_ENV === 'production') {
			console.error('Error caught by boundary:', error, errorInfo)
			// Example: Send to error tracking service
			// trackError(error, errorInfo)
		}
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null })
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback
			}

			return (
				<div className="min-h-[400px] flex items-center justify-center bg-white dark:bg-slate-950 px-4">
					<div className="max-w-md w-full text-center space-y-6">
						<div className="inline-flex p-4 rounded-full bg-red-100 dark:bg-red-900/30">
							<AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
						</div>
						
						<div className="space-y-2">
							<h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
								Something went wrong
							</h2>
							<p className="text-base text-slate-600 dark:text-slate-400">
								We encountered an unexpected error. Please try again.
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Button
								onClick={this.handleReset}
								className="flex items-center gap-2"
							>
								<RefreshCw className="h-4 w-4" />
								Try again
							</Button>
							<Button
								asChild
								variant="outline"
								className="flex items-center gap-2"
							>
								<Link href="/">
									<Home className="h-4 w-4" />
									Go home
								</Link>
							</Button>
						</div>

						{process.env.NODE_ENV === 'development' && this.state.error && (
							<div className="mt-8 p-4 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
								<p className="text-xs font-mono text-slate-600 dark:text-slate-400 text-left break-all">
									{this.state.error.message}
								</p>
							</div>
						)}
					</div>
				</div>
			)
		}

		return this.props.children
	}
}

