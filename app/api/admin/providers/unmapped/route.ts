import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * API endpoint để lấy danh sách providers chưa có mapping
 * Dùng cho AI automation (n8n workflow)
 *
 * GET /api/admin/providers/unmapped
 * Query params:
 *   - limit: Số lượng providers (default: 50)
 *   - min_count: Minimum số benchmarks để include (default: 1)
 *
 * Returns: { unmapped: [{ legal_name, benchmark_count }] }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const minCount = parseInt(searchParams.get("min_count") || "1");

    // Query providers chưa có mapping trong provider_mappings table
    // Group by display_name và count số benchmarks
    const unmapped = await db`
      SELECT DISTINCT 
        p.display_name as legal_name,
        COUNT(DISTINCT br.id) as benchmark_count
      FROM providers p
      LEFT JOIN provider_mappings pm ON p.display_name = pm.legal_name
      LEFT JOIN benchmark_runs br ON br.provider_id = p.id
      WHERE pm.id IS NULL
        AND p.display_name != 'Unknown'
        AND p.display_name IS NOT NULL
        AND p.display_name != ''
      GROUP BY p.display_name
      HAVING COUNT(DISTINCT br.id) >= ${minCount}
      ORDER BY benchmark_count DESC
      LIMIT ${limit}
    `;

    return NextResponse.json({
      success: true,
      unmapped: Array.isArray(unmapped) ? unmapped : [],
      count: Array.isArray(unmapped) ? unmapped.length : 0,
    });
  } catch (error) {
    console.error("[API] Error fetching unmapped providers:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch unmapped providers",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
