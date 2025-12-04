import { NextRequest } from "next/server";
import { readFileSync } from "fs";
import { resolve } from "path";

export const runtime = "nodejs";

/**
 * Endpoint phục vụ shell script cài đặt vps-benchmark-hophamlam
 * Tương tự phong cách https://get.docker.com/
 *
 * @param _req - NextRequest (không dùng, nhưng giữ để sau này có thể log)
 * @returns Response chứa nội dung bash script với content-type text/x-shellscript
 */
export async function GET(_req: NextRequest): Promise<Response> {
  // Đọc nội dung file script từ thư mục scripts của project
  const scriptPath = resolve(process.cwd(), "scripts", "vps-benchmark.sh");
  const content = readFileSync(scriptPath, "utf8");

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/x-shellscript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}


