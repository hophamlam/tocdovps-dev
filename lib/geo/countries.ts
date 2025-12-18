/**
 * Tiện ích xử lý country cho UI (không dùng i18n, tiếng Anh mặc định)
 * - Nhận countryCode (ISO-3166 alpha-2, ví dụ: "VN", "US")
 * - Trả về { name } nếu biết, hoặc fallback
 *
 * Note: Flag icons được hiển thị riêng bằng <CountryFlag /> component (FlagCDN)
 * Không dùng emoji trong text để tránh inconsistency và giữ UI clean
 *
 * Sử dụng `countries-ts` package để có full country coverage
 */

import { getByAlpha2, getByCountry } from "countries-ts";

type CountryMeta = {
  name: string;
};

/**
 * Normalize country code từ country name hoặc code
 * Chuyển country name (ví dụ: "Vietnam") → ISO code (ví dụ: "VN")
 * Sử dụng countries-ts package để có full coverage
 *
 * @param country - Country name hoặc code
 * @returns ISO country code (2 letters) hoặc null
 */
export function normalizeCountryCode(
  country: string | null | undefined
): string | null {
  if (!country) return null;

  const trimmed = country.trim();

  // Nếu đã là ISO code (2 letters, uppercase)
  if (trimmed.length === 2 && /^[A-Z]{2}$/i.test(trimmed)) {
    // Verify với countries-ts
    const found = getByAlpha2(trimmed.toUpperCase());
    return found?.code || trimmed.toUpperCase();
  }

  // Tìm country name → ISO code bằng countries-ts
  // getByCountry hỗ trợ fuzzy matching và case-insensitive
  const found = getByCountry(trimmed);
  if (found && found.code) {
    return found.code.toUpperCase();
  }

  // Fallback: thử với một số variations phổ biến
  const variations = [
    trimmed,
    trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase(),
    trimmed.toUpperCase(),
  ];

  for (const variation of variations) {
    const found = getByCountry(variation);
    if (found && found.code) {
      return found.code.toUpperCase();
    }
  }

  return null;
}

/**
 * Lấy metadata country (tên) từ countryCode
 * Sử dụng countries-ts package để có full coverage
 *
 * @param countryCode - ISO alpha-2 (ví dụ "VN")
 * @returns Meta hoặc null nếu không có
 */
export function getCountryMeta(
  countryCode: string | null | undefined
): CountryMeta | null {
  if (!countryCode) return null;

  const upper = countryCode.trim().toUpperCase();
  const country = getByAlpha2(upper);

  if (!country || !country.label) return null;

  return {
    name: country.label, // "United States of America", "Vietnam", etc.
  };
}

/**
 * Format location dạng "City, Country"
 * Flag icon được hiển thị riêng bằng <CountryFlag /> component
 *
 * @param city - city hoặc null
 * @param region - region/state hoặc null
 * @param countryCode - ISO-2 hoặc null
 * @returns Formatted location string (không có emoji)
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

  const countryLabel = meta.name;
  if (!place) return countryLabel;
  return `${place}, ${countryLabel}`;
}
