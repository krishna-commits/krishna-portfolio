import ResearchCoreCard from "./components/researchcore-card"

export default function ResearchCorePage() {
    return (
        <div className="max-w-4xl mx-auto  py-10 sm:py-10 lg:py-15">
            <h1 className="dark:text-foreground text-cyan-900 font-normal font-serif text-3xl">
            Research Core: In-Depth Insights and Academic Exploration
            </h1>
            <p className="mt-1 mb-8 text-md tracking-tight  dark:text-muted-foreground text-slate-500 font-serif ">
            The Research Core combines academic findings, conference highlights, coding practices, and theoretical summaries in a structured, research-focused format for continuous learning and exploration.
            </p>
            <ResearchCoreCard/>
        </div>
    )
}