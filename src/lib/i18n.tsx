"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "de" | "es" | "fr" | "hi";

export interface Translations {
  // App
  appName: string;
  appVersion: string;
  appTagline: string;
  appDescription: string;

  // Generator
  urlLabel: string;
  urlPlaceholder: string;
  depthLabel: string;
  depthPlaceholder: string;
  generateButton: string;
  stopButton: string;

  // Status
  crawlingLabel: string;
  foundLabel: string;
  queuedLabel: string;
  timeLabel: string;
  domainLabel: string;
  pagesLabel: string;
  depthStatLabel: string;
  startingCrawl: string;

  // Errors
  urlRequired: string;
  invalidUrl: string;
  errorLabel: string;
  noPagesFound: string;

  // Tabs
  treeTab: string;
  listTab: string;
  xmlTab: string;

  // Export
  exportLabel: string;
  copyButton: string;
  copiedButton: string;
  exportedMessage: string;
  copiedMessage: string;

  // Table headers
  headerNumber: string;
  headerUrl: string;
  headerStatus: string;
  headerDepth: string;
  headerPriority: string;
  headerFrequency: string;

  // Toast messages
  pagesFoundMessage: string;
  stoppedMessage: string;

  // FAQ
  faqTitle: string;
  faq: {
    question: string;
    answer: string;
  }[];

  // Language names
  languages: {
    en: string;
    de: string;
    es: string;
    fr: string;
    hi: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    appName: "sitemap-gen",
    appVersion: "v1.0.2",
    appTagline: "xml sitemap generator",
    appDescription: "Generate XML sitemaps for any website",

    urlLabel: "url:",
    urlPlaceholder: "example.com",
    depthLabel: "depth:",
    depthPlaceholder: "∞",
    generateButton: "generate",
    stopButton: "stop",

    crawlingLabel: "crawling:",
    foundLabel: "found:",
    queuedLabel: "queued:",
    timeLabel: "time:",
    domainLabel: "domain:",
    pagesLabel: "pages:",
    depthStatLabel: "depth:",
    startingCrawl: "Starting crawl...",

    urlRequired: "URL required",
    invalidUrl: "Invalid URL",
    errorLabel: "error:",
    noPagesFound: "No pages found - site may block crawlers",

    treeTab: "tree",
    listTab: "list",
    xmlTab: "xml",

    exportLabel: "export:",
    copyButton: "copy",
    copiedButton: "copied!",
    exportedMessage: "exported",
    copiedMessage: "copied",

    headerNumber: "#",
    headerUrl: "url",
    headerStatus: "st",
    headerDepth: "d",
    headerPriority: "pri",
    headerFrequency: "freq",

    pagesFoundMessage: "pages in",
    stoppedMessage: "Stopped - pages crawled",

    faqTitle: "FAQ",
    faq: [
      {
        question: "What is a sitemap?",
        answer: "A sitemap is an XML file that lists all important pages of a website, helping search engines like Google discover and index your content more efficiently."
      },
      {
        question: "How does this tool work?",
        answer: "Enter your website URL and click 'generate'. The tool crawls your site, discovers all accessible pages, and creates a standard XML sitemap ready for submission to search engines."
      },
      {
        question: "What is the depth parameter?",
        answer: "Depth controls how many link levels deep the crawler will go. Depth 1 = homepage only, depth 2 = homepage + directly linked pages, etc. Leave empty for unlimited depth."
      },
      {
        question: "Which export formats are supported?",
        answer: "XML (standard sitemap format), TXT (plain URL list), JSON (structured data), and CSV (spreadsheet compatible). XML is recommended for search engine submission."
      },
      {
        question: "Why are some pages not found?",
        answer: "The crawler only follows HTML links. Pages behind login walls, loaded via JavaScript, or blocked by robots.txt won't be discovered. Also, orphaned pages with no incoming links cannot be found."
      },
      {
        question: "Is there a page limit?",
        answer: "No hard limit, but very large sites (10,000+ pages) may take longer to crawl. You can stop the crawl anytime and export partial results."
      }
    ],

    languages: {
      en: "English",
      de: "Deutsch",
      es: "Español",
      fr: "Français",
      hi: "हिन्दी"
    }
  },

