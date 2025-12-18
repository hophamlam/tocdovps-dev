import React from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ResultDetailSection } from "@/components/result/result-detail-section";
import { BenchmarkRepository } from "@/lib/repositories/benchmark.repository";

/**
 * Trang chi tiết một benchmark result
 * @param params - dynamic route params (id)
 * @returns Trang chi tiết benchmark với performance metrics và metadata
 */
export default async function ResultDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Lấy benchmark detail từ repository
  const result = await BenchmarkRepository.getBenchmarkById(id);

  if (!result) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <ResultDetailSection result={result} />
      </main>
      <Footer />
    </div>
  );
}
