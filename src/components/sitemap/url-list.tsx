"use client";

import { SitemapUrl } from "@/types/sitemap";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UrlListProps {
  urls: SitemapUrl[];
}

function getPriorityColor(priority: number): string {
  if (priority >= 0.8) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (priority >= 0.5) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  if (priority >= 0.3) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  return "bg-slate-500/10 text-slate-600 border-slate-500/20";
}

function getDepthBadge(depth: number): string {
  const colors = [
    "bg-violet-500/10 text-violet-600 border-violet-500/20",
    "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    "bg-teal-500/10 text-teal-600 border-teal-500/20",
    "bg-slate-500/10 text-slate-600 border-slate-500/20",
  ];
  return colors[Math.min(depth, colors.length - 1)];
}

export function UrlList({ urls }: UrlListProps) {
  return (
    <div className="space-y-2">
      {urls.map((url, index) => (
        <div
          key={url.loc}
          className={cn(
            "group p-4 rounded-lg border bg-card transition-all hover:shadow-md",
            "hover:border-primary/20"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                {url.status === 200 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                )}
                <span className="text-xs text-muted-foreground font-mono">
                  #{index + 1}
                </span>
                {url.title && (
                  <span className="font-medium truncate">{url.title}</span>
                )}
              </div>

              <a
                href={url.loc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary truncate block font-mono group-hover:underline"
              >
                {url.loc}
              </a>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={getPriorityColor(url.priority || 0.5)}>
                  Priority: {url.priority?.toFixed(1)}
                </Badge>
                <Badge variant="outline" className={getDepthBadge(url.depth)}>
                  Depth: {url.depth}
                </Badge>
                {url.changefreq && (
                  <Badge variant="outline" className="bg-slate-500/10 text-slate-600 border-slate-500/20">
                    {url.changefreq}
                  </Badge>
                )}
                {url.lastmod && (
                  <Badge variant="outline" className="bg-slate-500/10 text-slate-600 border-slate-500/20">
                    {url.lastmod}
                  </Badge>
                )}
              </div>
            </div>

            <a
              href={url.loc}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-muted transition-colors shrink-0"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
