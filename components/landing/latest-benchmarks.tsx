"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/i18n-provider";

type LatestBenchmarkItem = {
  id: string;
  createdAt: string;
  serverLabel: string | null;
  avgPingMs: string | null;
  downloadMbps: string | null;
  score: string | null;
};

type LatestBenchmarksSectionProps = {
  items: LatestBenchmarkItem[];
};

/**
 * Section hiển thị danh sách các lần benchmark mới nhất
 * @param items - mảng các record benchmark đã được map từ DB
 * @returns Một section bảng nhỏ trên landing page
 */
export const LatestBenchmarksSection: React.FC<LatestBenchmarksSectionProps> = ({
  items,
}) => {
  const { t } = useI18n();

  return (
    <section className="border-t border-border bg-background/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:py-10">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t("latestBenchmarks.title")}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t("latestBenchmarks.description")}
            </p>
          </div>
        </div>
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/80 p-12 text-center">
            <p className="text-sm text-muted-foreground">
              {t("latestBenchmarks.empty")}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("latestBenchmarks.emptyDescription")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card/80 text-xs">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/60 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 text-left">{t("latestBenchmarks.table.time")}</th>
                  <th className="px-3 py-2 text-left">{t("latestBenchmarks.table.label")}</th>
                  <th className="px-3 py-2 text-right">{t("latestBenchmarks.table.ping")}</th>
                  <th className="px-3 py-2 text-right">{t("latestBenchmarks.table.download")}</th>
                  <th className="px-3 py-2 text-right">{t("latestBenchmarks.table.score")}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-border/60 hover:bg-muted/30"
                >
                  <td className="px-3 py-2 align-middle text-[11px] text-muted-foreground">
                    {item.createdAt}
                  </td>
                    <td className="max-w-[160px] px-3 py-2 align-middle text-[11px]">
                      <Link
                        href={`/result/${item.id}`}
                        className="line-clamp-2 break-words hover:text-primary hover:underline"
                      >
                        {item.serverLabel || "—"}
                      </Link>
                    </td>
                  <td className="px-3 py-2 text-right align-middle text-[11px]">
                    {item.avgPingMs ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-right align-middle text-[11px]">
                    {item.downloadMbps ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-right align-middle text-[11px] font-semibold text-primary">
                    {item.score ?? "—"}
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};


