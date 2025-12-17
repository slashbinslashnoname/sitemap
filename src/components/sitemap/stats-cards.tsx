"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SitemapResult } from "@/types/sitemap";
import { Globe, FileText, Clock, Layers } from "lucide-react";

interface StatsCardsProps {
  result: SitemapResult;
}

export function StatsCards({ result }: StatsCardsProps) {
  const maxDepth = Math.max(...result.urls.map((u) => u.depth));
  const avgDepth = result.urls.reduce((sum, u) => sum + u.depth, 0) / result.urls.length;

  const stats = [
    {
      label: "Domain",
      value: new URL(result.baseUrl).hostname,
      icon: Globe,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Pages Found",
      value: result.totalPages.toString(),
      icon: FileText,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Crawl Time",
      value: `${(result.crawlTime / 1000).toFixed(1)}s`,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Max Depth",
      value: `${maxDepth} (avg: ${avgDepth.toFixed(1)})`,
      icon: Layers,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-sm font-semibold truncate">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
