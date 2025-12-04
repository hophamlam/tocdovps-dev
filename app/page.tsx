import React from "react";
import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/landing/hero";
import { BannerSection } from "@/components/landing/banner";
import { Footer } from "@/components/layout/footer";
import { LatestBenchmarksSection } from "@/components/landing/latest-benchmarks";
import { StatsSection } from "@/components/landing/stats-section";
import { db } from "@/lib/db";

/**
 * Trang landing chính cho vps-benchmark-hophamlam
 * @returns Landing page gồm Hero, banner, và danh sách benchmark mới nhất
 */
export default async function Home() {
  let latestItems: Array<{
    id: string;
    createdAt: string;
    serverLabel: string | null;
    avgPingMs: string | null;
    downloadMbps: string | null;
    score: string | null;
  }> = [];

  let stats: {
    totalCount: number;
    avgScore: number | null;
    avgDownloadMbps: number | null;
  } = {
    totalCount: 0,
    avgScore: null,
    avgDownloadMbps: null,
  };

  try {
    const rows = (await db/* sql */ `
        SELECT
          id,
          created_at,
          server_label,
          avg_ping_ms,
          download_mbps,
          score
        FROM benchmark_runs
        ORDER BY created_at DESC
        LIMIT 10
      `) as Array<{
      id: string;
      created_at: string;
      server_label: string | null;
      avg_ping_ms: string | null;
      download_mbps: string | null;
      score: string | null;
    }>;

    latestItems = rows.map((row) => ({
      id: row.id,
      createdAt: new Date(row.created_at)
        .toISOString()
        .replace("T", " ")
        .replace("Z", ""),
      serverLabel: row.server_label,
      avgPingMs: row.avg_ping_ms ?? null,
      downloadMbps: row.download_mbps ?? null,
      score: row.score ?? null,
    }));

    const [agg] = await db/* sql */ `
        SELECT
          COUNT(*)::bigint          AS total_count,
          AVG(score)::numeric       AS avg_score,
          AVG(download_mbps)::numeric AS avg_download_mbps
        FROM benchmark_runs
        WHERE score IS NOT NULL
           OR download_mbps IS NOT NULL
           OR avg_ping_ms IS NOT NULL
      `;

    stats = {
      totalCount: Number(agg.total_count ?? 0),
      avgScore:
        agg.avg_score !== null && agg.avg_score !== undefined
          ? Number(agg.avg_score)
          : null,
      avgDownloadMbps:
        agg.avg_download_mbps !== null && agg.avg_download_mbps !== undefined
          ? Number(agg.avg_download_mbps)
          : null,
    };
  } catch (error) {
    // Log error nhưng không crash page
    console.error("Failed to fetch latest benchmarks:", error);
    // latestItems sẽ là empty array, component sẽ hiển thị empty state
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <StatsSection stats={stats} />
        <BannerSection />
        <LatestBenchmarksSection items={latestItems} />
      </main>
      <Footer />
    </div>
  );
}
