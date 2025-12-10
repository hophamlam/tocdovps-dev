"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import {
  Terminal,
  Code,
  Settings,
  HelpCircle,
  BookOpen,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/**
 * Sidebar navigation cho docs page
 * Style giống shadcn/ui docs với active state và better UX
 * @returns Sidebar với các sections và navigation links
 */
export const DocsSidebar: React.FC = () => {
  const { t } = useI18n();
  const [activeSection, setActiveSection] = useState<string>("quick-start");

  const sections = [
    {
      id: "quick-start",
      title: t("docs.sidebar.quickStart"),
      icon: Terminal,
    },
    {
      id: "usage",
      title: t("docs.sidebar.usage"),
      icon: Code,
    },
    {
      id: "parameters",
      title: t("docs.sidebar.parameters"),
      icon: Settings,
    },
    {
      id: "technical",
      title: t("docs.sidebar.technical"),
      icon: BookOpen,
    },
    {
      id: "tests",
      title: t("docs.sidebar.tests"),
      icon: Cpu,
    },
    {
      id: "faq",
      title: t("docs.sidebar.faq"),
      icon: HelpCircle,
    },
  ];

  /**
   * Detect active section khi scroll
   */
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(
        "[id^='quick-start'], [id^='usage'], [id^='parameters'], [id^='technical'], [id^='tests'], [id^='faq']"
      );
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i] as HTMLElement;
        if (section.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setActiveSection(id);
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-64 flex-shrink-0 border-r border-border lg:block">
      <ScrollArea className="h-full">
        <nav className="p-4 space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
            const isActive = activeSection === section.id;

              return (
                <Button
                  key={section.id}
                  variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-sm font-normal transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
                  onClick={() => scrollToSection(section.id)}
                >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{section.title}</span>
                </Button>
              );
            })}
        </nav>
      </ScrollArea>
    </aside>
  );
};
