import type { NextConfig } from "next";
import createMDX from "@next/mdx";

/**
 * Cấu hình Next.js với MDX support
 * Cho phép sử dụng .mdx và .md files như pages hoặc imports
 *
 * Note: Sử dụng string names cho plugins để tương thích với Turbopack
 * Turbopack không thể serialize JavaScript functions, nên phải dùng string names
 */
const nextConfig: NextConfig = {
  // Configure pageExtensions để include markdown và MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // Image optimization config cho external images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "cdn.tocdovps.dev",
      },
    ],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here
  // Sử dụng string names thay vì import để tương thích với Turbopack
  options: {
    remarkPlugins: [
      // GitHub Flavored Markdown support
      "remark-gfm",
    ],
    rehypePlugins: [],
  },
});

// Merge MDX config với Next.js config
export default withMDX(nextConfig);
