import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="eyebrow accent-ink">404</p>
      <h1 className="h-page mt-3">Page not found</h1>
      <p className="lede mt-4">The page you&apos;re looking for has moved or doesn&apos;t exist.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn-primary">Home</Link>
        <Link href="/projects" className="btn-outline">Projects</Link>
      </div>
    </div>
  );
}
