"use client"
import { ReactNode } from "react"
import { ProfileCard } from "app/components/profile/profile-card"

export function PortfolioThemeProvider({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col-reverse md:flex-row md:space-x-6 space-y-6 md:space-y-0 lg:items-start max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 md:my-6">
      <div className="md:w-7/12 w-full">
        {children}
      </div>
      <div className="md:sticky pt-0 md:top-20 md:pr-0 md:overflow-hidden md:w-5/12 w-full">
        <ProfileCard />
      </div>
    </div>
  )
}
