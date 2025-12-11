"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/i18n-provider";

type TocItem = {
  id: string;
  title: string;
  level: number;
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-");

type DocsTocProps = {
  contentSelector?: string;
  maxDepth?: number;
};

/**
 * TOC tự động: quét H2-H3 trong nội dung và tạo mục lục bên phải, kèm scrollspy.
 */
export const DocsToc: React.FC<DocsTocProps> = ({
  contentSelector = "#doc-content",
  maxDepth = 3,
}) => {
  const { t } = useI18n();
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    const container = document.querySelector(contentSelector);
    if (!container) return;

    const headings = Array.from(
      container.querySelectorAll<HTMLHeadingElement>("h2, h3")
    ).filter((h) => {
      const level = Number(h.tagName.replace("H", ""));
      return level >= 2 && level <= maxDepth;
    });

    const withIds = headings.map((h) => {
      if (!h.id) {
        h.id = slugify(h.textContent ?? "heading");
      }
      return {
        id: h.id,
        title: h.textContent ?? "",
        level: Number(h.tagName.replace("H", "")),
      };
    });

    setItems(withIds);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.find((e) => e.isIntersecting);
        if (entry?.target instanceof HTMLElement) {
          setActiveId(entry.target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 }
    );

    headings.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, [contentSelector, maxDepth]);

  const grouped = useMemo(() => items, [items]);

  if (grouped.length === 0) return null;

  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-6rem)] w-64 flex-shrink-0 pl-4 pr-2 xl:block">
      <div className="h-full overflow-y-auto border-l border-border pl-4 text-sm">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("docs.toc.title")}
        </div>
        <ul className="space-y-1">
          {grouped.map((item) => (
            <li key={item.id}>
              <a
                className={cn(
                  "block truncate transition-colors hover:text-primary",
                  item.level === 3 && "pl-3 text-muted-foreground",
                  activeId === item.id
                    ? "text-primary font-medium"
                    : "text-foreground"
                )}
                href={`#${item.id}`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
