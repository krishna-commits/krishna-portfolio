import Image from "next/image";
import { profile } from "@/lib/data";

/** Header and footer mark: the portrait in a thin Saturn-gold ring. The KN monogram lives on as the favicon (app/icon.tsx). */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 overflow-hidden rounded-full p-[2px]"
      style={{ width: size, height: size, background: "var(--accent-2)" }}
    >
      <Image
        src={profile.photo.src}
        width={size * 2}
        height={size * 2}
        alt=""
        className="h-full w-full rounded-full object-cover"
        style={{ boxShadow: "0 0 0 2px var(--bg)" }}
      />
    </span>
  );
}
