"use client"
import { SpotlightCard } from "app/theme/components/theme/spotlight-card";
import { useGetGithubRepos } from "app/api/github";
import { Badge } from "app/theme/components/ui/badge";
import GithubLanguages from "./github/github-languages";
import GithubContributors from "./github/github-contributors";
import moment from 'moment'
import { Icons } from "app/theme/components/theme/icons";
export default function Page() {

    const { repo, repoLoading, repoError, repoValidating, repoEmpty } = useGetGithubRepos();

    if (repoLoading) {
        return (
            <div className="max-w-4xl mx-auto  py-10 sm:py-10 lg:py-15 ">
                <h1 className="dark:text-foreground text-cyan-900 font-normal font-serif text-3xl">
                    Unveiling the Code Canvas
                </h1>
                <p className="mt-1 mb-8 text-md tracking-tight  dark:text-muted-foreground text-slate-500 font-serif ">
                    Embark on a Journey Through My GitHub Galaxy - Where Every Project Tells a Unique Story
                </p>
                <div className="grid grid-cols-1 gap-0">
                    {[...Array(20)].map((_, index) => (
                        <div key={index} className="p-6 max-w w-full mx-auto bg-cyan-50 border-b"
                        // className="border border-slate-400 dark:border-slate-600 bg-gradient-to-tl from-cyan-800/5 via-cyan-400/10 to-cyan-900/7 px-10 py-7 duration-700 shadow rounded-md p-4 max-w w-full mx-auto"
                        >
                            <div className="animate-pulse flex space-x-4">
                                <div className="flex-1 space-y-6 py-1 w-full">
                                    <div className="h-4 bg-slate-600 dark:bg-slate-200 opacity-10 rounded w-5/12"></div>
                                    <div className="space-y-3">
                                        <div className="h-2 bg-slate-700 dark:bg-slate-200 rounded opacity-10"></div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="h-2 bg-slate-700 dark:bg-slate-200 rounded col-span-2 opacity-10"></div>
                                            <div className="h-2 bg-slate-700 dark:bg-slate-200 rounded col-span-1 opacity-10"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        )
    }

    return (

        <main className="max-w-4xl mx-auto  py-10 sm:py-10 lg:py-15 ">
              <h1 className="dark:text-foreground text-cyan-900 font-normal font-serif text-3xl">
                    Unveiling the Code Canvas
                </h1>
                <p className="mt-1 mb-8 text-md tracking-tight  dark:text-muted-foreground text-slate-500 font-serif ">
                    Embark on a Journey Through My GitHub Galaxy - Where Every Project Tells a Unique Story
                </p>
            <div className="grid gap-0 grid-cols-1">
                {repoEmpty ? (
                    <p>No repositories found.</p>
                ) : (
                    <>
                        {repo.map((repoItem, index) => (
                                       <div key={index} className="bg-cyan-50 px-6 py-6 border-slate-400 dark:border-slate-600  text-slate-700 hover:text-cyan-900  dark:bg-slate-900 dark:hover:bg-cyan-950 transition-opacity border-b">


                                <div className="flex justify-between space-x-2 text-lg mb-4 dark:text-slate-300 sm:text-2xl items-center">
                                    <div className="flex space-x-2 justify-center items-center">
                                    <Icons.gitHub className="h-5 w-5 fill-current" />
                                    <h5 className="hover:underline font-mono font-semibold text-sm">{repoItem.name}</h5>
                                    </div>
                                    <p className="text-xs font-serif text-muted-foreground mb-3">Published at {moment(repoItem.updated_at).format("MMM Do YY")} @ github</p>
                                </div>
                                <div className="mb-2 font-mono">
                                    {repoItem.description !== null ? (
                                        <p className="text-xs dark:text-slate-400 text-slate-500 text-justify">{repoItem.description}</p>
                                    ) : (
                                        <p className="text-xs dark:text-slate-400 text-slate-500 text-justify">
                                            This repository contains the source code for {repoItem.name}, created by {repoItem.owner.login}. It is developed using {repoItem.language} and is intended for study purpose.
                                        </p>
                                    )}
                                </div>
                                <div className="flex space-x-2  mt-2">
                                    {
                                        repoItem.language &&
                                        <p className="text-xs dark:text-slate-500 text-slate-600">
                                            #{repoItem.language}
                                        </p>
                                    }


                                </div>
                                {/* <div className="flex">
                                            {repoLoading ? (
                                                <p>loading...</p>
                                            ) : (
                                                <GithubLanguages repoName={repoItem.name} />
                                            )}
                                        </div> */}
                                {/* <div className="flex">
                                            {repoLoading ? (
                                                <p>loading...</p>
                                            ) : (
                                                <GithubContributors repoName={repoItem.name} />
                                            )}
                                        </div> */}
                            </div>
                        ))}
                    </>
                )}
            </div>

        </main>

    );
};

