import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { marked } from "marked";

interface ContentDialogProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

function looksLikeHtml(content: string): boolean {
  const trimmed = content.trim();
  return /^<[a-z][\s\S]*>/i.test(trimmed);
}

function enhanceListMarkup(html: string): string {
  return html
    .replace(
      /<li>([\s\S]*?)<\/li>/g,
      '<li class="flex items-start gap-2 my-1.5"><span class="text-primary shrink-0 mt-0.5">▸</span><span class="text-sm">$1</span></li>',
    )
    .replace(
      /<ul>([\s\S]*?)<\/ul>/g,
      '<ul class="space-y-1 my-3 list-none pl-0">$1</ul>',
    )
    .replace(
      /<ol>([\s\S]*?)<\/ol>/g,
      '<ol class="space-y-1 my-3 list-none pl-0">$1</ol>',
    );
}

export default function ContentDialog({
  title,
  content,
  isOpen,
  onClose,
}: ContentDialogProps) {
  const htmlContent = useMemo(() => {
    const source = content || "";
    const html = looksLikeHtml(source)
      ? source
      : (marked.parse(source, { async: false }) as string);
    return enhanceListMarkup(html);
  }, [content]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto rounded-none border-primary/40 bg-card font-mono shadow-[0_0_40px_-10px_hsl(var(--primary)/0.35)]">
        <DialogHeader className="border-b border-border pb-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            $ cat {title.toLowerCase().replace(/\s+/g, "-")}.md
          </p>
          <DialogTitle className="text-lg font-semibold text-primary">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div
          className="prose-terminal mt-2"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </DialogContent>
    </Dialog>
  );
}
