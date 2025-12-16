/**
 * Tiện ích xử lý country cho UI (không dùng i18n, tiếng Anh mặc định)
 * - Nhận countryCode (ISO-3166 alpha-2, ví dụ: "VN", "US")
 * - Trả về { name, emoji } nếu biết, hoặc fallback
 */

type CountryMeta = {
  name: string;
  emoji: string;
};

// Một số country phổ biến cho VPS + fallback
const COUNTRY_NAMES: Record<string, string> = {
  VN: "Vietnam",
  US: "United States",
  SG: "Singapore",
  JP: "Japan",
  HK: "Hong Kong",
  KR: "South Korea",
  DE: "Germany",
  FR: "France",
  GB: "United Kingdom",
  NL: "Netherlands",
  AU: "Australia",
  BR: "Brazil",
  IN: "India",
};

/**
 * Chuyển mã country ISO-2 (A–Z) thành emoji cờ 🇻🇳
 * @param code - Mã country ISO-2 (ví dụ: "VN")
 * @returns Emoji flag hoặc chuỗi rỗng nếu không hợp lệ
 */
export function countryCodeToFlagEmoji(
  code: string | null | undefined
): string {
  if (!code) return "";
  const upper = code.trim().toUpperCase();
  if (upper.length !== 2 || !/^[A-Z]{2}$/.test(upper)) return "";

  const base = 0x1f1e6;
  const first = upper.codePointAt(0);
  const second = upper.codePointAt(1);
  if (first == null || second == null) return "";

  return String.fromCodePoint(base + (first - 0x41), base + (second - 0x41));
}

/**
 * Lấy metadata country (tên + emoji) từ countryCode
 * @param countryCode - ISO alpha-2 (ví dụ "VN")
 * @returns Meta hoặc null nếu không có
 */
export function getCountryMeta(
  countryCode: string | null | undefined
): CountryMeta | null {
  if (!countryCode) return null;
  const upper = countryCode.trim().toUpperCase();
  const name = COUNTRY_NAMES[upper];
  const emoji = countryCodeToFlagEmoji(upper);

  if (!name && !emoji) return null;

  return {
    name: name ?? upper,
    emoji,
  };
}

/**
 * Format location dạng "City, Country 🇻🇳"
 * @param city - city hoặc null
 * @param region - region/state hoặc null
 * @param countryCode - ISO-2 hoặc null
 */
export function formatCityCountry(
  city: string | null | undefined,
  region: string | null | undefined,
  countryCode: string | null | undefined
): string {
  const place = city ?? region ?? "";
  const meta = getCountryMeta(countryCode);

  if (!place && !meta) return "";
  if (!meta) return place || ""; // không biết country → chỉ hiện place

  const countryLabel = meta.emoji ? `${meta.name} ${meta.emoji}` : meta.name;
  if (!place) return countryLabel;
  return `${place}, ${countryLabel}`;
}
