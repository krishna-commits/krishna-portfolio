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
import { labelForResearchSegment } from "lib/research-labels"
import { useResearchCoreConfig } from "lib/hooks/use-research-core-config"

export default function ResearchCoreBreadcrumb() {
	const pathname = usePathname()
	const { config } = useResearchCoreConfig()
	const segments = pathname.split("/").filter(Boolean)

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{segments.map((segment, index) => {
					const isLast = index === segments.length - 1
					const href = `/${segments.slice(0, index + 1).join("/")}`
					const label = getPillarMeta(segment)?.title ?? labelForResearchSegment(segment, index, segments, config.segmentLabels)

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
