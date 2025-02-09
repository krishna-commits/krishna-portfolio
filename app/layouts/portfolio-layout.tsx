"use client"
import { ThemeProvider as PortfolioLayout } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { ProfileCard } from "app/components/profile/profile-card"

export function PortfolioThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <PortfolioLayout {...props}>
    <div className="flex flex-col-reverse md:flex-row md:space-x-6 space-y-6 md:space-y-0 lg:items-start max-w-5xl mx-6 md:my-6 md:mx-auto">
      <div className="md:w-7/12">
        {children}
      </div>
      <div className="md:sticky pt-0 md:top-14 md:pr-0 md:overflow-hidden md:w-5/12">
      <ProfileCard />
      </div>
    </div>
  </PortfolioLayout>
}
