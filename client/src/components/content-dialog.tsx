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
      '<li class="flex items-start gap-2 my-2"><div class="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div><span class="text-sm">$1</span></li>',
    )
    .replace(
      /<ul>([\s\S]*?)<\/ul>/g,
      '<ul class="space-y-2 my-4 list-none pl-0">$1</ul>',
    )
    .replace(
      /<ol>([\s\S]*?)<\/ol>/g,
      '<ol class="space-y-2 my-4 list-none pl-0">$1</ol>',
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
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div
          className="prose dark:prose-invert prose-primary mt-4 max-w-none prose-ul:pl-0 prose-ol:pl-0 prose-li:pl-0 prose-li:marker:hidden"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </DialogContent>
    </Dialog>
  );
}
