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


      {/* <div className="hidden sm:mb-8 sm:flex ">
        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-800 dark:text-slate-400 ring-1 ring-slate-500 ">
          {siteConfig.home.chip.label}
          <a href={siteConfig.home.chip.url} className="font-semibold text-cyan-600">
            <span className="absolute inset-0" aria-hidden="true" />
            {siteConfig.home.chip.link} <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div> */}


      {/* <div className="">
      <h3 className={cn(
          "dark:text-foreground text-cyan-900 font-serif text-2xl",
        )}>Builds</h3>
      </div>
      <div className="flex space-x-4">
        <div className=" border rounded-sm">
        <img className="flex-none rounded-sm h-10" src={'company/dottrade.png'} alt="" />
        </div>
        <div className=" border rounded-sm">
        <img className="flex-none rounded-sm h-10" src={'company/dot.png'} alt="" />
        </div>
        <div className=" border rounded-sm">
        <img className="flex-none rounded-sm h-10" src={'company/inatale.png'} alt="" />
        </div>
        <div className=" border rounded-sm">
        <img className="flex-none rounded-sm h-10" src={'company/offix.png'} alt="" />
        </div>
      </div> */}


    </div>



  )
}


