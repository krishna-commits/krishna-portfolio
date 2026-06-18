'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card'
import { Button } from 'app/theme/components/ui/button'
import { Input } from 'app/theme/components/ui/input'
import { Label } from 'app/theme/components/ui/label'
import { Compass, Loader2, Save, Plus, Trash2, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import {
	DEFAULT_NAVIGATION_CONFIG,
	NAV_ICON_OPTIONS,
	type NavLinkConfig,
	type NavigationConfig,
} from 'lib/navigation-config'

export default function NavigationAdminPage() {
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [navigation, setNavigation] = useState<NavigationConfig>(DEFAULT_NAVIGATION_CONFIG)

	const fetchData = useCallback(async () => {
		try {
			const res = await fetch('/api/admin/homepage/navigation')
			if (!res.ok) throw new Error('Failed to load')
			const data = await res.json()
			setNavigation(data.navigation)
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'Failed to load')
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const updateItem = (index: number, patch: Partial<NavLinkConfig>) => {
		setNavigation((prev) => {
			const items = [...prev.items]
			items[index] = { ...items[index], ...patch }
			return { items }
		})
	}

	const moveItem = (index: number, direction: -1 | 1) => {
		setNavigation((prev) => {
			const items = [...prev.items]
			const target = index + direction
			if (target < 0 || target >= items.length) return prev
			;[items[index], items[target]] = [items[target], items[index]]
			return { items }
		})
	}

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			setSaving(true)
			const res = await fetch('/api/admin/homepage/navigation', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ navigation }),
			})
			if (!res.ok) throw new Error((await res.json()).error || 'Failed to save')
			toast.success('Navigation saved — header and mobile menu update live')
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'Failed to save')
		} finally {
			setSaving(false)
		}
	}

	const handleReset = async () => {
		if (!confirm('Reset navigation to defaults?')) return
		try {
			setSaving(true)
			const res = await fetch('/api/admin/homepage/navigation', { method: 'POST' })
			const data = await res.json()
			if (!res.ok) throw new Error(data.error)
			setNavigation(data.navigation)
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
						<div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
							<Compass className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold">Navigation Menu</h1>
							<p className="text-sm text-muted-foreground">Desktop navbar and mobile menu links</p>
						</div>
					</div>
					<Button type="button" variant="outline" size="sm" onClick={handleReset} disabled={saving}>
						<RefreshCw className="h-4 w-4 mr-1" />
						Reset
					</Button>
				</div>

				<form onSubmit={handleSave} className="space-y-4">
					{navigation.items.map((item, i) => (
						<Card key={`${item.path}-${i}`}>
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between gap-2">
									<CardTitle className="text-base">{item.name || 'New link'}</CardTitle>
									<div className="flex items-center gap-1">
										<Button type="button" variant="ghost" size="sm" onClick={() => moveItem(i, -1)} disabled={i === 0}>
											<ChevronUp className="h-4 w-4" />
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => moveItem(i, 1)}
											disabled={i === navigation.items.length - 1}
										>
											<ChevronDown className="h-4 w-4" />
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="text-red-600"
											onClick={() =>
												setNavigation((prev) => ({
													items: prev.items.filter((_, idx) => idx !== i),
												}))
											}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
								<CardDescription>{item.path}</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="grid gap-3 sm:grid-cols-2">
									<div>
										<Label>Label</Label>
										<Input value={item.name} onChange={(e) => updateItem(i, { name: e.target.value })} />
									</div>
									<div>
										<Label>Path</Label>
										<Input value={item.path} onChange={(e) => updateItem(i, { path: e.target.value })} />
									</div>
								</div>
								<div>
									<Label>Mobile description</Label>
									<Input
										value={item.description}
										onChange={(e) => updateItem(i, { description: e.target.value })}
									/>
								</div>
								<div className="grid gap-3 sm:grid-cols-2">
									<div>
										<Label>Icon</Label>
										<select
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
											value={item.icon}
											onChange={(e) => updateItem(i, { icon: e.target.value as NavLinkConfig['icon'] })}
										>
											{NAV_ICON_OPTIONS.map((icon) => (
												<option key={icon} value={icon}>
													{icon}
												</option>
											))}
										</select>
									</div>
									<div>
										<Label>Accessibility label</Label>
										<Input value={item.ariaLabel} onChange={(e) => updateItem(i, { ariaLabel: e.target.value })} />
									</div>
								</div>
								<div className="flex flex-wrap gap-4 text-sm">
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={item.enabled}
											onChange={(e) => updateItem(i, { enabled: e.target.checked })}
										/>
										Enabled
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={item.showInDesktop}
											onChange={(e) => updateItem(i, { showInDesktop: e.target.checked })}
										/>
										Desktop nav
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={item.showInMobile}
											onChange={(e) => updateItem(i, { showInMobile: e.target.checked })}
										/>
										Mobile menu
									</label>
								</div>
							</CardContent>
						</Card>
					))}

					<Button
						type="button"
						variant="outline"
						onClick={() =>
							setNavigation((prev) => ({
								items: [
									...prev.items,
									{
										path: '/new-page',
										name: 'New Page',
										description: 'Description',
										icon: 'BookOpen',
										ariaLabel: 'Navigate to new page',
										gradient: 'from-slate-500 to-slate-600',
										isAnchor: false,
										enabled: true,
										showInDesktop: true,
										showInMobile: true,
									},
								],
							}))
						}
					>
						<Plus className="h-4 w-4 mr-1" />
						Add link
					</Button>

					<Button type="submit" disabled={saving} className="gap-2 w-full sm:w-auto">
						{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
						Save & publish
					</Button>
				</form>
			</div>
		</div>
	)
}
