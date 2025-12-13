"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Trophy, BookOpen, ChevronRight } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

/**
 * Mobile navigation menu chung cho toàn site
 * Bao gồm main navigation và docs submenu (khi ở trang docs)
 */
export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { t } = useI18n();
  const [open, setOpen] = React.useState(false);
  const isDocsPage = pathname?.startsWith("/docs");

  const mainNavItems = [
    {
      href: "/",
      label: t("header.nav.about"),
      icon: Home,
    },
    {
      href: "/leaderboard",
      label: t("header.nav.leaderboard"),
      icon: Trophy,
    },
    {
      href: "/docs",
      label: t("header.nav.docs"),
      icon: BookOpen,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 sm:w-96">
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle className="text-left text-lg font-semibold">
            Menu
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <nav className="px-4 py-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Navigation
            </div>
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      // Chỉ đóng menu nếu không phải docs page hoặc click vào docs link
                      if (!isDocsPage || item.href === "/docs") {
                        setOpen(false);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Docs Submenu - chỉ hiện khi ở trang docs */}
          {isDocsPage && (
            <>
              <Separator className="my-2" />
              <nav className="px-4 py-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("docs.title")}
                </div>
                <div className="space-y-1">
                  {docs.map((item) => {
                    const href = `/docs/${item.slug}`;
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={item.slug}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                        <span className="truncate">{t(item.titleKey as never)}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

