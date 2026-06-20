export const NAVIGATION_CONFIG_KEY = 'navigation_config'

export type NavIconName =
	| 'Home'
	| 'BookOpen'
	| 'GraduationCap'
	| 'Lightbulb'
	| 'FolderKanban'
	| 'Mail'
	| 'Code2'

export type NavLinkConfig = {
	path: string
	name: string
	description: string
	icon: NavIconName
	ariaLabel: string
	gradient: string
	isAnchor: boolean
	enabled: boolean
	showInDesktop: boolean
	showInMobile: boolean
}

export type NavigationConfig = {
	items: NavLinkConfig[]
}

export const DEFAULT_NAVIGATION_CONFIG: NavigationConfig = {
	items: [
		{
			path: '/',
			name: 'Home',
			description: 'Overview and introduction',
			icon: 'Home',
			ariaLabel: 'Navigate to home page',
			gradient: 'from-yellow-400 via-amber-500 to-yellow-600',
			isAnchor: false,
			enabled: true,
			showInDesktop: true,
			showInMobile: true,
		},
		{
			path: '/research-core',
			name: 'Research',
			description: 'Applied security research notes',
			icon: 'GraduationCap',
			ariaLabel: 'Navigate to research core page',
			gradient: 'from-red-500 via-orange-500 to-red-600',
			isAnchor: false,
			enabled: true,
			showInDesktop: true,
			showInMobile: true,
		},
		{
			path: '/projects',
			name: 'Projects',
			description: 'Portfolio showcase',
			icon: 'FolderKanban',
			ariaLabel: 'Navigate to projects page',
			gradient: 'from-yellow-500 to-amber-600',
			isAnchor: false,
			enabled: true,
			showInDesktop: true,
			showInMobile: true,
		},
		{
			path: '/blog',
			name: 'Blog',
			description: 'Articles and insights',
			icon: 'BookOpen',
			ariaLabel: 'Navigate to blog page',
			gradient: 'from-orange-500 via-red-500 to-orange-600',
			isAnchor: false,
			enabled: true,
			showInDesktop: true,
			showInMobile: true,
		},
		{
			path: '/codecanvas',
			name: 'Canvas',
			description: 'Technical projects and code',
			icon: 'Code2',
			ariaLabel: 'Navigate to code canvas page',
			gradient: 'from-blue-400 to-sky-500',
			isAnchor: false,
			enabled: true,
			showInDesktop: true,
			showInMobile: true,
		},
		{
			path: '/mantras',
			name: 'Mantras',
			description: 'Philosophy and principles',
			icon: 'Lightbulb',
			ariaLabel: 'Navigate to mantras page',
			gradient: 'from-blue-400 to-sky-500',
			isAnchor: false,
			enabled: true,
			showInDesktop: true,
			showInMobile: true,
		},
		{
			path: '/contact',
			name: 'Contact',
			description: 'Get in touch',
			icon: 'Mail',
			ariaLabel: 'Navigate to contact page',
			gradient: 'from-sky-400 to-blue-500',
			isAnchor: false,
			enabled: true,
			showInDesktop: true,
			showInMobile: true,
		},
	],
}

export function mergeNavigationConfig(partial?: Partial<NavigationConfig> | null): NavigationConfig {
	if (!partial?.items?.length) return DEFAULT_NAVIGATION_CONFIG
	return { items: partial.items }
}

export const NAV_ICON_OPTIONS: NavIconName[] = [
	'Home',
	'BookOpen',
	'GraduationCap',
	'Lightbulb',
	'FolderKanban',
	'Mail',
	'Code2',
]
