import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DocsMDXSection } from "@/components/docs/docs-mdx-section";

/**
 * Trang documentation về script benchmark
 * Sử dụng MDX files để render content
 * @returns Trang docs với hướng dẫn chi tiết về cách sử dụng script
 */
export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <DocsMDXSection />
      </main>
      <Footer />
    </div>
  );
}

