"use client"

import { usePathname } from "next/navigation"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "app/theme/components/ui/breadcrumb"
import { getPillarMeta } from "lib/research-pillars"

function labelForSegment(segment: string, index: number, segments: string[]) {
	if (segment === "research-core") return "Research Core"
	const pillar = getPillarMeta(segment)
	if (pillar) return pillar.title
	if (segment === "introduction") return "Overview"
	if (segment.startsWith("Chapter")) return segment.replace(/-/g, " ")
	if (index === segments.length - 1) return segment.replace(/-/g, " ")
	return segment.replace(/-/g, " ")
}

export default function ResearchCoreBreadcrumb() {
	const pathname = usePathname()
	const segments = pathname.split("/").filter(Boolean)

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{segments.map((segment, index) => {
					const isLast = index === segments.length - 1
					const href = `/${segments.slice(0, index + 1).join("/")}`
					const label = labelForSegment(segment, index, segments)

					return (
						<div className="flex items-center space-x-2" key={`${segment}-${index}`}>
							<BreadcrumbItem className="hidden md:block">
								{isLast ? (
									<BreadcrumbPage className="capitalize">{label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink href={href} className="capitalize">
										{label}
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{!isLast && <BreadcrumbSeparator className="hidden md:block" />}
						</div>
					)
				})}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
