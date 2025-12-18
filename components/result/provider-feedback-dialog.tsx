"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "../ui/badge";
import { useI18n } from "@/components/i18n/i18n-provider";

/**
 * Dialog góp ý / báo lỗi thông tin Provider
 * - Hiển thị form đơn giản để user gửi góp ý
 * - MVP: chỉ log client-side (có thể nối API sau)
 */
export function ProviderFeedbackDialog({
  benchmarkId,
  providerName,
  providerSlug,
}: {
  benchmarkId: string;
  providerName: string | null;
  providerSlug: string | null;
}) {
  const [type, setType] = React.useState<"add_new_provider" | "wrong_provider">(
    "wrong_provider"
  );
  const [brandName, setBrandName] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [iconType, setIconType] = React.useState<"url" | "upload">("url");
  const [iconUrl, setIconUrl] = React.useState("");
  const [iconFile, setIconFile] = React.useState<File | null>(null);
  const [message, setMessage] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isAnonymous, setIsAnonymous] = React.useState(true);

  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/feedback/provider", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          benchmarkId,
          providerName,
          providerSlug,
          type,
          brandName: brandName || null,
          website: website || null,
          iconType,
          iconUrl: iconType === "url" ? iconUrl || null : null,
          iconFileName: iconType === "upload" ? iconFile?.name || null : null,
          message: message || null,
          email: isAnonymous ? null : email || null,
          isAnonymous,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit feedback");
      }

      // Success → đóng dialog và reset form
      alert(t("feedback.providerDialog.success"));
      
      // Reset form
      setBrandName("");
      setWebsite("");
      setIconUrl("");
      setIconFile(null);
      setMessage("");
      setEmail("");
      setIsAnonymous(true);
      
      // Đóng dialog (cần access Dialog.Root state)
      // Tạm thời reload page để đóng dialog
      window.location.reload();
    } catch (error) {
      console.error("[Feedback] Error submitting:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : t("feedback.providerDialog.error.generic")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const providerLabel = providerName || providerSlug || "Unknown";

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-[11px] whitespace-nowrap"
        >
          {t("feedback.providerDialog.trigger")}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/80 bg-background p-5 shadow-xl focus:outline-none">
          <Dialog.Title className="text-sm font-semibold mb-1">
            {t("feedback.providerDialog.title")}
          </Dialog.Title>
          <Dialog.Description className="mb-2 text-xs text-muted-foreground">
            {t("feedback.providerDialog.benchmarkId")}:{" "}
            <span className="font-mono">{benchmarkId}</span>
          </Dialog.Description>
          <div className="mb-4 text-xs text-muted-foreground">
            {t("feedback.providerDialog.currentProvider")}:{" "}
            <Badge variant="outline">{providerLabel}</Badge>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <label className="block font-medium">
                {t("feedback.providerDialog.type.label")}
              </label>
              <RadioGroup
                value={type}
                onValueChange={(v) =>
                  setType(v as "add_new_provider" | "wrong_provider")
                }
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="wrong_provider" id="wrong_provider" />
                  <label
                    htmlFor="wrong_provider"
                    className="text-xs font-normal cursor-pointer"
                  >
                    {t("feedback.providerDialog.type.wrongProvider")}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="add_new_provider"
                    id="add_new_provider"
                  />
                  <label
                    htmlFor="add_new_provider"
                    className="text-xs font-normal cursor-pointer"
                  >
                    {t("feedback.providerDialog.type.missingInfo")}
                  </label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-1.5">
              <label className="block font-medium">
                {t("feedback.providerDialog.brandName")}
              </label>
              <input
                type="text"
                value={brandName || ""}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder={t("feedback.providerDialog.brandName.placeholder")}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-medium">
                {t("feedback.providerDialog.website")}
              </label>
              <input
                type="url"
                value={website || ""}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder={t("feedback.providerDialog.website.placeholder")}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-medium">
                {t("feedback.providerDialog.icon")}
              </label>
              <RadioGroup
                value={iconType}
                onValueChange={(v) => setIconType(v as "url" | "upload")}
                className="flex gap-4 mb-2"
              >
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="url" id="icon_url" />
                  <label
                    htmlFor="icon_url"
                    className="text-[11px] font-normal cursor-pointer"
                  >
                    {t("feedback.providerDialog.icon.url")}
                  </label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="upload" id="icon_upload" />
                  <label
                    htmlFor="icon_upload"
                    className="text-[11px] font-normal cursor-pointer"
                  >
                    {t("feedback.providerDialog.icon.upload")}
                  </label>
                </div>
              </RadioGroup>
              {iconType === "url" ? (
                <input
                  key="icon-url-input"
                  type="url"
                  value={iconUrl}
                  onChange={(e) => setIconUrl(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="https://example.com/logo.svg"
                />
              ) : (
                <input
                  key="icon-file-input"
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg"
                  onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs file:mr-2 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block font-medium">
                {t("feedback.providerDialog.description")}
              </label>
              <textarea
                value={message || ""}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder={t(
                  "feedback.providerDialog.description.placeholder"
                )}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-medium">
                {t("feedback.providerDialog.email")}
              </label>
              <input
                type="email"
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isAnonymous}
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                placeholder={t("feedback.providerDialog.email.placeholder")}
              />
              <label className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-3 w-3"
                />
                <span>{t("feedback.providerDialog.anonymous")}</span>
              </label>
            </div>

            {submitError && (
              <div className="mt-2 rounded-md bg-destructive/10 border border-destructive/20 px-2 py-1.5 text-[11px] text-destructive">
                {submitError}
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-2 text-xs">
              <Dialog.Close asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isSubmitting}
                >
                  {t("feedback.providerDialog.close")}
                </Button>
              </Dialog.Close>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting
                  ? t("feedback.providerDialog.submitting")
                  : t("feedback.providerDialog.submit")}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
