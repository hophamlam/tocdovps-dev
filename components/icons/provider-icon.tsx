"use client";

import Image from "next/image";

/**
 * Provider Icon Component
 * Hiển thị icon cho VPS providers
 *
 * Ưu tiên: logo_url từ database → hardcoded mapping → placeholder
 */

const PROVIDER_ICONS: Record<string, string> = {
  // Major providers
  vultr: "/icons/provider/vultr.svg",
  digitalocean: "/icons/provider/digitalocean.svg",
  "amazon-web-services": "/icons/provider/aws.svg",
  aws: "/icons/provider/aws.svg",
  "google-cloud-platform": "/icons/provider/gcp.svg",
  gcp: "/icons/provider/gcp.svg",
  "microsoft-azure": "/icons/provider/azure.svg",
  azure: "/icons/provider/azure.svg",

  // European providers
  hetzner: "/icons/provider/hetzner.svg",
  ovhcloud: "/icons/provider/ovh.svg",
  contabo: "/icons/provider/contabo.svg",

  // Asian providers
  hypercorevn: "/icons/provider/hypercore.svg",
  "hypercore.vn": "/icons/provider/hypercore.svg",

  // Other
  hosthatch: "/icons/provider/hosthatch.svg",
  "oracle-cloud": "/icons/provider/oracle.svg",
  "akamai-linode": "/icons/provider/linode.svg",
  linode: "/icons/provider/linode.svg",

  // Default
  default: "/icons/provider/default.svg",
};

/**
 * Get provider icon path từ slug
 * @param providerSlug - Provider slug từ database
 * @returns Icon path hoặc null nếu không match (để dùng placeholder)
 */
function getProviderIconPath(providerSlug: string | null): string | null {
  if (!providerSlug) {
    return null;
  }

  const slugKey = providerSlug.toLowerCase();
  if (PROVIDER_ICONS[slugKey]) {
    return PROVIDER_ICONS[slugKey];
  }

  // Fallback: thử match partial
  for (const [key, path] of Object.entries(PROVIDER_ICONS)) {
    if (slugKey.includes(key) || key.includes(slugKey)) {
      return path;
    }
  }

  // Không biết provider này → để UI dùng placeholder
  return null;
}

/**
 * Provider Icon Component
 * @param providerSlug - Provider slug từ database
 * @param displayName - Provider display name (dùng cho placeholder)
 * @param logoUrl - Logo URL từ database (ưu tiên cao nhất)
 * @param className - Custom className
 * @param size - Icon size (default: 20x20)
 * @param withPlaceholder - Có hiển thị placeholder khi không có icon không
 */
export function ProviderIcon({
  providerSlug,
  displayName,
  logoUrl,
  className = "",
  size = 20,
  withPlaceholder = false,
}: {
  providerSlug: string | null;
  displayName?: string | null;
  logoUrl?: string | null;
  className?: string;
  size?: number;
  withPlaceholder?: boolean;
}) {
  // Ưu tiên: logo_url từ database → hardcoded mapping → null
  const iconPath = logoUrl || getProviderIconPath(providerSlug);

  // Nếu không có icon (không có logo_url và không match hardcoded mapping)
  if (!iconPath) {
    if (!withPlaceholder) {
      return null;
    }

    // Placeholder: vòng tròn với chữ cái đầu của provider
    const letter =
      (displayName || providerSlug || "?").trim().charAt(0).toUpperCase() ||
      "?";

    return (
      <div
        className={`inline-flex items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {letter}
      </div>
    );
  }

  // Có icon (từ logo_url hoặc hardcoded mapping)
  return (
    <Image
      src={iconPath}
      alt={providerSlug || "Provider"}
      width={size}
      height={size}
      className={className}
      onError={(e) => {
        // Fallback nếu icon không tồn tại (logo_url lỗi hoặc hardcoded path không tồn tại)
        const target = e.target as HTMLImageElement;
        // Nếu đang dùng logo_url mà lỗi → fallback về hardcoded mapping
        if (logoUrl) {
          const fallbackPath = getProviderIconPath(providerSlug);
          if (fallbackPath) {
            target.src = fallbackPath;
            return;
          }
        }
        // Cuối cùng fallback về default icon
        target.src = PROVIDER_ICONS.default;
      }}
    />
  );
}
