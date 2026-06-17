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

/** Form controls — matches theme tokens */
export const PAGE_INPUT =
	"w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"

export const PAGE_INPUT_LG =
	"block w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all sm:px-5 sm:py-4 sm:text-base"

export const PAGE_FILTER_ACTIVE =
	"rounded-lg border border-transparent bg-amber-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm dark:bg-amber-600"

export const PAGE_FILTER_INACTIVE =
	"rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
