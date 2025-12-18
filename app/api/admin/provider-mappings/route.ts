import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

/**
 * API endpoint để AI/n8n update provider mappings
 *
 * Security: Nên thêm authentication (API key hoặc JWT)
 * Hiện tại để public để test, nhưng production cần protect
 *
 * Usage từ n8n:
 * POST /api/admin/provider-mappings
 * Body: { legal_name, brand_name, website_url?, confidence_score?, ai_model?, notes? }
 */

const createMappingSchema = z.object({
  legal_name: z.string().min(1).max(500),
  brand_name: z.string().min(1).max(255),
  website_url: z.string().url().optional().nullable(),
  confidence_score: z.number().min(0).max(1).optional().default(1.0),
  source: z.enum(["manual", "ai", "n8n"]).optional().default("ai"),
  ai_model: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

const updateMappingSchema = createMappingSchema.partial().extend({
  legal_name: z.string().min(1).max(500), // Required for update
});

/**
 * GET: List all provider mappings (có thể filter)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const legalName = searchParams.get("legal_name");
    const brandName = searchParams.get("brand_name");
    const source = searchParams.get("source");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = db`
      SELECT 
        id,
        legal_name,
        brand_name,
        website_url,
        confidence_score,
        source,
        ai_model,
        created_at,
        updated_at,
        created_by,
        notes
      FROM provider_mappings
      WHERE 1=1
    `;

    if (legalName) {
      query = db`${query} AND legal_name ILIKE ${`%${legalName}%`}`;
    }
    if (brandName) {
      query = db`${query} AND brand_name ILIKE ${`%${brandName}%`}`;
    }
    if (source) {
      query = db`${query} AND source = ${source}`;
    }

    query = db`${query} ORDER BY updated_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const mappings = await query;

    return NextResponse.json({
      success: true,
      data: mappings,
      count: Array.isArray(mappings) ? mappings.length : 0,
    });
  } catch (error) {
    console.error("[API] Error fetching provider mappings:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch provider mappings",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST: Create hoặc update provider mapping
 * Nếu legal_name đã tồn tại → update
 * Nếu chưa tồn tại → create
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createMappingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check xem legal_name đã tồn tại chưa
    const existing = await db`
      SELECT id, brand_name FROM provider_mappings 
      WHERE legal_name = ${data.legal_name} 
      LIMIT 1
    `;

    if (Array.isArray(existing) && existing.length > 0) {
      // Update existing mapping
      const [updated] = await db`
        UPDATE provider_mappings
        SET 
          brand_name = ${data.brand_name},
          website_url = ${data.website_url || null},
          confidence_score = ${data.confidence_score || 1.0},
          source = ${data.source || "ai"},
          ai_model = ${data.ai_model || null},
          notes = ${data.notes || null},
          updated_at = NOW()
        WHERE legal_name = ${data.legal_name}
        RETURNING id, legal_name, brand_name, updated_at
      `;

      console.log(
        `[API] Updated provider mapping: ${data.legal_name} → ${data.brand_name}`
      );

      return NextResponse.json({
        success: true,
        action: "updated",
        data: updated,
      });
    } else {
      // Create new mapping
      const [created] = await db`
        INSERT INTO provider_mappings (
          legal_name,
          brand_name,
          website_url,
          confidence_score,
          source,
          ai_model,
          notes,
          created_by
        )
        VALUES (
          ${data.legal_name},
          ${data.brand_name},
          ${data.website_url || null},
          ${data.confidence_score || 1.0},
          ${data.source || "ai"},
          ${data.ai_model || null},
          ${data.notes || null},
          'api'
        )
        RETURNING id, legal_name, brand_name, created_at
      `;

      console.log(
        `[API] Created provider mapping: ${data.legal_name} → ${data.brand_name}`
      );

      return NextResponse.json(
        {
          success: true,
          action: "created",
          data: created,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("[API] Error creating/updating provider mapping:", error);
    return NextResponse.json(
      {
        error: "Failed to create/update provider mapping",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update existing mapping (explicit update)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateMappingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check xem legal_name có tồn tại không
    const existing = await db`
      SELECT id FROM provider_mappings 
      WHERE legal_name = ${data.legal_name} 
      LIMIT 1
    `;

    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json(
        {
          error: "Mapping not found",
          message: `No mapping found for legal_name: ${data.legal_name}`,
        },
        { status: 404 }
      );
    }

    // Build update query dynamically (chỉ update fields được provide)
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.brand_name !== undefined) {
      updates.push(`brand_name = $${paramIndex}`);
      values.push(data.brand_name);
      paramIndex++;
    }
    if (data.website_url !== undefined) {
      updates.push(`website_url = $${paramIndex}`);
      values.push(data.website_url);
      paramIndex++;
    }
    if (data.confidence_score !== undefined) {
      updates.push(`confidence_score = $${paramIndex}`);
      values.push(data.confidence_score);
      paramIndex++;
    }
    if (data.source !== undefined) {
      updates.push(`source = $${paramIndex}`);
      values.push(data.source);
      paramIndex++;
    }
    if (data.ai_model !== undefined) {
      updates.push(`ai_model = $${paramIndex}`);
      values.push(data.ai_model);
      paramIndex++;
    }
    if (data.notes !== undefined) {
      updates.push(`notes = $${paramIndex}`);
      values.push(data.notes);
      paramIndex++;
    }

    if (updates.length === 0) {
      return NextResponse.json(
        {
          error: "No fields to update",
        },
        { status: 400 }
      );
    }

    updates.push(`updated_at = NOW()`);
    values.push(data.legal_name);

    const updateQuery = `
      UPDATE provider_mappings
      SET ${updates.join(", ")}
      WHERE legal_name = $${paramIndex}
      RETURNING id, legal_name, brand_name, updated_at
    `;

    // Sử dụng db(query, params) thay vì db.unsafe để tương thích type Neon
    const [updated] = await db(updateQuery, values);

    return NextResponse.json({
      success: true,
      action: "updated",
      data: updated,
    });
  } catch (error) {
    console.error("[API] Error updating provider mapping:", error);
    return NextResponse.json(
      {
        error: "Failed to update provider mapping",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
