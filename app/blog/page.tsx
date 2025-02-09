"use client"
import { SpotlightCard } from "app/theme/components/theme/spotlight-card"
import { Badge } from "app/theme/components/ui/badge"
import moment from "moment"
import Link from "next/link"
import { useState, useEffect } from "react";

export default function BlogPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading,setLoading]= useState<boolean>(true);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(
                    `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@neupane.krishna33`
                );
                const data = await response.json();
                setPosts(data.items);
                setLoading(false)
            } catch (error) {
                console.error("Error fetching Medium posts:", error);
            }
        };

        fetchPosts();
    }, []);

    // Function to handle changes in the search input
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    // Filter posts based on the search query
    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Function to clear the search query
    const clearSearchQuery = () => {
        setSearchQuery("");
    };

    return (
        <main className="max-w-4xl mx-auto  py-10 sm:py-10 lg:py-15 ">
 <h1 className="dark:text-foreground text-cyan-900 font-normal font-serif text-3xl">
                Blogging Canvas: Byte-sized Reflections
            </h1>
            <p className="mt-1 mb-8 text-md tracking-tight  dark:text-muted-foreground text-slate-500 font-serif ">
            Sharing My Experiences in a Digital Diary, Unveiling New Chapters with Every Click
            </p>

            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                Search
            </label>
            <div className="relative my-10">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-slate-500 dark:text-slate-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </div>
                <input
                    type="search"
                    id="default-search"
                    className="block w-full p-2 ps-10 text-sm text-gray-900 border-b border-slate-300 bg-zinc-50  focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
                    placeholder="Search Blogs"
                    value={searchQuery}
                    onChange={handleSearchChange} //event
                />
                {searchQuery !== "" && (
                    <button
                        onClick={clearSearchQuery}
                        className="text-black absolute end-2.5 bottom-1.5  focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-1 py-1 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-x"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {
                    loading &&
                    <div className="grid grid-cols-1 gap-0">

                    {[...Array(20)].map((_, index) => (
                        <div key={index} className="p-6 max-w w-full mx-auto border-b bg-cyan-50"
                        // className="border border-slate-400 dark:border-slate-600 bg-gradient-to-tl from-cyan-800/5 via-cyan-400/10 to-cyan-900/7 px-10 py-7 duration-700 shadow rounded-md p-4 max-w w-full mx-auto"
                        >
                            <div className="animate-pulse flex space-x-4">
                                <div className="flex-1 space-y-3 py-1 w-full">
                                <div className="h-2 w-32 bg-slate-700 dark:bg-slate-200 rounded col-span-1 opacity-10"></div>
                                <div className="h-6 bg-slate-600 dark:bg-slate-200 opacity-10 rounded w-full"></div>
                                    {/* <div className="h-4 bg-slate-600 dark:bg-slate-200 opacity-10 rounded w-5/12"></div> */}
                                    {/* <div className="space-y-3">
                                     
                                        <div className="flex w-full space-x-2">
                                            <div className="h-2 bg-slate-700 dark:bg-slate-200 rounded opacity-10 w-4/12"></div>
                                            <div className="h-2 bg-slate-700 dark:bg-slate-200 rounded opacity-10 w-4/12"></div>
                                            <div className="h-2 bg-slate-700 dark:bg-slate-200 rounded opacity-10 w-4/12"></div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                }

            <div className="grid gap-0 grid-cols-1">
             
                {filteredPosts.map((post) => (
                    <div className="bg-cyan-50 px-6 py-6 border-slate-400 dark:border-slate-600  text-slate-700 hover:text-cyan-900  dark:bg-slate-900 dark:hover:bg-cyan-950 transition-opacity border-b">
                        <article
                            key={post.guid}
                        >
                            <p className="text-xs  mb-2 font- text-muted-foreground">Published at {moment(post.pubDate).format("MMM Do YY")} @ Medium</p>
                            <h3 className="text-md font-medium  sm:text-xl flex items-center font-serif tracking-tight">
                                <Link
                                    href={post?.link ? new URL(post.link).toString() : '/'}
                                    className="hover:underline text-md">{post?.title}</Link>
                            </h3>
                            {/* <div className="flex space-x-3">
                                {post.categories.map((item, index) => {
                                    return (
                                        <p className="text-xs text-slate-400 mt-1">
                                        #{item}
                                        </p>
                                    )
                                })}
                            </div> */}
                        </article>
                     </div>
                ))}
            </div>
        </main>
    )
}