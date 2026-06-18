'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card'
import { Button } from 'app/theme/components/ui/button'
import { Input } from 'app/theme/components/ui/input'
import { Label } from 'app/theme/components/ui/label'
import { Textarea } from 'app/theme/components/ui/textarea'
import { Mail, Loader2, Save } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { DEFAULT_CONTACT_PAGE, type ContactPageConfig } from 'lib/contact-page-config'

export default function ContactPageAdmin() {
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [contact, setContact] = useState<ContactPageConfig>(DEFAULT_CONTACT_PAGE)

	const fetchData = useCallback(async () => {
		try {
			const res = await fetch('/api/admin/homepage/contact')
			if (!res.ok) throw new Error('Failed to load')
			const data = await res.json()
			setContact(data.contact)
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
			const res = await fetch('/api/admin/homepage/contact', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ contact }),
			})
			if (!res.ok) throw new Error((await res.json()).error || 'Failed to save')
			toast.success('Contact page copy saved')
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
							<div className="p-2 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600">
								<Mail className="h-6 w-6 text-white" />
							</div>
							<div>
								<CardTitle>Contact Page</CardTitle>
								<CardDescription>Headlines and contact method descriptions on /contact</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSave} className="space-y-4">
							<div>
								<Label>Page title</Label>
								<Input value={contact.pageTitle} onChange={(e) => setContact({ ...contact, pageTitle: e.target.value })} />
							</div>
							<div>
								<Label>Page lead</Label>
								<Textarea rows={2} value={contact.pageLead} onChange={(e) => setContact({ ...contact, pageLead: e.target.value })} />
							</div>
							<div>
								<Label>Location</Label>
								<Input value={contact.location} onChange={(e) => setContact({ ...contact, location: e.target.value })} />
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<div>
									<Label>Email description</Label>
									<Input value={contact.emailDescription} onChange={(e) => setContact({ ...contact, emailDescription: e.target.value })} />
								</div>
								<div>
									<Label>Phone description</Label>
									<Input value={contact.phoneDescription} onChange={(e) => setContact({ ...contact, phoneDescription: e.target.value })} />
								</div>
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
