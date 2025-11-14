'use client';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Mail, MapPinned, Phone, Send, Shield, MessageSquare, Calendar, Briefcase, Globe, Linkedin, Github, ExternalLink, BookOpen, Sparkles, ArrowRight, Instagram, FileText, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { siteConfig } from 'config/site';
import { Button } from 'app/theme/components/ui/button';

type FormInput = {
  name: string;
  email: string;
  message: string;
  phone: string;
  company: string;
  country: string;
};

// Comprehensive list of country codes
const countryCodes = [
	{ code: '+1', country: 'US', name: 'United States' },
	{ code: '+1', country: 'CA', name: 'Canada' },
	{ code: '+44', country: 'GB', name: 'United Kingdom' },
	{ code: '+61', country: 'AU', name: 'Australia' },
	{ code: '+91', country: 'IN', name: 'India' },
	{ code: '+977', country: 'NP', name: 'Nepal' },
	{ code: '+86', country: 'CN', name: 'China' },
	{ code: '+81', country: 'JP', name: 'Japan' },
	{ code: '+82', country: 'KR', name: 'South Korea' },
	{ code: '+65', country: 'SG', name: 'Singapore' },
	{ code: '+60', country: 'MY', name: 'Malaysia' },
	{ code: '+66', country: 'TH', name: 'Thailand' },
	{ code: '+84', country: 'VN', name: 'Vietnam' },
	{ code: '+62', country: 'ID', name: 'Indonesia' },
	{ code: '+63', country: 'PH', name: 'Philippines' },
	{ code: '+49', country: 'DE', name: 'Germany' },
	{ code: '+33', country: 'FR', name: 'France' },
	{ code: '+39', country: 'IT', name: 'Italy' },
	{ code: '+34', country: 'ES', name: 'Spain' },
	{ code: '+31', country: 'NL', name: 'Netherlands' },
	{ code: '+32', country: 'BE', name: 'Belgium' },
	{ code: '+41', country: 'CH', name: 'Switzerland' },
	{ code: '+43', country: 'AT', name: 'Austria' },
	{ code: '+46', country: 'SE', name: 'Sweden' },
	{ code: '+47', country: 'NO', name: 'Norway' },
	{ code: '+45', country: 'DK', name: 'Denmark' },
	{ code: '+358', country: 'FI', name: 'Finland' },
	{ code: '+353', country: 'IE', name: 'Ireland' },
	{ code: '+351', country: 'PT', name: 'Portugal' },
	{ code: '+30', country: 'GR', name: 'Greece' },
	{ code: '+48', country: 'PL', name: 'Poland' },
	{ code: '+420', country: 'CZ', name: 'Czech Republic' },
	{ code: '+36', country: 'HU', name: 'Hungary' },
	{ code: '+40', country: 'RO', name: 'Romania' },
	{ code: '+7', country: 'RU', name: 'Russia' },
	{ code: '+380', country: 'UA', name: 'Ukraine' },
	{ code: '+52', country: 'MX', name: 'Mexico' },
	{ code: '+55', country: 'BR', name: 'Brazil' },
	{ code: '+54', country: 'AR', name: 'Argentina' },
	{ code: '+56', country: 'CL', name: 'Chile' },
	{ code: '+57', country: 'CO', name: 'Colombia' },
	{ code: '+51', country: 'PE', name: 'Peru' },
	{ code: '+27', country: 'ZA', name: 'South Africa' },
	{ code: '+20', country: 'EG', name: 'Egypt' },
	{ code: '+971', country: 'AE', name: 'United Arab Emirates' },
	{ code: '+966', country: 'SA', name: 'Saudi Arabia' },
	{ code: '+974', country: 'QA', name: 'Qatar' },
	{ code: '+965', country: 'KW', name: 'Kuwait' },
	{ code: '+973', country: 'BH', name: 'Bahrain' },
	{ code: '+968', country: 'OM', name: 'Oman' },
	{ code: '+972', country: 'IL', name: 'Israel' },
	{ code: '+90', country: 'TR', name: 'Turkey' },
	{ code: '+64', country: 'NZ', name: 'New Zealand' },
	{ code: '+234', country: 'NG', name: 'Nigeria' },
	{ code: '+254', country: 'KE', name: 'Kenya' },
	{ code: '+233', country: 'GH', name: 'Ghana' },
];

