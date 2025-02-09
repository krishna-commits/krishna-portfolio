"use client"
import { Home, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(segment => segment !== '');

  return (
    <div className="rounded-none border-b border-none px-0 py-5 mb-4">
      <div className="flex h-5 items-center space-x-4 text-sm">
        <Link href="/">
            <Home className="h-4 w-5" />
        </Link>
        {segments.map((segment, index) => (
          <div key={index} className="flex space-x-4">
            <ChevronRight className="text-gray-500" />
            <Link href={`/${segments.slice(0, index + 1).join('/')}`} className="capitalize no-underline hover:underline">
              {decodeURIComponent(segment)}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
