import { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Endpoint phục vụ shell script cài đặt tocdovps.dev
 * Tương tự phong cách tocdo.io/install - script ngắn gọn tải và chạy benchmark
 *
 * Usage:
 *   - Default (with prompt): bash <(curl -fsSL https://tocdovps.dev/install)
 *   - Bypass prompt: bash <(curl -fsSL "https://tocdovps.dev/install?mode=shared")
 *
 * Query Parameters:
 *   - mode: Sharing mode - "local" (no share), "private" (share with URL only), "shared" (public)
 *   - auto: Skip confirmation prompt (true/false)
 *   - skip-disk: Skip disk I/O test (true/false)
 *   - server-label: Custom server label
 *
 * @param req - NextRequest với query parameters
 * @returns Response chứa nội dung bash script với content-type text/x-shellscript
 */
export async function GET(req: NextRequest): Promise<Response> {
  // Lấy domain từ request để tự động detect (có thể là localhost trong dev hoặc tocdovps.dev trong production)
  const host = req.headers.get("host") || "tocdovps.dev";
  const protocol = host.includes("localhost") ? "http" : "https";

  // Parse query parameters
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode"); // local, private, shared
  const auto = searchParams.get("auto") === "true";
  const skipDisk = searchParams.get("skip-disk") === "true";
  const serverLabel = searchParams.get("server-label");

  // Build URL với query params nếu có
  let benchmarkUrl = `${protocol}://${host}/scripts/vps-benchmark.sh`;
  const urlParams = new URLSearchParams();
  if (mode) urlParams.append("mode", mode);
  if (auto) urlParams.append("auto", "true");
  if (skipDisk) urlParams.append("skip-disk", "true");
  if (serverLabel) urlParams.append("server-label", serverLabel);
  if (urlParams.toString()) {
    benchmarkUrl += `?${urlParams.toString()}`;
  }
  // Script ngắn gọn nhất - clone pattern từ tocdo.io/install
  // Tải và chạy trực tiếp script benchmark, không qua install.sh
  // Hỗ trợ cả wget và curl
  // Parse query params từ URL và set env vars
  // Tự động detect và set REPORT_URL từ URL hiện tại (ngrok support)
  const envVars = [];
  if (mode) envVars.push(`export BENCHMARK_MODE="${mode}"`);
  // Tự động set REPORT_URL từ URL hiện tại (hỗ trợ ngrok)
  envVars.push(`export REPORT_URL="${protocol}://${host}/api/benchmark/report"`);
  const envVarsStr = envVars.length > 0 ? envVars.join("\n") + "\n" : "";

  const installScript = `#!/bin/sh
${envVarsStr}wget -qO /tmp/tocdovps-benchmark.sh "${benchmarkUrl}" && chmod +x /tmp/tocdovps-benchmark.sh && bash /tmp/tocdovps-benchmark.sh && rm -f /tmp/tocdovps-benchmark.sh || (curl -fsSL "${benchmarkUrl}" -o /tmp/tocdovps-benchmark.sh && chmod +x /tmp/tocdovps-benchmark.sh && bash /tmp/tocdovps-benchmark.sh && rm -f /tmp/tocdovps-benchmark.sh)
`;

  return new Response(installScript, {
    status: 200,
    headers: {
      "Content-Type": "text/x-shellscript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
