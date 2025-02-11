import { Badge } from "app/theme/components/ui/badge"
import { Button } from "app/theme/components/ui/button";
import { siteConfig } from "config/site";
import Link from "next/link";

export interface EducationItem {
  imageUrl: string;
  organization: string;
  time: string;
  course: string;
  university: string;
}

export interface SiteConfig {
  education: EducationItem[];
}

export default function EducationList(): JSX.Element {
    return (
      <ul role="list">
        {siteConfig.education.length !== 0 &&  siteConfig.education.map((item: EducationItem, index: number) => (
          <div key={index}>
            <li className={`flex justify-between gap-x-4 py-3 ${index === siteConfig.education.length - 1 ? '' : 'border-b'}`}>
              <div className="flex min-w-0 w-full space-x-4 justify-center items-center">
                <img className="h-14 w-14 ring-1 ml-1 ring-slate-200 flex-none rounded-full bg-gray-50" src={item.imageUrl} alt="" />
                <div className="flex flex-col w-full ">
                  <div className="flex flex-col md:flex-row md:space-x-3 justify-between">
                    <p className="text-sm md:text-sm font-semibold text-left dark:text-slate-300">{item.organization}</p>
                    <div className="w-fit text-muted-foreground text-[10px] px-0">{item.time}</div>
                  </div>
                  <p className="text-xs leading-5 dark:text-slate-500">{item.course}, {item.university}</p>
                </div>
              </div>
            </li>
          </div>
        ))}
        {
          siteConfig.education.length == 0 &&
          <Button variant="outline" className="text-slate-600 w-full" asChild>
          <Link href="/contact">Available Upon Request</Link>
        </Button>
        }
      </ul>
    );
  }
  
