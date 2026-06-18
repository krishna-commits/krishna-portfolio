'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card'
import { Button } from 'app/theme/components/ui/button'
import { Input } from 'app/theme/components/ui/input'
import { Label } from 'app/theme/components/ui/label'
import { Textarea } from 'app/theme/components/ui/textarea'
import { BookOpen, Loader2, Save, Plus, Trash2, RefreshCw } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import {
	DEFAULT_PERSONAL_NOTE,
	type PersonalNoteCard,
	type PersonalNoteConfig,
} from 'lib/personal-note-config'

const CARD_ICONS: PersonalNoteCard['icon'][] = ['Target', 'Sparkles', 'Zap']

export default function PersonalNotePage() {
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [config, setConfig] = useState<PersonalNoteConfig>(DEFAULT_PERSONAL_NOTE)

	const fetchData = useCallback(async () => {
		try {
			const res = await fetch('/api/admin/homepage/personal-note')
			if (!res.ok) throw new Error('Failed to fetch')
			const data = await res.json()
			setConfig({ ...DEFAULT_PERSONAL_NOTE, ...data })
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
			const res = await fetch('/api/admin/homepage/personal-note', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(config),
			})
			if (!res.ok) throw new Error((await res.json()).error || 'Failed to save')
			toast.success('Personal note saved — live on homepage')
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'Failed to save')
		} finally {
			setSaving(false)
		}
	}

	const handleReset = async () => {
		if (!confirm('Reset to defaults?')) return
		try {
			setSaving(true)
			const res = await fetch('/api/admin/homepage/personal-note', { method: 'POST' })
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
						<div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500">
							<BookOpen className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold">What Drives Me</h1>
							<p className="text-sm text-muted-foreground">Structured section or simple text mode</p>
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
							<CardTitle>Display mode</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label>Section heading</Label>
								<Input value={config.heading} onChange={(e) => setConfig({ ...config, heading: e.target.value })} />
							</div>
							<label className="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									checked={config.useSimpleContent}
									onChange={(e) => setConfig({ ...config, useSimpleContent: e.target.checked })}
								/>
								Use simple text mode (replaces cards and structured layout)
							</label>
							{config.useSimpleContent && (
								<div>
									<Label>Simple content</Label>
									<Textarea
										rows={10}
										value={config.simpleContent}
										onChange={(e) => setConfig({ ...config, simpleContent: e.target.value })}
									/>
								</div>
							)}
						</CardContent>
					</Card>

					{!config.useSimpleContent && (
						<>
							<Card>
								<CardHeader>
									<CardTitle>Main statements</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<Label>Main statement</Label>
										<Textarea
											rows={2}
											value={config.mainStatement}
											onChange={(e) => setConfig({ ...config, mainStatement: e.target.value })}
										/>
									</div>
									<div>
										<Label>Supporting paragraph</Label>
										<Textarea
											rows={3}
											value={config.subStatement}
											onChange={(e) => setConfig({ ...config, subStatement: e.target.value })}
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<div className="flex justify-between items-center">
										<CardTitle>Value cards</CardTitle>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												setConfig({
													...config,
													cards: [
														...config.cards,
														{ icon: 'Target', title: 'New card', description: '' },
													],
												})
											}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add card
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									{config.cards.map((card, i) => (
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
															cards: config.cards.filter((_, idx) => idx !== i),
														})
													}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
											<div className="grid gap-2 sm:grid-cols-2">
												<Input
													placeholder="Title"
													value={card.title}
													onChange={(e) => {
														const cards = [...config.cards]
														cards[i] = { ...card, title: e.target.value }
														setConfig({ ...config, cards })
													}}
												/>
												<select
													className="flex h-10 rounded-md border border-input bg-background px-3 text-sm"
													value={card.icon}
													onChange={(e) => {
														const cards = [...config.cards]
														cards[i] = { ...card, icon: e.target.value as PersonalNoteCard['icon'] }
														setConfig({ ...config, cards })
													}}
												>
													{CARD_ICONS.map((icon) => (
														<option key={icon} value={icon}>
															{icon}
														</option>
													))}
												</select>
											</div>
											<Textarea
												rows={2}
												placeholder="Description"
												value={card.description}
												onChange={(e) => {
													const cards = [...config.cards]
													cards[i] = { ...card, description: e.target.value }
													setConfig({ ...config, cards })
												}}
											/>
										</div>
									))}
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Closing philosophy</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<Label>Philosophy paragraph</Label>
										<Textarea
											rows={3}
											value={config.philosophy}
											onChange={(e) => setConfig({ ...config, philosophy: e.target.value })}
										/>
									</div>
									<div>
										<Label>Closing statement</Label>
										<Input
											value={config.closingStatement}
											onChange={(e) => setConfig({ ...config, closingStatement: e.target.value })}
										/>
									</div>
								</CardContent>
							</Card>
						</>
					)}

					<Button type="submit" disabled={saving} className="gap-2">
						{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
						Save & publish
					</Button>
				</form>
			</div>
		</div>
	)
}
