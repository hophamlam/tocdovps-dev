import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sql } from "@neondatabase/serverless";
import { checkRateLimit } from "@/lib/rate-limit";
import type { BenchmarkPayload } from "@/lib/types/benchmark";

/**
 * Giới hạn kích thước request body (10MB)
 * Tránh DoS attacks và memory issues
 */
const MAX_REQUEST_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Chuyển đổi text thành slug để dùng trong URL và query
 * @param value - Giá trị cần slugify
 * @returns Slug string hoặc null nếu value rỗng
 */
const slugify = (value?: string | null): string | null => {
  if (!value) return null;
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 128);
};

/**
 * Clean object để loại bỏ các giá trị không hợp lệ cho JSON
 * Loại bỏ: NaN, Infinity, undefined, functions, symbols
 * @param obj - Object cần clean
 * @returns Cleaned object có thể serialize thành JSON
 */
const cleanObjectForJson = (obj: unknown): unknown => {
  // Handle null và undefined
  if (obj === null || obj === undefined) {
    return null;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(cleanObjectForJson).filter((item) => item !== undefined);
  }

  // Handle objects
  if (typeof obj === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip undefined, functions, symbols
      if (
        value === undefined ||
        typeof value === "function" ||
        typeof value === "symbol"
      ) {
        continue;
      }
      // Replace NaN và Infinity với null
      if (typeof value === "number" && (isNaN(value) || !isFinite(value))) {
        cleaned[key] = null;
      } else {
        cleaned[key] = cleanObjectForJson(value);
      }
    }
    return cleaned;
  }

  // Handle numbers - replace NaN và Infinity với null
  if (typeof obj === "number") {
    if (isNaN(obj) || !isFinite(obj)) {
      return null;
    }
    return obj;
  }

  // Handle strings, booleans - giữ nguyên
  if (typeof obj === "string" || typeof obj === "boolean") {
    return obj;
  }

  // Các type khác (function, symbol, bigint) - skip
  return null;
};

/**
 * Parse và normalize JSON value cho database jsonb column
 * Với Neon/postgresql-js, jsonb values cần là object/array (không phải string)
 * @param value - Giá trị cần parse (có thể là string, object, hoặc null)
 * @returns Cleaned object/array hoặc null (để insert vào jsonb column)
 */
const normalizeJsonbValue = (value: unknown): unknown => {
  if (value === null || value === undefined) {
    return null;
  }

  let parsed: unknown;

  // Nếu đã là object/array, clean nó
  if (typeof value === "object") {
    parsed = cleanObjectForJson(value);
  }
  // Nếu là string, parse thành object trước rồi clean
  else if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "null" || trimmed === "") {
      return null;
    }

    // Thử parse JSON string thành object
    try {
      parsed = JSON.parse(value);
      parsed = cleanObjectForJson(parsed);
    } catch (error) {
      // Nếu parse fail, log warning và trả về null
      console.warn(
        `[API] Failed to parse JSON string (first 100 chars):`,
        value.substring(0, 100),
        error
      );
      return null;
    }
  } else {
    return null;
  }

  return parsed;
};

/**
 * Schema validation cho benchmark report payload
 * Sử dụng Zod để validate type-safe
 */
const reportSchema = z.object({
  // Cho phép serverLabel là string hoặc null và có thể không gửi lên
  serverLabel: z.string().max(255).nullish(),
  // Summary fields (tùy chọn)
  avgPingMs: z.number().nonnegative().optional(),
  downloadMbps: z.number().nonnegative().optional(),
  score: z.number().min(0).max(10).optional(),
  cpuModelText: z.string().max(500).optional(),
  coreAmount: z.number().int().nonnegative().optional(),
  frequencyGhz: z.number().nonnegative().optional(),
  ramGb: z.number().nonnegative().optional(),
  ramAvailableGb: z.number().nonnegative().optional(),
  ramInfo: z.string().max(1000).optional(),
  swapInfo: z.string().max(1000).optional(),
  diskGb: z.number().nonnegative().optional(),
  diskInfo: z.string().max(1000).optional(),
  loadAverage: z.string().max(255).optional(),
  uptimeSeconds: z.number().int().nonnegative().optional(),
  osNameText: z.string().max(255).optional(),
  virtualizationText: z.string().max(255).optional(),
  providerText: z.string().max(255).optional(),
  summary: z.unknown().optional(),
  systemInfo: z.unknown().optional(),
  diskIo: z.unknown().optional(),
  fio: z.unknown().optional(),
  netSpeed: z.unknown().optional(),
  // payload có thể là network test payload hoặc system info payload
  // Cho phép bất kỳ structure nào để linh hoạt
  payload: z.unknown().optional(),
});

