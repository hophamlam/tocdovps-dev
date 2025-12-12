"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/i18n-provider";
import { getBaseUrl } from "@/lib/base-url";

/**
 * Footer với layout grid, quick links và social links
 * @returns Footer ở cuối trang với các sections
 */
export const Footer: React.FC = () => {
  const { t } = useI18n();
  const baseUrl = getBaseUrl();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Brand & Description */}
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-block text-lg font-semibold hover:text-foreground transition-colors sm:text-xl"
            >
              tocdovps.dev
            </Link>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("footer.links.title")}
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("footer.links.home")}
              </Link>
              <Link
                href="/leaderboard"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("footer.links.leaderboard")}
              </Link>
              <Link
                href="/#how-it-works"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("footer.links.howItWorks")}
              </Link>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border/60 pt-6">
          <p className="text-center text-xs text-muted-foreground">
            <Link
              href="https://github.com/hophamlam/tocdovps-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              aria-label="Open source on GitHub"
            >
              {t("footer.copyright.openSource")}
            </Link>{" "}
            {t("footer.copyright.by")}{" "}
            <Link
              href="https://hophamlam.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              aria-label="Visit hophamlam.com"
            >
              hophamlam
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};
