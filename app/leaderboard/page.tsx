import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LeaderboardSection } from "@/components/leaderboard/leaderboard-section";
import { db } from "@/lib/db";
import type { BenchmarkRunSummary } from "@/lib/types/benchmark";

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
  const pageSize = 50;
  const offset = (page - 1) * pageSize;

  // Query benchmarks với ORDER BY phù hợp
  type BenchmarkRow = {
    id: string;
    created_at: string;
    server_label: string | null;
    avg_ping_ms: string | null;
    download_mbps: string | null;
    score: string | null;
  };

  let rows: BenchmarkRow[] = [];
  let totalCount = 0;
  let totalPages = 0;

  try {
    rows = (await db/* sql */ `
      SELECT
        id,
        created_at,
        server_label,
        avg_ping_ms,
        download_mbps,
        score
      FROM benchmark_runs
      WHERE score IS NOT NULL
        OR download_mbps IS NOT NULL
        OR avg_ping_ms IS NOT NULL
      ORDER BY created_at DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `) as BenchmarkRow[];

    // Get total count for pagination
    const countRows = await db/* sql */ `
      SELECT COUNT(*) as count
      FROM benchmark_runs
      WHERE score IS NOT NULL
        OR download_mbps IS NOT NULL
        OR avg_ping_ms IS NOT NULL
    `;
    const [countResult] = countRows as { count: string }[];
    totalCount = countResult ? parseInt(countResult.count, 10) : 0;
    totalPages = Math.ceil(totalCount / pageSize);
  } catch (error) {
    // Log error nhưng không crash page
    console.error("Failed to fetch leaderboard data:", error);
    // rows, totalCount, totalPages sẽ là default values
  }

  const items: BenchmarkRunSummary[] = rows.map((row) => ({
    id: row.id,
    createdAt: new Date(row.created_at).toISOString(),
    serverLabel: row.server_label,
    avgPingMs: row.avg_ping_ms ? parseFloat(row.avg_ping_ms) : null,
    downloadMbps: row.download_mbps ? parseFloat(row.download_mbps) : null,
    score: row.score ? parseFloat(row.score) : null,
  }));

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
