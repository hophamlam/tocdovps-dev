"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { getBaseUrl } from "@/lib/base-url";

type HeroSectionProps = {
  totalBenchmarks?: number;
};

/**
 * Hero section chính của landing page theo phong cách SaaS kiểu Framer
 * @param totalBenchmarks - tổng số lần benchmark (optional)
 * @returns Phần hero với title, mô tả, CTA và cụm visual benchmark
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  totalBenchmarks = 0,
}) => {
  const { t } = useI18n();
  const baseUrl = getBaseUrl();
  const scriptCommand = `bash <(curl -fsSL ${baseUrl}/install)`;
  const typingLine = `$ ${scriptCommand}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="relative border-b border-border bg-gradient-to-b from-background via-background to-muted/40 overflow-hidden">
      {/* Grid background overlay - adaptive cho light/dark mode */}
      <div className="pointer-events-none absolute inset-0 [background-size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[linear-gradient(to_right,rgb(0_0_0/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.08)_1px,transparent_1px)]"></div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 pb-20 pt-24 text-center md:pb-32 md:pt-32">
        {totalBenchmarks > 0 ? (
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur transition hover:bg-card hover:text-foreground"
          >
            <span>
              {t("hero.benchmarkCount").replace(
                "{count}",
                totalBenchmarks.toLocaleString()
              )}
            </span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>tocdovps.dev • Early preview</span>
          </div>
        )}

        <div className="space-y-4">
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
            {t("hero.subtitle")}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <span className="truncate font-mono text-xs sm:text-sm">
              {scriptCommand}
            </span>
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10">
              {copied ? (
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3">
                  <path
                    fill="currentColor"
                    d="M6.00016 10.8002L3.20016 8.00016L2.26683 8.9335L6.00016 12.6668L14.0002 4.66683L13.0668 3.7335L6.00016 10.8002Z"
                  />
                </svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3">
                  <path
                    fill="currentColor"
                    d="M4 1h9v11H4V1Zm1 1v9h7V2H5Zm-3 3h1v9h8v1H2V5Z"
                  />
                </svg>
              )}
            </span>
          </button>
          <Link
            href="/docs"
            className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition hover:bg-muted"
          >
            {t("hero.ctaSecondary")}
          </Link>
        </div>
      </div>
    </section>
  );
};
