"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { TreeNode } from "@/types/sitemap";

interface TreeNodeComponentProps {
  node: TreeNode;
  level?: number;
}

function TreeNodeComponent({ node, level = 0 }: TreeNodeComponentProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-1 py-px hover:bg-muted/50 cursor-pointer group"
        style={{ paddingLeft: `${level * 12}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
          )
        ) : (
          <span className="w-3 shrink-0" />
        )}

        <span className={hasChildren ? "text-chart-3" : "text-chart-2"}>
          {hasChildren ? "d" : "-"}
        </span>

        <a
          href={node.fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="hover:text-primary hover:underline truncate"
          title={node.fullUrl}
        >
          {node.name || "/"}
        </a>

        {node.title && node.title !== node.name && (
          <span className="text-muted-foreground truncate ml-1 opacity-60" title={node.title}>
            {node.title}
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child, index) => (
            <TreeNodeComponent key={`${child.path}-${index}`} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface TreeViewProps {
  tree: TreeNode;
}

export function TreeView({ tree }: TreeViewProps) {
  return <TreeNodeComponent node={tree} />;
}
