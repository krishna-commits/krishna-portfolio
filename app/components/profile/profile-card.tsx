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
        <Card className="border-0 p-2 md:pt-4 md:pr-3 md:pb-4  md:overflow-y-auto md:h-[90vh] no-scrollbar shadow-none">
            <CardHeader className="p-0">
                <div className="flex flex-col-reverse md:flex-row justify-center align-middle items-center mb-6 md:mb-4">
                    <div className="flex flex-col space-y-3 w-9/12">
                        <CardTitle className="dark:text-foreground text-cyan-900 font-normal font-serif text-4xl md:text-2xl tracking-wide text-center md:text-left">
                            {siteConfig.name}
                        </CardTitle>
                        <CardDescription className=" text-center md:text-left">
                            {siteConfig.bio}
                        </CardDescription>
                        <CardDescription className="text-center md:text-left">
                            {siteConfig.talks_about}
                        </CardDescription>
                    </div>
                    <div className="w-3/12 mb-5 md:mb-0">
                        <img
                            src={siteConfig.profile_image}
                            width={200}
                            height={'auto'}
                            alt="Picture of the author"
                            className="md:h-full md:w-full rounded-full ring-1 ring-gray-200  dark:ring-slate-700 dark:bg-slate-900  "
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 mb-9 md:mb-6">
                <ProfileAccordion />
            </CardContent>
        </Card>
    )
}
