import React from "react";
import QuickStart from "@/content/docs/quick-start.mdx";
import Usage from "@/content/docs/usage.mdx";
import Parameters from "@/content/docs/parameters.mdx";
import Tests from "@/content/docs/tests.mdx";
import Technical from "@/content/docs/technical.mdx";
import FAQ from "@/content/docs/faq.mdx";

export type DocEntry = {
  slug: string;
  titleKey: string;
  Component: React.ComponentType;
};

export type DocMeta = Pick<DocEntry, "slug" | "titleKey">;

export const docs: DocEntry[] = [
  {
    slug: "quick-start",
    titleKey: "docs.quickStart.title",
    Component: QuickStart,
  },
  { slug: "usage", titleKey: "docs.usage.title", Component: Usage },
  {
    slug: "parameters",
    titleKey: "docs.parameters.title",
    Component: Parameters,
  },
  { slug: "tests", titleKey: "docs.tests.title", Component: Tests },
  { slug: "technical", titleKey: "docs.technical.title", Component: Technical },
  { slug: "faq", titleKey: "docs.faq.title", Component: FAQ },
];

export function getDocBySlug(slug: string) {
  const index = docs.findIndex((d) => d.slug === slug);
  if (index === -1)
    return {
      doc: undefined,
      prevMeta: undefined,
      nextMeta: undefined,
    };
  const doc = docs[index];
  const prevMeta =
    index > 0
      ? ({
          slug: docs[index - 1].slug,
          titleKey: docs[index - 1].titleKey,
        } satisfies DocMeta)
      : undefined;
  const nextMeta =
    index < docs.length - 1
      ? ({
          slug: docs[index + 1].slug,
          titleKey: docs[index + 1].titleKey,
        } satisfies DocMeta)
      : undefined;
  return { doc, prevMeta, nextMeta };
}
