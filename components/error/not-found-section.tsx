"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/i18n-provider";

/**
 * Component hiển thị trang 404 Not Found
 * @returns Section với message và navigation links
 */
export const NotFoundSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 md:py-32">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground md:text-8xl">
            404
          </h1>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {t("error.notFound.title")}
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            {t("error.notFound.description")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            {t("error.notFound.backHome")}
          </Link>
          <Link
            href="/leaderboard"
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            {t("error.notFound.viewLeaderboard")}
          </Link>
        </div>
      </div>
    </section>
  );
};

