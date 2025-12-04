"use client";

import React, { useState } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";

/**
 * Hero section chính của landing page theo phong cách SaaS kiểu Framer
 * @returns Phần hero với title, mô tả, CTA và cụm visual benchmark
 */
export const HeroSection: React.FC = () => {
  const { t } = useI18n();
  const scriptCommand =
    "bash <(curl -fsSL https://tocdovps.dev/install)";
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
    <section className="border-b border-border bg-gradient-to-b from-background via-background to-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-16 pt-20 md:flex-row md:items-center md:pb-24 md:pt-24">
        {/* Cột trái: copy chính kiểu Framer */}
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>vps-benchmark-hophamlam • Early preview</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              {t("hero.subtitle")}
            </p>
          </div>
          <div className="space-y-3">
            <p className="max-w-md text-xs text-muted-foreground md:text-sm">
              {t("hero.ctaPrimaryNote")}
            </p>
            <div className="space-y-2 rounded-lg border border-dashed border-border bg-card/80 p-3 text-[11px] text-muted-foreground">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] uppercase tracking-wide">
                  {t("hero.scriptLabel")}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
                >
                  {copied ? t("hero.copiedButton") : t("hero.copyButton")}
                </button>
              </div>
              <pre className="whitespace-pre-wrap break-all font-mono">
                <code>{scriptCommand}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Cột phải: cụm visual benchmark kiểu collage */}
        <div className="flex-1">
          <div className="relative flex justify-end">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,_var(--color-primary)/0.25,_transparent_55%),radial-gradient(circle_at_bottom,_var(--color-accent)/0.18,_transparent_55%)] opacity-80" />

            <div className="flex w-full max-w-md flex-col gap-4">
              {/* Card leaderboard chính */}
              <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-lg backdrop-blur">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Demo VPS leaderboard
                  </span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    UI preview
                  </span>
                </div>
                <div className="overflow-hidden rounded-xl border border-border/80 bg-background/95 text-xs">
                  <div className="grid grid-cols-5 border-b border-border/70 bg-muted/60 px-3 py-2 font-medium">
                    <span>VPS</span>
                    <span className="text-center">Location</span>
                    <span className="text-center">Ping</span>
                    <span className="text-center">Down</span>
                    <span className="text-center">Score</span>
                  </div>
                  {[
                    {
                      name: "VPS A",
                      location: "SG",
                      ping: "12 ms",
                      download: "920 Mbps",
                      score: "9.3",
                    },
                    {
                      name: "VPS B",
                      location: "Tokyo",
                      ping: "18 ms",
                      download: "750 Mbps",
                      score: "8.7",
                    },
                    {
                      name: "VPS C",
                      location: "US",
                      ping: "180 ms",
                      download: "650 Mbps",
                      score: "7.4",
                    },
                  ].map((row) => (
                    <div
                      key={row.name}
                      className="grid grid-cols-5 border-t border-border/60 px-3 py-2"
                    >
                      <span className="truncate">{row.name}</span>
                      <span className="text-center">{row.location}</span>
                      <span className="text-center">{row.ping}</span>
                      <span className="text-center">{row.download}</span>
                      <span className="text-center font-semibold text-primary">
                        {row.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hai card phụ xếp lệch kiểu Framer */}
              <div className="flex gap-4">
                <div className="flex-1 rounded-2xl border border-border/60 bg-card/95 p-3 text-[11px] shadow-md backdrop-blur">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">Network latency</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                      ms
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    Low ping from VN → SG, JP, US for common VPS locations.
                  </p>
                </div>
                <div className="flex-1 rounded-2xl border border-border/60 bg-card/95 p-3 text-[11px] shadow-md backdrop-blur">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">Disk I/O (planned)</span>
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent-foreground">
                      coming soon
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    Simple, repeatable tests for real-world VPS workloads.
                  </p>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground">
                Demo data only – benchmark engine & real measurements will be
                implemented later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


