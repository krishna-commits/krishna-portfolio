import * as React from "react"

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
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "app/theme/components/ui/sidebar"
import { Calendar, Home, Inbox, Search, Github, Phone, Shapes, Volume2 ,Rss } from "lucide-react"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} collapsible="closed" >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
          <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="border-b">
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className=" text-2xl"/>
                      <span className="text-md font-semibold">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
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


// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Code Canvas",
    url: "/codecanvas",
    icon: Github,
  },
  {
    title: "Blog",
    url: "/blog",
    icon: Rss,
  },
  {
    title: "Research Core",
    url: "/research-core",
    icon: Search,
  },
  {
    title: "Mantras",
    url: "/mantras",
    icon: Volume2,
  },
  // {
  //   title: "Skill Lab",
  //   url: "/skill-lab",
  //   icon: Shapes,
  // },
  {
    title: "Contact",
    url: "/contact",
    icon: Phone,
  },
]
 