/**
 * Resolve base URL theo môi trường.
 * Ưu tiên BASE_URL (set trong Vercel env), fallback VERCEL_URL, cuối cùng là window.location.origin.
 * Dùng được cả server lẫn client.
 */
export function getBaseUrl(): string {
  const envBase = process.env.BASE_URL;
  if (envBase && envBase.trim()) {
    return envBase.replace(/\/+$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl && vercelUrl.trim()) {
    const normalized = vercelUrl.startsWith("http")
      ? vercelUrl
      : `https://${vercelUrl}`;
    return normalized.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}
