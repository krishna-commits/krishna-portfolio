"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LocalTime } from "@/components/local-time";
import { LogoMark } from "@/components/logo-mark";
import { SearchDialog, type SearchEntry } from "@/components/search-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { nav, site } from "@/lib/data";

export function SiteHeader({ searchExtra }: { searchExtra?: SearchEntry[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const solid = scrolled || open;

  return (
    <header
      className={`no-print sticky top-0 z-40 border-b transition-[background,border-color] duration-300 ${solid ? "backdrop-blur-md" : ""}`}
      style={{
        borderColor: solid ? "var(--border)" : "transparent",
        background: solid ? "color-mix(in srgb, var(--bg) 84%, transparent)" : "transparent",
      }}
    >
      <div className="container-page flex h-[72px] min-w-0 items-center gap-4 lg:gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.name}, home`}>
          <LogoMark />
          <span className="hidden leading-tight sm:block">
            <span className="block text-[15px] font-semibold tracking-tight">{site.name}</span>
            <span className="muted block text-xs">Senior DevSecOps Engineer</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-5 md:flex lg:gap-7">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-sm transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:rounded-full after:bg-[var(--accent)] after:transition-transform after:duration-300 ${
                  active ? "font-medium after:scale-x-100" : "muted after:scale-x-0 hover:text-[var(--fg)] hover:after:scale-x-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-4">
          {/* Only on very wide screens; at laptop widths the header would overflow. */}
          <span className="tag hidden gap-2 px-3 py-1.5 2xl:inline-flex" title="Krishna's local time, Kathmandu (UTC+5:45)">
            <span className="h-1.5 w-1.5 rounded-full signal-pulse" style={{ background: "var(--ok)" }} aria-hidden />
            available
            <LocalTime seconds bare className="text-[var(--fg)]" />
          </span>
          <SearchDialog extra={searchExtra} />
          <ThemeToggle />
          <Link href="/contact" className="btn-primary hidden px-5 py-2 lg:inline-flex">Let&apos;s talk</Link>
          <button
            className="rounded-full p-2 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
              <path d={open ? "M6 6l12 12M18 6L6 18" : "M4 8h16M4 16h16"} />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="container-page flex flex-col border-t pb-5 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`border-b py-3.5 text-base ${isActive(item.href) ? "font-medium" : "muted"}`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary mt-4 justify-center">Let&apos;s talk</Link>
        </nav>
      )}
    </header>
  );
}
