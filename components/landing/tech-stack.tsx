"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";

/**
 * Type cho technology với logo path hoặc emoji
 */
type Technology = {
  name: string;
  logoPath?: string; // Path đến SVG trong public/techstack folder
  emoji?: string; // Emoji fallback
  url: string; // URL đến trang chủ của công nghệ
};

/**
 * Danh sách các công nghệ được sử dụng trong project
 * Sử dụng 6 SVG logos từ public/techstack folder
 */
const technologies: Technology[] = [
  {
    name: "Next.js",
    logoPath: "/techstack/nextdotjs.svg",
    url: "https://nextjs.org",
  },
  {
    name: "shadcn/ui",
    logoPath: "/techstack/shadcnui.svg",
    url: "https://ui.shadcn.com",
  },
  {
    name: "Vercel",
    logoPath: "/techstack/vercel.svg",
    url: "https://vercel.com",
  },
  {
    name: "Neon",
    logoPath: "/techstack/neon-logomark-light-mono.svg",
    url: "https://neon.tech",
  },
  {
    name: "Nextra",
    logoPath: "/techstack/nextra.svg",
    url: "https://nextra.site",
  },
  {
    name: "Upstash",
    logoPath: "/techstack/upstash.svg",
    url: "https://upstash.com",
  },
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

  return (
    <>
      {/* Desktop: hiển thị static, không loop */}
      <div
        className={cn(
          "hidden items-center justify-center gap-4 flex-wrap pt-2 pb-4 px-4 md:flex",
          className
        )}
      >
        {technologies.map((tech, index) => (
          <TechBadge key={tech.name} tech={tech} />
        ))}
      </div>

      {/* Mobile: marquee với Magic UI component - loop mượt, không fade */}
      <div className={cn("w-full pt-2 pb-4 md:hidden", className)}>
        <Marquee repeat={3} pauseOnHover={false} className="[--gap:1.5rem]">
          {technologies.map((tech) => (
            <TechBadge key={tech.name} tech={tech} />
          ))}
        </Marquee>
      </div>
    </>
  );
};

/**
 * Component hiển thị một tech badge với logo SVG - style Aceternity
 * Icon + text đơn giản, không border, không background - less distracted
 * @param tech - Object chứa name và logo của công nghệ
 */
const TechBadge: React.FC<{ tech: Technology }> = ({ tech }) => {
  return (
    <Link
      href={tech.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-3 px-4 py-2 text-sm font-medium text-muted-foreground",
        "transition-all duration-300",
        "hover:text-foreground",
        "group"
      )}
    >
      {tech.logoPath ? (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center transition-opacity duration-300 group-hover:opacity-80">
          <Image
            src={tech.logoPath}
            alt={`${tech.name} logo`}
            width={20}
            height={20}
            className={cn(
              "h-5 w-5 object-contain transition-all duration-300",
              // Adapt SVG theo theme
              // Light mode: SVG tối (mặc định)
              "opacity-60",
              // Dark mode: invert để SVG sáng lên
              "dark:opacity-80 dark:brightness-0 dark:invert dark:contrast-200"
            )}
          />
        </div>
      ) : null}
      <span className="whitespace-nowrap">{tech.name}</span>
    </Link>
  );
};
