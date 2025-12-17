"use client";

import { SitemapUrl } from "@/types/sitemap";
import {
  generateXmlSitemap,
  generateTxtSitemap,
  generateJsonSitemap,
  generateCsvSitemap,
  downloadFile,
} from "@/lib/export";
import { toast } from "sonner";
import { useState } from "react";

interface ExportButtonsProps {
  urls: SitemapUrl[];
  baseUrl: string;
}

export function ExportButtons({ urls, baseUrl }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);

  const hostname = new URL(baseUrl).hostname.replace(/\./g, "_");

  const handleExport = (format: "xml" | "txt" | "json" | "csv") => {
    const generators = {
      xml: { fn: generateXmlSitemap, mime: "application/xml", ext: "xml" },
      txt: { fn: generateTxtSitemap, mime: "text/plain", ext: "txt" },
      json: { fn: generateJsonSitemap, mime: "application/json", ext: "json" },
      csv: { fn: generateCsvSitemap, mime: "text/csv", ext: "csv" },
    };

    const { fn, mime, ext } = generators[format];
    const content = fn(urls);
    downloadFile(content, `sitemap_${hostname}.${ext}`, mime);
    toast.success(`exported ${format}`);
  };

  const handleCopyXml = async () => {
    const xml = generateXmlSitemap(urls);
    await navigator.clipboard.writeText(xml);
    setCopied(true);
    toast.success("copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-muted-foreground mr-1">export:</span>
      {(["xml", "txt", "json", "csv"] as const).map((format) => (
        <button
          key={format}
          onClick={() => handleExport(format)}
          className="px-1.5 py-0.5 hover:bg-muted hover:text-primary transition-colors"
        >
          {format}
        </button>
      ))}
      <span className="text-muted-foreground mx-1">|</span>
      <button
        onClick={handleCopyXml}
        className="px-1.5 py-0.5 hover:bg-muted hover:text-primary transition-colors"
      >
        {copied ? "copied!" : "copy"}
      </button>
    </div>
  );
}
