"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Component hiển thị code block với copy button
 * Style giống shadcn/ui docs
 * MDX sẽ render code blocks như: <pre><code className="language-xxx">content</code></pre>
 */
interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  className,
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const [codeText, setCodeText] = useState("");

  // Extract language từ className (ví dụ: "language-bash" -> "bash")
  const language = className?.replace("language-", "") || "text";

  // Extract code text từ children
  useEffect(() => {
    if (typeof children === "string") {
      setCodeText(children);
    } else {
      const extractText = (node: React.ReactNode): string => {
        if (typeof node === "string") return node;
        if (typeof node === "number") return String(node);
        if (Array.isArray(node)) {
          return node.map(extractText).join("");
        }
        if (React.isValidElement(node)) {
          const props = node.props as { children?: React.ReactNode };
          if (props.children) {
            return extractText(props.children);
          }
        }
        return "";
      };
      setCodeText(extractText(children).trim());
    }
  }, [children]);

  const handleCopy = async () => {
    if (!codeText) return;
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="relative my-4 group">
      <div className="relative overflow-hidden rounded-lg border border-code-border bg-code-background">
        {/* Language label và copy button */}
        <div className="flex items-center justify-between border-b border-code-border/50 bg-code-header-bg px-4 py-2">
          {language && language !== "text" && (
            <span className="text-xs font-mono text-muted-foreground uppercase">
              {language}
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7 text-muted-foreground hover:text-foreground transition-colors",
              copied && "text-primary"
            )}
            onClick={handleCopy}
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Code content */}
        <div className="overflow-x-auto">
          <pre className="p-4 text-sm">
            <code className="font-mono text-code-foreground leading-relaxed">
              {codeText || children}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
