"use client";

import React from "react";
import { useI18n } from "@/components/i18n/i18n-provider";

/**
 * Component wrapper để sử dụng i18n trong MDX files
 * @param translationKey - Key trong dictionary
 * @param children - Fallback text nếu không tìm thấy translation
 */
export const T: React.FC<{ translationKey: string; children?: React.ReactNode }> = ({
  translationKey,
  children,
}) => {
  const { t } = useI18n();
  
  try {
    const translated = t(translationKey as any);
    // Nếu translation trả về chính key (không tìm thấy), dùng children
    return <>{translated === translationKey ? children : translated}</>;
  } catch {
    // Nếu lỗi, dùng children hoặc key
    return <>{children || translationKey}</>;
  }
};

