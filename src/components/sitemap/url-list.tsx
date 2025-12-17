"use client";

import { SitemapUrl } from "@/types/sitemap";

interface UrlListProps {
  urls: SitemapUrl[];
}

export function UrlList({ urls }: UrlListProps) {
  return (
    <table className="w-full">
      <thead className="text-muted-foreground border-b border-border sticky top-0 bg-card">
        <tr>
          <th className="text-left py-1 px-2 w-8">#</th>
          <th className="text-left py-1 px-2">url</th>
          <th className="text-left py-1 px-2 w-12">st</th>
          <th className="text-left py-1 px-2 w-10">d</th>
          <th className="text-left py-1 px-2 w-12">pri</th>
          <th className="text-left py-1 px-2 w-16">freq</th>
        </tr>
      </thead>
      <tbody>
        {urls.map((url, index) => (
          <tr key={url.loc} className="border-b border-border/50 hover:bg-muted/30">
            <td className="py-0.5 px-2 text-muted-foreground">{index + 1}</td>
            <td className="py-0.5 px-2">
              <a
                href={url.loc}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary hover:underline truncate block max-w-[600px]"
                title={url.title || url.loc}
              >
                {url.loc}
              </a>
            </td>
            <td className="py-0.5 px-2">
              <span className={url.status === 200 ? "text-primary" : "text-destructive"}>
                {url.status}
              </span>
            </td>
            <td className="py-0.5 px-2 text-muted-foreground">{url.depth}</td>
            <td className="py-0.5 px-2 text-muted-foreground">{url.priority?.toFixed(1)}</td>
            <td className="py-0.5 px-2 text-muted-foreground">{url.changefreq?.slice(0, 1)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
