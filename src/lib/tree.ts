import { SitemapUrl, TreeNode } from "@/types/sitemap";

export function buildTree(urls: SitemapUrl[], baseUrl: string): TreeNode {
  const root: TreeNode = {
    name: new URL(baseUrl).hostname,
    path: "/",
    fullUrl: baseUrl,
    children: [],
    depth: 0,
  };

  for (const url of urls) {
    try {
      const parsedUrl = new URL(url.loc);
      const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

      let currentNode = root;

      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        const currentPath = "/" + pathParts.slice(0, i + 1).join("/");
        const fullUrl = `${parsedUrl.origin}${currentPath}`;

        let childNode = currentNode.children.find((c) => c.name === part);

        if (!childNode) {
          childNode = {
            name: part,
            path: currentPath,
            fullUrl,
            children: [],
            depth: i + 1,
            title: i === pathParts.length - 1 ? url.title : undefined,
          };
          currentNode.children.push(childNode);
        } else if (i === pathParts.length - 1 && url.title) {
          childNode.title = url.title;
        }

        currentNode = childNode;
      }

      // Handle root page
      if (pathParts.length === 0) {
        root.title = url.title;
      }
    } catch {
      // Skip invalid URLs
    }
  }

  // Sort children alphabetically
  sortTree(root);

  return root;
}

function sortTree(node: TreeNode): void {
  node.children.sort((a, b) => {
    // Folders (nodes with children) come first
    if (a.children.length > 0 && b.children.length === 0) return -1;
    if (a.children.length === 0 && b.children.length > 0) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const child of node.children) {
    sortTree(child);
  }
}
