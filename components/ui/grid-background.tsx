"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Grid background component từ Aceternity UI
 * Tạo grid pattern với dots để làm background cho sections
 */
export function GridBackground({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-white/[0.2] bg-black p-20",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"></div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      <div className="relative z-20">{children}</div>
    </div>
  );
}

/**
 * Dot background component từ Aceternity UI
 * Tạo dot pattern để làm background cho sections
 */
export function DotBackground({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-white/[0.2] bg-black p-20",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"></div>

      <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgb(255,255,255,0.15)_1px,transparent_0)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      <div className="relative z-20">{children}</div>
    </div>
  );
}

