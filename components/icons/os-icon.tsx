"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * OS Icon Component
 * Hiển thị icon cho Linux distributions
 *
 * Icons được hardcode vì chỉ có ~10 distros phổ biến
 * Có thể move vào database sau nếu cần scale
 */

const OS_ICONS: Record<string, string> = {
  // Debian family
  ubuntu: "/os/linux/ubuntu.svg",
  debian: "/os/linux/debian-svgrepo-com.svg",

  // RedHat / RHEL family
  centos: "/os/linux/centos-svgrepo-com.svg",
  fedora: "/os/linux/fedora.svg",
  rhel: "/os/linux/rockylinux.svg",
  "red hat": "/os/linux/rockylinux.svg",
  alma: "/os/linux/almalinux.svg",
  rocky: "/os/linux/rockylinux.svg",

  // Arch family
  arch: "/os/linux/arch-linux-svgrepo-com.svg",

  // Alpine
  alpine: "/os/linux/alpinelinux.svg",

  // BSD
  freebsd: "/os/linux/freebsd.svg",
  openbsd: "/os/linux/openbsd.svg",

  // Non-Linux (hiếm nhưng vẫn support cho tương lai)
  macos: "/os/macos/macos.svg",
  darwin: "/os/macos/macos.svg",
  windows: "/os/windows/windows-svgrepo-com.svg",
};

/**
 * Get OS icon path từ OS name hoặc family
 * @param osName - OS name (ví dụ: "Ubuntu")
 * @param osFamily - OS family (ví dụ: "debian")
 * @returns Icon path hoặc null nếu không match
 */
function getOSIconPath(
  osName: string | null,
  osFamily: string | null
): string | null {
  // 1. Ưu tiên distro cụ thể (osName) trước
  if (osName) {
    const nameKey = osName.toLowerCase().split(" ")[0]; // Lấy từ đầu tiên (Ubuntu, Debian, CentOS...)
    if (OS_ICONS[nameKey]) {
      return OS_ICONS[nameKey];
    }
  }

  // 2. Fallback về family nếu có
  if (osFamily) {
    const familyKey = osFamily.toLowerCase();
    if (OS_ICONS[familyKey]) {
      return OS_ICONS[familyKey];
    }
  }

  // 3. Không biết OS → không hiển thị icon (tránh gây hiểu nhầm)
  return null;
}

/**
 * OS Icon Component
 * @param osName - OS name từ database
 * @param osFamily - OS family từ database
 * @param className - Custom className
 * @param size - Icon size (default: 20x20)
 */
export function OSIcon({
  osName,
  osFamily,
  className = "",
  size = 20,
}: {
  osName: string | null;
  osFamily: string | null;
  className?: string;
  size?: number;
}) {
  const iconPath = getOSIconPath(osName, osFamily);

  // Nếu không có icon match → không render gì (tránh icon sai)
  if (!iconPath) {
    return null;
  }

  return (
    <Image
      src={iconPath}
      alt={osName || "OS"}
      width={size}
      height={size}
      className={cn(
        "object-contain",
        // Adapt màu cho dark mode: invert icon đen thành trắng
        "dark:brightness-0 dark:invert dark:contrast-200",
        className
      )}
      onError={(e) => {
        // Fallback nếu icon không tồn tại
        const target = e.target as HTMLImageElement;
        target.src = OS_ICONS.default;
      }}
    />
  );
}
