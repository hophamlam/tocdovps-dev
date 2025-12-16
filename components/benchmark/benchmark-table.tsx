"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/i18n-provider";
import { BenchmarkTableRow } from "@/components/benchmark/benchmark-table-row";
import { BenchmarkTableRowCompact } from "@/components/benchmark/benchmark-table-row-compact";
import type { BenchmarkRunSummary } from "@/lib/types/benchmark";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

type BenchmarkTableVariant = "compact" | "full";

type BenchmarkTableProps = {
  /**
   * Danh sách benchmark items
   */
  items: BenchmarkRunSummary[];
  /**
   * Variant của table: "compact" cho landing page, "full" cho leaderboard
   */
  variant?: BenchmarkTableVariant;
  /**
   * Hiển thị rank (số thứ tự)
   */
  showRank?: boolean;
  /**
   * Hiển thị absolute time (dd/mm/yyyy HH:mm:ss)
   */
  showAbsoluteTime?: boolean;
  /**
   * Hiển thị View button
   */
  showViewButton?: boolean;
  /**
   * Size của text
   */
  textSize?: "xs" | "sm";
  /**
   * Trang hiện tại (cho tính rank)
   */
  currentPage?: number;
  /**
   * Số items per page (cho tính rank)
   */
  pageSize?: number;
  /**
   * Tổng số trang (cho pagination)
   */
  totalPages?: number;
  /**
   * Tổng số records (cho pagination)
   */
  totalCount?: number;
  /**
   * Callback để build page URL (cho pagination)
   */
  buildPageUrl?: (page: number) => string;
  /**
   * Title của section
   */
  title?: string;
  /**
   * Description của section
   */
  description?: string;
  /**
   * Empty state message
   */
  emptyMessage?: string;
  /**
   * Empty state description
   */
  emptyDescription?: string;
};

/**
 * Component chung để hiển thị bảng benchmark
 * Có thể dùng cho cả landing page và leaderboard page
 * @param props - Configuration props
 * @returns Benchmark table component
 */
export const BenchmarkTable: React.FC<BenchmarkTableProps> = ({
  items,
  variant = "compact",
  showRank = false,
  showAbsoluteTime = false,
  showViewButton = false,
  textSize = "xs",
  currentPage = 1,
  pageSize = 20,
  totalPages,
  totalCount,
  buildPageUrl,
  title,
  description,
  emptyMessage,
  emptyDescription,
}) => {
  const { t } = useI18n();

  const isCompact = variant === "compact";
  const showPagination = !isCompact && totalPages && totalPages > 1;

  // Render table header dựa trên variant
  const renderTableHeader = () => {
    if (isCompact) {
      return (
        <thead>
          <tr className="border-b border-border bg-muted/60 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <th className="px-3 py-2 text-left">
              {t("latestBenchmarks.table.time")}
            </th>
            <th className="px-3 py-2 text-left">
              {t("latestBenchmarks.table.label")}
            </th>
            <th className="px-3 py-2 text-right">
              {t("latestBenchmarks.table.ping")}
            </th>
            <th className="px-3 py-2 text-right">
              {t("latestBenchmarks.table.download")}
            </th>
            <th className="px-3 py-2 text-right">
              {t("latestBenchmarks.table.score")}
            </th>
          </tr>
        </thead>
      );
    }

    return (
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
    );
  };

  // Render table body
  const renderTableBody = () => {
    if (items.length === 0) {
      const emptyMsg = emptyMessage || t("latestBenchmarks.empty");
      const emptyDesc =
        emptyDescription || t("latestBenchmarks.emptyDescription");

      if (isCompact) {
        return (
          <tbody>
            <tr>
              <td colSpan={5} className="px-4 py-12 text-center">
                <p className="text-sm text-muted-foreground">{emptyMsg}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {emptyDesc}
                </p>
              </td>
            </tr>
          </tbody>
        );
      }

      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="px-4 py-16">
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  {emptyMsg}
                </p>
                <p className="text-xs text-muted-foreground">{emptyDesc}</p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    const rows = items.map((item, index) => {
      if (isCompact) {
        return (
          <BenchmarkTableRowCompact
            key={item.id}
            item={item}
            textSize={textSize}
          />
        );
      }

      const rank = showRank
        ? (currentPage - 1) * pageSize + index + 1
        : undefined;

      return (
        <BenchmarkTableRow
          key={item.id}
          item={item}
          showRank={showRank}
          rank={rank}
          showAbsoluteTime={showAbsoluteTime}
          showViewButton={showViewButton}
          textSize={textSize}
        />
      );
    });

    if (isCompact) {
      return <tbody>{rows}</tbody>;
    }

    // For full variant, wrap rows in TableBody
    // Note: BenchmarkTableRow returns <tr>, which is compatible with shadcn Table
    return <TableBody>{rows}</TableBody>;
  };

  // Render pagination
  const renderPagination = () => {
    if (!showPagination || !buildPageUrl || !totalCount) return null;

    return (
      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {t("leaderboard.pagination.showing")
            .replace("{start}", String((currentPage - 1) * pageSize + 1))
            .replace("{end}", String(Math.min(currentPage * pageSize, totalCount)))
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
          {currentPage < totalPages! && (
            <Link
              href={buildPageUrl(currentPage + 1)}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition"
            >
              {t("leaderboard.pagination.next")}
            </Link>
          )}
        </div>
      </div>
    );
  };

  // Render section header (title + description)
  const renderSectionHeader = () => {
    if (isCompact) {
      if (!title && !description) return null;
      return (
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            {title && (
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="mb-8 space-y-2">
        {title && (
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    );
  };

  // Render table wrapper
  const renderTable = () => {
    if (isCompact) {
      return (
        <div className="overflow-x-auto rounded-xl border border-border bg-card/80 text-xs">
          <table className="min-w-full border-collapse">
            {renderTableHeader()}
            {renderTableBody()}
          </table>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card/90 shadow-lg backdrop-blur">
        <Table className="min-w-[960px]">
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
      </div>
    );
  };

  // Render section wrapper
  if (isCompact) {
    return (
      <section className="border-t border-border bg-background/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:py-10">
          {renderSectionHeader()}
          {renderTable()}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      {renderSectionHeader()}
      {renderTable()}
      {renderPagination()}
    </section>
  );
};

