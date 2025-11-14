import * as React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "app/theme/components/ui/card"
import Image from 'next/image'
import { Separator } from "app/theme/components/ui/separator"
import { ProfileAccordion } from "./profile-accordion"
import { siteConfig } from "config/site"

export function ProfileCard() {
    return (
        <Card className="border border-slate-200 dark:border-slate-800 p-4 md:pt-5 md:pr-4 md:pb-5 md:overflow-y-auto md:h-[calc(100vh-5rem)] no-scrollbar shadow-sm bg-white dark:bg-slate-900/50">
            <CardHeader className="p-0">
                <div className="flex flex-col-reverse md:flex-row justify-center align-middle items-center mb-6 md:mb-5 gap-4">
                    <div className="flex flex-col space-y-2.5 w-9/12">
                        <CardTitle className="dark:text-foreground text-cyan-900 font-normal font-serif text-3xl md:text-2xl tracking-wide text-center md:text-left">
                            {siteConfig.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-center md:text-left leading-relaxed">
                            {siteConfig.bio}
                        </CardDescription>
                        <CardDescription className="text-xs text-center md:text-left text-slate-500 dark:text-slate-400">
                            {siteConfig.talks_about}
                        </CardDescription>
                    </div>
                    <div className="w-3/12 mb-5 md:mb-0 flex-shrink-0">
                        <Image
                            src={siteConfig.profile_image}
                            width={120}
                            height={120}
                            alt="Picture of the author"
                            className="w-full h-auto rounded-full ring-2 ring-gray-200 dark:ring-slate-700 dark:bg-slate-900 object-cover"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 mb-6 md:mb-4">
                <ProfileAccordion />
            </CardContent>
        </Card>
    )
}