const contactMethods = [
	{
		icon: Mail,
		title: 'Email',
		description: 'Available upon request',
		gradient: 'from-blue-600 to-cyan-600',
		bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
		clickable: true,
	},
	{
		icon: Phone,
		title: 'Phone',
		description: 'Available upon request',
		gradient: 'from-emerald-600 to-teal-600',
		bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
		clickable: true,
	},
	{
		icon: MapPinned,
		title: 'Location',
		description: 'Kathmandu, Nepal',
		gradient: 'from-amber-600 to-orange-600',
		bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
		clickable: false,
	},
];

const socialLinks = [
	{ name: 'LinkedIn', url: siteConfig.links.linkedIn, icon: Linkedin, color: 'text-yellow-700 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
	{ name: 'GitHub', url: siteConfig.links.github, icon: Github, color: 'text-slate-700 dark:text-slate-300', bgColor: 'bg-slate-100 dark:bg-slate-800' },
	{ name: 'ResearchGate', url: siteConfig.links.researchgate, icon: BookOpen, color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
	{ name: 'ORCID', url: siteConfig.links.orcid, icon: ExternalLink, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
	{ name: 'Medium', url: siteConfig.links.medium, icon: FileText, color: 'text-slate-700 dark:text-slate-300', bgColor: 'bg-slate-100 dark:bg-slate-800' },
	{ name: 'Instagram', url: siteConfig.links.instagram, icon: Instagram, color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
];

const ctaButtons = [
	{ label: 'Schedule a Call', icon: Calendar, href: '/contact?type=call', gradient: 'from-blue-400 to-sky-500' },
	{ label: 'Interview Packet', icon: Briefcase, href: '/contact?type=interview', gradient: 'from-yellow-400 via-amber-500 to-yellow-600' },
	{ label: 'Collaboration', icon: Sparkles, href: '/contact?type=collaboration', gradient: 'from-orange-500 via-red-500 to-orange-600' },
];

export default function ContactUsForm() {
  const {
    register,
    handleSubmit,
		formState: { isSubmitting, errors },
    reset,
		setValue,
		watch,
	} = useForm<FormInput>({
		defaultValues: {
			country: '+977',
		}
	});

	const [submitted, setSubmitted] = useState(false);
	const [isCountryOpen, setIsCountryOpen] = useState(false);
	const [countrySearch, setCountrySearch] = useState('');
	const messageSectionRef = useRef<HTMLDivElement>(null);
	const countryDropdownRef = useRef<HTMLDivElement>(null);
	const selectedCountry = watch('country');

	// Scroll to message section
	const scrollToMessage = () => {
		messageSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	// Handle country code change
	const handleCountryChange = (code: string) => {
		setValue('country', code);
		setIsCountryOpen(false);
		setCountrySearch('');
	};

	// Get selected country display
	const getSelectedCountryDisplay = () => {
		const country = countryCodes.find(c => c.code === selectedCountry);
		return country ? country.code : selectedCountry;
	};

	const getSelectedCountryFull = () => {
		const country = countryCodes.find(c => c.code === selectedCountry);
		return country ? `${country.code} (${country.country})` : selectedCountry;
	};

	// Filter countries based on search
	const filteredCountries = countryCodes.filter(country =>
		country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
		country.code.includes(countrySearch) ||
		country.country.toLowerCase().includes(countrySearch.toLowerCase())
	);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
				setIsCountryOpen(false);
				setCountrySearch('');
			}
		};

		if (isCountryOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isCountryOpen]);

	// Handle hash navigation from other pages
	useEffect(() => {
		const handleHashScroll = () => {
			if (window.location.hash === '#send-a-message') {
				// Small delay to ensure the page is fully rendered
				setTimeout(() => {
					const element = document.getElementById('send-a-message');
					if (element) {
						element.scrollIntoView({ behavior: 'smooth', block: 'start' });
					}
				}, 300);
			}
		};

		// Check on mount
		handleHashScroll();

		// Also listen for hash changes
		window.addEventListener('hashchange', handleHashScroll);

		return () => {
			window.removeEventListener('hashchange', handleHashScroll);
		};
	}, []);

  async function onSubmit(formData: FormInput) {
		try {
			const response = await fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        phone: formData.phone,
        company: formData.company,
        country: formData.country,
      }),
			});

			if (response.ok) {
				toast.success('Message sent successfully!');
    reset();
				setSubmitted(true);
				setTimeout(() => setSubmitted(false), 5000);
			} else {
				toast.error('Failed to send message. Please try again.');
			}
		} catch (error) {
			toast.error('An error occurred. Please try again.');
		}
  }

  return (
		<main className="min-h-screen w-full bg-gradient-to-b from-white via-slate-50/30 to-white dark:from-slate-950 dark:via-slate-900/30 dark:to-slate-950">
			{/* Hero Section - Improved Spacing */}
			<section className="relative w-full pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 xl:pb-24 overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
				<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600" />
				
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 z-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-center mb-10 sm:mb-12 lg:mb-16"
					>
						<div className="inline-flex items-center gap-3 mb-5 sm:mb-6">
							<div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-blue-400 to-sky-500 shadow-xl">
								<MessageSquare className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
							</div>
							<div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-xl">
								<Shield className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
							</div>
						</div>
						<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight mb-5 sm:mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-100 dark:via-blue-200 dark:to-slate-100 bg-clip-text text-transparent px-2">
							Let's Connect
						</h1>
						<p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 font-medium max-w-4xl mx-auto leading-relaxed px-4">
							Ready to collaborate on your next DevSecOps project, discuss cybersecurity solutions, or explore research opportunities? Let's build something secure and scalable together.
						</p>
					</motion.div>

					{/* CTA Buttons - Improved Spacing */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4"
					>
						{ctaButtons.map((cta, idx) => {
							const Icon = cta.icon;
							return (
								<Link key={idx} href={cta.href} className="w-full sm:w-auto">
									<motion.div
										whileHover={{ scale: 1.05, y: -3 }}
										whileTap={{ scale: 0.95 }}
										className="w-full"
									>
										<Button className={`w-full sm:w-auto bg-gradient-to-r ${cta.gradient} text-white border-0 shadow-xl hover:shadow-2xl px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold justify-center transition-all duration-300`}>
											<Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2.5" />
											{cta.label}
											<ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2.5" />
										</Button>
									</motion.div>
								</Link>
							);
						})}
					</motion.div>
				</div>
			</section>

			{/* Main Content - Enhanced Spacing */}
			<section className="relative w-full py-12 sm:py-16 lg:py-20 xl:py-24">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
						{/* Left Column: Contact Info & Social */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="lg:col-span-4 space-y-6 sm:space-y-8"
						>
							{/* Contact Methods */}
							<div className="relative overflow-hidden rounded-2xl border-2 border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 p-6 sm:p-7 lg:p-8 shadow-xl">
								<div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600" />
								<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
								
								<div className="relative space-y-5 sm:space-y-6">
									<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1">
										Get In Touch
									</h2>
									{contactMethods.map((method, idx) => {
										const Icon = method.icon;
										return (
											<motion.div
												key={idx}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.4 + idx * 0.1 }}
												whileHover={{ x: 5, scale: 1.02 }}
												className={`flex items-start gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl bg-gradient-to-br ${method.bgGradient} border-2 border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all ${
													method.clickable ? 'cursor-pointer group' : ''
												}`}
												onClick={method.clickable ? (e) => {
													e.preventDefault();
													scrollToMessage();
												} : undefined}
											>
												<div className={`p-3 sm:p-3.5 rounded-xl bg-gradient-to-br ${method.gradient} shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
													<Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
												</div>
												<div className="flex-1 min-w-0 pt-0.5">
													<p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50 mb-1">{method.title}</p>
													{method.clickable ? (
														<button
															onClick={(e) => {
																e.stopPropagation();
																scrollToMessage();
															}}
															className="group/link flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-all"
														>
															<span className="hover:underline">Available upon request</span>
															<ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover/link:translate-x-1.5 flex-shrink-0" />
														</button>
													) : (
														<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{method.description}</p>
													)}
												</div>
											</motion.div>
										);
									})}
								</div>
							</div>

							{/* Social Links */}
							<div className="relative overflow-hidden rounded-2xl border-2 border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 p-6 sm:p-7 lg:p-8 shadow-xl">
								<div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-amber-500 via-orange-500 via-red-500 to-blue-400" />
								<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
								
								<div className="relative">
									<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-5 sm:mb-6">
										Connect Socially
									</h2>
									<div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
										{socialLinks.map((social, idx) => {
											const Icon = social.icon;
											return (
												<Link
													key={idx}
													href={social.url}
													target="_blank"
													rel="noopener noreferrer"
													className="block"
												>
													<motion.div
														whileHover={{ scale: 1.08, y: -3 }}
														whileTap={{ scale: 0.95 }}
														className={`flex flex-col items-center gap-2 sm:gap-2.5 p-4 sm:p-5 rounded-xl ${social.bgColor} hover:opacity-90 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-md hover:shadow-lg`}
													>
														<Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${social.color}`} />
														<span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">{social.name}</span>
													</motion.div>
												</Link>
											);
										})}
									</div>
								</div>
							</div>
						</motion.div>

						{/* Right Column: Contact Form */}
						<motion.div
							ref={messageSectionRef}
							id="send-a-message"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="lg:col-span-8 scroll-mt-20 sm:scroll-mt-24"
						>
							<div className="relative overflow-hidden rounded-2xl border-2 border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl">
								{/* Background Pattern */}
								<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
								<div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600" />
								
								<div className="relative space-y-7 sm:space-y-8 lg:space-y-10">
									<div className="space-y-3">
										<div className="flex items-center gap-3 sm:gap-4">
											<div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg">
												<Send className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
											</div>
											<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50">
												Send a Message
											</h2>
										</div>
										<p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 ml-0 sm:ml-14 leading-relaxed">
											Fill out the form below and I'll get back to you within 24 hours. All fields marked with * are required.
										</p>
									</div>

									<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-7 lg:space-y-8">
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
											<div className="sm:col-span-1">
												<label htmlFor="your-name" className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50 mb-2.5 sm:mb-3">
													<Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
													Your Name *
            </label>
            <input
													id="your-name"
													className="block w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 sm:px-5 py-3.5 sm:py-4 text-sm sm:text-base text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm"
              type='text'
													placeholder='John Doe'
              required
													{...register('name', { required: 'Name is required' })}
            />
												{errors.name && (
													<p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">{errors.name.message}</p>
												)}
          </div>

											<div className="sm:col-span-1">
												<label htmlFor="email" className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50 mb-2.5 sm:mb-3">
													<Mail className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
													Email Address *
            </label>
            <input
													id="email"
													className="block w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 sm:px-5 py-3.5 sm:py-4 text-sm sm:text-base text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm"
              type='email'
													placeholder='john@example.com'
              required
													{...register('email', {
														required: 'Email is required',
														pattern: {
															value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
															message: 'Invalid email address'
														}
													})}
												/>
												{errors.email && (
													<p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">{errors.email.message}</p>
												)}
          </div>

											<div className="sm:col-span-1">
												<label htmlFor="phone-number" className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50 mb-2.5 sm:mb-3">
													<Phone className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
													Phone Number
            </label>
												<div className="relative" ref={countryDropdownRef}>
													<div className="absolute inset-y-0 left-0 flex items-center z-10">
														<div className="relative">
															<button
																type="button"
																onClick={(e) => {
																	e.preventDefault();
																	setIsCountryOpen(!isCountryOpen);
																}}
																className="h-full rounded-l-xl border-0 border-r-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 py-0 pl-3 sm:pl-4 pr-6 sm:pr-8 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all flex items-center gap-2"
																style={{ minWidth: '85px', maxWidth: '110px' }}
															>
																<span className="font-mono truncate">{getSelectedCountryDisplay()}</span>
																<ChevronDown className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-200 flex-shrink-0 ${isCountryOpen ? 'rotate-180' : ''}`} />
															</button>
															{isCountryOpen && (
																<motion.div
																	initial={{ opacity: 0, y: -10 }}
																	animate={{ opacity: 1, y: 0 }}
																	exit={{ opacity: 0, y: -10 }}
																	className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 lg:w-96 max-w-[calc(100vw-2rem)] sm:max-w-none max-h-[60vh] sm:max-h-72 overflow-hidden bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50"
																>
																	<div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
																		<input
																			type="text"
																			placeholder="Search country or code..."
																			value={countrySearch}
																			onChange={(e) => setCountrySearch(e.target.value)}
																			className="w-full px-3 sm:px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
																			onClick={(e) => e.stopPropagation()}
																			autoFocus
																		/>
																	</div>
																	<div className="max-h-56 overflow-y-auto custom-scrollbar">
																		{filteredCountries.length > 0 ? (
																			filteredCountries.map((country, idx) => (
																				<button
																					key={`${country.country}-${idx}`}
																					type="button"
																					onClick={() => handleCountryChange(country.code)}
																					className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 ${
																						selectedCountry === country.code 
																							? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 font-bold' 
																							: ''
																					}`}
																				>
																					<div className="flex items-center justify-between gap-2 sm:gap-3">
																						<div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
																							<span className="font-mono font-bold text-blue-600 dark:text-blue-400 w-12 sm:w-14 flex-shrink-0">
																								{country.code}
																							</span>
																							<span className="text-slate-900 dark:text-slate-50 truncate">{country.name}</span>
																						</div>
																						<span className="text-xs text-slate-400 dark:text-slate-500 font-semibold flex-shrink-0">
																							{country.country}
																						</span>
																					</div>
																				</button>
																			))
																		) : (
																			<div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
																				No countries found
																			</div>
																		)}
																	</div>
																</motion.div>
															)}
														</div>
              </div>
              <input
                type="tel"
														id="phone-number"
                autoComplete="tel"
                {...register('phone')}
														className="block w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 sm:px-5 py-3.5 sm:py-4 pl-24 sm:pl-28 md:pl-32 text-sm sm:text-base text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm"
														placeholder="Phone number (optional)"
              />
            </div>
												<p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-500">
													Optional - Include if you prefer a call back
												</p>
          </div>

											<div className="sm:col-span-1">
												<label htmlFor="company" className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50 mb-2.5 sm:mb-3">
													<Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
													Company / Organization
            </label>
              <input
                {...register('company')}
                type="text"
                name="company"
                id="company"
                autoComplete="organization"
													className="block w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 sm:px-5 py-3.5 sm:py-4 text-sm sm:text-base text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm"
													placeholder="Your company (optional)"
              />
												<p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-500">
													Optional - Helps me understand context
												</p>
            </div>
          </div>

										<div>
											<label htmlFor="message" className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50 mb-2.5 sm:mb-3">
												<MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
												Message *
											</label>
            <textarea
												id="message"
												className="block w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 sm:px-5 py-3.5 sm:py-4 text-sm sm:text-base text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all resize-none shadow-sm"
												placeholder='Tell me about your project, question, or how we can collaborate. Be as detailed as possible...'
												rows={8}
              required
												{...register('message', { 
													required: 'Message is required', 
													minLength: { value: 20, message: 'Message must be at least 20 characters' },
													maxLength: { value: 2000, message: 'Message must be less than 2000 characters' }
												})}
											/>
											<div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mt-3">
												{errors.message ? (
													<p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">{errors.message.message}</p>
												) : (
													<p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">
														Minimum 20 characters required
													</p>
												)}
												<p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500 font-medium">
													{watch('message')?.length || 0} / 2000
												</p>
											</div>
          </div>

										<div className="space-y-4 pt-2">
											{isSubmitting ? (
              <button
              disabled
													className="flex justify-center items-center space-x-3 w-full rounded-xl bg-slate-400 px-6 sm:px-8 py-4 sm:py-5 text-center text-sm sm:text-base font-bold text-white shadow-sm cursor-not-allowed"
												>
													<Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
													<span>Sending Message...</span>
            </button>
											) : (
												<motion.button
            type="submit"
													whileHover={{ scale: 1.02, y: -2 }}
													whileTap={{ scale: 0.98 }}
													className="flex items-center justify-center gap-3 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 sm:px-8 py-4 sm:py-5 text-center text-sm sm:text-base font-bold text-white shadow-xl hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300"
												>
													<Send className="h-5 w-5 sm:h-6 sm:w-6" />
													Send Message
												</motion.button>
											)}

											{submitted && (
												<motion.div
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													className="flex items-start sm:items-center gap-3 p-4 sm:p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800"
												>
													<CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
													<div>
														<p className="text-sm sm:text-base font-bold text-emerald-900 dark:text-emerald-100">Message Sent Successfully!</p>
														<p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 mt-1">
															I'll get back to you within 24 hours. Thank you for reaching out!
														</p>
          </div>
												</motion.div>
											)}
        </div>
      </form>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>
    </main>
  );
}
