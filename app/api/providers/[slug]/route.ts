import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * API endpoint để lấy thông tin chi tiết của provider
 * Dùng cho tooltip và UI components
 *
 * GET /api/providers/:slug
 * Returns: { slug, display_name, brand_name, website_url, logo_url, legal_names[] }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Query provider với aliases (legal names)
    const [provider] = await db`
      SELECT 
        p.id,
        p.slug,
        p.display_name,
        p.brand_name,
        p.website_url,
        p.logo_url,
        p.is_popular,
        -- Lấy tất cả aliases (legal names) của provider này
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'alias', pa.alias,
              'is_legal_name', pa.alias != p.display_name
            )
          ) FILTER (WHERE pa.alias IS NOT NULL),
          '[]'::json
        ) as aliases
      FROM providers p
      LEFT JOIN provider_aliases pa ON p.id = pa.provider_id
      WHERE p.slug = ${slug}
      GROUP BY p.id, p.slug, p.display_name, p.brand_name, p.website_url, p.logo_url, p.is_popular
      LIMIT 1
    `;

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    // Parse aliases và filter legal names (khác display_name)
    const aliases = Array.isArray(provider.aliases)
      ? provider.aliases
      : JSON.parse(provider.aliases || "[]");
    const legalNames = aliases
      .filter((a: { alias: string; is_legal_name: boolean }) => a.is_legal_name)
      .map((a: { alias: string }) => a.alias);

    return NextResponse.json({
      slug: provider.slug,
      displayName: provider.display_name,
      brandName: provider.brand_name || provider.display_name,
      websiteUrl: provider.website_url,
      logoUrl: provider.logo_url,
      isPopular: provider.is_popular,
      legalNames,
    });
  } catch (error) {
    console.error("[API] Error fetching provider:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch provider",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
