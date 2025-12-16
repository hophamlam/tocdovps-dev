"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/i18n-provider";
import { BenchmarkTableRow } from "@/components/benchmark/benchmark-table-row";
import type { BenchmarkRunSummary } from "@/lib/types/benchmark";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

type LeaderboardSectionProps = {
  items: BenchmarkRunSummary[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

/**
 * Component hiển thị bảng leaderboard với sorting và pagination
 * @param items - mảng các benchmark items
 * @param currentPage - trang hiện tại
 * @param totalPages - tổng số trang
 * @param totalCount - tổng số records
 * @returns Section leaderboard với bảng và controls
 */
export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  items,
  currentPage,
  totalPages,
  totalCount,
}) => {
  const { t } = useI18n();

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
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

      {/* Table (desktop + mobile, scroll ngang khi hẹp) */}
      <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card/90 shadow-lg backdrop-blur">
        <Table className="min-w-[960px]">
          <TableHeader>
            <TableRow className="border-b border-border/70 bg-muted/60 font-medium">
              <TableHead className="w-[40px]">#</TableHead>
              <TableHead className="w-[160px]">
                {t("leaderboard.table.time")}
              </TableHead>
              <TableHead>System Info</TableHead>
              <TableHead>Provider Info</TableHead>
              <TableHead className="w-[160px]">ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("leaderboard.empty")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("leaderboard.emptyDescription")}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => {
                const rank = (currentPage - 1) * 20 + index + 1;
                return (
                  <BenchmarkTableRow
                    key={item.id}
                    item={item}
                    showRank={true}
                    rank={rank}
                    showAbsoluteTime={true}
                    textSize="xs"
                  />
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {t("leaderboard.pagination.showing")
              .replace("{start}", String((currentPage - 1) * 20 + 1))
              .replace("{end}", String(Math.min(currentPage * 20, totalCount)))
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
