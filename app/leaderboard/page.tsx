import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LeaderboardSection } from "@/components/leaderboard/leaderboard-section";
import type { BenchmarkRunSummary } from "@/lib/types/benchmark";
import { BenchmarkRepository } from "@/lib/repositories/benchmark.repository";

/**
 * Trang leaderboard hiển thị top benchmarks
 * @param searchParams - query params từ URL (sortBy, page)
 * @returns Trang leaderboard với bảng xếp hạng benchmarks
 */
export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ sortBy?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  let items: BenchmarkRunSummary[] = [];
  let totalCount = 0;
  let totalPages = 0;

  try {
    // Sử dụng repository để lấy benchmarks với pagination
    const result = await BenchmarkRepository.getBenchmarks({
      limit: pageSize,
      offset,
    });
    items = result.items;
    totalCount = result.totalCount;
    totalPages = Math.ceil(totalCount / pageSize);
  } catch (error) {
    // Log error nhưng không crash page
    console.error("Failed to fetch leaderboard data:", error);
    // items, totalCount, totalPages sẽ là default values
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <LeaderboardSection
          items={items}
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
        />
      </main>
      <Footer />
    </div>
  );
}
