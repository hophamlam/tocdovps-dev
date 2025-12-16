import { db } from "@/lib/db";
import type { BenchmarkRunSummary } from "@/lib/types/benchmark";
import {
  type BenchmarkRow,
  mapBenchmarkRowToSummary,
} from "@/lib/utils/benchmark";

/**
 * Repository pattern cho benchmark data access
 * Tách data access logic ra khỏi page components để dễ reuse và test
 */
export class BenchmarkRepository {
  /**
   * Lấy danh sách benchmarks từ leaderboard view với pagination
   * @param options - Query options
   * @returns Object chứa items và pagination info
   */
  static async getBenchmarks(options: {
    limit?: number;
    offset?: number;
    visibility?: "shared" | "private" | null;
  }): Promise<{
    items: BenchmarkRunSummary[];
    totalCount: number;
  }> {
    const { limit, offset = 0, visibility = null } = options;

    // Query benchmarks từ view
    // Sử dụng template literal với số cho LIMIT/OFFSET (an toàn vì số không thể SQL injection)
    // Luôn có LIMIT và OFFSET để đơn giản (nếu không có limit thì set giá trị lớn)
    const effectiveLimit = limit ?? 1000; // Default limit lớn nếu không specify
    const effectiveOffset = offset;

    let rows: BenchmarkRow[];
    if (visibility) {
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
        WHERE visibility = ${visibility}
        ORDER BY created_at DESC
        LIMIT ${effectiveLimit}
        OFFSET ${effectiveOffset}
      `) as BenchmarkRow[];
    } else {
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
        LIMIT ${effectiveLimit}
        OFFSET ${effectiveOffset}
      `) as BenchmarkRow[];
    }

    // Map rows sang BenchmarkRunSummary
    const items = rows.map(mapBenchmarkRowToSummary);

    // Get total count
    let countResult: { total_count: bigint | null };
    if (visibility) {
      const countRows = await db/* sql */ `
        SELECT COUNT(*)::bigint AS total_count
        FROM benchmark_runs
        WHERE visibility = ${visibility}
          AND (score IS NOT NULL
            OR download_mbps IS NOT NULL
            OR avg_ping_ms IS NOT NULL)
      `;
      [countResult] = countRows as Array<{ total_count: bigint | null }>;
    } else {
      const countRows = await db/* sql */ `
        SELECT COUNT(*)::bigint AS total_count
        FROM benchmark_runs
        WHERE score IS NOT NULL
          OR download_mbps IS NOT NULL
          OR avg_ping_ms IS NOT NULL
      `;
      [countResult] = countRows as Array<{ total_count: bigint | null }>;
    }

    const totalCount = Number(countResult?.total_count ?? 0);

    return {
      items,
      totalCount,
    };
  }

  /**
   * Lấy danh sách benchmarks mới nhất (cho landing page)
   * @param limit - Số lượng records (default: 10)
   * @returns Array of BenchmarkRunSummary
   */
  static async getLatestBenchmarks(
    limit: number = 10
  ): Promise<BenchmarkRunSummary[]> {
    const result = await this.getBenchmarks({ limit });
    return result.items;
  }

  /**
   * Lấy total count của benchmarks (có ít nhất một metric)
   * @param visibility - Filter theo visibility (optional)
   * @returns Total count
   */
  static async getTotalCount(
    visibility?: "shared" | "private" | null
  ): Promise<number> {
    let countResult: { total_count: bigint | null };
    if (visibility) {
      const countRows = await db/* sql */ `
        SELECT COUNT(*)::bigint AS total_count
        FROM benchmark_runs
        WHERE visibility = ${visibility}
          AND (score IS NOT NULL
            OR download_mbps IS NOT NULL
            OR avg_ping_ms IS NOT NULL)
      `;
      [countResult] = countRows as Array<{ total_count: bigint | null }>;
    } else {
      const countRows = await db/* sql */ `
        SELECT COUNT(*)::bigint AS total_count
        FROM benchmark_runs
        WHERE score IS NOT NULL
          OR download_mbps IS NOT NULL
          OR avg_ping_ms IS NOT NULL
      `;
      [countResult] = countRows as Array<{ total_count: bigint | null }>;
    }

    return Number(countResult?.total_count ?? 0);
  }
}
