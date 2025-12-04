"use client";

import React from "react";
import { useI18n } from "@/components/i18n/i18n-provider";

/**
 * Banner section mô tả mục tiêu và cách benchmark sẽ hoạt động
 * theo phong cách SaaS (hai cột, card gọn gàng)
 * @returns Phần banner với các khối nội dung mô tả dự án
 */
export const BannerSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)] md:items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {t("banner.goal.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("banner.goal.item1")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("banner.goal.item2")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("banner.goal.item3")}
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-border/80 bg-background/80 p-5 shadow-sm backdrop-blur">
            <h3 className="text-base font-semibold tracking-tight">
              {t("banner.howItWorks.title")}
            </h3>
            <div className="space-y-3">
              <BannerStep
                step="01"
                title={t("banner.howItWorks.step1.title")}
                body={t("banner.howItWorks.step1.body")}
              />
              <BannerStep
                step="02"
                title={t("banner.howItWorks.step2.title")}
                body={t("banner.howItWorks.step2.body")}
              />
              <BannerStep
                step="03"
                title={t("banner.howItWorks.step3.title")}
                body={t("banner.howItWorks.step3.body")}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-dashed border-border/80 bg-background/80 p-5 text-sm shadow-sm backdrop-blur">
          <h3 className="text-base font-semibold tracking-tight">
            {t("banner.demo.title")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("banner.demo.note")}
          </p>
        </div>
      </div>
    </section>
  );
};

type BannerStepProps = {
  step: string;
  title: string;
  body: string;
};

/**
 * Component hiển thị 1 bước trong phần "Cách benchmark sẽ hoạt động"
 * @param step - số thứ tự bước (ví dụ "01")
 * @param title - tiêu đề bước
 * @param body - mô tả theo locale hiện tại
 * @returns Card nhỏ mô tả 1 bước
 */
const BannerStep: React.FC<BannerStepProps> = ({
  step,
  title,
  body,
}) => {
  return (
    <div className="flex gap-3 rounded-xl border border-border/70 bg-card/80 p-3 text-xs shadow-sm">
      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
        {step}
      </span>
      <div className="space-y-1">
        <h4 className="text-xs font-medium md:text-sm">{title}</h4>
        <p className="text-[11px] text-muted-foreground md:text-xs">
          {body}
        </p>
      </div>
    </div>
  );
};

