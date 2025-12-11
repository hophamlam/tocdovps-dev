"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/i18n-provider";
import type { DocMeta } from "@/lib/docs/docs-map";

type Props = {
  prev?: DocMeta;
  next?: DocMeta;
};

export const DocsPrevNext: React.FC<Props> = ({ prev, next }) => {
  const { t } = useI18n();
  return (
    <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
      <div>
        {prev ? (
          <Link
            href={`/docs/${prev.slug}`}
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            ← {t(prev.titleKey as never)}
          </Link>
        ) : (
          <span className="text-sm text-muted-foreground">&nbsp;</span>
        )}
      </div>
      <div className="text-right">
        {next ? (
          <Link
            href={`/docs/${next.slug}`}
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            {t(next.titleKey as never)} →
          </Link>
        ) : (
          <span className="text-sm text-muted-foreground">&nbsp;</span>
        )}
      </div>
    </div>
  );
};
