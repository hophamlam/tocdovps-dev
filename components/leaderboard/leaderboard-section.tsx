"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/i18n-provider";

type BenchmarkItem = {
  id: string;
  createdAt: string;
  serverLabel: string | null;
  avgPingMs: number | null;
  downloadMbps: number | null;
  score: number | null;
};

type SortBy = "score" | "download" | "ping" | "date";

type LeaderboardSectionProps = {
  items: BenchmarkItem[];
  sortBy: SortBy;
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

/**
 * Component hiển thị bảng leaderboard với sorting và pagination
 * @param items - mảng các benchmark items
 * @param sortBy - cách sắp xếp hiện tại
 * @param currentPage - trang hiện tại
 * @param totalPages - tổng số trang
 * @param totalCount - tổng số records
 * @returns Section leaderboard với bảng và controls
 */
export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  items,
  sortBy,
  currentPage,
  totalPages,
  totalCount,
}) => {
  const { t } = useI18n();

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const buildSortUrl = (newSortBy: SortBy) => {
    const params = new URLSearchParams();
    params.set("sortBy", newSortBy);
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }
    return `/leaderboard?${params.toString()}`;
  };

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("sortBy", sortBy);
    if (page > 1) {
      params.set("page", page.toString());
    }
    return `/leaderboard?${params.toString()}`;
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {t("leaderboard.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("leaderboard.description")}
        </p>
      </div>

      {/* Sort controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card/80 p-4">
        <span className="text-xs font-medium text-muted-foreground">
          {t("leaderboard.sortBy")}:
        </span>
        <div className="flex flex-wrap gap-2">
          {(["score", "download", "ping", "date"] as SortBy[]).map((option) => (
            <Link
              key={option}
              href={buildSortUrl(option)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                sortBy === option
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t(`leaderboard.sort.${option}`)}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card/90 shadow-lg backdrop-blur">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-muted/60 font-medium">
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground">
                {t("leaderboard.table.time")}
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground">
                {t("leaderboard.table.label")}
              </th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground">
                {t("leaderboard.table.ping")}
              </th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground">
                {t("leaderboard.table.download")}
              </th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground">
                {t("leaderboard.table.score")}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("leaderboard.empty")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("leaderboard.emptyDescription")}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const rank = (currentPage - 1) * 50 + index + 1;
                return (
                  <tr
                    key={item.id}
                    className="border-t border-border/60 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      {rank}
                    </td>
                    <td className="px-4 py-3 text-left text-xs text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-left">
                      <Link
                        href={`/result/${item.id}`}
                        className="text-xs hover:text-primary hover:underline"
                      >
                        {item.serverLabel || "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right text-xs">
                      {item.avgPingMs !== null
                        ? `${item.avgPingMs.toFixed(2)} ms`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-xs">
                      {item.downloadMbps !== null
                        ? `${item.downloadMbps.toFixed(2)} Mbps`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-semibold text-primary">
                      {item.score !== null ? item.score.toFixed(2) : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {t("leaderboard.pagination.showing")
              .replace("{start}", String((currentPage - 1) * 50 + 1))
              .replace("{end}", String(Math.min(currentPage * 50, totalCount)))
              .replace("{total}", String(totalCount))}
          </p>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={buildPageUrl(currentPage - 1)}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition"
              >
                {t("leaderboard.pagination.previous")}
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={buildPageUrl(currentPage + 1)}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition"
              >
                {t("leaderboard.pagination.next")}
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

