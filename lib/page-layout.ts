/**
 * Shared page shell — matches home section rhythm (padding, width, cards).
 * Use these on marketing routes (blog, contact, projects, etc.).
 */

export const pageGutter = "px-4 sm:px-6 lg:px-8"

export const pageSectionY = "py-12 md:py-16"

/** Horizontal centering only (no vertical padding) — hero + stacked sections */
export const PAGE_CONTAINER = `w-full mx-auto ${pageGutter} max-w-7xl`

/** Full-width content band (e.g. projects, mantras) */
export const PAGE_SHELL_WIDE = `w-full mx-auto ${pageGutter} max-w-7xl ${pageSectionY}`

/** Reading-width (blog index) */
export const PAGE_SHELL_MD = `w-full mx-auto ${pageGutter} max-w-4xl ${pageSectionY}`

/** Narrow prose (privacy, legal) */
export const PAGE_SHELL_NARROW = `w-full mx-auto ${pageGutter} max-w-3xl ${pageSectionY}`

export const PAGE_ICON_CHIP =
	"inline-flex items-center justify-center rounded-xl border border-border bg-muted p-2.5 text-foreground"

export const PAGE_H1 = "text-3xl sm:text-4xl font-semibold tracking-tight text-foreground"

export const PAGE_LEAD = "text-sm sm:text-base text-muted-foreground max-w-prose leading-relaxed"

export const PAGE_CARD = "rounded-2xl border border-border bg-card shadow-sm"
