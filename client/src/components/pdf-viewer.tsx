import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(url).promise;
        const page = await pdf.getPage(1);
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPdf();
  }, [url]);

  return (
    <div className="w-full overflow-auto">
      <canvas ref={canvasRef} className="mx-auto" />
    </div>
  );
}