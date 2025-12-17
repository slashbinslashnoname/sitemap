"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { SitemapResult, SitemapUrl } from "@/types/sitemap";
import { TreeView } from "./tree-view";
import { UrlList } from "./url-list";
import { ExportButtons } from "./export-buttons";
import { buildTree } from "@/lib/tree";
import { Loader2, Square } from "lucide-react";
import { generateXmlSitemap } from "@/lib/export";

export function SitemapGenerator() {
  const [url, setUrl] = useState("");
  const [maxDepth, setMaxDepth] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SitemapResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liveUrls, setLiveUrls] = useState<SitemapUrl[]>([]);
  const [crawlStats, setCrawlStats] = useState<{ crawled: number; queued: number; elapsed: number } | null>(null);
  const [baseUrl, setBaseUrl] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);

      // Convert live URLs to final result if we have any
      if (liveUrls.length > 0) {
        const crawlTime = crawlStats?.elapsed || 0;
        setResult({
          urls: liveUrls,
          baseUrl: baseUrl,
          crawlTime,
          totalPages: liveUrls.length,
        });
        toast.info(`Stopped - ${liveUrls.length} pages crawled`);
      }
    }
  };

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
    setLiveUrls([]);
    setCrawlStats(null);
    setBaseUrl("");

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const params: { url: string; maxDepth?: number } = { url: normalizedUrl };
      if (maxDepth && parseInt(maxDepth) > 0) {
        params.maxDepth = parseInt(maxDepth);
      }

      const response = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Crawl failed");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let eventType = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7);
          } else if (line.startsWith("data: ") && eventType) {
            try {
              const data = JSON.parse(line.slice(6));

              switch (eventType) {
                case "start":
                  setBaseUrl(data.baseUrl);
                  break;
                case "url":
                  setLiveUrls(prev => [...prev, data.url]);
                  break;
                case "progress":
                  setCrawlStats({
                    crawled: data.crawled,
                    queued: data.queued,
                    elapsed: data.elapsed,
                  });
                  break;
                case "complete":
                  setResult(data);
                  toast.success(`${data.totalPages} pages in ${(data.crawlTime / 1000).toFixed(1)}s`);
                  break;
                case "error":
                  throw new Error(data.message);
              }
            } catch (parseError) {
              if (parseError instanceof SyntaxError) {
                // Skip malformed JSON
              } else {
                throw parseError;
              }
            }
            eventType = "";
          }
        }
      }

      if (liveUrls.length === 0 && !result) {
        setError("No pages found - site may block crawlers");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // User stopped the crawl - handled in handleStop
        return;
      }
      const message = err instanceof Error ? err.message : "Error";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const displayUrls = result?.urls || liveUrls;
  const displayBaseUrl = result?.baseUrl || baseUrl;
  const tree = displayUrls.length > 0 && displayBaseUrl ? buildTree(displayUrls, displayBaseUrl) : null;

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
        {isLoading ? (
          <Button type="button" size="sm" variant="destructive" onClick={handleStop} className="h-7 px-3">
            <Square className="h-3 w-3 mr-1" />
            stop
          </Button>
        ) : (
          <Button type="submit" size="sm" className="h-7 px-3">
            generate
          </Button>
        )}
      </form>

      {/* Live crawling status with results */}
      {isLoading && (
        <div className="border border-border bg-card">
          {/* Live stats bar */}
          <div className="flex items-center justify-between border-b border-border px-2 py-1 bg-muted/30">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-muted-foreground">crawling:</span>{" "}
                <span className="text-primary">{baseUrl ? new URL(baseUrl).hostname : url}</span>
              </span>
              {crawlStats && (
                <>
                  <span>
                    <span className="text-muted-foreground">found:</span>{" "}
                    <span className="text-foreground">{crawlStats.crawled}</span>
                  </span>
                  <span>
                    <span className="text-muted-foreground">queued:</span>{" "}
                    <span className="text-foreground">{crawlStats.queued}</span>
                  </span>
                  <span>
                    <span className="text-muted-foreground">time:</span>{" "}
                    <span className="text-foreground">{(crawlStats.elapsed / 1000).toFixed(1)}s</span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Live URL list */}
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="p-1">
              {liveUrls.length > 0 ? (
                <UrlList urls={liveUrls} />
              ) : (
                <div className="p-2 text-muted-foreground">Starting crawl...</div>
              )}
            </div>
          </ScrollArea>
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
