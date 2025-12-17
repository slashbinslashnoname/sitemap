import { SitemapGenerator } from "@/components/sitemap/sitemap-generator";

export default function Home() {
  return (
    <div className="min-h-screen p-2">
      <header className="flex items-center justify-between border-b border-border pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-primary">$</span>
          <span className="text-foreground">sitemap-gen</span>
          <span className="text-muted-foreground">v1.0.0</span>
        </div>
        <div className="text-muted-foreground">
          xml sitemap generator
        </div>
      </header>
      <main>
        <SitemapGenerator />
      </main>
    </div>
  );
}
