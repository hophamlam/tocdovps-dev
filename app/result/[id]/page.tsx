import React from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ResultDetailSection } from "@/components/result/result-detail-section";
import { db } from "@/lib/db";

/**
 * Trang chi tiết một benchmark result
 * @param params - dynamic route params (id)
 * @returns Trang chi tiết benchmark với raw_payload và metadata
 */
export default async function ResultDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let row: {
    id: string;
    created_at: string;
    source_ip: string | null;
    server_label: string | null;
    avg_ping_ms: string | null;
    download_mbps: string | null;
    score: string | null;
    raw_payload: unknown;
  } | undefined;

  try {
    // Query benchmark by ID
    const resultRows = await db/* sql */ `
      SELECT
        id,
        created_at,
        source_ip,
        server_label,
        avg_ping_ms,
        download_mbps,
        score,
        raw_payload
      FROM benchmark_runs
      WHERE id = ${id}
    `;
    const [result] = resultRows as {
      id: string;
      created_at: string;
      source_ip: string | null;
      server_label: string | null;
      avg_ping_ms: string | null;
      download_mbps: string | null;
      score: string | null;
      raw_payload: unknown;
    }[];
    row = result;
  } catch (error) {
    // Log error và return 404
    console.error("Failed to fetch benchmark result:", error);
    notFound();
  }

  if (!row) {
    notFound();
  }

  const result = {
    id: row.id,
    createdAt: new Date(row.created_at).toISOString(),
    sourceIp: row.source_ip,
    serverLabel: row.server_label,
    avgPingMs: row.avg_ping_ms ? parseFloat(row.avg_ping_ms) : null,
    downloadMbps: row.download_mbps ? parseFloat(row.download_mbps) : null,
    score: row.score ? parseFloat(row.score) : null,
    rawPayload: row.raw_payload,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <ResultDetailSection result={result} />
      </main>
      <Footer />
    </div>
  );
}

