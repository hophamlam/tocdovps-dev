import { NextRequest } from "next/server";
import { readFileSync } from "fs";
import { resolve } from "path";

export const runtime = "nodejs";

/**
 * Endpoint phục vụ script benchmark vps-benchmark.sh trực tiếp từ codebase
 * Thay vì phải tải từ GitHub, script được serve trực tiếp từ Next.js app
 *
 * Usage: curl -fsSL https://tocdovps.dev/scripts/vps-benchmark.sh
 *
 * @param _req - NextRequest
 * @returns Response chứa nội dung bash script với content-type text/x-shellscript
 */
export async function GET(_req: NextRequest): Promise<Response> {
  try {
    // Đọc script từ thư mục scripts của project
    const scriptPath = resolve(process.cwd(), "scripts", "vps-benchmark.sh");
    const content = readFileSync(scriptPath, "utf8");

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

