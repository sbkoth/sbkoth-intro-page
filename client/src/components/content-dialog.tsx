import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { marked } from "marked";

interface ContentDialogProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentDialog({ title, content, isOpen, onClose }: ContentDialogProps) {
  // Configure the marked renderer to customize bullet points
  const renderer = new marked.Renderer();
  
  // Customize list item rendering
  renderer.listitem = (text) => {
    return `<li class="flex items-center gap-2 my-1"><div class="h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>${text}</li>`;
  };
  
  // Customize unordered list rendering
  renderer.list = (body) => {
    return `<ul class="space-y-2 my-4">${body}</ul>`;
  };
  
  const htmlContent = marked(content, { renderer });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div 
          className="prose dark:prose-invert prose-primary mt-4 max-w-none prose-li:pl-0 prose-li:marker:hidden"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </DialogContent>
    </Dialog>
  );
}