'use client'

import { useCallback, useEffect, useState } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'app/theme/components/ui/card'
import { Button } from 'app/theme/components/ui/button'
import { Input } from 'app/theme/components/ui/input'
import { Label } from 'app/theme/components/ui/label'
import { Textarea } from 'app/theme/components/ui/textarea'
import {
	BookOpen,
	Loader2,
	Plus,
	RefreshCw,
	Save,
	Trash2,
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import {
	DEFAULT_RESEARCH_CORE_CONFIG,
	type ChecklistItemConfig,
	type ResearchCoreConfig,
	type StartHereLink,
} from 'lib/research-core-config'
import { RESEARCH_PILLARS } from 'lib/research-pillars'
import { RESEARCH_SEGMENT_LABELS } from 'lib/research-labels'

const ICON_OPTIONS: StartHereLink['icon'][] = [
	'BookOpen',
	'Map',
	'ClipboardCheck',
	'Layers',
	'Shield',
]

export default function ResearchCoreAdminPage() {
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [source, setSource] = useState<'database' | 'defaults'>('defaults')
	const [config, setConfig] = useState<ResearchCoreConfig>(DEFAULT_RESEARCH_CORE_CONFIG)

	const fetchConfig = useCallback(async () => {
		try {
			setLoading(true)
			const res = await fetch('/api/admin/research-core/config')
			if (!res.ok) throw new Error('Failed to load settings')
			const data = await res.json()
			setConfig(data.config)
			setSource(data.source ?? 'defaults')
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Failed to load'
			toast.error(message)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchConfig()
	}, [fetchConfig])

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			setSaving(true)
			const res = await fetch('/api/admin/research-core/config', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ config }),
			})
			const data = await res.json()
			if (!res.ok) throw new Error(data.error || 'Failed to save')
			setConfig(data.config)
			setSource('database')
			toast.success('Research Core settings saved — changes are live on the site')
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Failed to save'
			toast.error(message)
		} finally {
			setSaving(false)
		}
	}

	const handleReset = async () => {
		if (!confirm('Reset all Research Core UI settings to built-in defaults?')) return
		try {
			setSaving(true)
			const res = await fetch('/api/admin/research-core/config', { method: 'POST' })
			const data = await res.json()
			if (!res.ok) throw new Error(data.error || 'Failed to reset')
			setConfig(data.config)
			setSource('database')
			toast.success('Reset to defaults')
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Failed to reset'
			toast.error(message)
		} finally {
			setSaving(false)
		}
	}

	const updateStartHereLink = (index: number, patch: Partial<StartHereLink>) => {
		setConfig((prev) => {
			const links = [...prev.startHere.links]
			links[index] = { ...links[index], ...patch }
			return { ...prev, startHere: { ...prev.startHere, links } }
		})
	}

	const addStartHereLink = () => {
		setConfig((prev) => ({
			...prev,
			startHere: {
				...prev.startHere,
				links: [
					...prev.startHere.links,
					{
						href: '/research-core',
						title: 'New link',
						description: 'Description',
						icon: 'BookOpen' as const,
					},
				],
			},
		}))
	}

	const removeStartHereLink = (index: number) => {
		setConfig((prev) => ({
			...prev,
			startHere: {
				...prev.startHere,
				links: prev.startHere.links.filter((_, i) => i !== index),
			},
		}))
	}

	const updateChecklistItem = (index: number, patch: Partial<ChecklistItemConfig>) => {
		setConfig((prev) => {
			const items = [...prev.seniorGapChecklist.items]
			items[index] = { ...items[index], ...patch }
			return { ...prev, seniorGapChecklist: { items } }
		})
	}

	const addChecklistItem = () => {
		setConfig((prev) => ({
			...prev,
			seniorGapChecklist: {
				items: [
					...prev.seniorGapChecklist.items,
					{
						id: `item-${Date.now()}`,
						section: 'New section',
						label: 'New capability',
						href: '/research-core',
						linkLabel: 'Link',
					},
				],
			},
		}))
	}

	const removeChecklistItem = (index: number) => {
		setConfig((prev) => ({
			...prev,
			seniorGapChecklist: {
				items: prev.seniorGapChecklist.items.filter((_, i) => i !== index),
			},
		}))
	}

	const updatePillar = (slug: string, patch: { title?: string; description?: string }) => {
		setConfig((prev) => ({
			...prev,
			pillars: prev.pillars.map((p) => (p.slug === slug ? { ...p, ...patch } : p)),
		}))
	}

	const updateSegmentLabel = (slug: string, label: string) => {
		setConfig((prev) => ({
			...prev,
			segmentLabels: { ...prev.segmentLabels, [slug]: label },
		}))
	}

	const addSegmentLabel = () => {
		setConfig((prev) => ({
			...prev,
			segmentLabels: { ...prev.segmentLabels, 'new-segment': 'New label' },
		}))
	}

	const removeSegmentLabel = (slug: string) => {
		setConfig((prev) => {
			const segmentLabels = { ...prev.segmentLabels }
			delete segmentLabels[slug]
			return { ...prev, segmentLabels }
		})
	}

	if (loading) {
		return (
			<div className="min-h-screen pt-16 lg:pt-0 flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400" />
			</div>
		)
	}

	return (
		<div className="min-h-screen pt-16 lg:pt-0">
			<Toaster position="top-right" />
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-6">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
							<BookOpen className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
								Research Core Settings
							</h1>
							<p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
								Edit page copy, Start Here card, checklist, pillars, and homepage CTA. Changes appear on the live site immediately.
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								Source: {source === 'database' ? 'saved in database' : 'built-in defaults (not saved yet)'}
							</p>
						</div>
					</div>
					<Button type="button" variant="outline" size="sm" onClick={handleReset} disabled={saving}>
						<RefreshCw className="h-4 w-4 mr-2" />
						Reset defaults
					</Button>
				</div>

				<form onSubmit={handleSave} className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Research Core page</CardTitle>
							<CardDescription>Title and intro on /research-core</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label htmlFor="pageTitle">Page title</Label>
								<Input
									id="pageTitle"
									value={config.pageTitle}
									onChange={(e) => setConfig({ ...config, pageTitle: e.target.value })}
								/>
							</div>
							<div>
								<Label htmlFor="pageLead">Page lead</Label>
								<Textarea
									id="pageLead"
									rows={3}
									value={config.pageLead}
									onChange={(e) => setConfig({ ...config, pageLead: e.target.value })}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Start Here card</CardTitle>
							<CardDescription>Highlighted links at the top of Research Core</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<div>
									<Label>Badge</Label>
									<Input
										value={config.startHere.badge}
										onChange={(e) =>
											setConfig({
												...config,
												startHere: { ...config.startHere, badge: e.target.value },
											})
										}
									/>
								</div>
								<div>
									<Label>Heading</Label>
									<Input
										value={config.startHere.heading}
										onChange={(e) =>
											setConfig({
												...config,
												startHere: { ...config.startHere, heading: e.target.value },
											})
										}
									/>
								</div>
							</div>
							<div>
								<Label>Lead text</Label>
								<Textarea
									rows={2}
									value={config.startHere.lead}
									onChange={(e) =>
										setConfig({
											...config,
											startHere: { ...config.startHere, lead: e.target.value },
										})
									}
								/>
							</div>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label>Links</Label>
									<Button type="button" variant="outline" size="sm" onClick={addStartHereLink}>
										<Plus className="h-4 w-4 mr-1" />
										Add link
									</Button>
								</div>
								{config.startHere.links.map((link, i) => (
									<div key={i} className="rounded-lg border p-4 space-y-3">
										<div className="flex justify-end">
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removeStartHereLink(i)}
												className="text-red-600"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
										<div className="grid gap-3 sm:grid-cols-2">
											<div>
												<Label>Title</Label>
												<Input
													value={link.title}
													onChange={(e) => updateStartHereLink(i, { title: e.target.value })}
												/>
											</div>
											<div>
												<Label>Icon</Label>
												<select
													className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
													value={link.icon}
													onChange={(e) =>
														updateStartHereLink(i, {
															icon: e.target.value as StartHereLink['icon'],
														})
													}
												>
													{ICON_OPTIONS.map((icon) => (
														<option key={icon} value={icon}>
															{icon}
														</option>
													))}
												</select>
											</div>
										</div>
										<div>
											<Label>URL path</Label>
											<Input
												value={link.href}
												onChange={(e) => updateStartHereLink(i, { href: e.target.value })}
												placeholder="/research-core/..."
											/>
										</div>
										<div>
											<Label>Description</Label>
											<Input
												value={link.description}
												onChange={(e) => updateStartHereLink(i, { description: e.target.value })}
											/>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Homepage Learning Hub CTA</CardTitle>
							<CardDescription>Button on the hero section linking to Research Core</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<label className="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									checked={config.heroCta.enabled}
									onChange={(e) =>
										setConfig({
											...config,
											heroCta: { ...config.heroCta, enabled: e.target.checked },
										})
									}
								/>
								Show CTA button on homepage hero
							</label>
							<div className="grid gap-4 sm:grid-cols-2">
								<div>
									<Label>Button label</Label>
									<Input
										value={config.heroCta.label}
										onChange={(e) =>
											setConfig({
												...config,
												heroCta: { ...config.heroCta, label: e.target.value },
											})
										}
									/>
								</div>
								<div>
									<Label>Link path</Label>
									<Input
										value={config.heroCta.href}
										onChange={(e) =>
											setConfig({
												...config,
												heroCta: { ...config.heroCta, href: e.target.value },
											})
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Learning Hub sidebar</CardTitle>
							<CardDescription>Progress bar label in the Research Core sidebar</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label>Progress label</Label>
								<Input
									value={config.learningHub.progressLabel}
									onChange={(e) =>
										setConfig({
											...config,
											learningHub: { ...config.learningHub, progressLabel: e.target.value },
										})
									}
								/>
							</div>
							<label className="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									checked={config.learningHub.showReadingTime}
									onChange={(e) =>
										setConfig({
											...config,
											learningHub: {
												...config.learningHub,
												showReadingTime: e.target.checked,
											},
										})
									}
								/>
								Show reading time in sidebar
							</label>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Senior Gap Checklist</CardTitle>
									<CardDescription>Items in the interactive checklist MDX component</CardDescription>
								</div>
								<Button type="button" variant="outline" size="sm" onClick={addChecklistItem}>
									<Plus className="h-4 w-4 mr-1" />
									Add item
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-3 max-h-[480px] overflow-y-auto">
							{config.seniorGapChecklist.items.map((item, i) => (
								<div key={item.id} className="rounded-lg border p-3 space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="font-medium text-muted-foreground">Item {i + 1}</span>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => removeChecklistItem(i)}
											className="text-red-600 h-8"
										>
											<Trash2 className="h-3 w-3" />
										</Button>
									</div>
									<div className="grid gap-2 sm:grid-cols-2">
										<Input
											placeholder="Section"
											value={item.section}
											onChange={(e) => updateChecklistItem(i, { section: e.target.value })}
										/>
										<Input
											placeholder="ID (unique)"
											value={item.id}
											onChange={(e) => updateChecklistItem(i, { id: e.target.value })}
										/>
									</div>
									<Input
										placeholder="Capability label"
										value={item.label}
										onChange={(e) => updateChecklistItem(i, { label: e.target.value })}
									/>
									<div className="grid gap-2 sm:grid-cols-2">
										<Input
											placeholder="Link path"
											value={item.href}
											onChange={(e) => updateChecklistItem(i, { href: e.target.value })}
										/>
										<Input
											placeholder="Link label"
											value={item.linkLabel}
											onChange={(e) => updateChecklistItem(i, { linkLabel: e.target.value })}
										/>
									</div>
								</div>
							))}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Pillar display names</CardTitle>
							<CardDescription>Override titles and descriptions shown on the Research Core index</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{RESEARCH_PILLARS.map((pillar) => {
								const override = config.pillars.find((p) => p.slug === pillar.slug)
								return (
									<div key={pillar.slug} className="rounded-lg border p-4 space-y-3">
										<p className="text-xs font-mono text-muted-foreground">{pillar.slug}</p>
										<div>
											<Label>Title</Label>
											<Input
												value={override?.title ?? pillar.title}
												onChange={(e) => updatePillar(pillar.slug, { title: e.target.value })}
											/>
										</div>
										<div>
											<Label>Description</Label>
											<Textarea
												rows={2}
												value={override?.description ?? pillar.description}
												onChange={(e) =>
													updatePillar(pillar.slug, { description: e.target.value })
												}
											/>
										</div>
									</div>
								)
							})}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Breadcrumb labels</CardTitle>
									<CardDescription>Human-readable names for URL segments in Research Core breadcrumbs</CardDescription>
								</div>
								<Button type="button" variant="outline" size="sm" onClick={addSegmentLabel}>
									<Plus className="h-4 w-4 mr-1" />
									Add
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-3 max-h-[360px] overflow-y-auto">
							{Object.entries(config.segmentLabels).map(([slug, label]) => (
								<div key={slug} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] items-center">
									<Input
										value={slug}
										onChange={(e) => {
											const newSlug = e.target.value
											setConfig((prev) => {
												const segmentLabels = { ...prev.segmentLabels }
												delete segmentLabels[slug]
												segmentLabels[newSlug] = label
												return { ...prev, segmentLabels }
											})
										}}
										placeholder="url-segment"
										className="font-mono text-xs"
									/>
									<Input
										value={label}
										onChange={(e) => updateSegmentLabel(slug, e.target.value)}
										placeholder="Display label"
									/>
									{!(slug in RESEARCH_SEGMENT_LABELS) || slug.startsWith('new-') ? (
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="text-red-600"
											onClick={() => removeSegmentLabel(slug)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									) : (
										<span className="w-9" />
									)}
								</div>
							))}
						</CardContent>
					</Card>

					<div className="flex justify-end sticky bottom-4 z-10">
						<Button type="submit" disabled={saving} className="gap-2 shadow-lg">
							{saving ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="h-4 w-4" />
									Save & publish to site
								</>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
