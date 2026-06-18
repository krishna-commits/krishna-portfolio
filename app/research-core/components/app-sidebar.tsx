'use client'

import * as React from "react"
import { BookText, ChevronRight, ScrollText } from "lucide-react"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "app/theme/components/ui/collapsible"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarRail,
} from "app/theme/components/ui/sidebar"
import { allResearchCores, ResearchCore } from "contentlayer/generated"
import Link from "next/link"
import { cn } from "app/theme/lib/utils"
import { getPillarMeta } from "lib/research-pillars"

export default function AppSidebar({
	contentPrefix,
	lastSegment,
	...props
}: { contentPrefix: string; lastSegment: string } & React.ComponentProps<typeof Sidebar>) {
	const sortedItems = allResearchCores
		.filter((researchcore: ResearchCore) =>
			researchcore.slugAsParams.startsWith(contentPrefix),
		)
		.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

	const pillarSlug = contentPrefix.split("/")[0]
	const pillarMeta = getPillarMeta(pillarSlug)
	const topicIntro = sortedItems.find(
		(item) =>
			item.slugAsParams === `${contentPrefix}/introduction` ||
			(item.parent == null && item.grand_parent == null && item.slugAsParams.endsWith("/introduction")),
	)
	const sidebarTitle =
		topicIntro?.title || pillarMeta?.title || sortedItems[0]?.title || "Research"

	return (
		<Sidebar {...props}>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{sidebarTitle}</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{sortedItems.map(
								(item, index) =>
									item.parent !== null &&
									item.grand_parent == null && (
										<SidebarMenuItem key={index}>
											<Collapsible className="group/collapsible" defaultOpen={true}>
												<CollapsibleTrigger asChild>
													<SidebarMenuButton size={"lg"}>
														<ChevronRight className="transition-transform" />
														<BookText />
														{item.title}
													</SidebarMenuButton>
												</CollapsibleTrigger>
												<CollapsibleContent className="mt-3">
													<SidebarMenuSub>
														{sortedItems.map(
															(child, idx) =>
																child.parent === item.title && (
																	<SidebarMenuItem key={idx}>
																		<Link
																			href={child.url}
																			className={cn(
																				"flex w-full items-center gap-2 overflow-hidden rounded-md px-3 py-1 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2",
																				child.url.includes(lastSegment) &&
																					"bg-sidebar-accent font-semibold",
																			)}
																		>
																			{child.url.includes(lastSegment) ? (
																				<span className="mx-1 flex h-2 w-2 rounded-full bg-amber-500" />
																			) : (
																				<ScrollText className="h-4 w-4 shrink-0" />
																			)}
																			<p>{child.title}</p>
																		</Link>
																	</SidebarMenuItem>
																),
														)}
													</SidebarMenuSub>
												</CollapsibleContent>
											</Collapsible>
										</SidebarMenuItem>
									),
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}
