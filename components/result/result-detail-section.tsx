"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/components/i18n/i18n-provider";
import { TimeAgo } from "@/components/ui/time-ago";
import { formatLocalDateTime } from "@/lib/utils/time-ago";
import { formatCityCountry } from "@/lib/geo/countries";
import { CountryFlag } from "@/components/icons/country-flag";
import { OSIcon } from "@/components/icons/os-icon";
import { ProviderIcon } from "@/components/icons/provider-icon";
import { Badge } from "@/components/ui/badge";
import { ProviderFeedbackDialog } from "@/components/result/provider-feedback-dialog";
import type {
  BenchmarkResultDetail,
  DiskIoData,
  FioData,
  NetSpeedItem,
} from "@/lib/types/benchmark";

type ResultDetailSectionProps = {
  result: BenchmarkResultDetail;
};

/**
 * Component hiển thị Disk I/O metrics
 */
const DiskIoSection: React.FC<{ data: DiskIoData }> = ({ data }) => {
  const { t } = useI18n();
  return (
    <div className="mb-6 rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg backdrop-blur">
      <h2 className="mb-4 text-lg font-semibold">Disk I/O Performance</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.writeSpeedMBs !== undefined && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">
              Write Speed
            </span>
            <p className="mt-1 text-lg font-semibold">
              {data.writeSpeedMBs.toFixed(2)} MB/s
            </p>
            {data.writeSpeedMbps !== undefined && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {data.writeSpeedMbps.toFixed(2)} Mbps
              </p>
            )}
          </div>
        )}
        {data.readSpeedMBs !== undefined && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">
              Read Speed
            </span>
            <p className="mt-1 text-lg font-semibold">
              {data.readSpeedMBs.toFixed(2)} MB/s
            </p>
            {data.readSpeedMbps !== undefined && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {data.readSpeedMbps.toFixed(2)} Mbps
              </p>
            )}
          </div>
        )}
        {data.timeSeconds !== undefined && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">
              Test Duration
            </span>
            <p className="mt-1 text-lg font-semibold">
              {data.timeSeconds.toFixed(2)}s
            </p>
          </div>
        )}
        {data.bytesWritten !== undefined && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">
              Bytes Written
            </span>
            <p className="mt-1 text-sm">
              {(data.bytesWritten / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Component hiển thị FIO metrics
 */
const FioSection: React.FC<{ data: FioData }> = ({ data }) => {
  const blockSizes: Array<keyof FioData> = ["4k", "64k", "512k", "1M"];
  const hasData = blockSizes.some((bs) => data[bs]);

  if (!hasData) return null;

  return (
    <div className="mb-6 rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg backdrop-blur">
      <h2 className="mb-4 text-lg font-semibold">FIO Benchmark</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                Block Size
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                Total (MB/s)
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                Read (MB/s)
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                Write (MB/s)
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                IOPS
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                IOPS Read
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                IOPS Write
              </th>
            </tr>
          </thead>
          <tbody>
            {blockSizes.map((bs) => {
              const blockData = data[bs];
              if (!blockData) return null;
              return (
                <tr key={bs} className="border-b border-border/30">
                  <td className="px-4 py-3 font-medium">{bs}</td>
                  <td className="px-4 py-3 text-right">
                    {blockData.total?.toFixed(2) ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {blockData.read?.toFixed(2) ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {blockData.write?.toFixed(2) ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {blockData.iops
                      ? blockData.iops >= 1000
                        ? `${(blockData.iops / 1000).toFixed(1)}k`
                        : blockData.iops.toFixed(0)
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {blockData.iopsRead
                      ? blockData.iopsRead >= 1000
                        ? `${(blockData.iopsRead / 1000).toFixed(1)}k`
                        : blockData.iopsRead.toFixed(0)
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {blockData.iopsWrite
                      ? blockData.iopsWrite >= 1000
                        ? `${(blockData.iopsWrite / 1000).toFixed(1)}k`
                        : blockData.iopsWrite.toFixed(0)
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Component hiển thị Network Speed metrics
 */
const NetSpeedSection: React.FC<{ data: NetSpeedItem[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="mb-6 rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg backdrop-blur">
      <h2 className="mb-4 text-lg font-semibold">Network Speed Test</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                Server
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                Ping (ms)
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                Download (Mbps)
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                Upload (Mbps)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-b border-border/30">
                <td className="px-4 py-3 font-medium">{item.server ?? "-"}</td>
                <td className="px-4 py-3 text-right">
                  {item.ping !== undefined ? item.ping.toFixed(2) : "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  {item.download !== undefined ? item.download.toFixed(2) : "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  {item.upload !== undefined ? item.upload.toFixed(2) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Component hiển thị chi tiết một benchmark result
 * @param result - dữ liệu benchmark result từ DB
 * @returns Section chi tiết với metadata và performance metrics
 */
export const ResultDetailSection: React.FC<ResultDetailSectionProps> = ({
  result,
}) => {
  const { t } = useI18n();

  // Lấy provider name để hiển thị (ưu tiên brand_name, fallback về display_name)
  const providerDisplayName =
    result.providerBrandName || result.provider || null;

  // Format provider info
  const providerInfo: (string | React.ReactNode)[] = [];
  const locationLabel = formatCityCountry(
    result.regionCity,
    result.regionRegion,
    result.regionCountryCode
  );
  if (locationLabel) {
    // Hiển thị flag icon + location text
    providerInfo.push(
      <span key="location" className="inline-flex items-center gap-1.5">
        <CountryFlag
          countryCode={result.regionCountryCode}
          size="sm"
          className="shrink-0"
        />
        <span>{locationLabel}</span>
      </span>
    );
  }
  // Thêm uptime (nếu có) vào provider info với green dot
  if (
    result.uptimeSeconds !== undefined &&
    result.uptimeSeconds !== null &&
    typeof result.uptimeSeconds === "number"
  ) {
    const formatUptime = (seconds: number): string => {
      if (!Number.isFinite(seconds) || seconds <= 0) return "-";
      const d = Math.floor(seconds / 86400);
      const h = Math.floor((seconds % 86400) / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      if (d > 0) return `${d}d${h > 0 ? ` ${h}h` : ""}`;
      if (h > 0) return `${h}h${m > 0 ? ` ${m}m` : ""}`;
      if (m > 0) return `${m}m`;
      return `${s}s`;
    };

    providerInfo.push(
      <span
        key="uptime"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <span
          className="h-2 w-2 rounded-full bg-emerald-500"
          aria-hidden="true"
        />
        <span>Uptime: {formatUptime(result.uptimeSeconds)}</span>
      </span>
    );
  }

  // Format system info chips
  const metricChips: { label: string; icon: string }[] = [];
  if (result.cpuCores != null && typeof result.cpuCores === "number") {
    metricChips.push({
      label: `${result.cpuCores} core${result.cpuCores === 1 ? "" : "s"}`,
      icon: "/leaderboard/cpu-icon.svg",
    });
  }
  if (result.ramGB != null && typeof result.ramGB === "number") {
    metricChips.push({
      label: `${result.ramGB.toFixed(1)} GB`,
      icon: "/leaderboard/ram-memory-icon.svg",
    });
  }
  if (result.diskGB != null && typeof result.diskGB === "number") {
    metricChips.push({
      label: `${result.diskGB.toFixed(1)} GB`,
      icon: "/leaderboard/storage-svgrepo-com.svg",
    });
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <Link
            href="/leaderboard"
            className="text-xs text-muted-foreground hover:text-foreground transition"
          >
            ← {t("result.backToLeaderboard")}
          </Link>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {t("result.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("result.description")}
        </p>
      </div>

      {/* Summary Metrics Card */}
      <div className="mb-6 rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg backdrop-blur">
        <h2 className="mb-4 text-lg font-semibold">
          {t("result.summary.title")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-xs font-medium text-muted-foreground">
              {t("result.summary.time")}
            </span>
            <p className="mt-1 text-sm">
              {formatLocalDateTime(result.createdAt)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              <TimeAgo date={result.createdAt} />
            </p>
          </div>
          {result.avgPingMs !== null && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                {t("result.summary.avgPing")}
              </span>
              <p className="mt-1 text-lg font-semibold">
                {result.avgPingMs.toFixed(2)} ms
              </p>
            </div>
          )}
          {result.downloadMbps !== null && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                {t("result.summary.downloadSpeed")}
              </span>
              <p className="mt-1 text-lg font-semibold">
                {result.downloadMbps.toFixed(2)} Mbps
              </p>
            </div>
          )}
          {result.score !== null && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                {t("result.summary.score")}
              </span>
              <p className="mt-1 text-lg font-semibold text-primary">
                {result.score.toFixed(2)} / 10
              </p>
            </div>
          )}
        </div>
        {result.serverLabel && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <span className="text-xs font-medium text-muted-foreground">
              {t("result.summary.serverLabel")}
            </span>
            <p className="mt-1 text-sm">{result.serverLabel}</p>
          </div>
        )}
      </div>

      {/* System Info Card */}
      {(result.cpuModel ||
        metricChips.length > 0 ||
        result.os ||
        result.virtualization) && (
        <div className="mb-6 rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg backdrop-blur">
          <h2 className="mb-4 text-lg font-semibold">System Information</h2>
          <div className="space-y-4">
            {result.cpuModel && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  CPU Model
                </span>
                <p className="mt-1 text-sm">{result.cpuModel}</p>
              </div>
            )}
            {metricChips.length > 0 && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  Hardware
                </span>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  {metricChips.map((info, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Image
                        src={info.icon}
                        alt=""
                        width={20}
                        height={20}
                        className="h-8 w-8 opacity-70 dark:opacity-80 dark:brightness-0 dark:invert dark:contrast-200"
                      />
                      <span className="text-sm">{info.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* OS + Virtualization */}
            {(result.os || result.osDisplay || result.virtualization) && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  OS &amp; Virtualization
                </span>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {result.osDisplay || result.os ? (
                    <span className="inline-flex items-center gap-1.5">
                      <OSIcon
                        osName={result.os}
                        osFamily={result.osFamily}
                        size={16}
                        className="shrink-0"
                      />
                      <span>{result.osDisplay || result.os}</span>
                    </span>
                  ) : null}
                  {result.virtualization && (
                    <span className="text-sm">
                      {result.osDisplay || result.os ? "• " : ""}
                      {result.virtualization}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Provider Info Card */}
      {providerInfo.length > 0 && (
        <div className="mb-6 rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg backdrop-blur">
          <h2 className="mb-4 text-lg font-semibold">Provider Information</h2>
          {/* Provider header với logo + nút Góp ý / Báo lỗi */}
          {providerDisplayName && (
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <ProviderIcon
                  providerSlug={result.providerSlug}
                  displayName={providerDisplayName}
                  logoUrl={result.providerLogoUrl}
                  size={64}
                  withPlaceholder
                  className="shrink-0 rounded-lg"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold">
                    {providerDisplayName}
                  </span>
                  {result.providerWebsiteUrl && (
                    <a
                      href={result.providerWebsiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                    >
                      {new URL(result.providerWebsiteUrl).hostname.replace(
                        /^www\./,
                        ""
                      )}
                    </a>
                  )}
                </div>
              </div>
              <ProviderFeedbackDialog
                benchmarkId={result.id}
                providerName={providerDisplayName}
                providerSlug={result.providerSlug}
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            {providerInfo.map((info, idx) => (
              <div key={idx} className="text-sm">
                {info}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disk I/O Section */}
      {result.diskIo &&
        (result.diskIo.writeSpeedMBs !== undefined ||
          result.diskIo.readSpeedMBs !== undefined ||
          result.diskIo.timeSeconds !== undefined ||
          result.diskIo.bytesWritten !== undefined) && (
          <DiskIoSection data={result.diskIo} />
        )}

      {/* FIO Section */}
      {result.fio && <FioSection data={result.fio} />}

      {/* Network Speed Section */}
      {result.netSpeed &&
        Array.isArray(result.netSpeed) &&
        result.netSpeed.length > 0 && (
          <NetSpeedSection data={result.netSpeed} />
        )}
    </section>
  );
};
