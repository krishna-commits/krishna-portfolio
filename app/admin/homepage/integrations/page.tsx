'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card'
import { Button } from 'app/theme/components/ui/button'
import { Input } from 'app/theme/components/ui/input'
import { Label } from 'app/theme/components/ui/label'
import { ArrowLeft, Loader2, Save, Rss, BookOpen, GraduationCap } from 'lucide-react'
import toast from 'react-hot-toast'
import type { IntegrationStatsOverrides } from 'lib/integration-stats-config'

export default function IntegrationsAdminPage() {
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [form, setForm] = useState<IntegrationStatsOverrides>({
		medium: { useLiveFetch: true },
		researchgate: { useLiveFetch: true },
		orcid: { useLiveFetch: true },
	})

	useEffect(() => {
		fetch('/api/admin/homepage/integrations')
			.then((r) => r.json())
			.then((data) => {
				if (data.integrations) setForm(data.integrations)
			})
			.catch(() => toast.error('Failed to load integration settings'))
			.finally(() => setLoading(false))
	}, [])

	const save = async () => {
		setSaving(true)
		try {
			const res = await fetch('/api/admin/homepage/integrations', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			})
			const data = await res.json()
			if (!res.ok) throw new Error(data.error || 'Save failed')
			toast.success('Integration settings saved')
		} catch (e) {
			toast.error(e instanceof Error ? e.message : 'Save failed')
		} finally {
			setSaving(false)
		}
	}

	const setNum = (
		section: 'medium' | 'researchgate' | 'orcid',
		key: string,
		value: string,
	) => {
		const n = value === '' ? undefined : Number(value)
		setForm((prev) => ({
			...prev,
			[section]: { ...prev[section], [key]: n },
		}))
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center pt-16 lg:pt-0">
				<Loader2 className="h-8 w-8 animate-spin text-slate-500" />
			</div>
		)
	}

	return (
		<div className="min-h-screen pt-16 lg:pt-0">
			<div className="max-w-4xl mx-auto px-4 py-8 lg:py-12 space-y-6">
				<div className="flex items-center gap-3">
					<Link href="/admin/homepage">
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-5 w-5" />
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold">External Integrations</h1>
						<p className="text-slate-600 dark:text-slate-400">
							Profile URLs live in{' '}
							<Link href="/admin/homepage/social" className="underline">
								Social Links
							</Link>
							. GitHub username in{' '}
							<Link href="/admin/homepage/github" className="underline">
								GitHub Settings
							</Link>
							.
						</p>
					</div>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Rss className="h-5 w-5" /> Medium
						</CardTitle>
						<CardDescription>Override read/post counts or use live RSS fetch</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={form.medium?.useLiveFetch !== false}
								onChange={(e) =>
									setForm((p) => ({
										...p,
										medium: { ...p.medium, useLiveFetch: e.target.checked },
									}))
								}
							/>
							Fetch live post count from Medium RSS
						</label>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label>Total reads</Label>
								<Input
									type="number"
									value={form.medium?.totalReads ?? ''}
									onChange={(e) => setNum('medium', 'totalReads', e.target.value)}
								/>
							</div>
							<div>
								<Label>Total posts</Label>
								<Input
									type="number"
									value={form.medium?.totalPosts ?? ''}
									onChange={(e) => setNum('medium', 'totalPosts', e.target.value)}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BookOpen className="h-5 w-5" /> ResearchGate
						</CardTitle>
						<CardDescription>Override metrics or use live scrape / env fallbacks</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={form.researchgate?.useLiveFetch !== false}
								onChange={(e) =>
									setForm((p) => ({
										...p,
										researchgate: { ...p.researchgate, useLiveFetch: e.target.checked },
									}))
								}
							/>
							Use live ResearchGate fetch (when unchecked, manual values below are used)
						</label>
						<div className="grid grid-cols-2 gap-4">
							{(
								[
									['totalReads', 'Total reads'],
									['citations', 'Citations'],
									['hIndex', 'h-index'],
									['researchInterestScore', 'Research interest'],
								] as const
							).map(([key, label]) => (
								<div key={key}>
									<Label>{label}</Label>
									<Input
										type="number"
										step="any"
										value={form.researchgate?.[key] ?? ''}
										onChange={(e) => setNum('researchgate', key, e.target.value)}
									/>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<GraduationCap className="h-5 w-5" /> ORCID
						</CardTitle>
						<CardDescription>Override publication count shown on homepage</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={form.orcid?.useLiveFetch !== false}
								onChange={(e) =>
									setForm((p) => ({
										...p,
										orcid: { ...p.orcid, useLiveFetch: e.target.checked },
									}))
								}
							/>
							Fetch live work count from ORCID API
						</label>
						<div>
							<Label>Work count override</Label>
							<Input
								type="number"
								value={form.orcid?.workCount ?? ''}
								onChange={(e) => setNum('orcid', 'workCount', e.target.value)}
							/>
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end">
					<Button onClick={save} disabled={saving}>
						{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
						Save integration settings
					</Button>
				</div>
			</div>
		</div>
	)
}
