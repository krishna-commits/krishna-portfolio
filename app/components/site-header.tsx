import Link from "next/link"


import { buttonVariants } from "app/theme/components/ui/button"

import { Navbar } from "./nav"
import { siteConfig } from "config/site"
import { Icons } from "app/theme/components/theme/icons"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  return (
    <header 
    // className="sticky top-0 z-40 w-full border-b bg-transparent"
    className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50"
    >
      <div className="container flex h-14 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Navbar className="mx-2"  />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-6">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.researchgate className="h-4 w-4 fill-current" />
                <span className="sr-only">researchgate</span>
              </div>
            </Link>

            <Link
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.instagram className="h-4 w-4 fill-current" />
                <span className="sr-only">instagram</span>
              </div>
            </Link>

            <Link
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.orcid className="h-4 w-4 fill-current" />
                <span className="sr-only">orcid</span>
              </div>
            </Link>
           
            <Link
              href={siteConfig.links.linkedIn}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.linkedIn className="h-4 w-4 fill-current" />
                <span className="sr-only">LinkedIn</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}