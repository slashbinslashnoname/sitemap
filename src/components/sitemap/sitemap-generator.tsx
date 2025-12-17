"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { SitemapResult } from "@/types/sitemap";
import { TreeView } from "./tree-view";
import { UrlList } from "./url-list";
import { ExportButtons } from "./export-buttons";
import { buildTree } from "@/lib/tree";
import { Loader2 } from "lucide-react";
import { generateXmlSitemap } from "@/lib/export";

export function SitemapGenerator() {
  const [url, setUrl] = useState("");
  const [maxDepth, setMaxDepth] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SitemapResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [crawlProgress, setCrawlProgress] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("URL required");
      return;
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      toast.error("Invalid URL");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setCrawlProgress(0);

    try {
      const params: { url: string; maxDepth?: number } = { url: normalizedUrl };
      if (maxDepth && parseInt(maxDepth) > 0) {
        params.maxDepth = parseInt(maxDepth);
      }

      const response = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Crawl failed");
      }

      if (data.urls.length === 0) {
        setError("No pages found - site may block crawlers");
        return;
      }

      setResult(data);
      toast.success(`${data.totalPages} pages in ${(data.crawlTime / 1000).toFixed(1)}s`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const tree = result ? buildTree(result.urls, result.baseUrl) : null;

  return (
    <div className="space-y-2">
      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-card border border-border px-2">
          <span className="text-muted-foreground">url:</span>
          <Input
            type="text"
            placeholder="example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border-0 bg-transparent h-7 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center gap-2 bg-card border border-border px-2">
          <span className="text-muted-foreground">depth:</span>
          <Input
            type="number"
            placeholder="∞"
            min="1"
            max="99"
            value={maxDepth}
            onChange={(e) => setMaxDepth(e.target.value)}
            className="border-0 bg-transparent h-7 w-12 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" size="sm" disabled={isLoading} className="h-7 px-3">
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              crawling...
            </>
          ) : (
            "generate"
          )}
        </Button>
      </form>

      {/* Loading */}
      {isLoading && (
        <div className="border border-border bg-card p-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>crawling {url}{maxDepth ? ` (max depth: ${maxDepth})` : ""}...</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="border border-destructive/50 bg-destructive/10 p-2 text-destructive">
          error: {error}
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <div className="border border-border bg-card">
          {/* Stats bar */}
          <div className="flex items-center justify-between border-b border-border px-2 py-1 bg-muted/30">
            <div className="flex items-center gap-4">
              <span>
                <span className="text-muted-foreground">domain:</span>{" "}
                <span className="text-primary">{new URL(result.baseUrl).hostname}</span>
              </span>
              <span>
                <span className="text-muted-foreground">pages:</span>{" "}
                <span className="text-foreground">{result.totalPages}</span>
              </span>
              <span>
                <span className="text-muted-foreground">time:</span>{" "}
                <span className="text-foreground">{(result.crawlTime / 1000).toFixed(1)}s</span>
              </span>
              <span>
                <span className="text-muted-foreground">depth:</span>{" "}
                <span className="text-foreground">{Math.max(...result.urls.map((u) => u.depth))}</span>
              </span>
            </div>
            <ExportButtons urls={result.urls} baseUrl={result.baseUrl} />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="tree" className="w-full">
            <div className="border-b border-border px-2">
              <TabsList className="h-7 bg-transparent p-0 gap-2">
                <TabsTrigger value="tree" className="h-6 px-2 text-xs data-[state=active]:bg-muted">
                  tree
                </TabsTrigger>
                <TabsTrigger value="list" className="h-6 px-2 text-xs data-[state=active]:bg-muted">
                  list
                </TabsTrigger>
                <TabsTrigger value="xml" className="h-6 px-2 text-xs data-[state=active]:bg-muted">
                  xml
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="tree" className="mt-0">
              <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-2">
                  {tree && <TreeView tree={tree} />}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-1">
                  <UrlList urls={result.urls} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="xml" className="mt-0">
              <ScrollArea className="h-[calc(100vh-180px)]">
                <pre className="p-2 text-primary whitespace-pre-wrap break-all">
                  {generateXmlSitemap(result.urls)}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
