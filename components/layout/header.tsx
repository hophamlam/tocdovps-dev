"use client";

import React from "react";
import Link from "next/link";
import { MoonIcon, SunIcon } from "lucide-react";
import { useI18n } from "@/components/i18n/i18n-provider";
import type { Locale } from "@/lib/i18n/config";
import { useTheme } from "@/components/theme/theme-provider";
import { Toggle } from "@/components/ui/toggle";
import { getBaseUrl } from "@/lib/base-url";

/**
 * Component Header hiển thị brand, menu đơn giản,
 * nút đổi ngôn ngữ và nút đổi theme light/dark
 * @returns Thanh header cố định trên cùng trang
 */
export const Header: React.FC = () => {
  const { locale, setLocale, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const baseUrl = getBaseUrl();

  /**
   * Toggle language giữa VI/EN
   */
  const handleToggleLanguage = () => {
    setLocale(locale === "vi" ? "en" : "vi");
  };

  /**
   * Toggle theme giữa light/dark
   * @param pressed - trạng thái pressed từ Toggle component
   */
  const handleToggleTheme = (pressed: boolean) => {
    setTheme(pressed ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight sm:text-xl"
        >
          tocdovps.dev
        </Link>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-4 text-xs sm:flex">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition"
            >
              {t("header.nav.about")}
            </Link>
            <Link
              href="/leaderboard"
              className="text-muted-foreground hover:text-foreground transition"
            >
              {t("header.nav.leaderboard")}
            </Link>
            <Link
              href="/docs"
              className="text-muted-foreground hover:text-foreground transition"
            >
              {t("header.nav.docs")}
            </Link>
          </nav>
          <Toggle
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="rounded-full group size-6 data-[state=on]:bg-transparent data-[state=on]:hover:bg-muted"
            onPressedChange={handleToggleTheme}
            pressed={theme === "dark"}
            variant="outline"
          >
            <MoonIcon
              aria-hidden="true"
              className="absolute shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-90 group-data-[state=on]:opacity-100"
              size={16}
            />
            <SunIcon
              aria-hidden="true"
              className="shrink-0 scale-90 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
              size={16}
            />
          </Toggle>
          <Toggle
            aria-label={`Switch to ${
              locale === "vi" ? "English" : "Vietnamese"
            }`}
            className="group size-6 rounded-full data-[state=on]:bg-transparent data-[state=on]:hover:bg-muted"
            onPressedChange={handleToggleLanguage}
            pressed={locale === "en"}
            variant="outline"
          >
            <span
              aria-hidden="true"
              className="absolute shrink-0 scale-0 opacity-0 text-xs font-medium transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
            >
              {t("header.locale.en")}
            </span>
            <span
              aria-hidden="true"
              className="shrink-0 scale-100 opacity-100 text-xs font-medium transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
            >
              {t("header.locale.vi")}
            </span>
          </Toggle>
        </div>
      </div>
    </header>
  );
};
