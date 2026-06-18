'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card'
import { Button } from 'app/theme/components/ui/button'
import { Input } from 'app/theme/components/ui/input'
import { Label } from 'app/theme/components/ui/label'
import { Textarea } from 'app/theme/components/ui/textarea'
import { Shield, Loader2, Save, Plus, Trash2, RefreshCw } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import {
	DEFAULT_SECURITY_APPROACH,
	type SecurityApproachConfig,
	type SecurityMethodology,
	type SecurityPipelineStage,
} from 'lib/security-approach-config'

const METHODOLOGY_ICONS: SecurityMethodology['icon'][] = ['Code', 'Server', 'Eye']
const PIPELINE_ICONS: SecurityPipelineStage['icon'][] = [
	'Code',
	'Container',
	'CheckCircle2',
	'Cloud',
	'Eye',
]

export default function SecurityApproachPage() {
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [config, setConfig] = useState<SecurityApproachConfig>(DEFAULT_SECURITY_APPROACH)

	const fetchData = useCallback(async () => {
		try {
			const res = await fetch('/api/admin/homepage/security-approach')
			if (!res.ok) throw new Error('Failed to fetch')
			const data = await res.json()
			setConfig({ ...DEFAULT_SECURITY_APPROACH, ...data })
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'Failed to load')
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			setSaving(true)
			const res = await fetch('/api/admin/homepage/security-approach', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(config),
			})
			if (!res.ok) throw new Error((await res.json()).error || 'Failed to save')
			toast.success('Security section saved — live on homepage')
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'Failed to save')
		} finally {
			setSaving(false)
		}
	}

	const handleReset = async () => {
		if (!confirm('Reset security section to defaults?')) return
		try {
			setSaving(true)
			const res = await fetch('/api/admin/homepage/security-approach', { method: 'POST' })
			const data = await res.json()
			if (!res.ok) throw new Error(data.error)
			setConfig(data.data)
			toast.success('Reset to defaults')
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'Failed to reset')
		} finally {
			setSaving(false)
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen pt-16 lg:pt-0 flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		)
	}

	return (
		<div className="min-h-screen pt-16 lg:pt-0">
			<Toaster position="top-right" />
			<div className="max-w-3xl mx-auto px-4 py-8 lg:py-12 space-y-6">
				<div className="flex justify-between items-start gap-4">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
							<Shield className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold">Security-First Approach</h1>
							<p className="text-sm text-muted-foreground">Heading, lead, methodology cards, and pipeline</p>
						</div>
					</div>
					<Button type="button" variant="outline" size="sm" onClick={handleReset} disabled={saving}>
						<RefreshCw className="h-4 w-4 mr-1" />
						Reset
					</Button>
				</div>

				<form onSubmit={handleSave} className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Section header</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label>Heading</Label>
								<Input value={config.heading} onChange={(e) => setConfig({ ...config, heading: e.target.value })} />
							</div>
							<div>
								<Label>Lead paragraph</Label>
								<Textarea rows={3} value={config.lead} onChange={(e) => setConfig({ ...config, lead: e.target.value })} />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="flex justify-between items-center">
								<CardTitle>Methodology cards</CardTitle>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() =>
										setConfig({
											...config,
											methodologies: [
												...config.methodologies,
												{ icon: 'Code', title: 'New methodology', description: '' },
											],
										})
									}
								>
									<Plus className="h-4 w-4 mr-1" />
									Add
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{config.methodologies.map((m, i) => (
								<div key={i} className="rounded-lg border p-3 space-y-2">
									<div className="flex justify-end">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="text-red-600"
											onClick={() =>
												setConfig({
													...config,
													methodologies: config.methodologies.filter((_, idx) => idx !== i),
												})
											}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
									<div className="grid gap-2 sm:grid-cols-2">
										<Input
											placeholder="Title"
											value={m.title}
											onChange={(e) => {
												const methodologies = [...config.methodologies]
												methodologies[i] = { ...m, title: e.target.value }
												setConfig({ ...config, methodologies })
											}}
										/>
										<select
											className="flex h-10 rounded-md border border-input bg-background px-3 text-sm"
											value={m.icon}
											onChange={(e) => {
												const methodologies = [...config.methodologies]
												methodologies[i] = { ...m, icon: e.target.value as SecurityMethodology['icon'] }
												setConfig({ ...config, methodologies })
											}}
										>
											{METHODOLOGY_ICONS.map((icon) => (
												<option key={icon} value={icon}>
													{icon}
												</option>
											))}
										</select>
									</div>
									<Textarea
										rows={2}
										placeholder="Description"
										value={m.description}
										onChange={(e) => {
											const methodologies = [...config.methodologies]
											methodologies[i] = { ...m, description: e.target.value }
											setConfig({ ...config, methodologies })
										}}
									/>
								</div>
							))}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="flex justify-between items-center">
								<div>
									<CardTitle>Security pipeline</CardTitle>
									<CardDescription>Stages shown in the pipeline diagram</CardDescription>
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() =>
										setConfig({
											...config,
											pipeline: [
												...config.pipeline,
												{ stage: 'Stage', icon: 'Code', description: '' },
											],
										})
									}
								>
									<Plus className="h-4 w-4 mr-1" />
									Add stage
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label>Pipeline heading</Label>
								<Input
									value={config.pipelineHeading}
									onChange={(e) => setConfig({ ...config, pipelineHeading: e.target.value })}
								/>
							</div>
							{config.pipeline.map((stage, i) => (
								<div key={i} className="rounded-lg border p-3 space-y-2">
									<div className="flex justify-end">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="text-red-600"
											onClick={() =>
												setConfig({
													...config,
													pipeline: config.pipeline.filter((_, idx) => idx !== i),
												})
											}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
									<div className="grid gap-2 sm:grid-cols-3">
										<Input
											placeholder="Stage name"
											value={stage.stage}
											onChange={(e) => {
												const pipeline = [...config.pipeline]
												pipeline[i] = { ...stage, stage: e.target.value }
												setConfig({ ...config, pipeline })
											}}
										/>
										<select
											className="flex h-10 rounded-md border border-input bg-background px-3 text-sm"
											value={stage.icon}
											onChange={(e) => {
												const pipeline = [...config.pipeline]
												pipeline[i] = { ...stage, icon: e.target.value as SecurityPipelineStage['icon'] }
												setConfig({ ...config, pipeline })
											}}
										>
											{PIPELINE_ICONS.map((icon) => (
												<option key={icon} value={icon}>
													{icon}
												</option>
											))}
										</select>
										<Input
											placeholder="Description"
											value={stage.description}
											onChange={(e) => {
												const pipeline = [...config.pipeline]
												pipeline[i] = { ...stage, description: e.target.value }
												setConfig({ ...config, pipeline })
											}}
										/>
									</div>
								</div>
							))}
						</CardContent>
					</Card>

					<Button type="submit" disabled={saving} className="gap-2">
						{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
						Save & publish
					</Button>
				</form>
			</div>
		</div>
	)
}
