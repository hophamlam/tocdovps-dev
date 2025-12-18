"use client";

import { useEffect, useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import Link from "next/link";

/**
 * Provider tooltip component
 * Hiển thị website URL và alternative/legal names khi hover
 *
 * @param providerSlug - Provider slug để query thông tin
 * @param providerDisplayName - Display name hiện tại
 * @param children - Element để attach tooltip (thường là ProviderIcon + text)
 */
export function ProviderTooltip({
  providerSlug,
  providerDisplayName,
  children,
}: {
  providerSlug: string | null;
  providerDisplayName: string | null;
  children: React.ReactNode;
}) {
  const [providerInfo, setProviderInfo] = useState<{
    websiteUrl: string | null;
    legalNames: string[];
  }>({
    websiteUrl: null,
    legalNames: [],
  });
  const [loading, setLoading] = useState(false);

  // Fetch provider info từ API khi có slug
  useEffect(() => {
    if (!providerSlug) return;

    setLoading(true);
    fetch(`/api/providers/${providerSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          // API error → fallback về hardcoded mapping
          setProviderInfo({
            websiteUrl: getProviderWebsiteUrl(providerSlug),
            legalNames: [],
          });
        } else {
          setProviderInfo({
            websiteUrl: data.websiteUrl || null,
            legalNames: data.legalNames || [],
          });
        }
        setLoading(false);
      })
      .catch(() => {
        // Network error → fallback
        setProviderInfo({
          websiteUrl: getProviderWebsiteUrl(providerSlug),
          legalNames: [],
        });
        setLoading(false);
      });
  }, [providerSlug]);

  // Không có thông tin → không hiển thị tooltip
  if (!providerInfo.websiteUrl && providerInfo.legalNames.length === 0) {
    return <>{children}</>;
  }

  const tooltipContent = (
    <div className="text-left space-y-2 min-w-[200px]">
      {providerInfo.websiteUrl && (
        <div>
          <Link
            href={providerInfo.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 underline break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {providerInfo.websiteUrl.replace(/^https?:\/\//, "")}
          </Link>
        </div>
      )}
      {providerInfo.legalNames.length > 0 && (
        <div className="text-xs text-gray-300">
          <div className="font-semibold mb-1">Also known as:</div>
          <ul className="list-disc list-inside space-y-0.5">
            {providerInfo.legalNames.slice(0, 5).map((name, idx) => (
              <li key={idx} className="break-words">
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return <Tooltip content={tooltipContent}>{children}</Tooltip>;
}

/**
 * Get provider website URL từ slug (fallback nếu API fail)
 * TODO: Remove sau khi API hoạt động ổn định
 */
function getProviderWebsiteUrl(slug: string | null): string | null {
  if (!slug) return null;

  // Mapping phổ biến (fallback)
  const urlMap: Record<string, string> = {
    vultr: "https://www.vultr.com",
    digitalocean: "https://www.digitalocean.com",
    "amazon-web-services": "https://aws.amazon.com",
    "google-cloud-platform": "https://cloud.google.com",
    "microsoft-azure": "https://azure.microsoft.com",
    hetzner: "https://www.hetzner.com",
    ovhcloud: "https://www.ovhcloud.com",
    contabo: "https://www.contabo.com",
    "oracle-cloud": "https://www.oracle.com/cloud",
    "akamai-linode": "https://www.linode.com",
    hypercorevn: "https://hypercore.vn",
    "hypercore.vn": "https://hypercore.vn",
    hosthatch: "https://www.hosthatch.com",
  };

  return urlMap[slug.toLowerCase()] || null;
}
