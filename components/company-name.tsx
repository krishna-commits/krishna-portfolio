import type { Role } from "@/lib/data";

/**
 * Renders a role's company. For confidential roles the real name is never sent to the browser:
 * a blurred placeholder of similar shape shows instead, with an accessible label.
 */
export function CompanyName({ role, className = "" }: { role: Role; className?: string }) {
  if (!role.confidential) return <span className={className}>{role.company}</span>;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} title="Company name available on request">
      <span aria-hidden className="select-none blur-[5px]">Xxxxxxx Xxxxxxxxxx</span>
      <span className="sr-only">Company name withheld, available on request</span>
      <span aria-hidden className="tag px-1.5 py-0 text-[10px] font-normal">on request</span>
    </span>
  );
}
