import React from "react";
import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/landing/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { BannerSection } from "@/components/landing/banner";
import { Footer } from "@/components/layout/footer";
import { LeaderboardSection } from "@/components/leaderboard/leaderboard-section";
import type { BenchmarkRunSummary } from "@/lib/types/benchmark";
import { BenchmarkRepository } from "@/lib/repositories/benchmark.repository";

/**
 * Trang landing chính cho tocdovps.dev
 * @returns Landing page gồm Hero, banner, và danh sách benchmark mới nhất
 */
export default async function Home() {
  let latestItems: BenchmarkRunSummary[] = [];
  let totalCount = 0;

  try {
    // Sử dụng repository để lấy latest benchmarks
    const result = await BenchmarkRepository.getBenchmarks({
      limit: 10,
      offset: 0,
    });
    latestItems = result.items;

    // Lấy total count
    totalCount = await BenchmarkRepository.getTotalCount();
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
        <LeaderboardSection
          items={latestItems}
          currentPage={1}
          totalPages={1}
          totalCount={latestItems.length}
        />
      </main>
      <Footer />
    </div>
  );
}
