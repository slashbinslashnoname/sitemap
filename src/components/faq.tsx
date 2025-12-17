"use client";

import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export function FAQ() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border border-border bg-card mt-4">
      <div className="border-b border-border px-2 py-1 bg-muted/30">
        <span className="text-muted-foreground">{t.faqTitle}</span>
      </div>
      <div className="divide-y divide-border/50">
        {t.faq.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-muted/30 transition-colors"
            >
              {openIndex === index ? (
                <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              )}
              <span className="text-foreground">{item.question}</span>
            </button>
            {openIndex === index && (
              <div className="px-2 pb-2 pl-7 text-muted-foreground">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
