import { cn } from "app/theme/lib/utils";
import { siteConfig } from "config/site"
export default function HomePage() {
  return (

    <div className="md:pt-16 flex-col space-y-6 md:pr-9">

      <div className="mt-3 md:mt-0 mb-12 md:mb-12  ">
        
        <h1 className={cn(
          "dark:text-foreground text-blue-900 font-serif text-2xl md:text-4xl",
        )}>{siteConfig.home.title}</h1>
        <p className="mt-3 md:mt-5 md:mr-6 text-md tracking-tight text-muted-foreground  dark:text-muted-foreground font-serif md:text-md text-justify">
          {siteConfig.home.description}
        </p>
      </div>
    </div>



  )
}


