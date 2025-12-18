"use client";

import Image from "next/image";

/**
 * Country Flag Component - Dùng FlagCDN (flagcdn.com)
 *
 * Recommendation: Dùng FlagCDN vì:
 * - Free & reliable (Cloudflare hosting, trust score 100/100)
 * - Next.js Image component tự động optimize (WebP, lazy load, responsive)
 * - Professional look, consistent trên mọi platform
 * - CDN cached → fast loading
 *
 * @param countryCode - ISO country code (ví dụ: "VN", "US", "SG")
 * @param className - Custom className
 * @param size - Size của flag (default: "sm" = 20px)
 */
export function CountryFlag({
  countryCode,
  className = "",
  size = "sm",
}: {
  countryCode: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  if (!countryCode) return null;

  // FlagCDN sizes: w20, w40, w80, w160, w320
  // Dùng size lớn hơn một chút để Next.js optimize tốt hơn
  const sizeMap = {
    sm: { width: 20, height: 15, cdnSize: "w20" },
    md: { width: 32, height: 24, cdnSize: "w40" },
    lg: { width: 64, height: 48, cdnSize: "w80" },
  };

  const { width, height, cdnSize } = sizeMap[size];
  const flagUrl = `https://flagcdn.com/${cdnSize}/${countryCode.toLowerCase()}.png`;

  return (
    <Image
      src={flagUrl}
      alt={`Flag of ${countryCode}`}
      width={width}
      height={height}
      className={`inline-block ${className}`}
      unoptimized={false} // Next.js sẽ tự động optimize (WebP, lazy load)
      loading="lazy"
      title={countryCode}
    />
  );
}
