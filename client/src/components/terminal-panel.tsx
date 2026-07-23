import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TerminalPanelProps {
  title?: string;
  prompt?: string;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

/** Window-chrome panel used across home sections for a TUI look. */
export default function TerminalPanel({
  title = "session",
  prompt,
  className,
  bodyClassName,
  children,
}: TerminalPanelProps) {
  return (
    <section className={cn("tui-panel", className)}>
      <div className="tui-panel-header">
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="tui-dot tui-dot-red" />
          <span className="tui-dot tui-dot-yellow" />
          <span className="tui-dot tui-dot-green" />
        </span>
        <span className="ml-2 truncate text-primary/80">{title}</span>
        <span className="ml-auto hidden text-[10px] text-muted-foreground sm:inline">
          sbkoth@github.io
        </span>
      </div>
      <div className={cn("p-4 md:p-6", bodyClassName)}>
        {prompt ? (
          <p className="mb-4 text-sm text-muted-foreground">
            <span className="text-primary">visitor@sbkoth</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-accent">~</span>
            <span className="text-muted-foreground">$ </span>
            <span className="text-foreground">{prompt}</span>
            <span className="tui-blink ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-primary align-middle" />
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
