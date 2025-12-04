import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

/**
 * Global loading state cho Next.js App Router
 * Hiển thị khi đang load page hoặc navigate
 * @returns Loading skeleton với header và footer
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <LoadingSkeleton />
        </div>
      </main>
      <Footer />
    </div>
  );
}

