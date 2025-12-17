export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  depth: number;
  title?: string;
  status?: number;
}

export interface CrawlProgress {
  discovered: number;
  crawled: number;
  currentUrl: string;
  status: 'idle' | 'crawling' | 'completed' | 'error';
  error?: string;
}

export interface SitemapResult {
  urls: SitemapUrl[];
  baseUrl: string;
  crawlTime: number;
  totalPages: number;
}

export interface TreeNode {
  name: string;
  path: string;
  fullUrl: string;
  children: TreeNode[];
  depth: number;
  title?: string;
}
