"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { docs } from "@/lib/docs/docs-map";
import { useI18n } from "@/components/i18n/i18n-provider";

/**
 * Sidebar điều hướng đa trang cho docs.
 */
export const DocsSidebarNav: React.FC = () => {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-64 flex-shrink-0 border-r border-border lg:block">
      <div className="h-full overflow-y-auto px-3 py-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("docs.title")}
        </div>
        <nav className="space-y-1">
          {docs.map((item) => {
            const href = `/docs/${item.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={item.slug}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <span className="truncate">{t(item.titleKey as never)}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
