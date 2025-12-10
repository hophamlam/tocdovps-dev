"use client";

import React from "react";
import { DocsSidebar } from "./docs-sidebar";
import { useI18n } from "@/components/i18n/i18n-provider";

// Import MDX files
import QuickStart from "@/content/docs/quick-start.mdx";
import Usage from "@/content/docs/usage.mdx";
import Parameters from "@/content/docs/parameters.mdx";
import Technical from "@/content/docs/technical.mdx";
import Tests from "@/content/docs/tests.mdx";
import FAQ from "@/content/docs/faq.mdx";

/**
 * Component hiển thị documentation sử dụng MDX files
 * Alternative approach cho config-based system
 * 
 * @returns Section với các phần hướng dẫn từ MDX files
 */
export const DocsMDXSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <DocsSidebar />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="mx-auto max-w-3xl px-6 py-12 md:py-16 lg:px-8">
            {/* Header */}
            <div className="mb-12 space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                {t("docs.title")}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t("docs.description")}
              </p>
            </div>

            {/* Quick Start Section */}
            <div id="quick-start" className="mb-16 scroll-mt-20">
              <QuickStart />
            </div>

            {/* Usage Section */}
            <div id="usage" className="mb-16 scroll-mt-20">
              <Usage />
            </div>

            {/* Parameters Section */}
            <div id="parameters" className="mb-16 scroll-mt-20">
              <Parameters />
            </div>

            {/* Technical Section */}
            <div id="technical" className="mb-16 scroll-mt-20">
              <Technical />
            </div>

            {/* Tests Section */}
            <div id="tests" className="mb-16 scroll-mt-20">
              <Tests />
            </div>

            {/* FAQ Section */}
            <div id="faq" className="mb-16 scroll-mt-20">
              <FAQ />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

