"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/i18n-provider";

type ResultDetail = {
  id: string;
  createdAt: string;
  sourceIp: string | null;
  serverLabel: string | null;
  avgPingMs: number | null;
  downloadMbps: number | null;
  score: number | null;
  rawPayload: unknown;
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

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
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

      {/* Summary Card */}
      <div className="mb-6 rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg backdrop-blur">
        <h2 className="mb-4 text-lg font-semibold">
          {t("result.summary.title")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="text-xs font-medium text-muted-foreground">
              {t("result.summary.time")}
            </span>
            <p className="mt-1 text-sm">{formatDate(result.createdAt)}</p>
          </div>
          {result.serverLabel && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                {t("result.summary.serverLabel")}
              </span>
              <p className="mt-1 text-sm">{result.serverLabel}</p>
            </div>
          )}
          {result.avgPingMs !== null && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                {t("result.summary.avgPing")}
              </span>
              <p className="mt-1 text-sm font-semibold">
                {result.avgPingMs.toFixed(2)} ms
              </p>
            </div>
          )}
          {result.downloadMbps !== null && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                {t("result.summary.downloadSpeed")}
              </span>
              <p className="mt-1 text-sm font-semibold">
                {result.downloadMbps.toFixed(2)} Mbps
              </p>
            </div>
          )}
          {result.score !== null && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                {t("result.summary.score")}
              </span>
              <p className="mt-1 text-sm font-semibold text-primary">
                {result.score.toFixed(2)} / 10
              </p>
            </div>
          )}
          {result.sourceIp && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                {t("result.summary.sourceIp")}
              </span>
              <p className="mt-1 text-sm font-mono text-xs">
                {result.sourceIp}
              </p>
            </div>
          )}
        </div>
      </div>

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

