"use client"
import { ReactNode } from "react"

export function NoSideBarThemeProvider({ children }: { children: ReactNode }) {
    return <div className="">{children}</div>
}
