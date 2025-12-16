"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/components/i18n/i18n-provider";
import { TimeAgo } from "@/components/ui/time-ago";
import { formatLocalDateTime } from "@/lib/utils/time-ago";
import type { BenchmarkPayload } from "@/lib/types/benchmark";
import { formatCityCountry } from "@/lib/geo/countries";
import { Badge } from "@/components/ui/badge";

type ResultDetail = {
  id: string;
  createdAt: string;
  serverLabel: string | null;
  avgPingMs: number | null;
  downloadMbps: number | null;
  score: number | null;
  visibility: string;
  rawPayload: BenchmarkPayload;
  // Provider info
  provider: string | null;
  providerSlug: string | null;
  // OS info
  os: string | null;
  osVersion: string | null;
  osFamily: string | null;
  osSlug: string | null;
  osDisplay: string | null;
  // Virtualization info
  virtualization: string | null;
  virtualizationSlug: string | null;
  // Region info
  regionCity: string | null;
  regionRegion: string | null;
  regionCountryCode: string | null;
  // System info (parsed)
  cpuModel: string | null;
  cpuCores: number | null;
  ramGB: number | null;
  diskGB: number | null;
};

type ResultDetailSectionProps = {
  result: ResultDetail;
};

/**
 * Component hiển thị chi tiết một benchmark result
 * @param result - dữ liệu benchmark result từ DB
 * @returns Section chi tiết với metadata và raw payload
 */
export const ResultDetailSection: React.FC<ResultDetailSectionProps> = ({
  result,
}) => {
  const { t } = useI18n();

  // Format provider info
  const providerInfo: (string | React.ReactNode)[] = [];
  if (result.visibility === "private") {
    providerInfo.push(
      <span key="provider-private" className="inline-flex items-center gap-1">
        VPS Provider:{" "}
        <Badge variant="outline" className="text-xs px-2 py-0.5">
          private
        </Badge>
      </span>
    );
  } else if (result.provider) {
    providerInfo.push(result.provider);
  }
  const locationLabel = formatCityCountry(
    result.regionCity,
    result.regionRegion,
    result.regionCountryCode
  );
  if (locationLabel) providerInfo.push(locationLabel);
  const osLabel = result.osDisplay || result.os;
  if (osLabel) providerInfo.push(osLabel);
  if (result.virtualization) providerInfo.push(result.virtualization);

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
      icon: "/leaderboard/save.svg",
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
      {(result.cpuModel || metricChips.length > 0) && (
        <div className="mb-6 rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg backdrop-blur">
          <h2 className="mb-4 text-lg font-semibold">System Information</h2>
          <div className="space-y-3">
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
                        className="h-5 w-5 opacity-70 dark:opacity-80 dark:brightness-0 dark:invert dark:contrast-200"
                      />
                      <span className="text-sm">{info.label}</span>
                    </div>
                  ))}
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
          <div className="flex flex-col gap-2">
            {providerInfo.map((info, idx) => (
              <div key={idx} className="text-sm">
                {info}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Payload */}
      <div className="rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg backdrop-blur">
        <h2 className="mb-4 text-lg font-semibold">
          {t("result.rawPayload.title")}
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          {t("result.rawPayload.description")}
        </p>
        <div className="overflow-x-auto rounded-xl border border-border/70 bg-background/95 p-4">
          <pre className="text-[11px] font-mono leading-relaxed">
            <code>{JSON.stringify(result.rawPayload, null, 2)}</code>
          </pre>
        </div>
      </div>
    </section>
  );
};
