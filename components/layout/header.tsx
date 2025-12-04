"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/i18n-provider";
import type { Locale } from "@/lib/i18n/config";
import { useTheme } from "@/components/theme/theme-provider";

/**
 * Component Header hiển thị brand, menu đơn giản,
 * nút đổi ngôn ngữ và nút đổi theme light/dark
 * @returns Thanh header cố định trên cùng trang
 */
export const Header: React.FC = () => {
  const { locale, setLocale, t } = useI18n();
  const { theme, setTheme } = useTheme();

  /**
   * Xử lý đổi ngôn ngữ giữa VI/EN
   * @param nextLocale - locale được chọn
   */
  const handleLocaleChange = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    setLocale(nextLocale);
  };

  /**
   * Toggle theme giữa light/dark
   */
  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">
            {t("header.brand")}
          </span>
          <span className="text-xs text-muted-foreground">
            VPS benchmark landing (UI preview)
          </span>
        </div>
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
          </nav>
          <button
            type="button"
            onClick={handleToggleTheme}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-xs"
            aria-label="Toggle color theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <div className="flex items-center gap-1 rounded-full border border-border bg-card px-1 py-0.5 text-xs">
            <button
              type="button"
              onClick={() => handleLocaleChange("vi")}
              className={`rounded-full px-2 py-0.5 ${
                locale === "vi"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("header.locale.vi")}
            </button>
            <button
              type="button"
              onClick={() => handleLocaleChange("en")}
              className={`rounded-full px-2 py-0.5 ${
                locale === "en"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("header.locale.en")}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};