  de: {
    appName: "sitemap-gen",
    appVersion: "v1.0.2",
    appTagline: "XML-Sitemap-Generator",
    appDescription: "XML-Sitemaps für jede Website erstellen",

    urlLabel: "url:",
    urlPlaceholder: "beispiel.de",
    depthLabel: "tiefe:",
    depthPlaceholder: "∞",
    generateButton: "erstellen",
    stopButton: "stopp",

    crawlingLabel: "durchsuche:",
    foundLabel: "gefunden:",
    queuedLabel: "wartend:",
    timeLabel: "zeit:",
    domainLabel: "domain:",
    pagesLabel: "seiten:",
    depthStatLabel: "tiefe:",
    startingCrawl: "Starte Durchsuchung...",

    urlRequired: "URL erforderlich",
    invalidUrl: "Ungültige URL",
    errorLabel: "fehler:",
    noPagesFound: "Keine Seiten gefunden - Website blockiert möglicherweise Crawler",

    treeTab: "baum",
    listTab: "liste",
    xmlTab: "xml",

    exportLabel: "export:",
    copyButton: "kopieren",
    copiedButton: "kopiert!",
    exportedMessage: "exportiert",
    copiedMessage: "kopiert",

    headerNumber: "#",
    headerUrl: "url",
    headerStatus: "st",
    headerDepth: "t",
    headerPriority: "pri",
    headerFrequency: "freq",

    pagesFoundMessage: "Seiten in",
    stoppedMessage: "Gestoppt - Seiten durchsucht",

    faqTitle: "FAQ",
    faq: [
      {
        question: "Was ist eine Sitemap?",
        answer: "Eine Sitemap ist eine XML-Datei, die alle wichtigen Seiten einer Website auflistet und Suchmaschinen wie Google hilft, Ihre Inhalte effizienter zu entdecken und zu indexieren."
      },
      {
        question: "Wie funktioniert dieses Tool?",
        answer: "Geben Sie Ihre Website-URL ein und klicken Sie auf 'erstellen'. Das Tool durchsucht Ihre Website, findet alle erreichbaren Seiten und erstellt eine Standard-XML-Sitemap zur Einreichung bei Suchmaschinen."
      },
      {
        question: "Was bedeutet der Tiefe-Parameter?",
        answer: "Die Tiefe steuert, wie viele Link-Ebenen der Crawler durchsucht. Tiefe 1 = nur Homepage, Tiefe 2 = Homepage + direkt verlinkte Seiten, usw. Leer lassen für unbegrenzte Tiefe."
      },
      {
        question: "Welche Exportformate werden unterstützt?",
        answer: "XML (Standard-Sitemap-Format), TXT (einfache URL-Liste), JSON (strukturierte Daten) und CSV (tabellenkompatibel). XML wird für die Einreichung bei Suchmaschinen empfohlen."
      },
      {
        question: "Warum werden einige Seiten nicht gefunden?",
        answer: "Der Crawler folgt nur HTML-Links. Seiten hinter Login-Bereichen, per JavaScript geladene oder durch robots.txt blockierte Seiten werden nicht entdeckt. Auch verwaiste Seiten ohne eingehende Links können nicht gefunden werden."
      },
      {
        question: "Gibt es ein Seitenlimit?",
        answer: "Kein festes Limit, aber sehr große Websites (10.000+ Seiten) benötigen möglicherweise mehr Zeit. Sie können den Crawl jederzeit stoppen und Teilergebnisse exportieren."
      }
    ],

    languages: {
      en: "English",
      de: "Deutsch",
      es: "Español",
      fr: "Français",
      hi: "हिन्दी"
    }
  },

