"use client";

import { SitemapGenerator } from "@/components/sitemap/sitemap-generator";
import { LanguageSelector } from "@/components/language-selector";
import { FAQ } from "@/components/faq";
import { useI18n } from "@/lib/i18n";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen p-2">
      <header className="flex items-center justify-between border-b border-border pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-primary">$</span>
          <span className="text-foreground">{t.appName}</span>
          <span className="text-muted-foreground">{t.appVersion}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">{t.appTagline}</span>
          <LanguageSelector />
        </div>
      </header>
      <main>
        <SitemapGenerator />
        <FAQ />
      </main>
    </div>
  );
}
