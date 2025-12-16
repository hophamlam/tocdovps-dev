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

  // Format provider info
  const providerInfo: (string | React.ReactNode)[] = [];
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
  } else if (item.provider) {
    providerInfo.push(item.provider);
  }
  const locationLabel = formatCityCountry(
    item.regionCity,
    item.regionRegion,
    item.regionCountryCode
  );
  if (locationLabel) providerInfo.push(locationLabel);
  const osLabel = item.osDisplay || item.os;
  if (osLabel) providerInfo.push(osLabel);
  if (item.virtualization) providerInfo.push(item.virtualization);

  // Format system info:
  // - Line 1: CPU model
  // - Line 2: CPU cores + RAM + Disk (icons + value)
  const cpuLine = item.cpuModel ?? null;
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
      icon: "/leaderboard/save.svg",
    });
  }

  return (
    <tr className="border-t border-border/60 hover:bg-muted/30 transition-colors">
      {showRank && (
        <td
          className={`${paddingClass} text-left ${textSizeClass} font-medium text-muted-foreground`}
        >
          {rank}
        </td>
      )}
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
      {/* ID Column (cuối cùng) */}
      <td
        className={`${paddingClass} text-left ${textSizeClass} w-[120px] md:w-[120px]`}
      >
        {item.visibility === "private" ? (
          <span
            className="font-mono text-[12px] text-muted-foreground break-all"
            title={item.id}
          >
            {item.idDisplay}
          </span>
        ) : (
          <Link
            href={`/result/${item.id}`}
            className="inline-flex items-center gap-1 hover:text-primary break-all"
            title={item.id}
          >
            <span className="font-mono text-[12px] text-muted-foreground">
              {item.idDisplay}
            </span>
            <ExternalLink className="h-6 w-6 text-muted-foreground" />
          </Link>
        )}
      </td>
    </tr>
  );
};
