import { useState } from "react";
import type { Project } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PdfViewer from "./pdf-viewer";
import SlideViewer from "./slide-viewer";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [open, setOpen] = useState(false);

  const renderContent = () => {
    switch (project.type) {
      case "image":
        return (
          <img 
            src={project.content.url} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        );
      case "pdf":
        return <PdfViewer url={project.content.url} />;
      case "slides":
        return <SlideViewer slides={project.content.slides} />;
      case "text":
        return (
          <div className="prose prose-sm max-w-none">
            {project.content.text}
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="space-y-1">
            <CardTitle>{project.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src={project.thumbnail} 
              alt={project.title}
              className="w-full aspect-video object-cover rounded-md"
            />
            <p className="mt-4 text-sm text-muted-foreground">
              {project.description}
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
