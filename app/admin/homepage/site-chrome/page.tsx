'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card'
import { Button } from 'app/theme/components/ui/button'
import { Input } from 'app/theme/components/ui/input'
import { Label } from 'app/theme/components/ui/label'
import { Textarea } from 'app/theme/components/ui/textarea'
import { Globe, Loader2, Save } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { DEFAULT_SITE_CHROME, type SiteChromeConfig } from 'lib/site-chrome-config'

export default function SiteChromeAdminPage() {
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [chrome, setChrome] = useState<SiteChromeConfig>(DEFAULT_SITE_CHROME)

	const fetchData = useCallback(async () => {
		try {
			const res = await fetch('/api/admin/homepage/site-chrome')
			if (!res.ok) throw new Error('Failed to load')
			const data = await res.json()
			setChrome(data.chrome)
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
			const res = await fetch('/api/admin/homepage/site-chrome', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ chrome }),
			})
			if (!res.ok) throw new Error((await res.json()).error || 'Failed to save')
			toast.success('Site branding saved  header & footer update live')
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'Failed to save')
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
			<div className="max-w-2xl mx-auto px-4 py-8 lg:py-12">
				<Card>
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800">
								<Globe className="h-6 w-6 text-white" />
							</div>
							<div>
								<CardTitle>Site Branding</CardTitle>
								<CardDescription>Header logo text, footer copy, and copyright</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSave} className="space-y-4">
							<div>
								<Label>Site title (header / mobile nav)</Label>
								<Input value={chrome.siteTitle} onChange={(e) => setChrome({ ...chrome, siteTitle: e.target.value })} />
							</div>
							<div>
								<Label>Footer description</Label>
								<Textarea rows={3} value={chrome.footerDescription} onChange={(e) => setChrome({ ...chrome, footerDescription: e.target.value })} />
							</div>
							<div>
								<Label>Copyright name</Label>
								<Input value={chrome.copyrightText} onChange={(e) => setChrome({ ...chrome, copyrightText: e.target.value })} />
							</div>
							<div>
								<Label>&quot;Made with ♥ by&quot; name</Label>
								<Input value={chrome.madeWithName} onChange={(e) => setChrome({ ...chrome, madeWithName: e.target.value })} />
							</div>
							<Button type="submit" disabled={saving} className="gap-2">
								{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
								Save & publish
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
