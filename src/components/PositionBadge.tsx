import { Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** Where a position came from: null = the user's own trade; a "@handle" = copied from that trader. */
export type PositionSource = string | null;

interface PositionBadgeProps {
  /** Trader handle the position is currently copied from, or null for a self position. */
  source: PositionSource;
  /** If set on a self position, marks one that was kept after a copy was stopped. */
  former?: string | null;
  className?: string;
}

/**
 * Marks where a position came from.
 * - copied → blue "via @handle" chip with a copy icon + "Copied from @handle" tooltip
 * - former → faint "was copied" note with a "Was copied from @handle" tooltip
 * - self   → renders nothing
 */
export function PositionBadge({ source, former, className }: PositionBadgeProps) {
  if (source) {
    return (
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium leading-none text-blue-700 shrink-0",
                className,
              )}
            >
              <Copy className="w-3 h-3" />
              via {source}
            </span>
          </TooltipTrigger>
          <TooltipContent>Copied from {source}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (former) {
    return (
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn("text-[11px] text-gray-400 shrink-0", className)}>was copied</span>
          </TooltipTrigger>
          <TooltipContent>Was copied from {former}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return null;
}
