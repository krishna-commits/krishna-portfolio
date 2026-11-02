/** The KN monogram: a blue tile with a cyan edge, initials in Inter. */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="display inline-flex shrink-0 items-center justify-center rounded-[10px] font-bold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: "linear-gradient(135deg, var(--accent) 0%, #0e7490 100%)",
        boxShadow: "inset 0 0 0 1px rgb(34 211 238 / 0.35), 0 8px 22px -10px rgb(37 99 235 / 0.9)",
      }}
    >
      KN
    </span>
  );
}
