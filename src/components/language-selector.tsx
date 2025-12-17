"use client";

import { useI18n, Language } from "@/lib/i18n";

const languages: Language[] = ["en", "de", "es", "fr", "hi"];

export function LanguageSelector() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang, index) => (
        <span key={lang} className="flex items-center">
          {index > 0 && <span className="text-muted-foreground/50 mx-1">|</span>}
          <button
            onClick={() => setLanguage(lang)}
            className={`px-1 py-0.5 transition-colors ${
              language === lang
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={t.languages[lang]}
          >
            {lang.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
