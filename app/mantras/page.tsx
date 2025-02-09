import { allMantras, } from ".contentlayer/generated"
import { Mdx } from "app/components/mdx"
import { cn } from "app/theme/lib/utils";

export default function MantrasPage() {
    const sortedMantras = allMantras
        .filter((item) => typeof item.order === "number") // Filter out items without order
        .sort((a: any, b: any) => a.order - b.order);

    return (
        <main className="max-w-4xl mx-auto  py-10 sm:py-10 lg:py-15">
            <h1 className="dark:text-foreground text-cyan-900 font-normal font-serif text-3xl">
                Mantras: Inspiration for Every Moment
            </h1>
            <p className="mt-1 mb-8 text-md tracking-tight  dark:text-muted-foreground text-slate-500 font-serif ">
                The philosophy I live by—timeless quotes and sayings that inspire, guide, and shape my journey.
            </p>
            {
                sortedMantras.map((item, index) => (
                    <div key={index} className="bg-cyan-50 px-6 py-6 border-slate-400 dark:border-slate-600  text-slate-700 hover:text-slate-50 hover:bg-cyan-950 dark:bg-slate-900 dark:hover:bg-cyan-950 transition-opacity border-b">
                        <div
                            className={cn(
                                "",
                                `${item.title.length < 100 ? "grid  grid-flow-col gap-8" : "grid  gap-3"}`,
                            )}
                        >
                            <div>
                                <h1 className={cn(
                                    "dark:text-foreground tracking-tighter font-serif text-4xl",
                                    // `${item.title.length < 50 ? "text-5xl": "text-4xl"}`
                                )}>
                                    {item.title}
                                </h1>
                                <p className="mt-3  text-md tracking-tight  dark:text-muted-foreground font-serif italic text-left">
                                    -{item.philosopher}
                                </p>
                            </div>
                            <p className="font- text-xs dark:text-muted-foreground   text-justify">
                                <Mdx code={item.body.code} />
                            </p>
                        </div>
                    </div>
                ))}
        </main>
    )
}

