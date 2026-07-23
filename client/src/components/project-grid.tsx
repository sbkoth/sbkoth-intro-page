import React, { useState } from "react";
import type { Project } from "@shared/schema";
import ContentDialog from "./content-dialog";
import { format, isValid } from "date-fns";
import TerminalPanel from "./terminal-panel";

interface ProjectGridProps {
  projects: Project[];
}

function formatPublishedAt(value: string | Date): string | null {
  const date = value instanceof Date ? value : new Date(value);
  if (!isValid(date) || date.getTime() === 0) return null;
  return format(date, "yyyy-MM-dd");
}

function ProjectGridComponent({ projects }: ProjectGridProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!projects.length) {
    return (
      <TerminalPanel title="~/projects" prompt="ls projects/">
        <p className="text-muted-foreground text-sm">
          # projects will appear here soon
        </p>
      </TerminalPanel>
    );
  }

  return (
    <>
      <TerminalPanel title="~/projects" prompt="git log --oneline --projects">
        <div className="mb-6">
          <h2 className="tui-section-title">Projects</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="text-primary">{projects.length}</span> entries in tree
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {projects.map((project) => {
            const dateLabel = formatPublishedAt(project.publishedAt);
            return (
              <article
                key={project.id ?? project.slug}
                className="tui-card p-4 group"
                onClick={() => setSelectedProject(project)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                    <span className="text-muted-foreground font-normal">*</span>{" "}
                    {project.title}
                  </h3>
                  {dateLabel && (
                    <time className="text-[10px] text-muted-foreground shrink-0 font-mono">
                      {dateLabel}
                    </time>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
                <p className="mt-3 text-[10px] text-accent/80">
                  <span className="text-muted-foreground">slug=</span>
                  {project.slug}
                </p>
              </article>
            );
          })}
        </div>
      </TerminalPanel>

      {selectedProject && (
        <ContentDialog
          title={selectedProject.title}
          content={selectedProject.content}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}

export default React.memo(ProjectGridComponent);
