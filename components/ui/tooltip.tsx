"use client";

import { useState } from "react";

/**
 * Tooltip component hiển thị thông tin khi hover
 *
 * @param content - Nội dung tooltip (có thể là string hoặc ReactNode)
 * @param children - Element để attach tooltip
 * @param position - Vị trí tooltip: 'top', 'bottom', 'left', 'right'
 * @param className - Custom className cho tooltip wrapper
 */
export function Tooltip({
  content,
  children,
  position = "top",
  className = "",
}: {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}) {
  const [show, setShow] = useState(false);

  // Position classes
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  // Arrow classes
  const arrowClasses = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900",
    bottom:
      "bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900",
    left: "left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900",
    right:
      "right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900",
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]}`}
        >
          {content}
          <div className={`absolute ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
}
