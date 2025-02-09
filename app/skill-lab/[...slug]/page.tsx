import { cn } from "app/theme/lib/utils";
import { allSkills } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from 'app/theme/components/ui/accordion';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from 'app/theme/components/ui/button';
import Link from "next/link";
import { Mdx } from "app/components/mdx-components";
import { Slider } from "app/theme/components/ui/slider"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "app/theme/components/ui/card"

interface PostProps {
    params: {
        slug: string[];
    };
}

interface ContentItem {
    trigger: string;
    content: string;
    url: string;
    page: boolean;
    data: {
        title: string;
        description: string;
        url: string;
    }[];
}


async function getPostFromParams(params: PostProps["params"]) {
    const slug = params?.slug?.join("/");
    // console.log("slug :", slug);
    const post = allSkills.find((post) => post.slugAsParams === slug);
    // console.log('post: ', post);



    if (!post) {
        return null;
    }
    return post;
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
    const post = await getPostFromParams(params);
    if (!post) {
        return {};
    }
    return {
        title: post.title,
        description: post.description,
    };
}

export async function generateStaticParams(): Promise<PostProps["params"][]> {
    return allSkills.map((post) => ({
        slug: post.slugAsParams.split("/"),
    }));
}

export default async function SkillDetailPage({ params }: PostProps) {
    const post = await getPostFromParams(params);
    if (!post) {
        notFound();
    }
    const content: ContentItem[] = post.content as ContentItem[];
    const defaultOpenItems = content && content.map((_, idx) => `item-${idx + 1}`);

    return (
        <div>
            <div className="bg-cyan-50 dark:bg-cyan-950/40 px-6 py-12 border-slate-400 text-slate-700 border-b">
                <div className="max-w-4xl mx-auto">
                    <div className="text-cyan-950">
                        <h1 className={cn(
                            "dark:text-foreground tracking-tighter font-serif text-4xl ",
                        )}>
                            {post.title}
                        </h1>
                        <p className="mt-3 text-md tracking-tight dark:text-muted-foreground font-serif italic text-left">
                            {post.description}
                        </p>
                    </div>
                </div>
            </div>
            {/* <article className="mx-auto max-w-4xl prose dark:prose-invert py-6">
                </article> */}

            {params.slug.length == 2 &&
                <div className="mx-auto max-w-4xl mt-6 mb-32">
                    {content ? (
                        <Accordion type="multiple" className="w-full" defaultValue={defaultOpenItems}>
                            {content.map((item, idx) => (
                                item.trigger !== "Activity" ? (
                                    <AccordionItem key={idx} value={`item-${idx + 1}`} >
                                        <div className="flex justify-between items-center align-middle">
                                            <AccordionTrigger className="text-2xl gap-3" ># {item.trigger}</AccordionTrigger>

                                            {item.page && item.trigger != "Activity" &&
                                                <Button variant="outline" className="h-8 text-slate-600 flex justify-center items-center space-x-1" asChild>
                                                    <Link href={`${item.url}`}>

                                                        <ExternalLink className="w-4 h-4" /> <p className="font-mono">Read</p>
                                                    </Link>
                                                </Button>
                                            }
                                        </div>

                                        <AccordionContent className="text-md w-full">
                                            <p className="text-muted-foreground text-lg mb-3">{item.content}</p>
                                            <div className="grid gap-2 w-full">
                                                {item.data && item.data.map((lesson, lessonIdx) => (
                                                    <div
                                                        key={lessonIdx}
                                                        className={`flex justify-between gap-3 py-3 ${lessonIdx !== item.data.length - 1 ? 'border-b' : ''}`}
                                                    >
                                                        <div className="grid gap-2">
                                                            <Link href={`${lesson.url}`} className="text-lg font-medium leading-none hover:underline">{lesson.title}</Link>
                                                            <p className="text-md text-muted-foreground">{lesson.description}</p>
                                                        </div>
                                                        <Button variant="outline" size="icon" asChild>
                                                            <Link href={`${lesson.url}`}><ChevronRight className="h-4 w-4" /></Link>
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ) :
                                    (
                                        <Card className="mt-4 flex items-center justify-between bg-slate-900 border-2 border-slate-600">
                                            <CardHeader>
                                                <CardTitle className="text-slate-100">Activity Section</CardTitle>
                                            </CardHeader>
                                          
                                                <Button variant="outline" size="icon" className="mr-6  bg-white" asChild>
                                                <Link href={`${item.url}`}>                                                    <ChevronRight className="h-6 w-6 text-slate-900" />
                                                </Link>

                                                </Button>
                                 
                                        </Card>

                                    )
                            ))}
                        </Accordion>
                    ) : (
                        <p>No content available</p>
                    )}

                </div>
            }

            {params.slug.length >= 3 &&
                <div>
                    <article className="md:mx-auto max-w-4xl prose prose-lg dark:prose-invert px-6 py-6 md:px-0 md:py-0 md:my-12 ">
                        <Mdx code={post.body.code} />
                    </article>
                </div>
            }
        </div>
    );



}
