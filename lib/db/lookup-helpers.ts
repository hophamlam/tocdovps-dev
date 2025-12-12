/**
 * Helper functions để lookup hoặc tự động tạo records trong lookup tables
 * Khi insert benchmark_runs với OS/provider/virtualization/region mới
 */

import { db } from "@/lib/db";

/**
 * Tạo slug từ text (lowercase, replace spaces với dashes, remove special chars)
 * @param text - Text cần convert sang slug
 * @returns Slug string
 */
function slugify(text: string | null | undefined): string | null {
  if (!text) return null;
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces với dashes
    .replace(/-+/g, "-") // Replace multiple dashes với single dash
    .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
}

/**
 * Parse OS name và version từ osNameText
 * Ví dụ: "Ubuntu 24.04.3 LTS" -> { name: "Ubuntu", version: "24.04.3", family: "debian" }
 * @param osNameText - OS name text từ benchmark
 * @returns Object với name, version, family
 */
function parseOSInfo(osNameText: string | null | undefined): {
  name: string;
  version: string | null;
  family: string | null;
} {
  if (!osNameText) {
    return { name: "Unknown", version: null, family: null };
  }

  const text = osNameText.trim();

  // Detect OS family
  let family: string | null = null;
  const lowerText = text.toLowerCase();
  if (lowerText.includes("ubuntu") || lowerText.includes("debian")) {
    family = "debian";
  } else if (
    lowerText.includes("centos") ||
    lowerText.includes("rhel") ||
    lowerText.includes("red hat") ||
    lowerText.includes("fedora")
  ) {
    family = "redhat";
  } else if (lowerText.includes("arch")) {
    family = "arch";
  } else if (lowerText.includes("alpine")) {
    family = "alpine";
  } else if (lowerText.includes("freebsd") || lowerText.includes("openbsd")) {
    family = "bsd";
  }

  // Extract name và version
  // Pattern: "Ubuntu 24.04.3 LTS" -> name: "Ubuntu", version: "24.04.3"
  const parts = text.split(/\s+/);
  const name = parts[0] || "Unknown";
  const versionMatch = text.match(/(\d+\.\d+(?:\.\d+)?)/);
  const version = versionMatch ? versionMatch[1] : null;

  return { name, version, family };
}

/**
 * Lookup hoặc tạo OS record trong lookup table
 * @param osNameText - OS name text từ benchmark (ví dụ: "Ubuntu 24.04.3 LTS")
 * @returns OS ID (uuid) hoặc null nếu không tạo được
 */
export async function getOrCreateOS(
  osNameText: string | null | undefined
): Promise<string | null> {
  if (!osNameText) return null;

  const slug = slugify(osNameText);
  if (!slug) return null;

  try {
    // 1. Tìm OS bằng slug
    const existing = await db`
      SELECT id FROM oses WHERE slug = ${slug} LIMIT 1
    `;

    if (Array.isArray(existing) && existing.length > 0) {
      return existing[0].id;
    }

    // 2. Tìm OS bằng alias
    const aliasMatch = await db`
      SELECT os_id FROM os_aliases WHERE alias = ${osNameText} LIMIT 1
    `;

    if (Array.isArray(aliasMatch) && aliasMatch.length > 0) {
      return aliasMatch[0].os_id;
    }

    // 3. Tạo OS mới
    const { name, version, family } = parseOSInfo(osNameText);
    const [newOS] = await db`
      INSERT INTO oses (slug, name, version, family)
      VALUES (${slug}, ${name}, ${version}, ${family})
      RETURNING id
    `;

    if (!newOS || !newOS.id) return null;

    // 4. Tạo alias từ original text
    await db`
      INSERT INTO os_aliases (alias, os_id)
      VALUES (${osNameText}, ${newOS.id})
      ON CONFLICT (alias) DO NOTHING
    `;

    console.log(`[DB] Created new OS: ${name} ${version || ""} (${slug})`);
    return newOS.id;
  } catch (error) {
    console.error(`[DB] Error getting/creating OS "${osNameText}":`, error);
    return null;
  }
}

/**
 * Lookup hoặc tạo Provider record trong lookup table
 * @param providerText - Provider text từ benchmark (ví dụ: "Vultr" hoặc "The Constant Company, LLC")
 * @returns Provider ID (uuid) hoặc null nếu không tạo được
 */
