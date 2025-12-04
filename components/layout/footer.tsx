"use client";

import React from "react";
import { useI18n } from "@/components/i18n/i18n-provider";

/**
 * Footer đơn giản hiển thị ghi chú về dự án
 * @returns Footer ở cuối trang
 */
export const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 text-xs text-muted-foreground">
        <span className="font-medium">{t("header.brand")}</span>
        <span>{t("footer.note")}</span>
      </div>
    </footer>
  );
};
