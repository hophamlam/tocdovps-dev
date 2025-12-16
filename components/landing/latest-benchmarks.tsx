"use client";

import React from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { BenchmarkTable } from "@/components/benchmark/benchmark-table";
import type { BenchmarkRunSummary } from "@/lib/types/benchmark";

type LatestBenchmarksSectionProps = {
  items: BenchmarkRunSummary[];
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
    <BenchmarkTable
      items={items}
      variant="compact"
                    textSize="xs"
      title={t("latestBenchmarks.title")}
      description={t("latestBenchmarks.description")}
      emptyMessage={t("latestBenchmarks.empty")}
      emptyDescription={t("latestBenchmarks.emptyDescription")}
    />
  );
};


