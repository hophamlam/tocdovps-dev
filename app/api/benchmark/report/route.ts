import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const reportSchema = z.object({
  // Cho phép serverLabel là string hoặc null và có thể không gửi lên
  serverLabel: z.string().max(255).nullish(),
  avgPingMs: z.number().nonnegative().optional(),
  downloadMbps: z.number().nonnegative().optional(),
  score: z.number().min(0).max(10).optional(),
  payload: z.unknown(), // lưu thô vào raw_payload
});

/**
 * API nhận báo cáo benchmark từ script/CLI
 * - Yêu cầu header X-REPORT-TOKEN khớp với REPORT_TOKEN trong env
 * - Lưu toàn bộ payload vào bảng benchmark_runs (cột raw_payload)
 * - Chỉ sử dụng một số field tóm tắt để query nhanh (avg_ping_ms, download_mbps, score, server_label)
 */
export async function POST(request: NextRequest) {
  const reportToken = process.env.REPORT_TOKEN;

  if (!reportToken) {
    return NextResponse.json(
      { error: "REPORT_TOKEN is not configured on server" },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("x-report-token");
  if (!authHeader || authHeader !== reportToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const ipHeader = request.headers.get("x-forwarded-for");
  const ip = ipHeader ? ipHeader.split(",")[0]?.trim() : null;

  try {
    const [row] = await db/* sql */`
      INSERT INTO benchmark_runs (source_ip, server_label, avg_ping_ms, download_mbps, score, raw_payload)
      VALUES (
        ${ip},
        ${data.serverLabel ?? null},
        ${data.avgPingMs ?? null},
        ${data.downloadMbps ?? null},
        ${data.score ?? null},
        ${JSON.stringify(data.payload ?? body)}
      )
      RETURNING id, created_at;
    `;

    return NextResponse.json(
      {
        id: row.id,
        createdAt: row.created_at,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to insert benchmark run", error);
    return NextResponse.json(
      { error: "Failed to store benchmark report" },
      { status: 500 },
    );
  }
}


