import { SitemapUrl } from "@/types/sitemap";

export function generateXmlSitemap(urls: SitemapUrl[]): string {
  const xmlUrls = urls
    .map(
      (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority !== undefined ? `<priority>${url.priority.toFixed(1)}</priority>` : ""}
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
}

export function generateTxtSitemap(urls: SitemapUrl[]): string {
  return urls.map((url) => url.loc).join("\n");
}

export function generateJsonSitemap(urls: SitemapUrl[]): string {
  return JSON.stringify(
    urls.map((url) => ({
      loc: url.loc,
      lastmod: url.lastmod,
      changefreq: url.changefreq,
      priority: url.priority,
    })),
    null,
    2
  );
}

export function generateCsvSitemap(urls: SitemapUrl[]): string {
  const headers = "URL,Last Modified,Change Frequency,Priority,Depth,Title";
  const rows = urls.map(
    (url) =>
      `"${url.loc}","${url.lastmod || ""}","${url.changefreq || ""}","${url.priority || ""}","${url.depth}","${escapeCSV(url.title || "")}"`
  );
  return [headers, ...rows].join("\n");
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeCSV(str: string): string {
  return str.replace(/"/g, '""');
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
