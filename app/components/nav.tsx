'use client';

import { motion, LayoutGroup } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { cn } from "app/theme/lib/utils"
import { Icons } from "app/theme/components/theme/icons"
import { siteConfig } from 'config/site';
import { Logo } from 'app/theme/components/theme/logo';
import { useTheme } from "next-themes";
import './nav.css'
const navItems = {
  '/': {
    name: 'Home',
  },
  '/codecanvas': {
    name: 'Code Canvas',
  },
  '/blog': {
    name: 'Blog',
  },
  '/research-core': {
    name: 'Research Core',
  },
  '/mantras': {
    name: 'Mantras',
  },
  '/skill-lab': {
    name: 'Skill Lab',
  },
  '/contact': {
    name: 'Contact',
  },
  // '/guestbook': {
  //   name: 'Guest',
  // },

};

function NavItem({ path, name }: { path: string; name: string }) {
  let pathname = usePathname() || '/';
  if (pathname.includes('/blog/')) {
    pathname = '/blog';
  }
  let isActive = path === pathname;

  return (
    <Link
      key={path}
      href={path}
      className={cn(
        'text-sm transition-all text-cyan-900 hover:text-slate-500 dark:hover:text-slate-200 flex align-middle',
        {
          'text-slate-500': !isActive,
        }
      )}
    >
    <span className="relative py-1 px-2 ">
  {name}
  {path === pathname ? (
    <motion.div
      className="absolute h-[1.9px] top-10 mx-1 inset-0 bg-cyan-900 dark:bg-neutral-200 rounded-md"
      layoutId="sidebar"
      transition={{
        type: 'spring',
        stiffness: 700,
        damping: 60,
      }}
    />
  ) : null}
</span>

    </Link>
  );
}


export function Navbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { resolvedTheme } = useTheme();
  return (
    <div className=" hidden md:flex">
    <Link href="/" className="mr-6 flex items-center space-x-2">
      {/* <Icons.logo className="h-6 w-6" /> */}
      {/* <Logo.navbar
          className=" w-6 h-6"
          strokeWidth="45"
          fill="color-primary-700"
          isdarkmode={resolvedTheme == 'dark' ? 'true' : 'false'} 
        /> */}
      <span className="hidden font-semibold sm:inline-block text-2xl teko-font text-cyan-900 dark:text-cyan-100">
        {siteConfig.title}
      </span>
    </Link>
    <nav
      className={cn("flex items-center space-x-6 lg:space-x-6", className)}
      {...props}
    >
      {Object.entries(navItems).map(([path, { name }]) => {
        return <NavItem key={path} path={path} name={name} />;
      })}
      
    </nav>
    </div>
  )
}