"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen, ExternalLink } from "lucide-react";
import { TreeNode } from "@/types/sitemap";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors group",
          "hover:bg-muted/50"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren ? (
          <button className="p-0.5 hover:bg-muted rounded transition-colors">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}

        {hasChildren ? (
          isExpanded ? (
            <FolderOpen className="h-4 w-4 text-amber-500" />
          ) : (
            <Folder className="h-4 w-4 text-amber-500" />
          )
        ) : (
          <FileText className="h-4 w-4 text-blue-500" />
        )}

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex-1 truncate text-sm">
                {node.name || "/"}
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-md">
              <div className="space-y-1">
                <p className="font-medium">{node.title || node.name}</p>
                <p className="text-xs text-muted-foreground break-all">{node.fullUrl}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <a
          href={node.fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
        >
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
        </a>
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
  return (
    <div className="font-mono text-sm">
      <TreeNodeComponent node={tree} />
    </div>
  );
}
