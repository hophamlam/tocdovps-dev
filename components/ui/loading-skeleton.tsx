import React from "react";

/**
 * Component skeleton loader để hiển thị khi đang load data
 * @returns Skeleton UI với các placeholder boxes
 */
export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-lg bg-muted" />
        <div className="h-4 w-96 rounded-lg bg-muted" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl border border-border/80 bg-card/90 p-6">
        <div className="space-y-4">
          {/* Header row */}
          <div className="grid grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-4 rounded bg-muted" />
            ))}
          </div>

          {/* Data rows */}
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="grid grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((col) => (
                <div
                  key={col}
                  className="h-4 rounded bg-muted/60"
                  style={{
                    animationDelay: `${row * 50}ms`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

