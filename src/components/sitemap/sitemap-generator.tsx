"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { SitemapResult } from "@/types/sitemap";
import { TreeView } from "./tree-view";
import { UrlList } from "./url-list";
import { ExportButtons } from "./export-buttons";
import { StatsCards } from "./stats-cards";
import { buildTree } from "@/lib/tree";
import {
  Globe,
  Search,
  Loader2,
  TreeDeciduous,
  List,
  Code,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { generateXmlSitemap } from "@/lib/export";

export function SitemapGenerator() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SitemapResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to crawl website");
      }

      if (data.urls.length === 0) {
        setError("No pages found. The website might be blocking crawlers or requires authentication.");
        return;
      }

      setResult(data);
      toast.success(`Found ${data.totalPages} pages in ${(data.crawlTime / 1000).toFixed(1)}s`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const tree = result ? buildTree(result.urls, result.baseUrl) : null;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Free Sitemap Generator</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Generate Beautiful{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
            Sitemaps
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Enter any website URL and instantly generate a comprehensive XML sitemap.
          Visualize your site structure and export in multiple formats.
        </p>
      </div>

      {/* Search Form */}
      <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter website URL (e.g., example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-12 h-12 text-base"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" size="lg" disabled={isLoading} className="h-12 px-8 gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Crawling...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Generate Sitemap
                </>
              )}
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs text-muted-foreground">Try:</span>
            {["github.com", "vercel.com", "tailwindcss.com"].map((domain) => (
              <Badge
                key={domain}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => setUrl(domain)}
              >
                {domain}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div>
                <CardTitle className="text-lg">Crawling Website</CardTitle>
                <CardDescription>Discovering pages and building sitemap...</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-[400px] rounded-lg" />
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {result && !isLoading && (
        <div className="space-y-6">
          {/* Stats */}
          <StatsCards result={result} />

          {/* Export and Visualization */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Sitemap Results
                  </CardTitle>
                  <CardDescription>
                    Found {result.totalPages} pages on {new URL(result.baseUrl).hostname}
                  </CardDescription>
                </div>
                <ExportButtons urls={result.urls} baseUrl={result.baseUrl} />
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <Tabs defaultValue="tree" className="w-full">
                <div className="px-6 pt-4">
                  <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="tree" className="gap-2">
                      <TreeDeciduous className="h-4 w-4" />
                      Tree View
                    </TabsTrigger>
                    <TabsTrigger value="list" className="gap-2">
                      <List className="h-4 w-4" />
                      URL List
                    </TabsTrigger>
                    <TabsTrigger value="xml" className="gap-2">
                      <Code className="h-4 w-4" />
                      XML Preview
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="tree" className="mt-0 px-6 pb-6">
                  <ScrollArea className="h-[500px] rounded-lg border bg-muted/30 p-4">
                    {tree && <TreeView tree={tree} />}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="list" className="mt-0 px-6 pb-6">
                  <ScrollArea className="h-[500px]">
                    <UrlList urls={result.urls} />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="xml" className="mt-0 px-6 pb-6">
                  <ScrollArea className="h-[500px] rounded-lg border bg-slate-950 p-4">
                    <pre className="text-sm text-emerald-400 font-mono whitespace-pre-wrap break-all">
                      {generateXmlSitemap(result.urls)}
                    </pre>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
