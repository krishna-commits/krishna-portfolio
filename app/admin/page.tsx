'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card'
import { Button } from 'app/theme/components/ui/button'
import { Badge } from 'app/theme/components/ui/badge'
import { Users, Mail, BarChart3, Settings, Heart } from 'lucide-react'

interface AdminStats {
	newsletterSubscribers: number
	contactSubmissions: number
	totalViews: number
}

export default function AdminPanel() {
	const [stats, setStats] = useState<AdminStats>({
		newsletterSubscribers: 0,
		contactSubmissions: 0,
		totalViews: 0,
	})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true)
				// TODO: Replace with actual API endpoint
				// const response = await fetch('/api/admin/stats')
				// const data = await response.json()
				// setStats(data)
				
				// Placeholder data
				setStats({
					newsletterSubscribers: 0,
					contactSubmissions: 0,
					totalViews: 0,
				})
			} catch (err) {
				setError('Failed to load admin data')
			} finally {
				setLoading(false)
			}
		}

		fetchStats()
	}, [])

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-slate-100 mx-auto mb-4"></div>
					<p className="text-slate-600 dark:text-slate-400">Loading admin panel...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center px-4">
				<Card className="max-w-md w-full">
					<CardHeader>
						<CardTitle className="text-red-600 dark:text-red-400">Error</CardTitle>
						<CardDescription>{error}</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => window.location.reload()}>
							Retry
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
			<div className="mb-12">
				<h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-slate-900 dark:text-slate-50 mb-4">
					Admin Panel
				</h1>
				<p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400">
					Manage your portfolio website
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
						<Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.newsletterSubscribers}</div>
						<p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
							Total subscribers
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
						<Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.contactSubmissions}</div>
						<p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
							Total messages
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Views</CardTitle>
						<BarChart3 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalViews}</div>
						<p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
							All-time views
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Settings</CardTitle>
						<Settings className="h-4 w-4 text-slate-600 dark:text-slate-400" />
					</CardHeader>
					<CardContent>
						<Badge variant="secondary">Coming Soon</Badge>
					</CardContent>
				</Card>
			</div>

			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
						<CardDescription>Common administrative tasks</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button variant="outline" className="w-full sm:w-auto">
							Export Newsletter List
						</Button>
						<Button variant="outline" className="w-full sm:w-auto">
							View Contact Messages
						</Button>
						<Button variant="outline" className="w-full sm:w-auto">
							Analytics Dashboard
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Content Management</CardTitle>
						<CardDescription>Manage your portfolio content</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button 
							variant="outline" 
							className="w-full sm:w-auto"
							onClick={() => window.location.href = '/admin/hobbies'}
						>
							<Heart className="h-4 w-4 mr-2" />
							Manage Hobbies
						</Button>
					</CardContent>
				</Card>
			</div>
		</main>
	)
}
