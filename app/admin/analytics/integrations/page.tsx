'use client'

import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import {
	Activity,
	BarChart3,
	CheckCircle2,
	Cloud,
	ExternalLink,
	Globe2,
	Loader2,
	RefreshCw,
	AlertTriangle,
	Zap,
} from 'lucide-react'
import { Button } from 'app/theme/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card'
import { StatCard } from '../../components/charts/stat-card'
import { AdminLineChart } from '../../components/charts/line-chart'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
	return (
		<span
			className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
				ok
					? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
					: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
			}`}
		>
			{ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
			{label}
		</span>
	)
}

function formatNumber(num: number) {
	if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
	if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
	return num.toLocaleString()
}

export default function AnalyticsIntegrationsPage() {
	const [days, setDays] = useState(30)
	const { data, error, isLoading, mutate } = useSWR(
		`/api/admin/analytics/integrations?days=${days}`,
		fetcher,
		{ revalidateOnFocus: true, refreshInterval: 300_000 },
	)

	if (isLoading) {
		return (
			<div className="min-h-screen pt-16 lg:pt-0 flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400 mx-auto mb-4" />
					<p className="text-slate-600 dark:text-slate-400">Loading analytics hub…</p>
				</div>
			</div>
		)
	}

	if (error || !data) {
		return (
			<div className="min-h-screen pt-16 lg:pt-0 flex items-center justify-center">
				<div className="text-center space-y-4">
					<p className="text-red-600 dark:text-red-400">Failed to load analytics hub</p>
					<Button onClick={() => mutate()}>Retry</Button>
				</div>
			</div>
		)
	}

	const cfOk = data.cloudflare?.ok
	const cfSummary = data.cloudflare?.summary
	const vercelObs = data.vercel?.observability
	const vercelWeb = data.vercel?.webAnalytics
	const links = data.links || {}

	return (
		<div className="min-h-screen pt-16 lg:pt-0">
			<div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-12">
				<div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
							<Globe2 className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
								Analytics Hub
							</h1>
							<p className="text-slate-600 dark:text-slate-400 mt-1">
								Cloudflare, Vercel, and on-site tracking in one place
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2 flex-wrap">
						<select
							value={days}
							onChange={(e) => setDays(parseInt(e.target.value, 10))}
							className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-sm"
						>
							<option value={7}>Last 7 days</option>
							<option value={30}>Last 30 days</option>
							<option value={90}>Last 90 days</option>
						</select>
						<Button variant="outline" onClick={() => mutate()} className="gap-2">
							<RefreshCw className="h-4 w-4" />
							Refresh
						</Button>
					</div>
				</div>

				{/* External dashboards */}
				<Card className="mb-6 border-2">
					<CardHeader>
						<CardTitle className="text-lg">Open in provider dashboards</CardTitle>
						<CardDescription>
							Vercel Web Analytics has no public read API — use these links or configure a drain below
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						{[
							{ href: links.vercelAnalytics, label: 'Vercel Web Analytics' },
							{ href: links.vercelSpeedInsights, label: 'Vercel Speed Insights' },
							{ href: links.vercelObservability, label: 'Vercel Observability' },
							{ href: links.cloudflareAnalytics, label: 'Cloudflare Traffic' },
						].map((item) =>
							item.href ? (
								<a
									key={item.label}
									href={item.href}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
								>
									{item.label}
									<ExternalLink className="h-3.5 w-3.5 opacity-60" />
								</a>
							) : null,
						)}
					</CardContent>
				</Card>

				{/* Config status */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<Card>
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base flex items-center gap-2">
									<Cloud className="h-4 w-4" /> Cloudflare
								</CardTitle>
								<StatusBadge
									ok={data.config?.cloudflare?.configured}
									label={data.config?.cloudflare?.configured ? 'Configured' : 'Missing env'}
								/>
							</div>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground space-y-1">
							<p>Zone ID: {data.config?.cloudflare?.zoneIdSet ? 'Set' : 'Not set'}</p>
							<p>API token: {data.config?.cloudflare?.tokenSet ? 'Set' : 'Not set'}</p>
							<Link href="/admin/cloudflare" className="text-amber-700 dark:text-amber-400 font-medium">
								Full Cloudflare report →
							</Link>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base flex items-center gap-2">
									<Zap className="h-4 w-4" /> Vercel API
								</CardTitle>
								<StatusBadge
									ok={data.config?.vercel?.observabilityConfigured}
									label={
										data.config?.vercel?.observabilityConfigured ? 'Configured' : 'Missing token'
									}
								/>
							</div>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground space-y-1">
							<p>Access token: {data.config?.vercel?.accessTokenSet ? 'Set' : 'Not set'}</p>
							<p>Team / project IDs: {data.config?.vercel?.projectIdSet ? 'Set' : 'Not set'}</p>
							<p>Drain secret: {data.config?.vercel?.drainSecretSet ? 'Set' : 'Optional'}</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base flex items-center gap-2">
									<Activity className="h-4 w-4" /> On-site DB
								</CardTitle>
								<StatusBadge
									ok={data.config?.database?.configured}
									label={data.config?.database?.configured ? 'Connected' : 'No database'}
								/>
							</div>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground space-y-1">
							<p>Page views: {formatNumber(data.local?.pageViews ?? 0)}</p>
							<p>Unique visitors: {formatNumber(data.local?.uniqueVisitors ?? 0)}</p>
							<Link
								href="/admin/analytics/enhanced"
								className="text-amber-700 dark:text-amber-400 font-medium"
							>
								Enhanced analytics →
							</Link>
						</CardContent>
					</Card>
				</div>

				{/* Metrics overview */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					<StatCard
						title="Cloudflare requests"
						value={cfOk ? formatNumber(cfSummary?.totalRequests ?? 0) : '—'}
						icon={Cloud}
						gradient="from-orange-500 to-amber-500"
					/>
					<StatCard
						title="CF page views"
						value={cfOk ? formatNumber(cfSummary?.totalPageViews ?? 0) : '—'}
						icon={BarChart3}
						gradient="from-sky-500 to-blue-500"
					/>
					<StatCard
						title="Vercel edge requests"
						value={vercelObs?.ok ? formatNumber(vercelObs.totalRequests ?? 0) : '—'}
						icon={Zap}
						gradient="from-violet-500 to-purple-500"
					/>
					<StatCard
						title="Vercel drain pageviews"
						value={vercelWeb?.ok ? formatNumber(vercelWeb.pageViews ?? 0) : '—'}
						icon={Globe2}
						gradient="from-emerald-500 to-teal-500"
					/>
				</div>

				{/* Charts */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<Card>
						<CardHeader>
							<CardTitle>Cloudflare daily requests</CardTitle>
							{!cfOk && (
								<CardDescription className="text-amber-700 dark:text-amber-400">
									{data.cloudflare?.error || 'Configure Cloudflare credentials'}
								</CardDescription>
							)}
						</CardHeader>
						<CardContent>
							{cfOk && data.cloudflare?.chartData?.requests?.length ? (
								<AdminLineChart
									data={data.cloudflare.chartData.requests.map(
										(d: { date: string; value: number }) => ({
											name: d.date.slice(5),
											value: d.value,
										}),
									)}
									dataKey="value"
									color="#f97316"
								/>
							) : (
								<p className="text-sm text-muted-foreground">No Cloudflare data</p>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Vercel web analytics (drain)</CardTitle>
							<CardDescription>
								{vercelWeb?.note || vercelWeb?.error || 'Configure Web Analytics Drain'}
							</CardDescription>
						</CardHeader>
						<CardContent>
							{vercelWeb?.ok && vercelWeb.daily?.length ? (
								<AdminLineChart
									data={vercelWeb.daily.map((d: { date: string; pageViews: number }) => ({
										name: d.date.slice(5),
										value: d.pageViews,
									}))}
									dataKey="value"
									color="#8b5cf6"
								/>
							) : (
								<p className="text-sm text-muted-foreground">No drain events stored yet</p>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Setup guides */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					{(['cloudflare', 'vercelObservability', 'vercelWebAnalytics'] as const).map((key) => (
						<Card key={key}>
							<CardHeader>
								<CardTitle className="text-base capitalize">
									{key === 'cloudflare'
										? 'Cloudflare setup'
										: key === 'vercelObservability'
											? 'Vercel Observability'
											: 'Vercel Web Analytics drain'}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
									{(data.setup?.[key] || []).map((step: string, i: number) => (
										<li key={i}>{step}</li>
									))}
								</ol>
								<Link
									href="/admin/env"
									className="inline-block mt-4 text-sm font-medium text-amber-700 dark:text-amber-400"
								>
									Manage env vars in admin →
								</Link>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	)
}
