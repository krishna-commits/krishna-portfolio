'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card'
import { Button } from 'app/theme/components/ui/button'
import { Input } from 'app/theme/components/ui/input'
import { Label } from 'app/theme/components/ui/label'
import { Textarea } from 'app/theme/components/ui/textarea'
import { User, Loader2, Save } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { DEFAULT_HERO_DATA, type HeroData } from 'lib/hero-config'

export default function HeroContentAdminPage() {
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [hero, setHero] = useState<HeroData>(DEFAULT_HERO_DATA)

	const fetchData = useCallback(async () => {
		try {
			const res = await fetch('/api/admin/homepage/hero')
			if (!res.ok) throw new Error('Failed to load')
			const data = await res.json()
			setHero({ ...DEFAULT_HERO_DATA, ...data })
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
			const res = await fetch('/api/admin/homepage/hero', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(hero),
			})
			if (!res.ok) throw new Error((await res.json()).error || 'Failed to save')
			toast.success('Hero content saved — live on homepage')
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'Failed to save')
		} finally {
			setSaving(false)
		}
	}

	const updateView = (view: 'Academic' | 'Enterprise', field: 'headline' | 'bullets', value: string | string[]) => {
		setHero((prev) => ({
			...prev,
			viewContent: {
				...prev.viewContent,
				[view]:
					field === 'headline'
						? { ...prev.viewContent[view], headline: value as string }
						: { ...prev.viewContent[view], bullets: value as string[] },
			},
		}))
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
				<form onSubmit={handleSave} className="space-y-6">
					<Card>
						<CardHeader>
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
									<User className="h-6 w-6 text-white" />
								</div>
								<div>
									<CardTitle>Hero Headlines & Tags</CardTitle>
									<CardDescription>Main homepage hero copy (below basic profile in Hero Section admin)</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<div>
									<Label>Headline line 1</Label>
									<Input value={hero.headlineLine1} onChange={(e) => setHero({ ...hero, headlineLine1: e.target.value })} />
								</div>
								<div>
									<Label>Headline line 2</Label>
									<Input value={hero.headlineLine2} onChange={(e) => setHero({ ...hero, headlineLine2: e.target.value })} />
								</div>
							</div>
							<div>
								<Label>Subtitle (under headline)</Label>
								<Textarea rows={2} value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} />
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<div>
									<Label>Primary badge</Label>
									<Input value={hero.badgePrimary} onChange={(e) => setHero({ ...hero, badgePrimary: e.target.value })} />
								</div>
								<div>
									<Label>Secondary badge</Label>
									<Input value={hero.badgeSecondary} onChange={(e) => setHero({ ...hero, badgeSecondary: e.target.value })} />
								</div>
							</div>
							<div>
								<Label>Skill tags (comma-separated)</Label>
								<Input
									value={hero.customTags.join(', ')}
									onChange={(e) =>
										setHero({
											...hero,
											customTags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
										})
									}
								/>
							</div>
						</CardContent>
					</Card>

					{(['Academic', 'Enterprise'] as const).map((view) => (
						<Card key={view}>
							<CardHeader>
								<CardTitle>{view} panel</CardTitle>
								<CardDescription>Toggle panel on the hero section</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								<div>
									<Label>Headline</Label>
									<Input
										value={hero.viewContent[view].headline}
										onChange={(e) => updateView(view, 'headline', e.target.value)}
									/>
								</div>
								<div>
									<Label>Bullets (one per line)</Label>
									<Textarea
										rows={4}
										value={hero.viewContent[view].bullets.join('\n')}
										onChange={(e) =>
											updateView(
												view,
												'bullets',
												e.target.value.split('\n').map((l) => l.trim()).filter(Boolean),
											)
										}
									/>
								</div>
							</CardContent>
						</Card>
					))}

					<Card>
						<CardHeader>
							<CardTitle>Expertise cards</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{hero.expertiseAreas.map((area, i) => (
								<div key={i} className="rounded-lg border p-3 space-y-2">
									<div className="grid gap-2 sm:grid-cols-2">
										<Input
											placeholder="Title"
											value={area.title}
											onChange={(e) => {
												const expertiseAreas = [...hero.expertiseAreas]
												expertiseAreas[i] = { ...area, title: e.target.value }
												setHero({ ...hero, expertiseAreas })
											}}
										/>
										<select
											className="flex h-10 rounded-md border border-input bg-background px-3 text-sm"
											value={area.icon}
											onChange={(e) => {
												const expertiseAreas = [...hero.expertiseAreas]
												expertiseAreas[i] = {
													...area,
													icon: e.target.value as HeroData['expertiseAreas'][0]['icon'],
												}
												setHero({ ...hero, expertiseAreas })
											}}
										>
											{['Shield', 'Server', 'Lock', 'Cloud'].map((icon) => (
												<option key={icon} value={icon}>
													{icon}
												</option>
											))}
										</select>
									</div>
									<Textarea
										rows={2}
										placeholder="Description"
										value={area.description}
										onChange={(e) => {
											const expertiseAreas = [...hero.expertiseAreas]
											expertiseAreas[i] = { ...area, description: e.target.value }
											setHero({ ...hero, expertiseAreas })
										}}
									/>
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
