"use client";

import React from "react";
import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useI18n } from "@/components/i18n/i18n-provider";

/**
 * Global error boundary cho Next.js App Router
 * @param error - Error object từ React error boundary
 * @param reset - Function để reset error state
 * @returns Error page với message và retry button
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    // Log error to console hoặc error tracking service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 md:py-32">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                {t("error.generic.title")}
              </h1>
              <p className="text-sm text-muted-foreground md:text-base">
                {t("error.generic.description")}
              </p>
              {process.env.NODE_ENV === "development" && error.message && (
                <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-left">
                  <p className="text-xs font-mono text-destructive">
                    {error.message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
              <button
                onClick={reset}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                {t("error.generic.retry")}
              </button>
              <Link
                href="/"
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                {t("error.generic.backHome")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

