 "use client";

import React from "react";
import { useI18n } from "@/components/i18n/i18n-provider";

type Stats = {
  totalCount: number;
  avgScore: number | null;
  avgDownloadMbps: number | null;
};

type StatsSectionProps = {
  stats: Stats;
};

/**
 * Section hiển thị mini-dashboard thống kê tổng quan
 * @param stats - số lượng benchmark, điểm trung bình và tốc độ tải xuống trung bình
 * @returns Các thẻ stats nhỏ hiển thị ngay dưới Hero
 */
export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const { t } = useI18n();

  const formattedAvgScore =
    stats.avgScore !== null ? stats.avgScore.toFixed(2) : "—";
  const formattedAvgDownload =
    stats.avgDownloadMbps !== null
      ? `${stats.avgDownloadMbps.toFixed(2)} Mbps`
      : "—";

  return (
    <section className="border-b border-border/60 bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row md:items-stretch md:justify-between md:py-8">
        <div className="mb-2 md:mb-0 md:w-1/3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            vps-benchmark-hophamlam
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("stats.subtitle")}
          </p>
        </div>
        <div className="grid flex-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-border/70 bg-card/90 p-3 shadow-sm">
            <p className="text-[11px] font-medium text-muted-foreground">
              {t("stats.totalRuns")}
            </p>
            <p className="mt-1 text-xl font-semibold">
              {stats.totalCount.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card/90 p-3 shadow-sm">
            <p className="text-[11px] font-medium text-muted-foreground">
              {t("stats.avgScore")}
            </p>
            <p className="mt-1 text-xl font-semibold text-primary">
              {formattedAvgScore}
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card/90 p-3 shadow-sm">
            <p className="text-[11px] font-medium text-muted-foreground">
              {t("stats.avgDownload")}
            </p>
            <p className="mt-1 text-xl font-semibold">
              {formattedAvgDownload}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};


