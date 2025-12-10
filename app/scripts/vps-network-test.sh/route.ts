import { resolve } from "path";
import { readFileSync } from "fs";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Serve network test script (vps-network-test.sh) directly.
 * Usage: curl -fsSL https://<host>/scripts/vps-network-test.sh
 */
export async function GET(_req: NextRequest): Promise<Response> {
  try {
    const scriptPath = resolve(process.cwd(), "scripts", "vps-network-test.sh");
    const content = readFileSync(scriptPath, "utf8");

    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "text/x-shellscript; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Failed to read vps-network-test.sh:", error);
    return new Response("Script not found", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

