"use client"
import { usePathname } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "app/theme/components/ui/breadcrumb"

export default function MantrasBreadcrumb() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(segment => segment !== '');
    return (
            <Breadcrumb>
                <BreadcrumbList>
                    {segments.map((segment, index) => (
                        <div className='flex justify-center items-center space-x-2' key={index} >
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href={`/${segments.slice(0, index + 1).join('/')}`}>
                                    {decodeURIComponent(segment)}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                        </div>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
    )
}