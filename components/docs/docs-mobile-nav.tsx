"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { docs } from "@/lib/docs/docs-map";
import { useI18n } from "@/components/i18n/i18n-provider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

/**
 * Mobile navigation menu cho docs page
 * Sử dụng Sheet component để hiển thị sidebar trên mobile
 */
export const DocsMobileNav: React.FC = () => {
  const pathname = usePathname();
  const { t } = useI18n();
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Toggle docs menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b border-border px-4 py-3">
          <SheetTitle className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("docs.title")}
          </SheetTitle>
        </SheetHeader>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {docs.map((item) => {
              const href = `/docs/${item.slug}`;
              const active = pathname === href;
              return (
                <Link
                  key={item.slug}
                  href={href}
                  onClick={() => setOpen(false)}
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
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