  es: {
    appName: "sitemap-gen",
    appVersion: "v1.0.2",
    appTagline: "generador de sitemap XML",
    appDescription: "Genera sitemaps XML para cualquier sitio web",

    urlLabel: "url:",
    urlPlaceholder: "ejemplo.com",
    depthLabel: "profundidad:",
    depthPlaceholder: "∞",
    generateButton: "generar",
    stopButton: "parar",

    crawlingLabel: "rastreando:",
    foundLabel: "encontradas:",
    queuedLabel: "en cola:",
    timeLabel: "tiempo:",
    domainLabel: "dominio:",
    pagesLabel: "páginas:",
    depthStatLabel: "profundidad:",
    startingCrawl: "Iniciando rastreo...",

    urlRequired: "URL requerida",
    invalidUrl: "URL inválida",
    errorLabel: "error:",
    noPagesFound: "No se encontraron páginas - el sitio puede bloquear rastreadores",

    treeTab: "árbol",
    listTab: "lista",
    xmlTab: "xml",

    exportLabel: "exportar:",
    copyButton: "copiar",
    copiedButton: "¡copiado!",
    exportedMessage: "exportado",
    copiedMessage: "copiado",

    headerNumber: "#",
    headerUrl: "url",
    headerStatus: "st",
    headerDepth: "p",
    headerPriority: "pri",
    headerFrequency: "freq",

    pagesFoundMessage: "páginas en",
    stoppedMessage: "Detenido - páginas rastreadas",

    faqTitle: "Preguntas Frecuentes",
    faq: [
      {
        question: "¿Qué es un sitemap?",
        answer: "Un sitemap es un archivo XML que lista todas las páginas importantes de un sitio web, ayudando a los motores de búsqueda como Google a descubrir e indexar tu contenido de manera más eficiente."
      },
      {
        question: "¿Cómo funciona esta herramienta?",
        answer: "Ingresa la URL de tu sitio web y haz clic en 'generar'. La herramienta rastrea tu sitio, descubre todas las páginas accesibles y crea un sitemap XML estándar listo para enviar a los motores de búsqueda."
      },
      {
        question: "¿Qué es el parámetro de profundidad?",
        answer: "La profundidad controla cuántos niveles de enlaces el rastreador explorará. Profundidad 1 = solo página principal, profundidad 2 = página principal + páginas enlazadas directamente, etc. Deja vacío para profundidad ilimitada."
      },
      {
        question: "¿Qué formatos de exportación se soportan?",
        answer: "XML (formato estándar de sitemap), TXT (lista simple de URLs), JSON (datos estructurados) y CSV (compatible con hojas de cálculo). Se recomienda XML para enviar a motores de búsqueda."
      },
      {
        question: "¿Por qué no se encuentran algunas páginas?",
        answer: "El rastreador solo sigue enlaces HTML. Las páginas detrás de inicio de sesión, cargadas via JavaScript o bloqueadas por robots.txt no serán descubiertas. Además, las páginas huérfanas sin enlaces entrantes no pueden ser encontradas."
      },
      {
        question: "¿Hay un límite de páginas?",
        answer: "Sin límite fijo, pero sitios muy grandes (10,000+ páginas) pueden tardar más en rastrear. Puedes detener el rastreo en cualquier momento y exportar resultados parciales."
      }
    ],

    languages: {
      en: "English",
      de: "Deutsch",
      es: "Español",
      fr: "Français",
      hi: "हिन्दी"
    }
  },

  fr: {
    appName: "sitemap-gen",
    appVersion: "v1.0.2",
    appTagline: "générateur de sitemap XML",
    appDescription: "Générez des sitemaps XML pour n'importe quel site web",

    urlLabel: "url:",
    urlPlaceholder: "exemple.fr",
    depthLabel: "profondeur:",
    depthPlaceholder: "∞",
    generateButton: "générer",
    stopButton: "arrêter",

    crawlingLabel: "exploration:",
    foundLabel: "trouvées:",
    queuedLabel: "en file:",
    timeLabel: "temps:",
    domainLabel: "domaine:",
    pagesLabel: "pages:",
    depthStatLabel: "profondeur:",
    startingCrawl: "Démarrage de l'exploration...",

    urlRequired: "URL requise",
    invalidUrl: "URL invalide",
    errorLabel: "erreur:",
    noPagesFound: "Aucune page trouvée - le site bloque peut-être les robots",

    treeTab: "arbre",
    listTab: "liste",
    xmlTab: "xml",

    exportLabel: "exporter:",
    copyButton: "copier",
    copiedButton: "copié!",
    exportedMessage: "exporté",
    copiedMessage: "copié",

    headerNumber: "#",
    headerUrl: "url",
    headerStatus: "st",
    headerDepth: "p",
    headerPriority: "pri",
    headerFrequency: "freq",

    pagesFoundMessage: "pages en",
    stoppedMessage: "Arrêté - pages explorées",

    faqTitle: "FAQ",
    faq: [
      {
        question: "Qu'est-ce qu'un sitemap?",
        answer: "Un sitemap est un fichier XML qui liste toutes les pages importantes d'un site web, aidant les moteurs de recherche comme Google à découvrir et indexer votre contenu plus efficacement."
      },
      {
        question: "Comment fonctionne cet outil?",
        answer: "Entrez l'URL de votre site web et cliquez sur 'générer'. L'outil explore votre site, découvre toutes les pages accessibles et crée un sitemap XML standard prêt à être soumis aux moteurs de recherche."
      },
      {
        question: "Qu'est-ce que le paramètre de profondeur?",
        answer: "La profondeur contrôle combien de niveaux de liens le robot va explorer. Profondeur 1 = page d'accueil uniquement, profondeur 2 = page d'accueil + pages directement liées, etc. Laissez vide pour une profondeur illimitée."
      },
      {
        question: "Quels formats d'export sont supportés?",
        answer: "XML (format sitemap standard), TXT (liste d'URLs simple), JSON (données structurées) et CSV (compatible tableur). XML est recommandé pour la soumission aux moteurs de recherche."
      },
      {
        question: "Pourquoi certaines pages ne sont-elles pas trouvées?",
        answer: "Le robot ne suit que les liens HTML. Les pages derrière une connexion, chargées via JavaScript ou bloquées par robots.txt ne seront pas découvertes. Les pages orphelines sans liens entrants ne peuvent pas être trouvées."
      },
      {
        question: "Y a-t-il une limite de pages?",
        answer: "Pas de limite fixe, mais les très grands sites (10 000+ pages) peuvent prendre plus de temps à explorer. Vous pouvez arrêter l'exploration à tout moment et exporter les résultats partiels."
      }
    ],

    languages: {
      en: "English",
      de: "Deutsch",
      es: "Español",
      fr: "Français",
      hi: "हिन्दी"
    }
  },

