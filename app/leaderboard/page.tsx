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
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  // Query benchmarks từ view đã join lookup tables và chuẩn hóa ID hiển thị
  type BenchmarkRow = {
    id: string;
    id_display: string;
    created_at: string;
    server_label: string | null;
    avg_ping_ms: string | null;
    download_mbps: string | null;
    score: string | null;
    visibility: string | null;
    // Provider info
    provider_display_name: string | null;
    provider_slug: string | null;
    // OS info
    os_name: string | null;
    os_version: string | null;
    os_family: string | null;
    os_slug: string | null;
    // Virtualization info
    virtualization_name: string | null;
    virtualization_slug: string | null;
    // Region info
    region_city: string | null;
    region_region: string | null;
    region_country_code: string | null;
    // System info (JSONB)
    system_info: unknown;
  };

  let rows: BenchmarkRow[] = [];
  let totalCount = 0;
  let totalPages = 0;

  try {
    rows = (await db/* sql */ `
      SELECT
        id,
        id_display,
        created_at,
        server_label,
        avg_ping_ms,
        download_mbps,
        score,
        visibility,
        system_info,
        provider_display_name,
        provider_slug,
        os_name,
        os_version,
        os_family,
        os_slug,
        virtualization_name,
        virtualization_slug,
        region_city,
        region_region,
        region_country_code
      FROM public.benchmark_leaderboard_view
      ORDER BY created_at DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `) as BenchmarkRow[];

    // Get total count for pagination
    const countRows = await db/* sql */ `
      SELECT COUNT(*) as count
      FROM benchmark_runs br
    `;
    const [countResult] = countRows as { count: string }[];
    totalCount = countResult ? parseInt(countResult.count, 10) : 0;
    totalPages = Math.ceil(totalCount / pageSize);
  } catch (error) {
    // Log error nhưng không crash page
    console.error("Failed to fetch leaderboard data:", error);
    // rows, totalCount, totalPages sẽ là default values
  }

  const items: BenchmarkRunSummary[] = rows.map((row) => {
    // Parse system_info JSONB để lấy CPU, RAM, Disk, OS display
    let cpuModel: string | null = null;
    let cpuCores: number | null = null;
    let ramGB: number | null = null;
    let diskGB: number | null = null;
    let osDisplay: string | null = null;

    if (row.system_info && typeof row.system_info === "object") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const systemInfo = row.system_info as Record<string, any>;
      cpuModel = systemInfo.cpuModel || systemInfo.cpu_model || null;
      cpuCores =
        systemInfo.cores !== undefined
          ? Number(systemInfo.cores)
          : systemInfo.cpu_cores !== undefined
          ? Number(systemInfo.cpu_cores)
          : null;
      ramGB =
        systemInfo.ramGB !== undefined
          ? Number(systemInfo.ramGB)
          : systemInfo.ram_gb !== undefined
          ? Number(systemInfo.ram_gb)
          : null;
      diskGB =
        systemInfo.diskTotalGB !== undefined
          ? Number(systemInfo.diskTotalGB)
          : systemInfo.disk_total_gb !== undefined
          ? Number(systemInfo.disk_total_gb)
          : null;

      // OS detail trong system_info.os (ví dụ: Ubuntu 24.04.1 LTS (Noble Numbat))
      const osInfo = systemInfo.os;
      if (osInfo && typeof osInfo === "object") {
        const osNameFromSystem =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (osInfo as Record<string, any>).name ?? row.os_name ?? null;
        const osVersionFromSystem =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (osInfo as Record<string, any>).version ?? null;

        if (osNameFromSystem && osVersionFromSystem) {
          osDisplay = `${osNameFromSystem} ${osVersionFromSystem}`;
        } else if (osNameFromSystem) {
          osDisplay = osNameFromSystem;
        } else if (osVersionFromSystem) {
          osDisplay = osVersionFromSystem;
        }
      }
    }

    // Fallback nếu không có system_info.os: dùng dữ liệu từ lookup table
    if (!osDisplay) {
      if (row.os_name && row.os_version) {
        osDisplay = `${row.os_name} ${row.os_version}`;
      } else if (row.os_name) {
        osDisplay = row.os_name;
      }
    }

    return {
      id: row.id,
      idDisplay: row.id_display,
      createdAt: new Date(row.created_at).toISOString(),
      serverLabel: row.server_label,
      avgPingMs: row.avg_ping_ms ? parseFloat(row.avg_ping_ms) : null,
      downloadMbps: row.download_mbps ? parseFloat(row.download_mbps) : null,
      score: row.score ? parseFloat(row.score) : null,
      visibility: row.visibility || "shared",
      // Provider info
      provider: row.provider_display_name || null,
      providerSlug: row.provider_slug || null,
      // OS info
      os: row.os_name || null,
      osVersion: row.os_version || null,
      osFamily: row.os_family || null,
      osSlug: row.os_slug || null,
      osDisplay,
      // Virtualization info
      virtualization: row.virtualization_name || null,
      virtualizationSlug: row.virtualization_slug || null,
      // Region info
      regionCity: row.region_city || null,
      regionRegion: row.region_region || null,
      regionCountryCode: row.region_country_code || null,
      // System info
      cpuModel,
      cpuCores,
      ramGB,
      diskGB,
    };
  });

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
