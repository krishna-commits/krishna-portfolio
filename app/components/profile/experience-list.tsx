import { Badge } from "app/theme/components/ui/badge"
import { Button } from "app/theme/components/ui/button"
import { siteConfig } from "config/site"
import Link from "next/link"

export interface WorkExperienceItem {
  imageUrl?: string
  organization: string
  time: string
  role: string
  url?: string
  description?: string
  course?: string
}

export interface SiteConfig {
  work_experience: WorkExperienceItem[]
}

function formatWorkUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export default function ExperienceList() {
  const items = siteConfig.work_experience

  return (
    <ul role="list">
      {items.length !== 0 && items.map((item: WorkExperienceItem, index: number) => (
        <div key={`${item.organization}-${index}`}>
          <li className={`flex justify-between gap-x-4 py-3 ${index === items.length - 1 ? '' : 'border-b'}`}>
            <div className="flex min-w-0 gap-x-5">
              {item.imageUrl ? (
                <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={item.imageUrl} alt="" />
              ) : null}
              <div className="min-w-0 flex-auto">
                <div className="flex gap-2">
                  <p className="text-sm font-semibold leading-6 dark:text-slate-300">{item.organization}</p>
                  <Badge variant="outline">{item.time}</Badge>
                </div>
                <p className="truncate text-xs leading-5 dark:text-slate-500">{item.role}</p>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-xs leading-5 text-cyan-700 dark:text-cyan-500 italic hover:underline"
                  >
                    {formatWorkUrl(item.url)}
                  </a>
                ) : null}
              </div>
            </div>
          </li>
        </div>
      ))}
      {items.length === 0 ? (
        <Button variant="outline" className="text-slate-600 w-full" asChild>
          <Link href="/contact#send-a-message">Available Upon Request</Link>
        </Button>
      ) : (
        <Button variant="outline" className="text-slate-600 w-full mt-2" asChild>
          <Link href="/contact#send-a-message">Available Upon Request</Link>
        </Button>
      )}
    </ul>
  )
}
