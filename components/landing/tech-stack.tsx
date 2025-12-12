"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Danh sách các công nghệ được sử dụng trong project
 */
const technologies = [
  { name: "Next.js", icon: "⚡" },
  { name: "React", icon: "⚛️" },
  { name: "TypeScript", icon: "📘" },
  { name: "Tailwind CSS", icon: "🎨" },
  { name: "shadcn/ui", icon: "✨" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Supabase", icon: "🚀" },
  { name: "Vercel", icon: "▲" },
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
  // Tạo duplicate array cho marquee effect
  const duplicatedTechs = [...technologies, ...technologies];

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

  // Marquee variant (default)
  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden border-t border-b border-border/50 bg-muted/30 py-6",
        className
      )}
    >
      {/* Gradient overlay để tạo fade effect */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />

      {/* Marquee container */}
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{
          animation: "marquee 30s linear infinite",
        }}
      >
        {duplicatedTechs.map((tech, index) => (
          <TechBadge key={`${tech.name}-${index}`} tech={tech} />
        ))}
      </div>
    </div>
  );
};

/**
 * Component hiển thị một tech badge
 * @param tech - Object chứa name và icon của công nghệ
 */
const TechBadge: React.FC<{ tech: { name: string; icon: string } }> = ({
  tech,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/80 px-4 py-2 text-sm font-medium text-muted-foreground",
        "backdrop-blur-sm transition-all duration-300",
        "hover:border-primary/50 hover:bg-primary/5 hover:text-foreground",
        "group"
      )}
    >
      <span className="text-base transition-transform duration-300 group-hover:scale-110">
        {tech.icon}
      </span>
      <span className="whitespace-nowrap">{tech.name}</span>
    </div>
  );
};

