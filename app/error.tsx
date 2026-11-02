"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="py-24 text-center">
      <p className="eyebrow accent-ink">Error</p>
      <h1 className="h-page mt-3">Something went wrong</h1>
      <p className="lede mt-4">This page hit an unexpected error.</p>
      <div className="mt-8 flex justify-center gap-3">
        <button onClick={reset} className="btn-primary">Try again</button>
        <Link href="/" className="btn-outline">Home</Link>
      </div>
    </div>
  );
}
