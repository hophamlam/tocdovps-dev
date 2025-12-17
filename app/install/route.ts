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
 * - Staging: bash <(curl -fsSL "https://staging.tocdovps.dev/install?x-vercel-protection-bypass=TOKEN")
 *   Hoặc: curl -fsSL "https://staging.tocdovps.dev/install?x-vercel-protection-bypass=TOKEN" | bash
 *
 * Note: Vercel protection bypass token phải được truyền qua query string hoặc header
 * khi curl, không phải qua env variable VERCEL_BYPASS (env var chỉ dùng trong script sau khi download)
 *
 * @param req - NextRequest
 * @returns Response chứa bash script với REPORT_URL được set tự động (nếu có)
 */
export async function GET(req: NextRequest): Promise<Response> {
  try {
    // Đọc script từ thư mục scripts của project
    const scriptPath = resolve(process.cwd(), "scripts", "vps-benchmark.sh");
    let content = readFileSync(scriptPath, "utf8");

    // Xác định REPORT_URL dựa trên:
    // 1. REPORT_URL env var (nếu có)
    // 2. BASE_URL env var + /api/benchmark/report (nếu có)
    // 3. Request hostname (tự động detect staging)
    // 4. Fallback về production default
    const hostname = req.headers.get("host") || "";
    const isStaging = hostname.includes("staging.tocdovps.dev");

    let reportUrl: string;

    if (process.env.REPORT_URL) {
      // Ưu tiên REPORT_URL env var nếu có
      reportUrl = process.env.REPORT_URL;
    } else if (process.env.BASE_URL) {
      // Dùng BASE_URL để build REPORT_URL
      reportUrl = `${process.env.BASE_URL}/api/benchmark/report`;
    } else if (isStaging) {
      // Tự động detect staging từ hostname
      reportUrl = "https://staging.tocdovps.dev/api/benchmark/report";
    } else {
      // Fallback về production
      reportUrl = "https://www.tocdovps.dev/api/benchmark/report";
    }

    // Chỉ inject REPORT_URL nếu khác với default (staging environment hoặc custom URL)
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
