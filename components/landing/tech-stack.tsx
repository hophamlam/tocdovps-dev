"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Type cho technology với logo path hoặc emoji
 */
type Technology = {
  name: string;
  logoPath?: string; // Path đến SVG trong public/icons folder
  emoji?: string; // Emoji fallback
};

/**
 * Danh sách các công nghệ được sử dụng trong project
 * Sử dụng 6 SVG logos từ public/icons folder
 */
const technologies: Technology[] = [
  { name: "Next.js", logoPath: "/icons/nextdotjs.svg" },
  { name: "shadcn/ui", logoPath: "/icons/shadcnui.svg" },
  { name: "Vercel", logoPath: "/icons/vercel.svg" },
  { name: "Neon", logoPath: "/icons/neon-logomark-light-mono.svg" },
  { name: "Nextra", logoPath: "/icons/nextra.svg" },
  { name: "Upstash", logoPath: "/icons/upstash.svg" },
];

type TechStackProps = {
  className?: string;
  variant?: "default" | "marquee" | "grid";
};

/**
 * Component hiển thị tech stack - Logo Cloud section
 * Hiển thị các công nghệ được sử dụng trong project theo phong cách Aceternity
 *
 * @param className - Custom className cho container
 * @param variant - Kiểu hiển thị: default (marquee), marquee (cuộn ngang), grid (lưới)
 * @returns Component hiển thị tech stack với animation mượt
 */
export const TechStack: React.FC<TechStackProps> = ({
  className,
  variant = "default",
}) => {
  if (variant === "grid") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-4 px-4",
          className
        )}
      >
        {technologies.map((tech, index) => (
          <TechBadge key={`${tech.name}-${index}`} tech={tech} />
        ))}
      </div>
    );
  }

  // Marquee variant (default) - sử dụng CSS animation đơn giản để tránh lag
  // Duplicate items để tạo seamless loop
  const duplicatedTechs = React.useMemo(
    () => [...technologies, ...technologies],
    []
  );

  return (
    <div className={cn("relative flex w-full overflow-hidden py-8", className)}>
      {/* Gradient overlay để tạo fade effect */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />

      {/* Marquee container với CSS animation */}
      <div
        className="flex items-center gap-12 whitespace-nowrap"
        style={{
          animation: "marquee 40s linear infinite",
        }}
      >
        {duplicatedTechs.map((tech, index) => (
          <div key={`${tech.name}-${index}`} className="flex-shrink-0">
            <TechBadge tech={tech} />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Component hiển thị một tech badge với logo SVG - style Aceternity
 * Icon + text đơn giản, không background, không border
 * @param tech - Object chứa name và logo của công nghệ
 */
const TechBadge: React.FC<{ tech: Technology }> = ({ tech }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 text-sm font-medium text-muted-foreground",
        "transition-all duration-300",
        "hover:text-foreground",
        "group"
      )}
    >
      {tech.logoPath ? (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center transition-opacity duration-300 group-hover:opacity-80">
          <Image
            src={tech.logoPath}
            alt={`${tech.name} logo`}
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
        </div>
      ) : null}
      <span className="whitespace-nowrap">{tech.name}</span>
    </div>
  );
};
