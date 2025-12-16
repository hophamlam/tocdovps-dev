"use client";

import React from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { BenchmarkTable } from "@/components/benchmark/benchmark-table";
import type { BenchmarkRunSummary } from "@/lib/types/benchmark";

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
    <BenchmarkTable
      items={items}
      variant="full"
      showRank={true}
      showAbsoluteTime={true}
      textSize="xs"
      currentPage={currentPage}
      pageSize={20}
      totalPages={totalPages}
      totalCount={totalCount}
      buildPageUrl={buildPageUrl}
      title={t("leaderboard.title")}
      description={t("leaderboard.description")}
      emptyMessage={t("leaderboard.empty")}
      emptyDescription={t("leaderboard.emptyDescription")}
    />
  );
};
