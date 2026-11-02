import type { Role } from "@/lib/data";

/**
 * Renders a role's company. For confidential roles the real name is never sent to the browser:
 * a blurred placeholder is drawn with CSS (so no fake text exists in the page), with an accessible label.
 */
export function CompanyName({ role, className = "" }: { role: Role; className?: string }) {
  if (!role.confidential) return <span className={className}>{role.company}</span>;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} title="Company name available on request">
      <span aria-hidden className="blurred-name" />
      <span className="sr-only">Company name available on request</span>
    </span>
  );
}
