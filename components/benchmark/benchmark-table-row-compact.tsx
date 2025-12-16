"use client";

import React from "react";
import { TimeAgo } from "@/components/ui/time-ago";
import type { BenchmarkRunSummary } from "@/lib/types/benchmark";

type BenchmarkTableRowCompactProps = {
  item: BenchmarkRunSummary;
  textSize?: "xs" | "sm";
};

/**
 * Compact version của BenchmarkTableRow cho landing page
 * Chỉ hiển thị: Time, Label, Ping, Download, Score
 */
export const BenchmarkTableRowCompact: React.FC<
  BenchmarkTableRowCompactProps
> = ({ item, textSize = "xs" }) => {
  const textSizeClass = textSize === "xs" ? "text-xs" : "text-sm";
  const paddingClass = textSize === "xs" ? "px-3 py-2" : "px-4 py-3";

  return (
    <tr className="border-t border-border/60 hover:bg-muted/30 transition-colors">
      <td
        className={`${paddingClass} text-left ${textSizeClass} text-muted-foreground`}
      >
        <TimeAgo date={item.createdAt} />
      </td>
      <td
        className={`${paddingClass} text-left ${textSizeClass} text-muted-foreground`}
      >
        {item.serverLabel || "—"}
      </td>
      <td
        className={`${paddingClass} text-right ${textSizeClass} text-muted-foreground`}
      >
        {item.avgPingMs != null
          ? `${item.avgPingMs.toFixed(2)} ms`
          : "—"}
      </td>
      <td
        className={`${paddingClass} text-right ${textSizeClass} text-muted-foreground`}
      >
        {item.downloadMbps != null
          ? `${item.downloadMbps.toFixed(2)} Mbps`
          : "—"}
      </td>
      <td
        className={`${paddingClass} text-right ${textSizeClass} font-medium ${
          item.score != null ? "text-foreground" : "text-muted-foreground/60"
        }`}
      >
        {item.score != null ? item.score.toFixed(2) : "—"}
      </td>
    </tr>
  );
};

