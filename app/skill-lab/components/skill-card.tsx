import { cn } from "app/theme/lib/utils";
import { allSkills } from ".contentlayer/generated";

export default function SkillCard() {
  const sortedSkills = allSkills
    .filter((item: any) => item.parent === true) 
    .sort((a: any, b: any) => a.order - b.order); 
  
  return (
      <div className="grid grid-cols-1 gap-4">
        {
          sortedSkills.map((item, index) => (
            <a key={index} href={`${item.url}`} className="bg-cyan-50 px-6 py-6 border-slate-400 dark:border-slate-600  text-slate-700 hover:text-slate-50 hover:bg-cyan-950 dark:bg-slate-900 dark:hover:bg-cyan-950 transition-opacity border-b">
              <h1 className={cn(
                "dark:text-foreground tracking-tighter font-serif text-3xl hover:underline hover:cursor-pointer",
              )}>
                {item.title}
              </h1>
              <p className="mt-3  text-md tracking-tight  dark:text-muted-foreground font-serif italic text-left ">
                {item.description}
              </p>
            </a>
          ))
        }
      </div>
  )
}
