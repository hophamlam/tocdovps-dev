import type {
  BenchmarkRunSummary,
  BenchmarkResultDetail,
  DiskIoData,
  FioData,
  NetSpeedItem,
} from "@/lib/types/benchmark";

/**
 * Type cho row từ database query (benchmark_leaderboard_view)
 */
export type BenchmarkRow = {
  id: string;
  id_display: string;
  public_id?: number | string | null;
  created_at: string;
  server_label: string | null;
  avg_ping_ms: string | null;
  download_mbps: string | null;
  score: string | null;
  visibility: string | null;
  uptime_seconds?: number | string | null;
  // Provider info
  provider_display_name: string | null;
  provider_brand_name?: string | null;
  provider_slug: string | null;
  provider_website_url?: string | null;
  provider_logo_url?: string | null;
  provider_text?: string | null;
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
  // System info (JSONB)
  system_info: unknown;
};

/**
 * Type cho row từ database query (benchmark detail với performance metrics)
 */
export type BenchmarkDetailRow = {
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
  uptime_seconds?: number | string | null;
  // Provider info
  provider_display_name: string | null;
  provider_brand_name: string | null;
  provider_slug: string | null;
  provider_website_url: string | null;
  provider_logo_url: string | null;
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

/**
 * Parse system_info JSONB để lấy CPU, RAM, Disk, OS display
 * @param systemInfo - system_info từ database (có thể là object hoặc null)
 * @param osName - OS name từ lookup table (fallback)
 * @param osVersion - OS version từ lookup table (fallback)
 * @returns Object chứa parsed system info
 */
export function parseSystemInfo(
  systemInfo: unknown,
  osName: string | null = null,
  osVersion: string | null = null
): {
  cpuModel: string | null;
  cpuCores: number | null;
  ramGB: number | null;
  diskGB: number | null;
  osDisplay: string | null;
} {
  let cpuModel: string | null = null;
  let cpuCores: number | null = null;
  let ramGB: number | null = null;
  let diskGB: number | null = null;
  let osDisplay: string | null = null;

  if (systemInfo && typeof systemInfo === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const systemInfoObj = systemInfo as Record<string, any>;
    cpuModel = systemInfoObj.cpuModel || systemInfoObj.cpu_model || null;
    cpuCores =
      systemInfoObj.cores !== undefined
        ? Number(systemInfoObj.cores)
        : systemInfoObj.cpu_cores !== undefined
        ? Number(systemInfoObj.cpu_cores)
        : null;
    ramGB =
      systemInfoObj.ramGB !== undefined
        ? Number(systemInfoObj.ramGB)
        : systemInfoObj.ram_gb !== undefined
        ? Number(systemInfoObj.ram_gb)
        : null;
    diskGB =
      systemInfoObj.diskTotalGB !== undefined
        ? Number(systemInfoObj.diskTotalGB)
        : systemInfoObj.disk_total_gb !== undefined
        ? Number(systemInfoObj.disk_total_gb)
        : null;

    // OS detail trong system_info.os
    const osInfo = systemInfoObj.os;
    if (osInfo && typeof osInfo === "object") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const osInfoObj = osInfo as Record<string, any>;
      const osNameFromSystem = osInfoObj.name ?? osName ?? null;
      const osVersionFromSystem = osInfoObj.version ?? null;

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
    if (osName && osVersion) {
      osDisplay = `${osName} ${osVersion}`;
    } else if (osName) {
      osDisplay = osName;
    }
  }

  return {
    cpuModel,
    cpuCores,
    ramGB,
    diskGB,
    osDisplay,
  };
}

/**
 * Map database row thành BenchmarkRunSummary
 * @param row - Row từ database query
 * @returns BenchmarkRunSummary object
 */
export function mapBenchmarkRowToSummary(
  row: BenchmarkRow
): BenchmarkRunSummary {
  const systemInfo = parseSystemInfo(
    row.system_info,
    row.os_name,
    row.os_version
  );

  return {
    id: row.id,
    idDisplay: row.id_display,
    publicId:
      row.public_id !== undefined && row.public_id !== null
        ? Number(row.public_id)
        : null,
    createdAt: new Date(row.created_at).toISOString(),
    serverLabel: row.server_label,
    avgPingMs: row.avg_ping_ms ? parseFloat(row.avg_ping_ms) : null,
    downloadMbps: row.download_mbps ? parseFloat(row.download_mbps) : null,
    score: row.score ? parseFloat(row.score) : null,
    visibility: row.visibility || "shared",
    // Provider info
    provider: row.provider_display_name || null,
    providerBrandName: row.provider_brand_name ?? null,
    providerSlug: row.provider_slug || null,
    providerWebsiteUrl: row.provider_website_url ?? null,
    providerLogoUrl: row.provider_logo_url ?? null,
    providerText: row.provider_text ?? null,
    // OS info
    os: row.os_name || null,
    osVersion: row.os_version || null,
    osFamily: row.os_family || null,
    osSlug: row.os_slug || null,
    osDisplay: systemInfo.osDisplay,
    // Virtualization info
    virtualization: row.virtualization_name || null,
    virtualizationSlug: row.virtualization_slug || null,
    // Region info
    regionCity: row.region_city || null,
    regionRegion: row.region_region || null,
    regionCountryCode: row.region_country_code || null,
    // System info
    cpuModel: systemInfo.cpuModel,
    cpuCores: systemInfo.cpuCores,
    ramGB: systemInfo.ramGB,
    diskGB: systemInfo.diskGB,
    uptimeSeconds:
      row.uptime_seconds !== undefined && row.uptime_seconds !== null
        ? Number(row.uptime_seconds)
        : null,
  };
}

/**
 * Parse JSONB field từ database
 * Xử lý cả object và string (nếu DB trả về string)
 * @param field - Field từ database (có thể là object, string, hoặc null)
 * @returns Parsed object/array hoặc null
 */
export function parseJsonbField(field: unknown): unknown {
  if (field === null || field === undefined) return null;
  if (typeof field === "object") return field;
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Parse Disk I/O data từ JSONB field
 * @param field - disk_io field từ database
 * @returns DiskIoData hoặc null
 */
export function parseDiskIo(field: unknown): DiskIoData | null {
  const parsed = parseJsonbField(field);
  if (!parsed || typeof parsed !== "object") return null;
  return parsed as DiskIoData;
}

/**
 * Parse FIO data từ JSONB field
 * @param field - fio field từ database
 * @returns FioData hoặc null
 */
export function parseFio(field: unknown): FioData | null {
  const parsed = parseJsonbField(field);
  if (!parsed || typeof parsed !== "object") return null;
  return parsed as FioData;
}

/**
 * Parse Network Speed data từ JSONB field
 * @param field - net_speed field từ database
 * @returns Array of NetSpeedItem hoặc null
 */
export function parseNetSpeed(field: unknown): NetSpeedItem[] | null {
  const parsed = parseJsonbField(field);
  if (!parsed) return null;
  if (Array.isArray(parsed)) {
    return parsed as NetSpeedItem[];
  }
  return null;
}

/**
 * Map database detail row thành BenchmarkResultDetail
 * @param row - Row từ database query với performance metrics
 * @returns BenchmarkResultDetail object
 */
export function mapBenchmarkDetailRowToResult(
  row: BenchmarkDetailRow
): BenchmarkResultDetail {
  const systemInfo = parseSystemInfo(
    row.system_info,
    row.os_name,
    row.os_version
  );

  return {
    id: row.id,
    idDisplay: row.id, // Detail page không cần idDisplay, dùng id
    publicId: null,
    createdAt: new Date(row.created_at).toISOString(),
    serverLabel: row.server_label,
    avgPingMs: row.avg_ping_ms ? parseFloat(row.avg_ping_ms) : null,
    downloadMbps: row.download_mbps ? parseFloat(row.download_mbps) : null,
    score: row.score ? parseFloat(row.score) : null,
    visibility: row.visibility ?? "shared",
    // Provider info
    provider: row.provider_display_name || null,
    providerBrandName: row.provider_brand_name || null,
    providerSlug: row.provider_slug || null,
    providerWebsiteUrl: row.provider_website_url || null,
    providerLogoUrl: row.provider_logo_url || null,
    providerText: null,
    // OS info
    os: row.os_name || null,
    osVersion: row.os_version || null,
    osFamily: row.os_family || null,
    osSlug: row.os_slug || null,
    osDisplay: systemInfo.osDisplay,
    // Virtualization info
    virtualization: row.virtualization_name || null,
    virtualizationSlug: row.virtualization_slug || null,
    // Region info
    regionCity: row.region_city || null,
    regionRegion: row.region_region || null,
    regionCountryCode: row.region_country_code || null,
    // System info
    cpuModel: systemInfo.cpuModel,
    cpuCores: systemInfo.cpuCores,
    ramGB: systemInfo.ramGB,
    diskGB: systemInfo.diskGB,
    uptimeSeconds:
      row.uptime_seconds !== undefined && row.uptime_seconds !== null
        ? Number(row.uptime_seconds)
        : null,
    // Performance metrics
    diskIo: parseDiskIo(row.disk_io),
    fio: parseFio(row.fio),
    netSpeed: parseNetSpeed(row.net_speed),
  };
}
