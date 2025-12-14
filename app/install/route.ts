import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { resolve } from "path";

export const runtime = "nodejs";

/**
 * Endpoint phục vụ script benchmark với REPORT_URL được inject tự động
 * VERCEL_BYPASS không được inject để tránh lộ token (user phải tự set nếu cần)
 *
 * Usage:
 * - Production: bash <(curl -fsSL https://tocdovps.dev/install)
 * - Staging: VERCEL_BYPASS="..." bash <(curl -fsSL https://staging.tocdovps.dev/install)
 *
 * @param req - NextRequest
 * @returns Response chứa bash script với REPORT_URL được set tự động (nếu có)
 */
export async function GET(req: NextRequest): Promise<Response> {
  try {
    // Đọc script từ thư mục scripts của project
    const scriptPath = resolve(process.cwd(), "scripts", "vps-benchmark.sh");
    let content = readFileSync(scriptPath, "utf8");

    // Lấy REPORT_URL từ environment variable (chỉ có trên server)
    // Không inject VERCEL_BYPASS để tránh lộ token - user phải tự set nếu cần
    const reportUrl =
      process.env.REPORT_URL || "https://www.tocdovps.dev/api/benchmark/report";

    // Chỉ inject REPORT_URL nếu khác với default (staging environment)
    if (reportUrl !== "https://www.tocdovps.dev/api/benchmark/report") {
      const injectScript = `#!/bin/bash
# Auto-injected REPORT_URL (from server-side, not hardcoded)
export REPORT_URL="${reportUrl}"

`;
      content = injectScript + content;
    }

    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "text/x-shellscript; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Failed to read vps-benchmark.sh:", error);
    return new Response("Script not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
