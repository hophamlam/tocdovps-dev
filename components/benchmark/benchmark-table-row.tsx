"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { TimeAgo } from "@/components/ui/time-ago";
import { formatLocalDateTime } from "@/lib/utils/time-ago";
import type { BenchmarkRunSummary } from "@/lib/types/benchmark";
import { formatCityCountry } from "@/lib/geo/countries";
import { Badge } from "@/components/ui/badge";
import { CountryFlag } from "@/components/icons/country-flag";
import { OSIcon } from "@/components/icons/os-icon";
import { ProviderIcon } from "@/components/icons/provider-icon";

type BenchmarkTableRowProps = {
  item: BenchmarkRunSummary;
  /**
   * Hiển thị rank (số thứ tự)
   */
  showRank?: boolean;
  rank?: number;
  /**
   * Hiển thị absolute time (dd/mm/yyyy HH:mm:ss)
   */
  showAbsoluteTime?: boolean;
  /**
   * Hiển thị View button
   */
  showViewButton?: boolean;
  /**
   * Size của text trong cell
   */
  textSize?: "xs" | "sm";
};

/**
 * Shared component hiển thị 1 row trong bảng benchmark
 * Có thể tùy chỉnh hiển thị rank, absolute time, view button
 * @param item - benchmark item data
 * @param showRank - có hiển thị cột rank không
 * @param rank - số rank (nếu showRank = true)
 * @param showAbsoluteTime - có hiển thị absolute time không
 * @param showViewButton - có hiển thị View button không
 * @param textSize - size của text (xs hoặc sm)
 * @returns Table row component
 */
