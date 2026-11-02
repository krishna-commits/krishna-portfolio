"use client";

import { useEffect, useState } from "react";

// Dark-first: dark is the default; light is an explicit choice stored in localStorage.
export type Theme = "dark" | "light";
const EVENT = "themechange";

/** Runs before paint (inlined in <head>) so the stored theme never flashes. */
export const themeScript = `try{if(localStorage.getItem("theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}document.documentElement.classList.add("js")`;

function readTheme(): Theme {
  try {
    return localStorage.getItem("theme") === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

/** Toggle dark ↔ light, persist, and notify every toggle (header button, ⌘K action). */
export function cycleTheme() {
  const next: Theme = readTheme() === "dark" ? "light" : "dark";
  const root = document.documentElement;
  try {
    if (next === "dark") localStorage.removeItem("theme");
    else localStorage.setItem("theme", "light");
  } catch {}
  if (next === "dark") delete root.dataset.theme;
  else root.dataset.theme = "light";
  window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(readTheme());
    const onChange = (e: Event) => setTheme((e as CustomEvent<Theme>).detail);
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  const label = theme === "light" ? "Switch to dark theme" : "Switch to light theme";

  return (
    <button onClick={cycleTheme} className="tag h-9 w-9 justify-center p-0 hover:border-[var(--fg)]" aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        {theme === "light" ? (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
      </svg>
    </button>
  );
}