export async function getOrCreateProvider(
  providerText: string | null | undefined
): Promise<string | null> {
  if (!providerText) return null;

  const slug = slugify(providerText);
  if (!slug) return null;

  try {
    // 1. Tìm Provider bằng slug
    const existing = await db`
      SELECT id FROM providers WHERE slug = ${slug} LIMIT 1
    `;

    if (Array.isArray(existing) && existing.length > 0) {
      return existing[0].id;
    }

    // 2. Tìm Provider bằng alias
    const aliasMatch = await db`
      SELECT provider_id FROM provider_aliases WHERE alias = ${providerText} LIMIT 1
    `;

    if (Array.isArray(aliasMatch) && aliasMatch.length > 0) {
      return aliasMatch[0].provider_id;
    }

    // 3. Tạo Provider mới
    const [newProvider] = await db`
      INSERT INTO providers (slug, display_name)
      VALUES (${slug}, ${providerText})
      RETURNING id
    `;

    if (!newProvider || !newProvider.id) return null;

    // 4. Tạo alias từ original text
    await db`
      INSERT INTO provider_aliases (alias, provider_id)
      VALUES (${providerText}, ${newProvider.id})
      ON CONFLICT (alias) DO NOTHING
    `;

    console.log(`[DB] Created new Provider: ${providerText} (${slug})`);
    return newProvider.id;
  } catch (error) {
    console.error(
      `[DB] Error getting/creating Provider "${providerText}":`,
      error
    );
    return null;
  }
}

/**
 * Lookup hoặc tạo Virtualization record trong lookup table
 * @param virtualizationText - Virtualization text từ benchmark (ví dụ: "KVM" hoặc "QEMU")
 * @returns Virtualization ID (uuid) hoặc null nếu không tạo được
 */
export async function getOrCreateVirtualization(
  virtualizationText: string | null | undefined
): Promise<string | null> {
  if (!virtualizationText) return null;

  const slug = slugify(virtualizationText);
  if (!slug) return null;

  try {
    // 1. Tìm Virtualization bằng slug
    const existing = await db`
      SELECT id FROM virtualizations WHERE slug = ${slug} LIMIT 1
    `;

    if (Array.isArray(existing) && existing.length > 0) {
      return existing[0].id;
    }

    // 2. Tạo Virtualization mới
    const [newVirt] = await db`
      INSERT INTO virtualizations (slug, display_name)
      VALUES (${slug}, ${virtualizationText})
      RETURNING id
    `;

    if (!newVirt || !newVirt.id) return null;

    console.log(
      `[DB] Created new Virtualization: ${virtualizationText} (${slug})`
    );
    return newVirt.id;
  } catch (error) {
    console.error(
      `[DB] Error getting/creating Virtualization "${virtualizationText}":`,
      error
    );
    return null;
  }
}

/**
 * Lookup hoặc tạo Region record trong lookup table
 * @param city - City name
 * @param region - Region/State name
 * @param country - Country name hoặc code
 * @param countryCode - ISO country code (optional)
 * @param latitude - Latitude (optional)
 * @param longitude - Longitude (optional)
 * @returns Region ID (uuid) hoặc null nếu không tạo được
 */
export async function getOrCreateRegion(
  city: string | null | undefined,
  region: string | null | undefined,
  country: string | null | undefined,
  countryCode?: string | null,
  latitude?: number | null,
  longitude?: number | null
): Promise<string | null> {
  if (!city && !region && !country) return null;

  // Tạo slug từ city-region-country
  const slugParts = [city, region, country].filter(Boolean);
  const slug = slugify(slugParts.join("-"));
  if (!slug) return null;

  try {
    // 1. Tìm Region bằng slug
    const existing = await db`
      SELECT id FROM regions WHERE slug = ${slug} LIMIT 1
    `;

    if (Array.isArray(existing) && existing.length > 0) {
      return existing[0].id;
    }

    // 2. Tạo Region mới
    const [newRegion] = await db`
      INSERT INTO regions (slug, city, region, country_code, latitude, longitude)
      VALUES (
        ${slug},
        ${city || null},
        ${region || null},
        ${countryCode || null},
        ${latitude || null},
        ${longitude || null}
      )
      RETURNING id
    `;

    if (!newRegion || !newRegion.id) return null;

    console.log(
      `[DB] Created new Region: ${slug} (${city}, ${region}, ${country})`
    );
    return newRegion.id;
  } catch (error) {
    console.error(`[DB] Error getting/creating Region "${slug}":`, error);
    return null;
  }
}
