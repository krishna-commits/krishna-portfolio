'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card'
import { Button } from 'app/theme/components/ui/button'
import { Input } from 'app/theme/components/ui/input'
import { Label } from 'app/theme/components/ui/label'
import { Textarea } from 'app/theme/components/ui/textarea'
import { Badge } from 'app/theme/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from 'app/theme/components/ui/dialog'
import { Heart, Plus, Edit, Trash2, Upload, X, Loader2, Check, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'
import { cn } from 'app/theme/lib/utils'

interface Hobby {
	id: number
	title: string
	description: string | null
	image_url: string
	order_index: number
	is_active: boolean
	created_at: string
	updated_at: string
}

export default function HobbiesAdminPage() {
	const [hobbies, setHobbies] = useState<Hobby[]>([])
	const [loading, setLoading] = useState(true)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [editingHobby, setEditingHobby] = useState<Hobby | null>(null)
	const [uploading, setUploading] = useState(false)
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		image_url: '',
		order_index: 0,
		is_active: true,
	})

	useEffect(() => {
		fetchHobbies()
	}, [])

	const fetchHobbies = async () => {
		try {
			setLoading(true)
			const response = await fetch('/api/hobbies?includeInactive=true')
			const data = await response.json()
			setHobbies(data.hobbies || [])
		} catch (error) {
			toast.error('Failed to load hobbies')
			console.error('Error fetching hobbies:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleFileUpload = async (file: File) => {
		try {
			setUploading(true)
			const formData = new FormData()
			formData.append('file', file)

			const response = await fetch('/api/hobbies/upload', {
				method: 'POST',
				body: formData,
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Upload failed')
			}

			setFormData(prev => ({ ...prev, image_url: data.url }))
			toast.success('Image uploaded successfully')
		} catch (error: any) {
			toast.error(error.message || 'Failed to upload image')
			console.error('Error uploading file:', error)
		} finally {
			setUploading(false)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			const url = editingHobby
				? `/api/hobbies/${editingHobby.id}`
				: '/api/hobbies'
			const method = editingHobby ? 'PUT' : 'POST'

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...formData,
					description: formData.description || null,
					order_index: parseInt(formData.order_index.toString()) || 0,
				}),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to save hobby')
			}

			toast.success(editingHobby ? 'Hobby updated successfully' : 'Hobby created successfully')
			setIsDialogOpen(false)
			resetForm()
			fetchHobbies()
		} catch (error: any) {
			toast.error(error.message || 'Failed to save hobby')
			console.error('Error saving hobby:', error)
		}
	}

	const handleEdit = (hobby: Hobby) => {
		setEditingHobby(hobby)
		setFormData({
			title: hobby.title,
			description: hobby.description || '',
			image_url: hobby.image_url,
			order_index: hobby.order_index,
			is_active: hobby.is_active,
		})
		setIsDialogOpen(true)
	}

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this hobby?')) {
			return
		}

		try {
			const response = await fetch(`/api/hobbies/${id}`, {
				method: 'DELETE',
			})

			if (!response.ok) {
				throw new Error('Failed to delete hobby')
			}

			toast.success('Hobby deleted successfully')
			fetchHobbies()
		} catch (error: any) {
			toast.error(error.message || 'Failed to delete hobby')
			console.error('Error deleting hobby:', error)
		}
	}

	const resetForm = () => {
		setFormData({
			title: '',
			description: '',
			image_url: '',
			order_index: 0,
			is_active: true,
		})
		setEditingHobby(null)
	}

	const handleDialogClose = () => {
		setIsDialogOpen(false)
		resetForm()
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400 mx-auto mb-4" />
					<p className="text-slate-600 dark:text-slate-400">Loading hobbies...</p>
				</div>
			</div>
		)
	}

	return (
		<>
			<Toaster position="top-right" />
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
				{/* Header */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
							Hobbies Management
						</h1>
						<p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
							Manage your hobbies and photos
						</p>
					</div>
					<Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
						<DialogTrigger asChild>
							<Button
								onClick={() => {
									resetForm()
									setIsDialogOpen(true)
								}}
								className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
							>
								<Plus className="h-4 w-4 mr-2" />
								Add Hobby
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
							<DialogHeader>
								<DialogTitle>
									{editingHobby ? 'Edit Hobby' : 'Add New Hobby'}
								</DialogTitle>
								<DialogDescription>
									{editingHobby ? 'Update hobby information' : 'Add a new hobby with photo'}
								</DialogDescription>
							</DialogHeader>
							<form onSubmit={handleSubmit} className="space-y-4">
								{/* Title */}
								<div>
									<Label htmlFor="title">Title *</Label>
									<Input
										id="title"
										value={formData.title}
										onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
										placeholder="e.g., Photography, Travel, Reading"
										required
									/>
								</div>

								{/* Description */}
								<div>
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										value={formData.description}
										onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
										placeholder="Brief description of the hobby"
										rows={3}
									/>
								</div>

								{/* Image Upload */}
								<div>
									<Label htmlFor="image">Image *</Label>
									<div className="space-y-2">
										{formData.image_url && (
											<div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-800">
												<Image
													src={formData.image_url}
													alt="Preview"
													fill
													className="object-cover"
												/>
												<button
													type="button"
													onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
													className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
												>
													<X className="h-3 w-3" />
												</button>
											</div>
										)}
										<div className="flex items-center gap-2">
											<Label
												htmlFor="file-upload"
												className={cn(
													"cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-600 transition-colors",
													uploading && "opacity-50 cursor-not-allowed"
												)}
											>
												{uploading ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<Upload className="h-4 w-4" />
												)}
												<span className="text-sm">
													{uploading ? 'Uploading...' : 'Upload Image'}
												</span>
											</Label>
											<input
												id="file-upload"
												type="file"
												accept="image/*"
												className="hidden"
												disabled={uploading}
												onChange={(e) => {
													const file = e.target.files?.[0]
													if (file) {
														handleFileUpload(file)
													}
												}}
											/>
										</div>
										<p className="text-xs text-slate-500 dark:text-slate-400">
											Max file size: 5MB. Supported formats: JPEG, PNG, WebP, GIF
										</p>
									</div>
								</div>

								{/* Order Index */}
								<div>
									<Label htmlFor="order_index">Order Index</Label>
									<Input
										id="order_index"
										type="number"
										value={formData.order_index}
										onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
										placeholder="0"
										min="0"
									/>
									<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
										Lower numbers appear first
									</p>
								</div>

								{/* Is Active */}
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										id="is_active"
										checked={formData.is_active}
										onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
										className="rounded border-slate-300 dark:border-slate-700"
									/>
									<Label htmlFor="is_active" className="cursor-pointer">
										Active (visible on homepage)
									</Label>
								</div>

								{/* Submit Button */}
								<div className="flex justify-end gap-2 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={handleDialogClose}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										disabled={!formData.title || !formData.image_url || uploading}
										className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
									>
										{editingHobby ? 'Update' : 'Create'}
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Hobbies Grid */}
			{hobbies.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center">
						<Heart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
						<p className="text-slate-600 dark:text-slate-400 mb-4">
							No hobbies yet. Add your first hobby!
						</p>
						<Button
							onClick={() => {
								resetForm()
								setIsDialogOpen(true)
							}}
							className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Hobby
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
					{hobbies.map((hobby) => (
						<Card key={hobby.id} className="overflow-hidden">
							<div className="relative aspect-square">
								<Image
									src={hobby.image_url}
									alt={hobby.title}
									fill
									className="object-cover"
								/>
								{!hobby.is_active && (
									<div className="absolute top-2 right-2">
										<Badge variant="secondary" className="bg-slate-500">
											Inactive
										</Badge>
									</div>
								)}
							</div>
							<CardHeader>
								<CardTitle className="text-base">{hobby.title}</CardTitle>
								{hobby.description && (
									<CardDescription className="text-xs line-clamp-2">
										{hobby.description}
									</CardDescription>
								)}
								<div className="flex items-center gap-2 mt-2">
									<Badge variant="outline" className="text-xs">
										Order: {hobby.order_index}
									</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEdit(hobby)}
										className="flex-1"
									>
										<Edit className="h-3 w-3 mr-1" />
										Edit
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleDelete(hobby.id)}
										className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
									>
										<Trash2 className="h-3 w-3" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
			</main>
		</>
	)
}

