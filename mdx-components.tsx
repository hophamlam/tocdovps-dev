import type { MDXComponents } from "mdx/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/docs/mdx-code-block";
import { T } from "@/components/docs/mdx-i18n-wrapper";

/**
 * MDX Components mapping
 * Cho phép sử dụng custom React components trong MDX files
 * Thay thế các HTML elements mặc định bằng shadcn UI components
 */
const components: MDXComponents = {
  // Wrapper để áp dụng prose và khoảng cách chuẩn cho toàn bộ nội dung MDX
  wrapper: ({ children }) => (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {children}
    </div>
  ),

  // Headings - Style giống shadcn/ui docs
  h1: (props) => (
    <h1
      className="scroll-m-20 text-4xl font-bold tracking-tight mt-12 mb-4 first:mt-0"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-12 mb-4"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-3"
      {...props}
    />
  ),

  // Paragraphs - Style giống shadcn/ui docs
  p: (props) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
  ),

  // Lists - Style giống shadcn/ui docs
  ul: (props) => (
    <ul
      className="my-6 ml-6 list-disc [&>li]:mt-2 text-sm text-muted-foreground"
      {...props}
    />
  ),
  ol: (props) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
  ),
  li: (props) => <li className="leading-7" {...props} />,

  // Code blocks - Style giống shadcn/ui docs
  code: (props) => {
    const { children, className } = props;
    const isInline = !className || !className.startsWith("language-");

    if (isInline) {
      return (
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {children}
        </code>
      );
    }

    // Block code - sẽ được xử lý bởi CodeBlock component
    return <CodeBlock {...props} />;
  },
  pre: (props) => {
    // Pre tag chứa code tag, nên chỉ cần return children
    // CodeBlock sẽ được render từ code tag
    return <>{props.children}</>;
  },

  // Links - Style giống shadcn/ui docs
  a: (props) => (
    <a
      className="font-medium text-primary underline underline-offset-4 hover:no-underline"
      {...props}
    />
  ),

  // Blockquote - Style giống shadcn/ui docs
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-2 border-border pl-6 italic [&>*]:text-muted-foreground"
      {...props}
    />
  ),

  // Tables - Style giống shadcn/ui docs
  table: (props) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  thead: (props) => <thead {...props} />,
  tbody: (props) => <tbody className="[&_tr:last-child]:border-0" {...props} />,
  tr: (props) => (
    <tr
      className="m-0 border-t border-border p-0 even:bg-muted/50"
      {...props}
    />
  ),
  th: (props) => (
    <th
      className="border border-border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="border border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),

  // Details/Summary for FAQ - Native HTML với styling
  details: (props) => (
    <details className="group border-b border-border py-4" {...props} />
  ),
  summary: (props) => (
    <summary
      className="cursor-pointer text-sm font-semibold text-foreground hover:text-primary transition-colors list-none [&::-webkit-details-marker]:hidden"
      {...props}
    />
  ),

  // Definition lists - Style cho parameters
  dl: (props) => (
    <dl className="space-y-6 border-b border-border pb-6" {...props} />
  ),
  dt: (props) => <dt className="mb-2 text-sm font-semibold" {...props} />,
  dd: (props) => (
    <dd className="mb-4 ml-4 text-sm text-muted-foreground" {...props} />
  ),

  // Custom components có thể dùng trong MDX
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  // Callout đơn giản dựa trên Alert
  Callout: ({
    title,
    children,
  }: {
    title?: React.ReactNode;
    children?: React.ReactNode;
  }) => (
    <Alert className="not-prose">
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  ),
  // i18n wrapper
  T,
};

/**
 * Export function để Next.js sử dụng
 */
export function useMDXComponents(): MDXComponents {
  return components;
}
