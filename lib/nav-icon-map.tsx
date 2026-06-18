'use client'

import {
	Home,
	BookOpen,
	GraduationCap,
	Lightbulb,
	FolderKanban,
	Mail,
	Code2,
	type LucideIcon,
} from 'lucide-react'
import type { NavIconName } from 'lib/navigation-config'

export const NAV_ICON_MAP: Record<NavIconName, LucideIcon> = {
	Home,
	BookOpen,
	GraduationCap,
	Lightbulb,
	FolderKanban,
	Mail,
	Code2,
}

export function getNavIcon(name: NavIconName): LucideIcon {
	return NAV_ICON_MAP[name] ?? Home
}
