"use client";

import Image from "next/image";
import { useIsDark } from "@/store/useThemeStore";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export default function PlannerBackground({ opacity = 25 }: { opacity?: number }) {
  const isDark = useIsDark();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {isDark ? (
        <>
          <Image
            src={PUBLIC_ASSETS.images.worldmap}
            alt=""
            fill
            className="object-cover object-[55%_45%] opacity-65"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/35 to-black/55" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30" />
        </>
      ) : (
        <Image
          src={PUBLIC_ASSETS.images.worldmapWhite}
          alt=""
          fill
          className={`scale-102 object-cover opacity-${opacity} blur-[3px]`}
          priority
        />
      )}

      <div className="absolute left-1/2 top-[38%] h-[420px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[120px] dark:bg-accent/15" />
      <div className="absolute right-[8%] top-[55%] h-[280px] w-[320px] rounded-full bg-accent/8 blur-[90px] dark:bg-[#F7EA00]/10" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.09)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_center,black_40%,transparent_88%)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] dark:mask-[radial-gradient(ellipse_at_center,black_25%,transparent_80%)]" />
    </div>
  );
}
