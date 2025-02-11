
import * as React from "react"
import { BookText, ChevronRight, ScrollText,LibraryBig } from "lucide-react"
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
    SidebarMenuLink,
    SidebarMenuSub,
    SidebarRail,
} from "app/theme/components/ui/sidebar"
import { allMantras, Mantras } from "contentlayer/generated"
import Link from "next/link"
import { cn } from "app/theme/lib/utils"


export default function AppSidebar({ firstSegment,lastSegment,...props }:{ firstSegment: string ; lastSegment: string} &  React.ComponentProps<typeof Sidebar>) {

      const sortedItems = allMantras
      .filter((Mantras: Mantras) => Mantras.url.includes(firstSegment))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return (
        <Sidebar {...props} >
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="">{sortedItems && sortedItems.length != 0 && sortedItems[0].title}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sortedItems.map((item, index) => (
                                item.parent !== null && item.grand_parent == null &&
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
                                                {sortedItems.map((child, idx) => (
                                                    child.parent === item.title && (
                                                        <SidebarMenuItem key={idx} >
                                                           
                                                            <Link  href={child.url} className={cn(
                                                                "flex   w-full items-center px-3 gap-2 overflow-hidden rounded-md py-1 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
                                                                child.url.includes(lastSegment) && "bg-sidebar-accent font-semibold"
                                                               
                                                            )}>
                                                                {child.url.includes(lastSegment) ? <span className="flex w-2 h-2 mx-1 bg-cyan-500 rounded-full"></span> : <ScrollText />}
                                                                
                                                                <p>{child.title}</p>

                      
                                                            </Link>
                                                      
                                                          
                                                        </SidebarMenuItem>
                                                    )
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}