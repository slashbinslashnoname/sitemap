"use client";

import { Button } from "@/components/ui/button";
import { SitemapUrl } from "@/types/sitemap";
import {
  generateXmlSitemap,
  generateTxtSitemap,
  generateJsonSitemap,
  generateCsvSitemap,
  downloadFile,
} from "@/lib/export";
import { FileCode, FileText, FileJson, FileSpreadsheet, Copy, Check } from "lucide-react";
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
    toast.success(`Sitemap exported as ${format.toUpperCase()}`);
  };

  const handleCopyXml = async () => {
    const xml = generateXmlSitemap(urls);
    await navigator.clipboard.writeText(xml);
    setCopied(true);
    toast.success("XML copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("xml")}
        className="gap-2"
      >
        <FileCode className="h-4 w-4" />
        XML
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("txt")}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        TXT
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("json")}
        className="gap-2"
      >
        <FileJson className="h-4 w-4" />
        JSON
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("csv")}
        className="gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyXml}
        className="gap-2"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        Copy XML
      </Button>
    </div>
  );
}
