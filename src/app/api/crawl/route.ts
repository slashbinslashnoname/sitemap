import { NextRequest } from 'next/server';
import * as cheerio from 'cheerio';
import { SitemapUrl } from '@/types/sitemap';

const TIMEOUT = 10000;
const CONCURRENCY = 5;

function normalizeUrl(url: string, baseUrl: string): string | null {
  try {
    const parsed = new URL(url, baseUrl);
    parsed.hash = '';
    let normalized = parsed.href;
    if (normalized.endsWith('/') && normalized !== parsed.origin + '/') {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  } catch {
    return null;
  }
}

function isSameDomain(url: string, baseUrl: string): boolean {
  try {
    const urlHost = new URL(url).hostname;
    const baseHost = new URL(baseUrl).hostname;
    return urlHost === baseHost;
  } catch {
    return false;
  }
}

function shouldCrawl(url: string): boolean {
  const excludeExtensions = [
    '.pdf', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp',
    '.mp3', '.mp4', '.avi', '.mov', '.wmv',
    '.zip', '.rar', '.tar', '.gz',
    '.css', '.js', '.json', '.xml',
    '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.ico', '.woff', '.woff2', '.ttf', '.eot'
  ];

  const lowerUrl = url.toLowerCase();
  return !excludeExtensions.some(ext => lowerUrl.endsWith(ext));
}

async function fetchPage(url: string, signal?: AbortSignal): Promise<{ html: string; status: number } | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    // Link external signal to our controller
    if (signal) {
      signal.addEventListener('abort', () => controller.abort());
    }

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SitemapGenerator/1.0 (compatible; Bot)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { html: '', status: response.status };
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return null;
    }

    const html = await response.text();
    return { html, status: response.status };
  } catch {
    return null;
  }
}

function extractLinks(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const links: string[] = [];

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');
    if (href) {
      const normalized = normalizeUrl(href, baseUrl);
      if (normalized && isSameDomain(normalized, baseUrl) && shouldCrawl(normalized)) {
        links.push(normalized);
      }
    }
  });

  return [...new Set(links)];
}

function extractTitle(html: string): string | undefined {
  const $ = cheerio.load(html);
  const title = $('title').first().text().trim();
  return title || undefined;
}

interface CrawlItem {
  url: string;
  depth: number;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { url, maxPages, maxDepth } = await request.json();

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let baseUrl: string;
    try {
      const parsed = new URL(url);
      baseUrl = parsed.origin;
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create a readable stream for SSE
    const encoder = new TextEncoder();
    let isCancelled = false;

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: unknown) => {
          if (isCancelled) return;
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        // Send initial info
        sendEvent('start', { baseUrl, startTime });

        const visited = new Set<string>();
        const queued = new Set<string>();
        const queue: CrawlItem[] = [{ url, depth: 0 }];
        const results: SitemapUrl[] = [];

        queued.add(url);

        try {
          while (queue.length > 0 && (!maxPages || results.length < maxPages) && !isCancelled) {
            // Get batch of URLs to crawl concurrently
            const batch: CrawlItem[] = [];
            while (batch.length < CONCURRENCY && queue.length > 0) {
              const item = queue.shift();
              if (item && !visited.has(item.url)) {
                batch.push(item);
              }
            }

            if (batch.length === 0) break;

            // Crawl batch concurrently
            const batchResults = await Promise.all(
              batch.map(async ({ url: currentUrl, depth }) => {
                if (visited.has(currentUrl) || isCancelled) return null;
                visited.add(currentUrl);

                const pageData = await fetchPage(currentUrl);
                if (!pageData) return null;

                const title = pageData.html ? extractTitle(pageData.html) : undefined;

                const result: SitemapUrl = {
                  loc: currentUrl,
                  lastmod: new Date().toISOString().split('T')[0],
                  changefreq: depth === 0 ? 'daily' : depth === 1 ? 'weekly' : 'monthly',
                  priority: Math.max(0.1, 1 - depth * 0.2),
                  depth,
                  title,
                  status: pageData.status,
                };

                // Extract links if not at max depth
                let newLinks: string[] = [];
                if (pageData.html && (maxDepth === undefined || depth < maxDepth)) {
                  newLinks = extractLinks(pageData.html, currentUrl);
                }

                return { result, newLinks, depth };
              })
            );

            // Process results and send them
            for (const item of batchResults) {
              if (!item || isCancelled) continue;

              if (!maxPages || results.length < maxPages) {
                results.push(item.result);
                // Send each URL as it's discovered
                sendEvent('url', {
                  url: item.result,
                  total: results.length,
                  queued: queue.length
                });
              }

              // Add new links to queue
              for (const link of item.newLinks) {
                if (!visited.has(link) && !queued.has(link)) {
                  queued.add(link);
                  queue.push({ url: link, depth: item.depth + 1 });
                }
              }
            }

            // Send progress update
            sendEvent('progress', {
              crawled: results.length,
              queued: queue.length,
              elapsed: Date.now() - startTime
            });
          }

          const crawlTime = Date.now() - startTime;

          // Send completion event
          sendEvent('complete', {
            urls: results,
            baseUrl,
            crawlTime,
            totalPages: results.length,
          });

        } catch (error) {
          sendEvent('error', {
            message: error instanceof Error ? error.message : 'An error occurred'
          });
        }

        controller.close();
      },
      cancel() {
        isCancelled = true;
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'An error occurred'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
