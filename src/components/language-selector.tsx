"use client";

import Link from "next/link";
import { useI18n, LANGUAGES, Language } from "@/lib/i18n";

export function LanguageSelector() {
  const { language, t } = useI18n();

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map((lang, index) => (
        <span key={lang} className="flex items-center">
          {index > 0 && <span className="text-muted-foreground/50 mx-1">|</span>}
          <Link
            href={`?lang=${lang}`}
            className={`px-1 py-0.5 transition-colors ${
              language === lang
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={t.languages[lang]}
            hrefLang={lang}
          >
            {lang.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
