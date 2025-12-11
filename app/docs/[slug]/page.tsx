import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DocsSidebarNav } from "@/components/docs/docs-sidebar-nav";
import { DocsToc } from "@/components/docs/docs-toc";
import { docs, getDocBySlug } from "@/lib/docs/docs-map";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";

type Props = {
  params: Promise<{ slug?: string }>;
};

export default async function DocPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug[0]
    : resolvedParams.slug ?? "quick-start";

  const { doc, prevMeta, nextMeta } = getDocBySlug(slug);
  if (!doc) return notFound();

  const Content = doc.Component;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto flex w-full max-w-[1400px] px-4 pb-16 pt-10">
        <DocsSidebarNav />
        <article
          id="doc-content"
          className="min-w-0 flex-1 px-0 md:px-4 lg:px-8 space-y-8"
        >
          <Content />
          <DocsPrevNext prev={prevMeta} next={nextMeta} />
        </article>
        <DocsToc />
      </main>
      <Footer />
    </div>
  );
}
