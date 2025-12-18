import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * Lấy client IP từ request headers
 * Hỗ trợ x-forwarded-for header từ Vercel/proxy
 */
const getClientIp = (request: NextRequest): string | null => {
  const ipHeader = request.headers.get("x-forwarded-for");
  if (ipHeader) {
    return ipHeader.split(",")[0]?.trim() || null;
  }
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    null
  );
};

/**
 * Schema validation cho provider feedback
 */
const feedbackSchema = z.object({
  benchmarkId: z.string().uuid(),
  providerName: z.string().nullable(),
  providerSlug: z.string().nullable(),
  type: z.enum(["add_new_provider", "wrong_provider"]),
  brandName: z.string().max(255).optional().nullable(),
  website: z.string().url().optional().nullable(),
  iconType: z.enum(["url", "upload"]),
  iconUrl: z.string().url().optional().nullable(),
  iconFileName: z.string().optional().nullable(), // Chỉ lưu filename nếu upload
  message: z.string().max(2000).optional().nullable(),
  email: z.string().email().optional().nullable(),
  isAnonymous: z.boolean(),
});

/**
 * API endpoint để nhận feedback về provider từ user
 *
 * Flow:
 * 1. User submit form trong dialog
 * 2. Frontend gọi POST /api/feedback/provider
 * 3. API validate với Zod
 * 4. Lưu vào table provider_feedback
 * 5. Return success/error
 *
 * Security:
 * - Rate limiting (có thể reuse từ benchmark/report)
 * - Không lưu IP nếu isAnonymous = true
 * - Email optional (chỉ lưu nếu user không chọn ẩn danh)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const clientIp = getClientIp(request);

    // Lưu vào database
    // Nếu isAnonymous = true → không lưu IP và email
    const [feedback] = await db`
      INSERT INTO provider_feedback (
        benchmark_id,
        provider_name,
        provider_slug,
        feedback_type,
        brand_name,
        website_url,
        icon_type,
        icon_url,
        icon_file_name,
        message,
        email,
        source_ip,
        user_agent,
        is_anonymous,
        status,
        created_at
      )
      VALUES (
        ${data.benchmarkId},
        ${data.providerName || null},
        ${data.providerSlug || null},
        ${data.type},
        ${data.brandName || null},
        ${data.website || null},
        ${data.iconType},
        ${data.iconUrl || null},
        ${data.iconFileName || null},
        ${data.message || null},
        ${data.isAnonymous ? null : data.email || null},
        ${data.isAnonymous ? null : clientIp},
        ${data.isAnonymous ? null : request.headers.get("user-agent") || null},
        ${data.isAnonymous},
        'pending',
        NOW()
      )
      RETURNING id, created_at
    `;

    console.log(
      `[API] Provider feedback submitted: ${feedback.id} (type: ${data.type}, anonymous: ${data.isAnonymous})`
    );

    return NextResponse.json(
      {
        success: true,
        id: feedback.id,
        createdAt: feedback.created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] Error submitting provider feedback:", error);
    return NextResponse.json(
      {
        error: "Failed to submit feedback",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

