import SkillCard from "./components/skill-card";

export default function SkillLabPage() {
    return (
        <div className="max-w-4xl mx-auto  py-10 sm:py-10 lg:py-15">
            <h1 className="dark:text-foreground text-cyan-900 font-normal font-serif text-3xl">
                Skill Lab: Continuous Learning and Experimentation
            </h1>
            <p className="mt-1 mb-8 text-md tracking-tight  dark:text-muted-foreground text-slate-500 font-serif ">
                Skill Lab is a dedicated space where I document my journey of mastering new skills, sharing insights, progress, and resources as I grow in each area of expertise.
            </p>
            <SkillCard/>
        </div>
    )
}