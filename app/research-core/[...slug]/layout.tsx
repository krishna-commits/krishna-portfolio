'use client'
import * as React from "react"
import { Separator } from "app/theme/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "app/theme/components/ui/sidebar"
import AppSidebar from "../components/app-sidebar"
import ResearchCoreBreadcrumb from "../components/breadcrumb"
import { usePathname } from 'next/navigation'

export default function Layout({ children }) {
  const pathname = usePathname()
    const firstSegment = pathname.split('/').filter(Boolean)[1]; // gets the second segment
    const lastSegment = pathname.split('/').filter(Boolean)[3];
    console.log('Extracted Segment:',  lastSegment);
  return (
    <SidebarProvider>
      <AppSidebar firstSegment={firstSegment} lastSegment={lastSegment}/>
      <SidebarInset>
        <header className="flex h-10 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <ResearchCoreBreadcrumb />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}


