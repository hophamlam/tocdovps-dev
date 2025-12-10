import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import type { BenchmarkPayload } from "@/lib/types/benchmark";

const slugify = (value?: string | null) => {
  if (!value) return null;
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 128);
};

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
  ramInfo: z.string().optional(),
  swapInfo: z.string().optional(),
  diskGb: z.number().nonnegative().optional(),
  diskInfo: z.string().optional(),
  loadAverage: z.string().optional(),
  uptimeSeconds: z.number().int().nonnegative().optional(),
  osNameText: z.string().max(255).optional(),
  virtualizationText: z.string().max(255).optional(),
  providerText: z.string().max(255).optional(),
  summary: z.unknown().optional(),
  systemInfo: z.unknown().optional(),
  diskIo: z.unknown().optional(),
  fio: z.unknown().optional(),
  netSpeed: z.unknown().optional(),
  payload: z
    .object({
      pingTargets: z.array(z.string()),
      avgPingMs: z.number().nonnegative(),
      download: z.object({
        url: z.string().url(),
        timeSeconds: z.number().nonnegative(),
        speedMbps: z.number().nonnegative(),
      }),
    })
    .catchall(z.unknown()) as z.ZodType<BenchmarkPayload>, // lưu thô vào raw_payload với type an toàn
});

/**
 * API nhận báo cáo benchmark từ script/CLI
 * - Yêu cầu header X-REPORT-TOKEN khớp với REPORT_TOKEN trong env
 * - Lưu toàn bộ payload vào bảng benchmark_runs (cột raw_payload)
 * - Chỉ sử dụng một số field tóm tắt để query nhanh (avg_ping_ms, download_mbps, score, server_label)
 */
export async function POST(request: NextRequest) {
  // Endpoint không cần bảo vệ - public access
  // Đã được expose qua ngrok, không cần token authentication

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const ipHeader = request.headers.get("x-forwarded-for");
  const ip = ipHeader ? ipHeader.split(",")[0]?.trim() : null;

  const osSlug = slugify(data.osNameText);
  const cpuSlug = slugify(data.cpuModelText);
  const providerSlug = slugify(data.providerText);
  const virtualizationSlug = slugify(data.virtualizationText);

  // Lấy visibility từ header (private/shared), mặc định là 'shared' nếu không có
  const visibilityHeader = request.headers.get("x-visibility");
  const visibility = visibilityHeader === "private" ? "private" : "shared";

  try {
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
        ${ip},
        ${ip},
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
        ${data.systemInfo ?? null},
        ${data.diskIo ?? null},
        ${data.fio ?? null},
        ${data.netSpeed ?? null},
        ${data.summary ?? null},
        ${JSON.stringify(data.payload ?? body)},
        ${visibility}
      )
      RETURNING id, created_at;
    `;

    return NextResponse.json(
      {
        id: row.id,
        createdAt: row.created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to insert benchmark run", error);
    return NextResponse.json(
      { error: "Failed to store benchmark report" },
      { status: 500 }
    );
  }
}