  hi: {
    appName: "sitemap-gen",
    appVersion: "v1.0.2",
    appTagline: "XML साइटमैप जनरेटर",
    appDescription: "किसी भी वेबसाइट के लिए XML साइटमैप बनाएं",

    urlLabel: "url:",
    urlPlaceholder: "example.com",
    depthLabel: "गहराई:",
    depthPlaceholder: "∞",
    generateButton: "बनाएं",
    stopButton: "रोकें",

    crawlingLabel: "क्रॉल हो रहा:",
    foundLabel: "मिले:",
    queuedLabel: "कतार में:",
    timeLabel: "समय:",
    domainLabel: "डोमेन:",
    pagesLabel: "पेज:",
    depthStatLabel: "गहराई:",
    startingCrawl: "क्रॉल शुरू हो रहा है...",

    urlRequired: "URL आवश्यक है",
    invalidUrl: "अमान्य URL",
    errorLabel: "त्रुटि:",
    noPagesFound: "कोई पेज नहीं मिला - साइट क्रॉलर को ब्लॉक कर सकती है",

    treeTab: "ट्री",
    listTab: "सूची",
    xmlTab: "xml",

    exportLabel: "निर्यात:",
    copyButton: "कॉपी",
    copiedButton: "कॉपी हुआ!",
    exportedMessage: "निर्यात किया",
    copiedMessage: "कॉपी किया",

    headerNumber: "#",
    headerUrl: "url",
    headerStatus: "स्थिति",
    headerDepth: "ग",
    headerPriority: "प्राथ",
    headerFrequency: "फ्रीक",

    pagesFoundMessage: "पेज मिले",
    stoppedMessage: "रुका - पेज क्रॉल हुए",

    faqTitle: "सामान्य प्रश्न",
    faq: [
      {
        question: "साइटमैप क्या है?",
        answer: "साइटमैप एक XML फाइल है जो वेबसाइट के सभी महत्वपूर्ण पेजों को सूचीबद्ध करती है, जिससे Google जैसे सर्च इंजन आपकी सामग्री को अधिक कुशलता से खोज और इंडेक्स कर सकें।"
      },
      {
        question: "यह टूल कैसे काम करता है?",
        answer: "अपनी वेबसाइट का URL दर्ज करें और 'बनाएं' पर क्लिक करें। टूल आपकी साइट को क्रॉल करता है, सभी सुलभ पेज खोजता है, और सर्च इंजन में सबमिट करने के लिए तैयार मानक XML साइटमैप बनाता है।"
      },
      {
        question: "गहराई पैरामीटर क्या है?",
        answer: "गहराई नियंत्रित करती है कि क्रॉलर कितने लिंक स्तरों तक जाएगा। गहराई 1 = केवल होमपेज, गहराई 2 = होमपेज + सीधे लिंक किए गए पेज, आदि। असीमित गहराई के लिए खाली छोड़ें।"
      },
      {
        question: "कौन से एक्सपोर्ट फॉर्मेट समर्थित हैं?",
        answer: "XML (मानक साइटमैप फॉर्मेट), TXT (सादी URL सूची), JSON (संरचित डेटा), और CSV (स्प्रेडशीट संगत)। सर्च इंजन सबमिशन के लिए XML अनुशंसित है।"
      },
      {
        question: "कुछ पेज क्यों नहीं मिलते?",
        answer: "क्रॉलर केवल HTML लिंक का अनुसरण करता है। लॉगिन के पीछे, JavaScript के माध्यम से लोड होने वाले, या robots.txt द्वारा ब्लॉक किए गए पेज नहीं खोजे जाएंगे। बिना आने वाले लिंक के अनाथ पेज भी नहीं मिल सकते।"
      },
      {
        question: "क्या पेज की कोई सीमा है?",
        answer: "कोई निश्चित सीमा नहीं, लेकिन बहुत बड़ी साइटों (10,000+ पेज) को क्रॉल करने में अधिक समय लग सकता है। आप कभी भी क्रॉल रोक सकते हैं और आंशिक परिणाम निर्यात कर सकते हैं।"
      }
    ],

    languages: {
      en: "English",
      de: "Deutsch",
      es: "Español",
      fr: "Français",
      hi: "हिन्दी"
    }
  }
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const value = {
    language,
    setLanguage,
    t: translations[language]
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export { translations };
