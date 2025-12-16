import React from "react";
import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/landing/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { BannerSection } from "@/components/landing/banner";
import { Footer } from "@/components/layout/footer";
import { LatestBenchmarksSection } from "@/components/landing/latest-benchmarks";
import { db } from "@/lib/db";
import type { BenchmarkRunSummary } from "@/lib/types/benchmark";

/**
 * Trang landing chính cho tocdovps.dev
 * @returns Landing page gồm Hero, banner, và danh sách benchmark mới nhất
 */
export default async function Home() {
  let latestItems: BenchmarkRunSummary[] = [];

  let totalCount = 0;

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
      idDisplay: row.id.slice(-6), // Hiển thị 6 ký tự cuối
      createdAt: new Date(row.created_at).toISOString(),
      serverLabel: row.server_label,
      avgPingMs: row.avg_ping_ms ? parseFloat(row.avg_ping_ms) : null,
      downloadMbps: row.download_mbps ? parseFloat(row.download_mbps) : null,
      score: row.score ? parseFloat(row.score) : null,
      visibility: "shared", // Default cho landing page
      provider: null,
      providerSlug: null,
      os: null,
      osVersion: null,
      osFamily: null,
      osSlug: null,
      osDisplay: null,
      virtualization: null,
      virtualizationSlug: null,
      regionCity: null,
      regionRegion: null,
      regionCountryCode: null,
      cpuModel: null,
      cpuCores: null,
      ramGB: null,
      diskGB: null,
    }));

    const [countResult] = await db/* sql */ `
        SELECT COUNT(*)::bigint AS total_count
        FROM benchmark_runs
        WHERE score IS NOT NULL
           OR download_mbps IS NOT NULL
           OR avg_ping_ms IS NOT NULL
      `;

    totalCount = Number(countResult.total_count ?? 0);
  } catch (error) {
    // Log error nhưng không crash page
    console.error("Failed to fetch latest benchmarks:", error);
    // latestItems sẽ là empty array, component sẽ hiển thị empty state
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection totalBenchmarks={totalCount} />
        <HowItWorksSection />
        <BannerSection />
        <LatestBenchmarksSection items={latestItems} />
      </main>
      <Footer />
    </div>
  );
}
