import { NextRequest } from "next/server";
import { readFileSync } from "fs";
import { resolve } from "path";

export const runtime = "nodejs";

/**
 * Endpoint phục vụ script test API với sample data
 * Dùng để test API nhanh mà không cần chạy benchmark thật (15 phút)
 *
 * Usage:
 * - Production: bash <(curl -fsSL https://tocdovps.dev/scripts/test-api-sample.sh)
 * - Staging: bash <(curl -fsSL -H "x-vercel-protection-bypass:TOKEN" https://staging.tocdovps.dev/scripts/test-api-sample.sh)
 *
 * @param _req - NextRequest
 * @returns Response chứa bash script test với sample data
 */
export async function GET(_req: NextRequest): Promise<Response> {
  try {
    // Đọc script từ thư mục scripts của project
    const scriptPath = resolve(process.cwd(), "scripts", "test-api-sample.sh");
    const content = readFileSync(scriptPath, "utf8");

    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "text/x-shellscript; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Failed to read test-api-sample.sh:", error);
    return new Response("Script not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}