/**
 * Lấy client IP từ request headers
 * Hỗ trợ x-forwarded-for header từ Vercel/proxy
 * @param request - NextRequest object
 * @returns Client IP address hoặc null
 */
const getClientIp = (request: NextRequest): string | null => {
  const ipHeader = request.headers.get("x-forwarded-for");
  if (ipHeader) {
    // x-forwarded-for có thể chứa nhiều IPs, lấy IP đầu tiên
    return ipHeader.split(",")[0]?.trim() || null;
  }

  // Fallback cho các headers khác
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    null
  );
};

/**
 * API nhận báo cáo benchmark từ script/CLI
 *
 * Features:
 * - Validate payload với Zod schema
 * - Lưu toàn bộ payload vào bảng benchmark_runs (cột raw_payload)
 * - Chỉ sử dụng một số field tóm tắt để query nhanh (avg_ping_ms, download_mbps, score, server_label)
 * - Hỗ trợ visibility header (private/shared)
 * - Error handling và logging
 * - Request size validation
 *
 * @param request - NextRequest object chứa benchmark report data
 * @returns JSON response với id và created_at của record mới
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // Log request info (không log sensitive data)
  const userAgent = request.headers.get("user-agent") || "unknown";
  const contentType = request.headers.get("content-type") || "";

  // Validate Content-Type
  if (!contentType.includes("application/json")) {
    console.warn(
      `[API] Invalid Content-Type: ${contentType} from ${getClientIp(request)}`
    );
    return NextResponse.json(
      {
        error: "Invalid Content-Type",
        message: "Content-Type must be application/json",
      },
      { status: 400 }
    );
  }

  // Validate request size
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_SIZE) {
    console.warn(
      `[API] Request too large: ${contentLength} bytes from ${getClientIp(
        request
      )}`
    );
    return NextResponse.json(
      {
        error: "Request too large",
        message: `Request body must be less than ${
          MAX_REQUEST_SIZE / 1024 / 1024
        }MB`,
      },
      { status: 413 }
    );
  }

  // Rate limiting check
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(clientIp || "unknown");

  if (!rateLimitResult.success) {
    const resetTime = new Date(rateLimitResult.reset).toISOString();
    console.warn(
      `[API] Rate limit exceeded from ${clientIp}: ${rateLimitResult.remaining}/${rateLimitResult.limit} remaining, reset at ${resetTime}`
    );

    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000), // seconds
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.toString(),
          "Retry-After": Math.ceil(
            (rateLimitResult.reset - Date.now()) / 1000
          ).toString(),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(
      `[API] JSON parse error from ${getClientIp(request)}:`,
      errorMessage
    );
    return NextResponse.json(
      {
        error: "Invalid JSON payload",
        message: "Request body must be valid JSON",
      },
      { status: 400 }
    );
  }

  // Validate payload với Zod schema
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    const errorDetails = parsed.error.flatten();
    console.warn(
      `[API] Validation error from ${getClientIp(request)}:`,
      errorDetails.fieldErrors
    );
    // Debug: log body structure để debug
    console.warn(`[API] Body keys:`, Object.keys(body || {}));
    console.warn(
      `[API] Body has payload:`,
      body && typeof body === "object" && body !== null && "payload" in body
    );
    if (body && typeof body === "object" && "payload" in body) {
      console.warn(`[API] Payload type:`, typeof body.payload);
      console.warn(
        `[API] Payload keys:`,
        body.payload ? Object.keys(body.payload) : "null"
      );
    }

    return NextResponse.json(
      {
        error: "Invalid payload",
        message: "Request validation failed",
        details: errorDetails.fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Generate slugs từ text fields
  const osSlug = slugify(data.osNameText);
  const cpuSlug = slugify(data.cpuModelText);
  const providerSlug = slugify(data.providerText);
  const virtualizationSlug = slugify(data.virtualizationText);

  // Lấy visibility từ header (private/shared), mặc định là 'shared' nếu không có
  const visibilityHeader = request.headers.get("x-visibility");
  const visibility = visibilityHeader === "private" ? "private" : "shared";

  // Normalize jsonb values và log để debug
  const normalizedDiskIo = normalizeJsonbValue(data.diskIo);
  const normalizedFio = normalizeJsonbValue(data.fio);
  const normalizedNetSpeed = normalizeJsonbValue(data.netSpeed);
  const normalizedSystemInfo = normalizeJsonbValue(data.systemInfo);
  const normalizedSummary = normalizeJsonbValue(data.summary);

  // Debug logging - validate JSON có thể stringify được không
  if (normalizedDiskIo !== null) {
    try {
      const testStringify = JSON.stringify(normalizedDiskIo);
      console.log(
        `[API] diskIo: can stringify=${
          testStringify.length
        } chars, type=${typeof normalizedDiskIo}, isArray=${Array.isArray(
          normalizedDiskIo
        )}`
      );
    } catch (e) {
      console.error(`[API] diskIo FAILED to stringify:`, e);
    }
  }
  if (normalizedFio !== null) {
    try {
      const testStringify = JSON.stringify(normalizedFio);
      console.log(
        `[API] fio: can stringify=${
          testStringify.length
        } chars, type=${typeof normalizedFio}, isArray=${Array.isArray(
          normalizedFio
        )}`
      );
    } catch (e) {
      console.error(`[API] fio FAILED to stringify:`, e);
    }
  }
  if (normalizedNetSpeed !== null) {
    try {
      const testStringify = JSON.stringify(normalizedNetSpeed);
      console.log(
        `[API] netSpeed: can stringify=${
          testStringify.length
        } chars, type=${typeof normalizedNetSpeed}, isArray=${Array.isArray(
          normalizedNetSpeed
        )}`
      );
    } catch (e) {
      console.error(`[API] netSpeed FAILED to stringify:`, e);
    }
  }

  try {
    // Insert vào database
    const [row] = await db/* sql */ `
      INSERT INTO benchmark_runs (
        source_ip,
        client_ip,
        server_label,
        avg_ping_ms,
        download_mbps,
        score,
        cpu_model_text,
        core_amount,
        frequency_ghz,
        ram_gb,
        ram_available_gb,
        ram_info,
        swap_info,
        disk_gb,
        disk_info,
        load_average,
        uptime_seconds,
        os_name_text,
        os_slug,
        virtualization_text,
        virtualization_slug,
        provider_text,
        provider_slug,
        cpu_slug,
        system_info,
        disk_io,
        fio,
        net_speed,
        summary,
        raw_payload,
        visibility
      )
      VALUES (
        ${clientIp},
        ${clientIp},
        ${data.serverLabel ?? null},
        ${data.avgPingMs ?? null},
        ${data.downloadMbps ?? null},
        ${data.score ?? null},
        ${data.cpuModelText ?? null},
        ${data.coreAmount ?? null},
        ${data.frequencyGhz ?? null},
        ${data.ramGb ?? null},
        ${data.ramAvailableGb ?? null},
        ${data.ramInfo ?? null},
        ${data.swapInfo ?? null},
        ${data.diskGb ?? null},
        ${data.diskInfo ?? null},
        ${data.loadAverage ?? null},
        ${data.uptimeSeconds ?? null},
        ${data.osNameText ?? null},
        ${osSlug ?? null},
        ${data.virtualizationText ?? null},
        ${virtualizationSlug ?? null},
        ${data.providerText ?? null},
        ${providerSlug ?? null},
        ${cpuSlug ?? null},
        ${normalizedSystemInfo},
        ${normalizedDiskIo},
        ${normalizedFio},
        ${normalizedNetSpeed},
        ${normalizedSummary},
        ${data.payload ?? body},
        ${visibility}
      )
      RETURNING id, created_at;
    `;

    const responseTime = Date.now() - startTime;
    console.log(
      `[API] Success: Created benchmark run ${row.id} in ${responseTime}ms from ${clientIp}`
    );

    return NextResponse.json(
      {
        success: true,
        id: row.id,
        createdAt: row.created_at,
      },
      {
        status: 201,
        headers: {
          "X-Response-Time": `${responseTime}ms`,
        },
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error(`[API] Database error from ${clientIp}:`, {
      message: errorMessage,
      stack: errorStack,
    });

    // Không expose internal error details cho client
    return NextResponse.json(
      {
        error: "Failed to store benchmark report",
        message: "An internal error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
