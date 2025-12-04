import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NotFoundSection } from "@/components/error/not-found-section";

/**
 * Custom 404 page khi route không tồn tại
 * @returns Trang 404 với message và link quay lại
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <NotFoundSection />
      </main>
      <Footer />
    </div>
  );
}

