import { Badge } from "app/theme/components/ui/badge"
import { Button } from "app/theme/components/ui/button";
import { siteConfig } from "config/site";
import Link from "next/link";

export default function ExperienceList() {
    return (
      <ul role="list">
        {siteConfig.work_experience.map((item, index) => (
          <div key={item.course}>
            <li className={`flex justify-between gap-x-4 py-3 ${index === siteConfig.work_experience.length - 1 ? '' : 'border-b'}`}>
              <div className="flex min-w-0 gap-x-5">
                <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={item.imageUrl} alt="" />
                <div className="min-w-0 flex-auto">
                  <div className="flex gap-2">
                    <p className="text-sm font-semibold leading-6 dark:text-slate-300">{item.organization}</p>
                    <Badge variant="outline">{item.time}</Badge>
                  </div>
                  <p className="truncate text-xs leading-5 dark:text-slate-500">{item.role}</p>
                  <a href={item.url} className="truncate text-xs leading-5 text-cyan-700 dark:text-cyan-500 italic hover:underline">{item.url}</a>
                </div>
              </div>
            </li>
          </div>
        ))}
        {
          siteConfig.work_experience.length == 0 &&
          <Button variant="outline" className="text-slate-600 w-full" asChild>
          <Link href="/contact">Available Upon Request</Link>
        </Button>
        }
      </ul>
    );
  }
  
