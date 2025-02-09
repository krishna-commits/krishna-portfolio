"use client"
import { ThemeProvider as NoSideBarLayout } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function NoSideBarThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NoSideBarLayout {...props}>
        <div className="">
            {children}
        </div>
    </NoSideBarLayout>
}
