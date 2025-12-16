import React from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ResultDetailSection } from "@/components/result/result-detail-section";
import { db } from "@/lib/db";
import type { BenchmarkPayload } from "@/lib/types/benchmark";

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

  type BenchmarkRow = {
    id: string;
    created_at: string;
    server_label: string | null;
    avg_ping_ms: string | null;
    download_mbps: string | null;
    score: string | null;
    visibility: string | null;
    system_info: unknown;
    disk_io: unknown;
    fio: unknown;
    net_speed: unknown;
    raw_payload: BenchmarkPayload;
    // Provider info
    provider_display_name: string | null;
    provider_slug: string | null;
    // OS info
    os_name: string | null;
    os_version: string | null;
    os_family: string | null;
    os_slug: string | null;
    // Virtualization info
    virtualization_name: string | null;
    virtualization_slug: string | null;
    // Region info
    region_city: string | null;
    region_region: string | null;
    region_country_code: string | null;
  };

  let row: BenchmarkRow | undefined;

  try {
    // Query benchmark by ID với JOIN lookup tables
    const resultRows = await db/* sql */ `
      SELECT
        br.id,
        br.created_at,
        br.server_label,
        br.avg_ping_ms,
        br.download_mbps,
        br.score,
        br.visibility,
        br.system_info,
        br.disk_io,
        br.fio,
        br.net_speed,
        br.raw_payload,
        -- Provider info
        p.display_name as provider_display_name,
        p.slug as provider_slug,
        -- OS info
        o.name as os_name,
        o.version as os_version,
        o.family as os_family,
        o.slug as os_slug,
        -- Virtualization info
        v.display_name as virtualization_name,
        v.slug as virtualization_slug,
        -- Region info
        r.city as region_city,
        r.region as region_region,
        r.country_code as region_country_code
      FROM benchmark_runs br
      LEFT JOIN providers p ON br.provider_id = p.id
      LEFT JOIN oses o ON br.os_id = o.id
      LEFT JOIN virtualizations v ON br.virtualization_id = v.id
      LEFT JOIN regions r ON br.region_id = r.id
      WHERE br.id = ${id}
    `;
    const [result] = resultRows as BenchmarkRow[];
    row = result;
  } catch (error) {
    // Log error và return 404
    console.error("Failed to fetch benchmark result:", error);
    notFound();
  }

  if (!row) {
    notFound();
  }

  // Sanitize raw payload: xóa mọi field publicIp trong systemInfo.location (nếu có)
  const sanitizedPayload: BenchmarkPayload = (() => {
    const cloned = JSON.parse(JSON.stringify(row.raw_payload)) as Record<
      string,
      unknown
    >;
    const locations = [
      (cloned.payload as Record<string, unknown> | undefined)?.systemInfo &&
        (cloned.payload as Record<string, unknown> | undefined)?.systemInfo &&
        (
          cloned.payload as {
            systemInfo?: { location?: Record<string, unknown> };
          }
        ).systemInfo?.location,
      (cloned.systemInfo as { location?: Record<string, unknown> } | undefined)
        ?.location,
    ];
    for (const loc of locations) {
      if (loc && typeof loc === "object" && "publicIp" in loc) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete (loc as Record<string, unknown>).publicIp;
      }
    }
    return cloned as BenchmarkPayload;
  })();

  // Parse system_info JSONB để lấy CPU, RAM, Disk, OS display
  let cpuModel: string | null = null;
  let cpuCores: number | null = null;
  let ramGB: number | null = null;
  let diskGB: number | null = null;
  let osDisplay: string | null = null;

  if (row.system_info && typeof row.system_info === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const systemInfo = row.system_info as Record<string, any>;
    cpuModel = systemInfo.cpuModel || systemInfo.cpu_model || null;
    cpuCores =
      systemInfo.cores !== undefined
        ? Number(systemInfo.cores)
        : systemInfo.cpu_cores !== undefined
        ? Number(systemInfo.cpu_cores)
        : null;
    ramGB =
      systemInfo.ramGB !== undefined
        ? Number(systemInfo.ramGB)
        : systemInfo.ram_gb !== undefined
        ? Number(systemInfo.ram_gb)
        : null;
    diskGB =
      systemInfo.diskTotalGB !== undefined
        ? Number(systemInfo.diskTotalGB)
        : systemInfo.disk_total_gb !== undefined
        ? Number(systemInfo.disk_total_gb)
        : null;

    // OS detail trong system_info.os (ví dụ: Ubuntu 24.04.1 LTS (Noble Numbat))
    const osInfo = systemInfo.os;
    if (osInfo && typeof osInfo === "object") {
      const osNameFromSystem =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (osInfo as Record<string, any>).name ?? row.os_name ?? null;
      const osVersionFromSystem =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (osInfo as Record<string, any>).version ?? null;

      if (osNameFromSystem && osVersionFromSystem) {
        osDisplay = `${osNameFromSystem} ${osVersionFromSystem}`;
      } else if (osNameFromSystem) {
        osDisplay = osNameFromSystem;
      } else if (osVersionFromSystem) {
        osDisplay = osVersionFromSystem;
      }
    }
  }

  // Fallback nếu không có system_info.os: dùng dữ liệu từ lookup table
  if (!osDisplay) {
    if (row.os_name && row.os_version) {
      osDisplay = `${row.os_name} ${row.os_version}`;
    } else if (row.os_name) {
      osDisplay = row.os_name;
    }
  }

  const result = {
    id: row.id,
    createdAt: new Date(row.created_at).toISOString(),
    serverLabel: row.server_label,
    avgPingMs: row.avg_ping_ms ? parseFloat(row.avg_ping_ms) : null,
    downloadMbps: row.download_mbps ? parseFloat(row.download_mbps) : null,
    score: row.score ? parseFloat(row.score) : null,
    visibility: row.visibility ?? "shared",
    systemInfo: row.system_info,
    diskIo: row.disk_io,
    fio: row.fio,
    netSpeed: row.net_speed,
    rawPayload: sanitizedPayload,
    // Provider info
    provider: row.provider_display_name || null,
    providerSlug: row.provider_slug || null,
    // OS info
    os: row.os_name || null,
    osVersion: row.os_version || null,
    osFamily: row.os_family || null,
    osSlug: row.os_slug || null,
    osDisplay,
    // Virtualization info
    virtualization: row.virtualization_name || null,
    virtualizationSlug: row.virtualization_slug || null,
    // Region info
    regionCity: row.region_city || null,
    regionRegion: row.region_region || null,
    regionCountryCode: row.region_country_code || null,
    // System info (parsed)
    cpuModel,
    cpuCores,
    ramGB,
    diskGB,
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
