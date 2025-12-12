"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { getBaseUrl } from "@/lib/base-url";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal";

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

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-16 pt-20 md:flex-row md:items-center md:pb-24 md:pt-24">
        {/* Cột trái: copy chính kiểu Framer */}
        <div className="flex-1 space-y-8">
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
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              {t("hero.subtitle")}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <span className="truncate font-mono">{scriptCommand}</span>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/10">
                {copied ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-3 w-3"
                  >
                    <path
                      fill="currentColor"
                      d="M6.00016 10.8002L3.20016 8.00016L2.26683 8.9335L6.00016 12.6668L14.0002 4.66683L13.0668 3.7335L6.00016 10.8002Z"
                    />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-3 w-3"
                  >
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
              className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-medium transition hover:bg-muted"
            >
              {t("hero.ctaSecondary")}
            </Link>
          </div>
        </div>

        {/* Cột phải: Terminal demo script benchmark */}
        <div className="flex-1">
          <div className="relative flex justify-end">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,_var(--color-primary)/0.25,_transparent_55%),radial-gradient(circle_at_bottom,_var(--color-accent)/0.18,_transparent_55%)] opacity-80" />

            <div className="w-full max-w-md">
              <Terminal className="max-h-[400px] shadow-lg overflow-y-auto">
                <TypingAnimation>{typingLine.toString()}</TypingAnimation>

                <AnimatedSpan className="text-foreground">
                  ============================================================
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground font-semibold">
                  &nbsp;&nbsp;tocdovps.dev (VPS benchmark)
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground">
                  ============================================================
                </AnimatedSpan>

                <AnimatedSpan className="text-muted-foreground">
                  [i] Estimated runtime ~15 minutes (disk, FIO, speedtest)...
                </AnimatedSpan>
                <AnimatedSpan className="text-muted-foreground">
                  Share results?
                </AnimatedSpan>
                <AnimatedSpan className="text-muted-foreground">
                  &nbsp;&nbsp;1) local&nbsp;&nbsp;&nbsp;- Keep local only
                </AnimatedSpan>
                <AnimatedSpan className="text-muted-foreground">
                  &nbsp;&nbsp;2) private - Private URL
                </AnimatedSpan>
                <AnimatedSpan className="text-muted-foreground">
                  &nbsp;&nbsp;3) shared&nbsp;&nbsp;- Public
                </AnimatedSpan>
                <AnimatedSpan className="text-muted-foreground">
                  Choose (1/2/3) [default: 1]:
                </AnimatedSpan>

                <AnimatedSpan className="text-muted-foreground">
                  1. System Information
                </AnimatedSpan>
                <AnimatedSpan className="text-muted-foreground">
                  CPU&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Intel(R) Xeon(R) CPU
                  E5-2680 v4 @ 2.40GHz
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground">
                  Cores&nbsp;&nbsp;: 4
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground">
                  RAM&nbsp;&nbsp;&nbsp;&nbsp;: 8.00 GB (Available: 6.50 GB)
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground">
                  OS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Ubuntu - 22.04.3 LTS
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground">
                  Virt&nbsp;&nbsp;&nbsp;: KVM
                </AnimatedSpan>

                <AnimatedSpan className="text-foreground">
                  ============================================================
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground font-semibold">
                  &nbsp;&nbsp;2. Disk I/O Test
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground">
                  ============================================================
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground">
                  DD write avg : 2956 MB/s
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground">
                  DD read&nbsp; avg : 4519 MB/s
                </AnimatedSpan>

                <AnimatedSpan className="text-foreground">
                  ============================================================
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground font-semibold">
                  &nbsp;&nbsp;3. FIO Benchmark
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground">
                  ============================================================
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground">
                  4k&nbsp;&nbsp; | Read 0 MB/s | Write 0 MB/s | IOPS 0
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground">
                  1M&nbsp;&nbsp; | Read 0 MB/s | Write 0 MB/s | IOPS 0
                </AnimatedSpan>

                <AnimatedSpan className="text-foreground">
                  ============================================================
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground font-semibold">
                  &nbsp;&nbsp;4. Network Speed (Ookla)
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground">
                  ============================================================
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground">
                  Server | Ping | Download | Upload
                </AnimatedSpan>
                <AnimatedSpan className="text-blue-500">
                  VN HCM Viettel | 2.7ms | 83.3 Mbps| 93.3 Mbps
                </AnimatedSpan>
                <AnimatedSpan className="text-blue-500">
                  SG Singtel | 44ms | 22.0 Mbps| 92.9 Mbps
                </AnimatedSpan>
                <AnimatedSpan className="text-blue-500">
                  US LA Hivelocity | 174ms | 17.1 Mbps| 93.3 Mbps
                </AnimatedSpan>
              </Terminal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