export const BenchmarkTableRow: React.FC<BenchmarkTableRowProps> = ({
  item,
  showRank = false,
  rank,
  showAbsoluteTime = false,
  showViewButton = false,
  textSize = "xs",
}) => {
  const textSizeClass = textSize === "xs" ? "text-xs" : "text-sm";
  const paddingClass = textSize === "xs" ? "px-3 py-2" : "px-4 py-3";

  /**
   * Format uptime (seconds) thành chuỗi ngắn: 3d 4h, 5h 10m, 12m, 45s
   * @param seconds - số giây uptime
   */
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

  // Format provider info
  const providerInfo: (string | React.ReactNode)[] = [];

  // Provider name với ưu tiên:
  // 1) providers.brand_name
  // 2) providers.display_name
  // 3) benchmark_runs.provider_text (fallback khi không có provider_id)
  const providerDisplayName =
    item.providerBrandName || item.provider || item.providerText || null;

  // Provider lên đầu tiên, nếu private thì hiện "VPS Provider: " + badge "private"
  if (item.visibility === "private") {
    providerInfo.push(
      <span key="provider-private" className="inline-flex items-center gap-1">
        VPS Provider:{" "}
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          private
        </Badge>
      </span>
    );
  }

  // Chỉ hiển thị thông tin provider (brand_name, website, logo) khi KHÔNG phải private
  if (providerDisplayName && item.visibility !== "private") {
    const providerContent = (
      <span className="inline-flex items-center gap-1.5">
        <ProviderIcon
          providerSlug={item.providerSlug}
          displayName={providerDisplayName}
          logoUrl={item.providerLogoUrl}
          size={24}
          withPlaceholder
          className="shrink-0"
        />
        <span>{providerDisplayName}</span>
      </span>
    );

    providerInfo.push(
      item.providerWebsiteUrl ? (
        <a
          key="provider"
          href={item.providerWebsiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-foreground hover:underline underline-offset-4"
        >
          {providerContent}
        </a>
      ) : (
        <span key="provider" className="inline-flex items-center gap-1.5">
          {providerContent}
        </span>
      )
    );
  }
  const locationLabel = formatCityCountry(
    item.regionCity,
    item.regionRegion,
    item.regionCountryCode
  );
  if (locationLabel) {
    // Hiển thị flag icon + location text
    providerInfo.push(
      <span key="location" className="inline-flex items-center gap-1.5">
        <CountryFlag
          countryCode={item.regionCountryCode}
          size="sm"
          className="shrink-0"
        />
        <span>{locationLabel}</span>
      </span>
    );
  }
  // Thêm uptime (nếu có) vào provider info (dưới provider / location)
  if (item.uptimeSeconds != null && typeof item.uptimeSeconds === "number") {
    providerInfo.push(
      <span
        key="uptime"
        className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground"
      >
        <span
          className="h-2 w-2 rounded-full bg-emerald-500"
          aria-hidden="true"
        />
        <span>Uptime: {formatUptime(item.uptimeSeconds)}</span>
      </span>
    );
  }

  // Format system info:
  // - Line 1: CPU model
  // - Line 2: CPU cores + RAM + Disk (icons + value)
  const cpuLine = item.cpuModel ?? null;
  const osLabel = item.osDisplay || item.os;
  const metricChips: { label: string; icon: string }[] = [];
  if (item.cpuCores != null && typeof item.cpuCores === "number") {
    metricChips.push({
      label: `${item.cpuCores} core${item.cpuCores === 1 ? "" : "s"}`,
      icon: "/leaderboard/cpu-icon.svg",
    });
  }
  if (item.ramGB != null && typeof item.ramGB === "number") {
    metricChips.push({
      label: `${item.ramGB.toFixed(1)} GB`,
      icon: "/leaderboard/ram-memory-icon.svg",
    });
  }
  if (item.diskGB != null && typeof item.diskGB === "number") {
    metricChips.push({
      label: `${item.diskGB.toFixed(1)} GB`,
      icon: "/leaderboard/storage-svgrepo-com.svg",
    });
  }

  return (
    <tr className="border-t border-border/60 hover:bg-muted/30 transition-colors">
      {/* Public ID column (#) - luôn hiển thị publicId nếu có */}
      <td
        className={`${paddingClass} text-left ${textSizeClass} font-medium text-muted-foreground`}
      >
        {item.publicId != null ? `#${item.publicId}` : "—"}
      </td>
      <td
        className={`${paddingClass} text-left ${textSizeClass} text-muted-foreground`}
      >
        {showAbsoluteTime ? (
          <div className="flex flex-col">
            <span>{formatLocalDateTime(item.createdAt)}</span>
            <span className="text-[10px] text-muted-foreground/80">
              <TimeAgo date={item.createdAt} />
            </span>
          </div>
        ) : (
          <TimeAgo date={item.createdAt} />
        )}
      </td>
      {/* System Info Column (line 1: CPU model, line 2: chips CPU/RAM/Disk) */}
      <td className={`${paddingClass} text-left ${textSizeClass} w-1/3`}>
        {cpuLine ? (
          <div className="mb-1 text-muted-foreground text-[11px] sm:text-xs">
            {cpuLine}
          </div>
        ) : null}

        {metricChips.length > 0 ? (
          <div className="flex flex-wrap items-center gap-3">
            {metricChips.map((info, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-muted-foreground"
              >
                <Image
                  src={info.icon}
                  alt=""
                  width={16}
                  height={16}
                  className="h-6 w-6 opacity-70 dark:opacity-80 dark:brightness-0 dark:invert dark:contrast-200"
                />
                <span className="whitespace-nowrap text-[11px] sm:text-xs">
                  {info.label}
                </span>
              </div>
            ))}
          </div>
        ) : !cpuLine ? (
          <span className="text-muted-foreground/60">—</span>
        ) : null}
        {/* OS + Virtualization trong System Info, cách dòng metrics một chút */}
        {(osLabel || item.virtualization) && (
          <div className="mt-2 mb-1 flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
            {osLabel && (
              <span className="inline-flex items-center gap-1">
                <OSIcon
                  osName={item.os}
                  osFamily={item.osFamily}
                  size={14}
                  className="shrink-0"
                />
                <span>{osLabel}</span>
              </span>
            )}
            {item.virtualization && (
              <span className="text-[11] sm:text-xs">
                {osLabel ? "• " : ""}
                {item.virtualization}
              </span>
            )}
          </div>
        )}
      </td>
      {/* Provider Info Column */}
      <td
        className={`${paddingClass} text-left ${textSizeClass} w-1/4 md:w-1/4`}
      >
        <div className="flex flex-col gap-1">
          {providerInfo.length > 0 ? (
            providerInfo.map((info, idx) =>
              typeof info === "string" ? (
                <span key={idx} className="text-muted-foreground">
                  {info}
                </span>
              ) : (
                <span key={idx} className="text-muted-foreground">
                  {info}
                </span>
              )
            )
          ) : (
            <span className="text-muted-foreground/60">—</span>
          )}
        </div>
      </td>
      {/* ID Column (cuối cùng) - luôn hiển thị idDisplay; private không có link */}
      <td
        className={`${paddingClass} text-left ${textSizeClass} w-[140px] md:w-[140px]`}
      >
        {item.visibility === "private" ? (
          // Private: chỉ hiển thị text, không link, không icon để tránh nhầm là public
          <span className="font-mono text-[12px] text-muted-foreground">
            {item.idDisplay}
          </span>
        ) : (
          // Shared: cho mở trang chi tiết, hiển thị idDisplay + icon mở tab mới
          <Link
            href={`/result/${item.id}`}
            className="inline-flex items-center gap-2 hover:text-primary break-all"
            title={item.idDisplay}
          >
            <span className="font-mono text-[12px] text-muted-foreground">
              {item.idDisplay}
            </span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}
      </td>
    </tr>
  );
};
